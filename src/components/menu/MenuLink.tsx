"use client";
import Link, { useLinkStatus } from "next/link";
import type { ComponentProps } from "react";

function NavigationFeedback() {
  const { pending } = useLinkStatus();
  return <span className={`kh-navigation-feedback${pending ? " is-pending" : ""}`} role="status">
    {pending && <><span className="kh-navigation-spinner" aria-hidden="true" /><span className="sr-only">Opening menu…</span></>}
  </span>;
}

// Let Next manage prefetch, modified clicks, cancellation and scroll restoration.
export function MenuLink({ children, className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={`kh-menu-link ${className}`}>
    {children}
    <NavigationFeedback />
  </Link>;
}
