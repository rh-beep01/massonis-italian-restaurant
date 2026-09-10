import React from 'react';
import { MapPin, Phone, Clock, Heart, ExternalLink } from 'lucide-react';
import { menuData } from '../data/menuData';

export default function Footer({ onOpenReserve, onScrollToMenu }) {
  const info = menuData.restaurantInfo;

  return (
    <footer className="bg-[#151312] text-[#DFD5C4] pt-16 pb-12 border-t border-[#36312E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#36312E]">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#7A1C29] text-white flex items-center justify-center font-serif text-xl font-bold">
                M
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-white leading-tight">
                  Massoni's
                </h3>
                <p className="text-[10px] tracking-widest uppercase text-[#D4A373] font-semibold">
                  Italian Restaurant & Bar
                </p>
              </div>
            </div>

            <p className="text-xs text-[#A89F97] leading-relaxed">
              Family-owned culinary tradition in Nottingham, Maryland. Dedicated to scratch-made 
              Italian pastas, wood-fired pizzas, famous spaghetti eggrolls, and homemade gelato.
            </p>

            <div className="pt-2">
              <span className="text-[11px] text-[#7D746D] block">Proprietors:</span>
              <p className="text-xs font-semibold text-white">{info.owners}</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={onScrollToMenu} className="hover:text-white transition-colors">
                  Full Menu & Takeout Ordering
                </button>
              </li>
              <li>
                <a href="#signatures" className="hover:text-white transition-colors">
                  Signature Spaghetti Eggrolls
                </a>
              </li>
              <li>
                <button onClick={onOpenReserve} className="hover:text-white transition-colors">
                  Table Reservations
                </button>
              </li>
              <li>
                <a href="#story" className="hover:text-white transition-colors">
                  Our Culinary Heritage
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Customer Testimonials
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Hours Summary */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Weekly Hours
            </h4>
            <div className="space-y-1.5 text-[#A89F97]">
              <p className="flex justify-between">
                <span>Mon:</span>
                <span className="text-white font-medium">5:00 PM – 9:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Tue – Thu:</span>
                <span className="text-white font-medium">11:00 AM – 9:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Fri – Sat:</span>
                <span className="text-white font-medium">11:00 AM – 10:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span>Sun:</span>
                <span className="text-white font-medium">11:00 AM – 9:00 PM</span>
              </p>
            </div>
          </div>

          {/* Column 4: Contact & Social */}
          <div className="space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <p className="flex items-start gap-2 text-[#A89F97]">
              <MapPin size={15} className="text-[#D4A373] shrink-0 mt-0.5" />
              <span>{info.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone size={15} className="text-[#D4A373] shrink-0" />
              <a href="tel:4109703700" className="text-white font-bold hover:underline">
                (410) 970-3700
              </a>
            </p>

            <div className="pt-3 flex flex-col gap-2">
              <a
                href={info.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D4A373] hover:underline"
              >
                <span>Visit Us on Facebook</span>
                <ExternalLink size={12} />
              </a>
              <a
                href={info.toastUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D4A373] hover:underline"
              >
                <span>Order on Toast POS</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7D746D] gap-4">
          <p>© {new Date().getFullYear()} Massoni's Italian Restaurant. All Rights Reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart size={13} className="text-[#7A1C29] fill-[#7A1C29]" />
            <span>for the Nottingham & Perry Hall Community</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
