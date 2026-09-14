"use client";

import { useId, useState } from "react";
import { defaultMenuTypography, defaultTextWeights, menuFonts, menuTypographyStyle, textRoles, type TextRole, type TextSize, type TextWeight, type MenuFontId, type MenuTypography } from "@/lib/menu-typography";
import "@/app/menu-typography.css?v=2";

const labels: Record<TextRole, string> = {
  categoryTitle: "Category titles", categorySubtitle: "Category subtext",
  itemName: "Dish names", itemDescription: "Dish descriptions", price: "Prices",
};
const sizes = ["small", "standard", "large"] as const;
const capitalise = (value: string) => value[0].toUpperCase() + value.slice(1);

export function TypographySettings({ value, disabled, onChange }: {
  value?: MenuTypography;
  disabled: boolean;
  onChange: (value: MenuTypography) => void;
}) {
  const settings = { ...defaultMenuTypography, ...value };
  const [role, setRole] = useState<TextRole>("categoryTitle");
  const hintId = useId();
  const overallSize = textRoles.every((key) => (settings.sizes?.[key] || "standard") === (settings.sizes?.categoryTitle || "standard"))
    ? settings.sizes?.categoryTitle || "standard" : "custom";
  return (
    <section className="panel settings-panel typography-settings">
      <h2>Menu appearance</h2>
      <p className="muted">Adjust the look, check the preview, then use “Publish changes”. Applies to every category on both menu pages.</p>
      <div className="typography-controls">
        <label>Text size
          <select disabled={disabled} value={overallSize} onChange={(event) => onChange({ ...settings, sizes: Object.fromEntries(textRoles.map((key) => [key, event.target.value as TextSize])) })}>
            {overallSize === "custom" && <option value="custom" disabled>Custom sizes</option>}
            {sizes.map((size) => <option key={size} value={size}>{capitalise(size)}</option>)}
          </select>
          <small>Changes all menu text together.</small>
        </label>
        <label>Space between dishes
          <select disabled={disabled} value={settings.spacing || "comfortable"} onChange={(event) => onChange({ ...settings, spacing: event.target.value as MenuTypography["spacing"] })}>
            {["compact", "comfortable", "spacious"].map((space) => <option key={space} value={space}>{capitalise(space)}</option>)}
          </select>
          <small>Comfortable is the original spacing.</small>
        </label>
      </div>
      <details className="typography-details">
        <summary>Fine-tune text <span>Fonts, individual sizes &amp; weights</span></summary>
        <label>Which text would you like to adjust?
          <select value={role} onChange={(event) => setRole(event.target.value as TextRole)}>
            {textRoles.map((key) => <option key={key} value={key}>{labels[key]}</option>)}
          </select>
        </label>
        <fieldset disabled={disabled} className="typography-fieldset">
          <legend>{labels[role]}</legend>
          {role !== "price" ? <label>Font
            <select value={settings[role]} onChange={(event) => onChange({ ...settings, [role]: event.target.value as MenuFontId })}>
              {menuFonts.map((font) => <option key={font.id} value={font.id}>{font.label}</option>)}
            </select>
            <small>{menuFonts.find((font) => font.id === settings[role])?.note}</small>
          </label> : <p className="muted">Prices use the dish-name font.</p>}
          <div className="typography-controls">
            <label>Size
              <select value={settings.sizes?.[role] || "standard"} onChange={(event) => onChange({ ...settings, sizes: { ...settings.sizes, [role]: event.target.value as TextSize } })}>
                {sizes.map((size) => <option key={size} value={size}>{capitalise(size)}</option>)}
              </select>
            </label>
            <label>Weight
              <select value={settings.weights?.[role] || defaultTextWeights[role]} onChange={(event) => onChange({ ...settings, weights: { ...settings.weights, [role]: event.target.value as TextWeight } })}>
                {["regular", "medium", "bold"].map((weight) => <option key={weight} value={weight}>{capitalise(weight)}</option>)}
              </select>
            </label>
          </div>
        </fieldset>
        <label>Category header alignment
          <select disabled={disabled} value={settings.headerAlign || "left"} onChange={(event) => onChange({ ...settings, headerAlign: event.target.value as MenuTypography["headerAlign"] })}>
            <option value="left">Left</option><option value="center">Centre</option>
          </select>
          <small>Matches on the home page and category detail page.</small>
        </label>
      </details>
      <div className="typography-preview-heading">
        <h3>Draft preview</h3>
      </div>
      <p className="muted typography-preview-hint" id={hintId}>Sample content · Adapts to your screen width.</p>
      <div className="typography-preview-scroll" tabIndex={0} role="region" aria-label="Menu appearance preview" aria-describedby={hintId}>
        <div className="typography-preview-frame">
          <div className="typography-preview" style={menuTypographyStyle(settings)}>
            <div className="menu-type-header">
              <h2 className="menu-type-title">From the grill</h2>
              <p className="menu-type-subtitle">Big flavours, good company, and something for everyone.</p>
            </div>
            {[
              ["Tender Beef Ribs & Wedges", "40,000", "Slow-cooked ribs with crispy wedges and our smoky house sauce."],
              ["Grilled Chicken", "25,000", "Flame-grilled chicken, fresh slaw, and a side of your choice."],
            ].map(([name, price, description]) => <div className="menu-type-dish" key={name}>
              <div className="menu-type-dish-top"><h3 className="menu-type-item">{name}</h3><span className="menu-type-price">K {price}</span></div>
              <p className="menu-type-description">{description}</p>
            </div>)}
          </div>
        </div>
      </div>
      <button className="typography-reset" type="button" disabled={disabled} onClick={() => onChange({ ...defaultMenuTypography })}>Reset appearance to defaults</button>
    </section>
  );
}
