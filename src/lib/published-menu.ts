import "server-only";
import { parsePublishedMenuDocument, PUBLISHED_MENU_TAG, PUBLISHED_MENU_REVALIDATE } from "./published-menu-data";

export async function getPublishedMenu() {
  // The same read-only document is already public under firestore.rules.
  // Emulator support allows cache/publish integration checks without live writes.
  const origin = process.env.FIRESTORE_EMULATOR_HOST
    ? `http://${process.env.FIRESTORE_EMULATOR_HOST}`
    : "https://firestore.googleapis.com";
  const response = await fetch(
    `${origin}/v1/projects/kitchini-cf37a/databases/(default)/documents/menu/current`,
    {
      cache: "force-cache",
      next: { tags: [PUBLISHED_MENU_TAG], revalidate: PUBLISHED_MENU_REVALIDATE },
      signal: AbortSignal.timeout(8000),
    },
  );
  if (!response.ok) throw new Error("The published menu could not be loaded.");
  // Never cache/render the sample menu as if it were a published version.
  return parsePublishedMenuDocument(await response.json());
}
