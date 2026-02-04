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

            {/* Contact & Social - Right Side */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Phone Number */}
              <a 
                href={`tel:${menuData.social.rsvp}`}
                className="px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-sm font-medium"
                style={{ color: '#FFFFFF' }}
              >
                RSVP: {menuData.social.rsvp}
              </a>
              
              {/* Social Icons */}
              <div className="flex items-center space-x-2">
                <a 
                  href={`https://instagram.com/${menuData.social.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" style={{ color: '#E4405F' }} />
                </a>
                <a 
                  href={`https://facebook.com/${menuData.social.facebook.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5" style={{ color: '#1877F2' }} />
                </a>
                <a 
                  href={`https://twitter.com/${menuData.social.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
                  aria-label="X"
                >
                  <FaX className="w-5 h-5" style={{ color: '#000000' }} />
                </a>
                <a 
                  href={`https://tiktok.com/@${menuData.social.tiktok}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
                  aria-label="TikTok"
                >
                  <FaTiktok className="w-5 h-5" style={{ color: '#000000' }} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Contact & Social Bar */}
      <div 
        className="md:hidden px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#6D1600' }}
      >
        {/* Phone Number */}
        <a 
          href={`tel:${menuData.social.rsvp}`}
          className="px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-sm font-medium"
          style={{ color: '#FFFFFF' }}
        >
          RSVP: {menuData.social.rsvp}
        </a>
        
        {/* Social Icons */}
        <div className="flex items-center space-x-1">
          <a 
            href={`https://instagram.com/${menuData.social.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            aria-label="Instagram"
          >
            <FaInstagram className="w-4 h-4" style={{ color: '#E4405F' }} />
          </a>
          <a 
            href={`https://facebook.com/${menuData.social.facebook.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            aria-label="Facebook"
          >
            <FaFacebook className="w-4 h-4" style={{ color: '#1877F2' }} />
          </a>
          <a 
            href={`https://twitter.com/${menuData.social.twitter.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            aria-label="X"
          >
            <FaX className="w-4 h-4" style={{ color: '#000000' }} />
          </a>
          <a 
            href={`https://tiktok.com/@${menuData.social.tiktok}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
            aria-label="TikTok"
          >
            <FaTiktok className="w-4 h-4" style={{ color: '#000000' }} />
          </a>
        </div>
      </div>

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
            © 2026 Khichini Hub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
