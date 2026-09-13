"use client";

import { useEffect } from "react";

const textInput = 'input:not([type="checkbox"]):not([type="radio"]):not([type="file"]):not([type="hidden"]):not([type="datetime-local"])';

// Shared by login, inline settings, and dynamically mounted admin editors.
export function useAdminKeyboard() {
  useEffect(() => {
    const nextField = (field: HTMLInputElement) => {
      const scope = field.closest("form, .settings-panel");
      if (!scope) return undefined;
      const fields = Array.from(scope.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`${textInput}, textarea, select, input[type="datetime-local"]`))
        .filter((node) => !node.disabled && !node.matches("[readonly]") && node.getClientRects().length > 0);
      return fields[fields.indexOf(field) + 1];
    };
    const focus = (event: FocusEvent) => {
      const field = event.target;
      if (!(field instanceof HTMLInputElement) || !field.closest(".admin") || !field.matches(textInput)) return;
      if (!field.hasAttribute("data-admin-enter")) {
        if (field.hasAttribute("enterkeyhint")) return;
        field.setAttribute("data-admin-enter", "true");
      }
      field.enterKeyHint = nextField(field) ? "next" : "done";
    };
    const key = (event: KeyboardEvent) => {
      const field = event.target;
      if (event.key !== "Enter" || event.isComposing || event.keyCode === 229 || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return;
      if (!(field instanceof HTMLInputElement) || !field.closest(".admin")) return;
      if (field.enterKeyHint === "next") {
        event.preventDefault();
        if (!field.reportValidity()) return;
        nextField(field)?.focus();
      } else if (field.enterKeyHint === "done" || field.enterKeyHint === "search") {
        // Done finishes editing; saving/publishing remains an explicit button action.
        event.preventDefault();
        field.blur();
      }
    };
    const submit = (event: Event) => {
      if (!(event.target instanceof HTMLFormElement) || !event.target.closest(".admin")) return;
      const field = document.activeElement;
      // Native validation happens before submit. Keep desktop keyboard focus intact.
      if (window.matchMedia("(any-pointer: coarse)").matches &&
          (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && event.target.contains(field)) field.blur();
    };
    const viewport = window.visualViewport;
    const root = document.documentElement;
    let frame = 0;
    const updateViewport = () => {
      // Do not resize dialogs around a user's deliberate pinch zoom.
      if (viewport && Math.abs(viewport.scale - 1) < 0.01) {
        const height = `${viewport.height}px`;
        const top = `${viewport.offsetTop}px`;
        if (root.style.getPropertyValue("--admin-visible-height") !== height) root.style.setProperty("--admin-visible-height", height);
        if (root.style.getPropertyValue("--admin-visible-top") !== top) root.style.setProperty("--admin-visible-top", top);
      }
    };
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateViewport);
    };
    updateViewport();
    viewport?.addEventListener("resize", resize);
    viewport?.addEventListener("scroll", resize);
    document.addEventListener("focusin", focus);
    document.addEventListener("keydown", key);
    document.addEventListener("submit", submit, true);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", resize);
      viewport?.removeEventListener("scroll", resize);
      root.style.removeProperty("--admin-visible-height");
      root.style.removeProperty("--admin-visible-top");
      document.removeEventListener("focusin", focus);
      document.removeEventListener("keydown", key);
      document.removeEventListener("submit", submit, true);
    };
  }, []);
}
