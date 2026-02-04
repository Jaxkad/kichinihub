import { MenuSection as MenuSectionType } from '@/data/menuData';
import { MenuItem } from './MenuItem';

interface MenuSectionProps {
  section: MenuSectionType;
}

const getLogoColorForTheme = (theme: string) => {
  // Food psychology-based colors with richness and depth
  switch (theme) {
    case 'red':
      return {
        background: '#6D1600', // Brand primary red
        onBackground: '#FFFFFF',
        surface: 'rgba(109, 22, 0, 0.15)', // Less faint red background
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'light':
      return {
        background: '#F5F5F5', // Light gray
        onBackground: '#000000',
        surface: 'rgba(245, 245, 245, 0.7)', // Less faint light gray
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'burgundy':
      return {
        background: '#722F37', // Deep burgundy - rich, elegant
        onBackground: '#FFFFFF',
        surface: 'rgba(114, 47, 55, 0.15)', // Less faint burgundy
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'terracotta':
      return {
        background: '#CB4B16', // Rich terracotta - earthy, warm
        onBackground: '#FFFFFF',
        surface: 'rgba(203, 75, 22, 0.15)', // Less faint terracotta
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'brown':
      return {
        background: '#6D1600', // Brand brown coffee - rich, comforting
        onBackground: '#FFFFFF',
        surface: 'rgba(109, 22, 0, 0.15)', // Less faint brown
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'green':
      return {
        background: '#2E7D32', // Deep forest green - fresh, healthy
        onBackground: '#FFFFFF',
        surface: 'rgba(46, 125, 50, 0.15)', // Less faint green
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'cream':
      return {
        background: '#D2B48C', // Tan - warm, comforting
        onBackground: '#2C1810',
        surface: 'rgba(210, 180, 140, 0.3)', // Less faint tan
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'teal':
      return {
        background: '#006064', // Deep teal - fresh, calming
        onBackground: '#FFFFFF',
        surface: 'rgba(0, 96, 100, 0.15)', // Less faint teal
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'slate':
      return {
        background: '#37474F', // Dark slate - sophisticated, neutral
        onBackground: '#FFFFFF',
        surface: 'rgba(55, 71, 79, 0.15)', // Less faint slate
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'forest':
      return {
        background: '#1B5E20', // Deep forest green
        onBackground: '#FFFFFF',
        surface: 'rgba(27, 94, 32, 0.15)', // Less faint forest green
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'pink':
      return {
        background: '#AD1457', // Deep pink - sweet, indulgent
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'golden':
      return {
        background: '#FF8F00', // Deep amber - rich, premium
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'burnt':
      return {
        background: '#BF360C', // Deep burnt orange - warm, energizing
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'sage':
      return {
        background: '#689F38', // Deep sage green - herbal, fresh
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'earth':
      return {
        background: '#5D4037', // Deep earth brown - grounding, wholesome
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'leaf':
      return {
        background: '#33691E', // Deep leaf green - vibrant, fresh
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    case 'olive':
      return {
        background: '#558B2F', // Deep olive - mediterranean, rich
        onBackground: '#FFFFFF',
        surface: 'rgba(255, 255, 255, 0.95)',
        onSurface: '#1F2937',
        priceColor: '#6D1600'
      };
    default:
      return {
        background: '#6D1600',
        onBackground: '#FFFFFF',
        surface: 'var(--md-sys-color-surface)',
        onSurface: 'var(--md-sys-color-on-surface)',
        priceColor: '#6D1600'
      };
  }
};

export function MenuSection({ section }: MenuSectionProps) {
  const colors = getLogoColorForTheme(section.theme);

  return (
    <div 
      className="mb-12"
      style={{ 
        backgroundColor: '#FFF8E7', // Light yellow background
        borderRadius: '0' // Remove rounded corners
      }}
      data-section-id={section.id}
    >
      {/* Clean Header - Luxury Hotel Style */}
      <div 
        className="px-6 py-8 text-center"
        style={{ 
          backgroundColor: colors.background
        }}
      >
        <h2 
          className="md-typescale-headline-large font-bold mb-3 tracking-tight"
          style={{ 
            color: (section.id === 'breakfast' || section.id === 'soups') ? '#000000' : '#FFFFFF' // Black for breakfast and soups, white for all others
          }}
        >
          {section.title}
        </h2>
        {section.subtitle && (
          <p 
            className="md-typescale-title-medium opacity-95 font-medium tracking-wide"
            style={{ 
              color: (section.id === 'breakfast' || section.id === 'soups') ? '#000000' : '#FFFFFF' // Black for breakfast and soups, white for all others
            }}
          >
            {section.subtitle}
          </p>
        )}
      </div>

      {/* Subtle Divider */}
      <div className="w-full h-0.5 opacity-30" style={{ backgroundColor: '#6D1600' }} />

      {/* Content - Single Column */}
      <div 
        className="px-6 pb-8"
        style={{ 
          backgroundColor: colors.surface, // Use theme surface color instead of fixed yellow
          color: colors.onSurface // Use theme text color
        }}
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          {section.items.map((item) => (
            <MenuItem key={item.id} item={item} priceColor={colors.priceColor} />
          ))}
        </div>
      </div>
    </div>
  );
}
