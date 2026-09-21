import MenuExperience from "@/components/menu/MenuExperience";

import { getPublishedMenu } from "@/lib/published-menu";

export default async function Home() {
  const initialMenu = await getPublishedMenu();
  return <MenuExperience key={initialMenu.revision} initialMenu={initialMenu} />;
}
