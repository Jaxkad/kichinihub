import { menuData } from '@/data/menuData';
import { MenuSection } from '@/components/menu/MenuSection';
import { SocialFooter } from '@/components/menu/SocialFooter';
import { FaInstagram, FaFacebook, FaTiktok, FaPhone } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Clean Professional Header */}
      <header 
        className="md-elevation-level3 relative"
        style={{ 
          backgroundColor: '#6D1600', // Brand primary color for consistency
          color: '#FFFFFF'
        }}
      >
        {/* Header Image */}
        <div className="relative w-full">
          <Image 
            src="/header.jpg" 
            alt="KHICHINI Hub Header" 
            width={1200}
            height={60}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      </header>

      {/* Main Menu Content */}
      <main className="max-w-6xl mx-auto px-4 py-4">
        {/* Menu Sections */}
        <div>
          {menuData.sections.map((section) => (
            <MenuSection key={section.id} section={section} />
          ))}
          
          {/* Social Media Card */}
          <div className="md-elevation-level2 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <Image 
              src="/socials.jpg" 
              alt="Follow us on social media" 
              width={1200}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="md-elevation-level4"
        style={{ 
          backgroundColor: '#6D1600',
          color: '#FFFFFF'
        }}
      >
        {/* Social Footer */}
        <SocialFooter social={menuData.social} />
        
        <div className="max-w-6xl mx-auto px-6 py-8">
          <p className="md-typescale-body-medium text-center">
            © 2026 Khichini Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
