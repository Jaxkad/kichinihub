import { MenuSection as MenuSectionType } from '@/data/menuData';
import { MenuItem } from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
}

const getLogoColorForTheme = (theme: string) => {
  // Map themes to logo colors for Material Design 3 - Subtle blending
  switch (theme) {
    case 'red':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'light':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'burgundy':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'terracotta':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'brown':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'green':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'cream':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'teal':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'slate':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'forest':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'pink':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'golden':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'burnt':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'sage':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'earth':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'leaf':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    case 'olive':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Dark gray in dark mode
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
    default:
      return {
        background: 'var(--md-sys-color-surface-container-high)',
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        priceColor: 'var(--md-sys-color-on-primary-container)'
      };
  }
};

export function MenuSection({ section }: MenuSectionProps) {
  const colors = getLogoColorForTheme(section.theme);

  return (
    <div 
      className="overflow-hidden mb-6"
      style={{ 
        backgroundColor: 'var(--md-sys-color-surface-container)',
        borderRadius: '16px'
      }}
      data-section-id={section.id}
    >
      {/* Header */}
      <div 
        className="px-6 py-4"
        style={{ 
          backgroundColor: colors.background,
          color: colors.onBackground
        }}
      >
        <h2 className="md-typescale-headline-small text-center">
          {section.title}
        </h2>
        {section.subtitle && (
          <p className="md-typescale-body-medium text-center mt-1 opacity-90">
            {section.subtitle}
          </p>
        )}
      </div>

      {/* Content */}
      <div 
        className="px-6 pb-4"
        style={{ 
          backgroundColor: 'var(--md-sys-color-surface-container)',
          color: 'var(--md-sys-color-on-surface)'
        }}
      >
        <div className="space-y-2">
          {section.items.map((item) => (
            <MenuItem key={item.id} item={item} priceColor={colors.priceColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
