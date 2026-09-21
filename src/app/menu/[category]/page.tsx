import MenuExperience from "@/components/menu/MenuExperience";

import { getPublishedMenu } from "@/lib/published-menu";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const initialMenu = await getPublishedMenu();
  return <MenuExperience key={`${category}-${initialMenu.revision}`} initialMenu={initialMenu} categoryId={category} />;
}
