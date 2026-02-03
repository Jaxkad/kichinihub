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
        background: 'var(--md-sys-color-primary-container)', // Subtle primary container
        onBackground: 'var(--md-sys-color-on-primary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'light':
      return {
        background: 'var(--md-sys-color-tertiary-container)', // Subtle tertiary container
        onBackground: 'var(--md-sys-color-on-tertiary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'burgundy':
      return {
        background: 'var(--md-sys-color-secondary-container)', // Subtle secondary container
        onBackground: 'var(--md-sys-color-on-secondary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'terracotta':
      return {
        background: 'var(--md-sys-color-tertiary-container)', // Subtle tertiary container
        onBackground: 'var(--md-sys-color-on-tertiary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'brown':
      return {
        background: 'var(--md-sys-color-primary-container)', // Subtle primary container
        onBackground: 'var(--md-sys-color-on-primary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'green':
      return {
        background: 'var(--md-sys-color-tertiary-container)', // Subtle tertiary container
        onBackground: 'var(--md-sys-color-on-tertiary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'cream':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Subtle surface container
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'teal':
      return {
        background: 'var(--md-sys-color-secondary-container)', // Subtle secondary container
        onBackground: 'var(--md-sys-color-on-secondary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'slate':
      return {
        background: 'var(--md-sys-color-surface-container-high)', // Subtle surface container
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'forest':
      return {
        background: 'var(--md-sys-color-tertiary-container)', // Subtle tertiary container
        onBackground: 'var(--md-sys-color-on-tertiary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'pink':
      return {
        background: 'var(--md-sys-color-secondary-container)', // Subtle secondary container
        onBackground: 'var(--md-sys-color-on-secondary-container)',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: 'var(--md-sys-color-secondary)'
      };
    case 'golden':
      return {
        background: 'rgba(255, 223, 128, 0.15)', // Subtle golden yellow
        onBackground: '#B8860B',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#D4A574'
      };
    case 'burnt':
      return {
        background: 'rgba(205, 92, 92, 0.12)', // Subtle burnt orange
        onBackground: '#8B4513',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#CD5C5C'
      };
    case 'sage':
      return {
        background: 'rgba(134, 166, 125, 0.12)', // Subtle sage green
        onBackground: '#6B8E23',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#8FBC8F'
      };
    case 'earth':
      return {
        background: 'rgba(160, 128, 96, 0.12)', // Subtle warm earth tones
        onBackground: '#8B7355',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#A0826D'
      };
    case 'leaf':
      return {
        background: 'rgba(124, 169, 124, 0.12)', // Subtle leaf green
        onBackground: '#556B2F',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#7CB342'
      };
    case 'olive':
      return {
        background: 'rgba(128, 128, 96, 0.12)', // Subtle olive
        onBackground: '#6B8E23',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#808000'
      };
    default:
      return {
        background: 'var(--md-sys-color-surface-container-high)',
        onBackground: 'var(--md-sys-color-on-surface)',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        priceColor: 'var(--md-sys-color-secondary)'
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
