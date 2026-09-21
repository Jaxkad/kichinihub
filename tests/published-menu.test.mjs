import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { validationFeedback } from '../src/lib/feedback.ts';
import { menuData } from '../src/data/menuData.ts';
import { parsePublishedMenuDocument, publishedMenuSchema, PUBLISHED_MENU_TAG } from '../src/lib/published-menu-data.ts';

const require = createRequire(import.meta.url);
function firestore(value) {
  if (value === null) return { nullValue: null };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestore) } };
  if (typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([k,v]) => [k, firestore(v)])) } };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  return { [typeof value === 'boolean' ? 'booleanValue' : 'stringValue']: value };
}
function loadModule(path, dependencies, globals = {}) {
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  runInNewContext(source, { exports, require: (id) => id in dependencies ? dependencies[id] : require(id), console, ...globals });
  return exports;
}

test('published REST menu preserves artwork, prices, availability and revision, stripping metadata', () => {
  const menu = structuredClone(menuData);
  menu.revision = 42;
  menu.sections[0].cardImage = {url:'https://firebasestorage.googleapis.com/v0/b/kitchini-cf37a.firebasestorage.app/o/event-media%2Fexample.webp?alt=media',alt:'Category artwork'};
  menu.sections[0].items[0].price = 12.5;
  menu.sections[0].items[0].available = false;
  const document = {fields: {...firestore(menu).mapValue.fields, updatedAt: {timestampValue:'2026-09-21T00:00:00Z'}}};
  assert.deepEqual(parsePublishedMenuDocument(document), publishedMenuSchema.parse(menu));
});
test('invalid or missing published content is rejected instead of showing the sample menu', () => {
  for (const doc of [{}, {fields:{}}, {fields:{sections:{arrayValue:{}},social:{mapValue:{}}}}]) assert.throws(() => parsePublishedMenuDocument(doc));
});
test('public fetch uses a shared cache tag, bounded refresh and timeout; failures are propagated', async () => {
  let status = 200;
  const loader = loadModule('../src/lib/published-menu.ts', {
    'server-only': {},
    './published-menu-data': {parsePublishedMenuDocument, PUBLISHED_MENU_TAG, PUBLISHED_MENU_REVALIDATE:300},
  }, { process: {env:{}}, AbortSignal, fetch: async (url, options) => {
    assert.match(url, /firestore.googleapis.com.*menu\/current$/);
    assert.equal(options.cache, 'force-cache');
    assert.equal(options.next.tags[0], PUBLISHED_MENU_TAG);
    assert.equal(options.next.revalidate, 300);
    assert.ok(options.signal);
    return Response.json({fields:firestore({...menuData,revision:9}).mapValue.fields}, {status});
  }});
  assert.equal((await loader.getPublishedMenu()).revision, 9);
  status = 503;
  await assert.rejects(loader.getPublishedMenu(), /could not be loaded/);
});

function publishHandler({ fail = false, role = 'editor' } = {}) {
  const calls = [];
  const db = {
    doc: () => ({}), collection: () => ({doc: () => ({})}),
    runTransaction: async (callback) => {
      await callback({get:async () => ({data:() => ({revision:7})}),set:() => {}});
      if (fail) throw new Error('Write failed');
      calls.push('committed');
    },
  };
  const route = loadModule('../src/app/api/admin/[resource]/route.ts', {
    'next/server': {NextResponse:Response},
    'next/cache': {revalidateTag:(tag, options) => calls.push([tag, options.expire]), revalidatePath:(...args) => calls.push(args)},
    '@/lib/published-menu-data': {PUBLISHED_MENU_TAG},
    '@/lib/firebase-admin': {adminServices:() => ({db,auth:{verifyIdToken:async () => ({uid:'test-editor'}),getUser:async () => ({customClaims:{role}})}})},
    '@/lib/admin-schema': requireSchema(),
    '@/data/menuData': {menuData},
    '@/lib/events': {},
    '@/lib/feedback': {validationFeedback},
  });
  return { calls, send: (revision = 7) => route.PUT(new Request('http://localhost/api/admin/menu', {method:'PUT',headers:{authorization:'Bearer test'},body:JSON.stringify({...menuData,revision})}), {params:Promise.resolve({resource:'menu'})}) };
}
// Use the same schemas as production rather than accepting arbitrary test data.
import { menuSchema, userSchema } from '../src/lib/admin-schema.ts';
function requireSchema() { return {menuSchema,userSchema}; }

test('successful publication expires data and both page caches after committing', async () => {
  const {calls,send} = publishHandler();
  const response = await send();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {revision:8});
  assert.equal(JSON.stringify(calls), JSON.stringify(['committed',[PUBLISHED_MENU_TAG,0],['/'],['/menu/[category]','page']]));
});
test('failed, conflicting and unauthorized publication do not invalidate caches', async () => {
  for (const [options,revision,status] of [[{fail:true},7,503],[{},6,409],[{role:'viewer'},7,403]]) {
    const {calls,send} = publishHandler(options);
    assert.equal((await send(revision)).status,status);
    assert.equal(calls.length,0);
  }
});
