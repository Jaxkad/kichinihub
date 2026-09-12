import MenuExperience from "@/components/menu/MenuExperience";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return <MenuExperience key={category} categoryId={category} />;
}
