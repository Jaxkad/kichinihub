'use client';

import { useState, useEffect, useRef } from 'react';
import { menuData } from '@/data/menuData';

export function StickyNavigator() {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const navigatorRef = useRef<HTMLDivElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const headerHeight = 300;
      
      setVisible(scrollY > headerHeight);
      
      const sections = menuData.sections;
      let currentSection = '';
      
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom > 100) {
            currentSection = section.id;
            break;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  // Auto-scroll active section into view with improved accuracy
  useEffect(() => {
    if (activeSection && activeButtonRef.current && navigatorRef.current) {
      const activeButton = activeButtonRef.current;
      const navigatorContainer = navigatorRef.current;
      
      // Use requestAnimationFrame for smoother transitions
      requestAnimationFrame(() => {
        // Get the button and container positions
        const buttonRect = activeButton.getBoundingClientRect();
        const containerRect = navigatorContainer.getBoundingClientRect();
        
        // Calculate the center position for the active button
        const buttonCenter = buttonRect.left - containerRect.left + (buttonRect.width / 2);
        const containerCenter = containerRect.width / 2;
        
        // Calculate the exact scroll position needed to center the button
        const scrollTarget = buttonCenter - containerCenter;
        
        // Only scroll if the button is not properly centered or not fully visible
        const buttonLeftEdge = buttonRect.left - containerRect.left;
        const buttonRightEdge = buttonRect.right - containerRect.left;
        const isButtonFullyVisible = buttonLeftEdge >= 0 && buttonRightEdge <= containerRect.width;
        const isButtonCentered = Math.abs(scrollTarget) < 20; // Allow 20px tolerance
        
        if (!isButtonFullyVisible || !isButtonCentered) {
          // Use smooth scrolling with precise timing and bounds checking
          const maxScroll = navigatorContainer.scrollWidth - containerRect.width;
          const boundedScrollTarget = Math.max(0, Math.min(scrollTarget, maxScroll));
          
          navigatorContainer.scrollTo({
            left: boundedScrollTarget,
            behavior: 'smooth'
          });
        }
      });
    }
  }, [activeSection]);

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const sections = menuData.sections;
    sections.forEach(section => {
      const element = document.querySelector(`[data-section-id="${section.id}"]`) as HTMLElement;
      if (element) {
        sectionRefs.current[section.id] = element;
      }
    });
  }, []);

  const getDisplayName = (sectionId: string) => {
    const nameMap: { [key: string]: string } = {
      'breakfast': 'Breakfast',
      'salads': 'Salads',
      'mains': 'Mains',
      'platters': 'Platters',
      'starches': 'Starches',
      'soups': 'Soup',
      'finger-foods': 'Finger foods',
      'sandwiches': 'Sandwiches',
      'wraps': 'Wraps',
      'desserts': 'Desserts'
    };
    return nameMap[sectionId] || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out">
      <div 
        ref={navigatorRef}
        className="flex gap-1 px-3 py-2 backdrop-blur-xl rounded-full shadow-lg border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          maxWidth: '85vw',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {menuData.sections.map((section) => (
          <button
            key={section.id}
            ref={activeSection === section.id ? activeButtonRef : undefined}
            onClick={() => scrollToSection(section.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 ${
              activeSection === section.id
                ? 'bg-black text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
            }`}
            style={{ 
              fontSize: '11px', 
              fontWeight: activeSection === section.id ? '600' : '500',
              minWidth: 'fit-content'
            }}
          >
            {getDisplayName(section.id)}
          </button>
        ))}
      </div>
    </div>
  );
}
