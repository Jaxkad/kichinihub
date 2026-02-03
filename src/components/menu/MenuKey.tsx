import { Badge } from '@/components/ui/badge';
import { LeafIcon, FlameIcon } from 'lucide-react';

export function MenuKey() {
  return (
    <div 
      className="md-elevation-level2 md-shape-corner-extra-large p-6 mb-8"
      style={{ 
        backgroundColor: 'var(--md-sys-color-surface)',
        color: 'var(--md-sys-color-on-surface)'
      }}
    >
      <h2 className="md-typescale-headline-medium text-center mb-6">
        MENU KEY
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <Badge 
            variant="secondary" 
            className="md-shape-corner-extra-small"
            style={{ 
              backgroundColor: '#92400E',
              color: '#ffffff'
            }}
          >
            🐷 Pork
          </Badge>
          <span className="md-typescale-body-medium">Contains Pork</span>
        </div>
        <div className="flex items-center gap-2">
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
          <span className="md-typescale-body-medium">Plant-based</span>
        </div>
        <div className="flex items-center gap-2">
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
          <span className="md-typescale-body-medium">Spicy</span>
        </div>
      </div>
    </div>
  );
}
