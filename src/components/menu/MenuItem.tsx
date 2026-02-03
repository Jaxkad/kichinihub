import { MenuItem as MenuItemType } from '@/data/menuData';
import { Badge } from '@/components/ui/badge';
import { FlameIcon, LeafIcon } from 'lucide-react';

interface MenuItemProps {
  item: MenuItemType;
  priceColor?: string;
}

export function MenuItem({ item, priceColor }: MenuItemProps) {
  const formatPrice = (price: number) => {
    return `K${price.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col space-y-3 py-4 md-state-layer" style={{ borderBottom: '1px solid var(--md-sys-color-surface-container-highest)' }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="md-typescale-title-large" style={{ color: '#000000' }}>
              {item.name}
            </h3>
            <div className="flex gap-1">
              {item.dietary?.pork && (
                <Badge 
                  variant="secondary" 
                  className="md-shape-corner-extra-small"
                  style={{ 
                    backgroundColor: '#92400E',
                    color: '#ffffff'
                  }}
                >
                  Pork
                </Badge>
              )}
              {item.dietary?.vegan && (
                <Badge 
                  variant="secondary" 
                  className="md-shape-corner-extra-small"
                  style={{ 
                    backgroundColor: '#059669',
                    color: '#ffffff'
                  }}
                >
                  <LeafIcon className="w-3 h-3 mr-1" />
                  Vegan
                </Badge>
              )}
              {item.dietary?.hot && (
                <Badge 
                  variant="secondary" 
                  className="md-shape-corner-extra-small"
                  style={{ 
                    backgroundColor: '#DC2626',
                    color: '#ffffff'
                  }}
                >
                  <FlameIcon className="w-3 h-3 mr-1" />
                  Hot
                </Badge>
              )}
            </div>
          </div>
          <p className="md-typescale-body-medium mt-2" style={{ color: '#000000' }}>
            {item.description}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span 
            className="md-typescale-title-large font-bold"
            style={{ color: priceColor }}
          >
            {formatPrice(item.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
