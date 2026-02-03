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
      
      {/* Clean Professional Header */}
      <header 
        className="md-elevation-level3 relative"
        style={{ 
          backgroundColor: '#6D1600', // Brand primary color for consistency
          color: '#FFFFFF'
        }}
      >
        <div className="relative max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Brand - Left Side */}
            <div className="flex items-center space-x-5">
              {/* Logo */}
              <div className="relative">
                <Image 
                  src="/IMG_4965.jpg" 
                  alt="KHICHINI Hub Logo" 
                  width={64}
                  height={64}
                  className="object-contain drop-shadow-lg rounded-full border-2 border-white/20"
                />
              </div>
              
              {/* Restaurant Name */}
              <div>
                <h1 className="text-3xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
                  <div style={{ fontFamily: 'Zebrazil, sans-serif' }}>
                    KHICHINI
                    <div style={{ fontFamily: 'Britanny Signature, cursive', fontSize: '0.5em', marginTop: '-0.2em' }}>
                      Hub
                    </div>
                  </div>
                </h1>
                <p className="text-sm opacity-90 mt-2 font-light">
                  Good food, great service, and all the convenience you crave. Let&apos;s make it easy!
                </p>
              </div>
            </div>

            {/* Navigation - Right Side */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#starters" className="text-white opacity-90 hover:opacity-100 transition-opacity font-medium">
                Starters
              </a>
              <a href="#mains" className="text-white opacity-90 hover:opacity-100 transition-opacity font-medium">
                Mains
              </a>
              <a href="#breakfast" className="text-white opacity-90 hover:opacity-100 transition-opacity font-medium">
                Breakfast
              </a>
              <a href="#contact" className="text-white opacity-90 hover:opacity-100 transition-opacity font-medium">
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 rounded-lg hover:bg-white/10 transition-colors" 
              style={{ color: '#FFFFFF' }}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
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
            © 2026 Kichini Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
