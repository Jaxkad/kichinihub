import { FaInstagram, FaFacebook, FaTiktok, FaPhone } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';

interface SocialFooterProps {
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    tiktok: string;
    rsvp: string;
  };
}

export function SocialFooter({ social }: SocialFooterProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Social Icons */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium mr-2" style={{ color: 'var(--md-sys-color-on-primary)' }}>
            Follow:
          </span>
          <div className="flex gap-1">
            <a 
              href="https://www.instagram.com/khichini_hub/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ color: 'var(--md-sys-color-on-primary)' }}
              aria-label="Instagram"
            >
              <FaInstagram className="w-4 h-4" style={{ color: '#E4405F' }} />
            </a>
            <a 
              href={`https://facebook.com/${social.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ color: 'var(--md-sys-color-on-primary)' }}
              aria-label="Facebook"
            >
              <FaFacebook className="w-4 h-4" style={{ color: '#1877F2' }} />
            </a>
            <a 
              href={`https://twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ color: 'var(--md-sys-color-on-primary)' }}
              aria-label="X"
            >
              <FaX className="w-4 h-4" style={{ color: '#000000' }} />
            </a>
            <a 
              href={`https://tiktok.com/@${social.tiktok}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95"
              style={{ color: 'var(--md-sys-color-on-primary)' }}
              aria-label="TikTok"
            >
              <FaTiktok className="w-4 h-4" style={{ color: '#000000' }} />
            </a>
          </div>
        </div>
        
        {/* Contact */}
        <div className="flex items-center gap-2">
          <a 
            href={`tel:${social.rsvp}`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 hover:bg-white/10 active:scale-95 text-sm"
            style={{ color: 'var(--md-sys-color-on-primary)' }}
          >
            <FaPhone className="w-4 h-4" />
            <span className="font-medium">{social.rsvp}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
