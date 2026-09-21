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
        sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc((100vw - 78px) / 2), (max-width: 1320px) calc((100vw - 144px) / 3), 392px"
        src={photo.url}
        alt={photo.alt}
        width={1200}
        height={600}
        onError={() => setFailedUrl(photo.url)}
      /> : children}
    </Link>
  );
}


export function CategoryHeader({ section, style, children }: {
  section?: MenuSection;
  style: CSSProperties;
  children: ReactNode;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const photo = section?.cardImage;
  const showImage = photo && photo.url !== failedUrl;
  return (
    <div className={`kh-category-title${showImage ? " kh-category-header-image" : ""}`} style={style}>
      {showImage ? <>
        <h1 className="sr-only">{section.title}</h1>
        <Image
          src={photo.url}
          alt={photo.alt}
          width={1200}
          height={600}
          sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) calc(100vw - 60px), (max-width: 1320px) calc(100vw - 108px), 1212px"
          loading="eager"
          fetchPriority="high"
          onError={() => setFailedUrl(photo.url)}
        />
      </> : children}
    </div>
  );
}
