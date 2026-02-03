import { menuData } from '@/data/menuData';
import { MenuSection } from '@/components/menu/MenuSection';
import { SocialFooter } from '@/components/menu/SocialFooter';
import { StickyNavigator } from '@/components/menu/StickyNavigator';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Sticky Navigator */}
      <StickyNavigator />
      
      {/* Header - Beautiful Design with Logo */}
      <header 
        className="md-elevation-level4 relative overflow-hidden"
        style={{ 
          backgroundColor: '#6D1600',
          color: '#FFFFFF'
        }}
      >
        {/* Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Image 
                  src="/IMG_4965.jpg" 
                  alt="KHICHINI Hub Logo" 
                  width={128}
                  height={128}
                  className="object-contain drop-shadow-lg rounded-full"
                />
              </div>
            </div>
            
            {/* Restaurant Name */}
            <div className="space-y-2">
              <h1 className="md-typescale-display-medium font-bold" style={{ color: '#FFFFFF' }}>
                KHICHINI Hub
              </h1>
              <div className="w-24 h-1 mx-auto rounded-full" 
                style={{ backgroundColor: 'var(--md-sys-color-secondary)' }}
              />
            </div>
            
            {/* Tagline */}
            <div className="space-y-2 max-w-2xl mx-auto">
              <p className="md-typescale-title-large opacity-95 font-medium">
                Where Memories Meet Flavor
              </p>
              <p className="md-typescale-title-medium opacity-85 italic">
                Khala&apos;s greatest hits, now part of the Hub-story
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-8 text-sm opacity-70">
              <span className="md-typescale-label-medium">Malawi&apos;s Finest</span>
              <span>•</span>
              <span className="md-typescale-label-medium">Hub of Flavors</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Menu Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Menu Sections */}
        <div className="space-y-10">
          {menuData.sections.map((section) => (
            <MenuSection key={section.id} section={section} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="md-elevation-level4 mt-16"
        style={{ 
          backgroundColor: '#6D1600',
          color: '#FFFFFF'
        }}
      >
        {/* Social Footer */}
        <SocialFooter social={menuData.social} />
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="md-typescale-body-medium text-center">
            © 2024 Kitchini Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
