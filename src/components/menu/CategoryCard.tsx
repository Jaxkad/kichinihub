"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties, type ReactNode } from "react";
import type { MenuSection } from "@/data/menuData";

export function CategoryCard({ section, style, children }: {
  section: MenuSection;
  style: CSSProperties;
  children: ReactNode;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const photo = section.cardImage;
  const showImage = photo && photo.url !== failedUrl;
  return (
    <Link
      className={`kh-category-card${showImage ? " kh-category-card-image" : ""}`}
      href={`/menu/${encodeURIComponent(section.id)}`}
      aria-label={`View ${section.title} menu`}
      style={style}
    >
      {showImage ? <Image
        unoptimized
        src={photo.url}
        alt={photo.alt}
        width={1200}
        height={600}
        onError={() => setFailedUrl(photo.url)}
      /> : children}
    </Link>
  );
}
