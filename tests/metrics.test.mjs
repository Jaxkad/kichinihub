import {test} from 'node:test';import assert from 'node:assert/strict';
import {trackingSchema,metricDay} from '../src/lib/metrics.ts';
import {eventSchema} from '../src/lib/events.ts';
test('tracking limits payloads and action names',()=>{assert.equal(trackingSchema.safeParse({events:[{kind:'category_select',id:'mains',label:'Mains'}]}).success,true);assert.equal(trackingSchema.safeParse({events:Array(31).fill({kind:'page_view',id:'home',label:'Home'})}).success,false);assert.equal(trackingSchema.safeParse({events:[{kind:'email',id:'x',label:'x'}]}).success,false);});
test('reporting day uses Malawi midnight',()=>assert.equal(metricDay(new Date('2026-09-09T23:00:00Z')),'2026-09-10'));
test('legacy events default to no photos and untrusted images are rejected',()=>{const event={id:'cbf62546-a677-43b9-8d64-f9cc84b631bc',title:'Test',description:'Details',venue:'Hub',startsAt:'2027-01-01T12:00:00Z',endsAt:'2027-01-01T16:00:00Z',status:'draft',revision:0};assert.deepEqual(eventSchema.parse(event).images,[]);assert.equal(eventSchema.safeParse({...event,images:[{url:'http://example.com/photo.jpg',alt:'Photo'}]}).success,false);});
