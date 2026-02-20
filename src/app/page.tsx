// import { menuData } from '@/data/menuData';
// import { MenuSection } from '@/components/menu/MenuSection';
// import { SocialFooter } from '@/components/menu/SocialFooter';
// import { FaInstagram, FaFacebook, FaTiktok, FaPhone } from 'react-icons/fa';
// import { FaX } from 'react-icons/fa6';
// import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#6D1600' }}>
      <h1 className="text-white text-5xl font-bold tracking-widest mb-4">Coming Soon</h1>
      <p className="text-white text-lg opacity-75">Something delicious is on the way.</p>
    </div>
  );
}

// ============================================================
// ORIGINAL PAGE — commented out for Coming Soon mode
// ============================================================
// export default function Home() {
//   return (
//     <div className="min-h-screen">
//       {/* Clean Professional Header */}
//       <header
//         className="md-elevation-level3 relative"
//         style={{
//           backgroundColor: '#6D1600',
//           color: '#FFFFFF'
//         }}
//       >
//         <div className="relative w-full">
//           <Image
//             src="/header.jpg"
//             alt="KHICHINI Hub Header"
//             width={1200}
//             height={60}
//             className="w-full h-auto object-cover"
//             priority
//           />
//         </div>
//       </header>
//
//       <main className="max-w-6xl mx-auto px-4 py-4">
//         <div>
//           {menuData.sections.map((section) => (
//             <MenuSection key={section.id} section={section} />
//           ))}
//           <div className="md-elevation-level2 rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
//             <Image
//               src="/socials.jpg"
//               alt="Follow us on social media"
//               width={1200}
//               height={400}
//               className="w-full h-auto object-cover"
//             />
//           </div>
//         </div>
//       </main>
//
//       <footer
//         className="md-elevation-level4"
//         style={{
//           backgroundColor: '#6D1600',
//           color: '#FFFFFF'
//         }}
//       >
//         <SocialFooter social={menuData.social} />
//         <div className="max-w-6xl mx-auto px-6 py-8">
//           <p className="md-typescale-body-medium text-center">
//             © 2026 Khichini Hub. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
