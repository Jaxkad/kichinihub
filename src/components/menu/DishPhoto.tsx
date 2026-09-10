"use client";
import Image from "next/image";
import { useState } from "react";
export function DishPhoto({ photo }: { photo: { url: string; alt: string } }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="kh-dish-photo">
      <Image
        unoptimized
        src={photo.url}
        alt={photo.alt}
        fill
        sizes="(max-width:700px) 88px, 104px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
