"use client";
import Image from "next/image";
import { MenuLink as Link } from "./MenuLink";
import { useState, useRef, type CSSProperties, type ReactNode } from "react";
import type { MenuSection } from "@/data/menuData";

export function CategoryCard({ section, style, children }: {
  section: MenuSection;
  style: CSSProperties;
  children: ReactNode;
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const alreadyVisible = useRef(new Set<string>());
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
        className={loadedUrl === photo.url ? "kh-artwork-loaded" : undefined}
        ref={(image) => { if (image?.complete) alreadyVisible.current.add(photo.url); }}
        onLoad={() => { if (!alreadyVisible.current.has(photo.url)) setLoadedUrl(photo.url); }}
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
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const alreadyVisible = useRef(new Set<string>());
  const photo = section?.cardImage;
  const showImage = photo && photo.url !== failedUrl;
  return (
    <div className={`kh-category-title${showImage ? " kh-category-header-image" : ""}`} style={style}>
      {showImage ? <>
        <h1 className="sr-only">{section.title}</h1>
        <Image
          className={loadedUrl === photo.url ? "kh-artwork-loaded" : undefined}
          ref={(image) => { if (image?.complete) alreadyVisible.current.add(photo.url); }}
        onLoad={() => { if (!alreadyVisible.current.has(photo.url)) setLoadedUrl(photo.url); }}
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
