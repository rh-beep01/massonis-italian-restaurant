import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { menuData } from '../data/menuData';

export default function Navbar({ cartCount, onOpenCart, onOpenReserve }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Notification Announcement Bar */}
      <div className="bg-[#181514] text-[#EAE1D2] text-xs py-2 px-4 border-b border-[#36302C]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#D4A373] font-medium">
              <MapPin size={13} />
              8833 Belair Rd, Nottingham MD 21236
            </span>
            <span className="hidden sm:inline-block text-[#7D746D]">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open Today: 11:00 AM – 9:00 PM
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <a 
              href="tel:4109703700" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone size={13} className="text-[#D4A373]" />
              <span className="font-semibold">(410) 970-3700</span>
            </a>
            <a 
              href={menuData.restaurantInfo.toastUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-[#D4A373] hover:underline"
            >
              Official Toast POS <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Tricolore Ribbon */}
      <div className="italian-ribbon w-full"></div>

      {/* Main Glass Header */}
      <header 
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'glass-nav shadow-md py-3' : 'bg-[#FDFAF5] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group text-decoration-none">
              <div className="w-11 h-11 rounded-full bg-[#7A1C29] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#7A1C29] leading-tight">
                  Massoni's
                </span>
                <span className="text-[10px] tracking-widest uppercase font-semibold text-[#57504A]">
                  Italian Restaurant & Bar
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-8">
              <a 
                href="#menu" 
                className="text-sm font-semibold text-[#221E1C] hover:text-[#7A1C29] transition-colors"
              >
                Menu & Ordering
              </a>
              <a 
                href="#signatures" 
                className="text-sm font-semibold text-[#221E1C] hover:text-[#7A1C29] transition-colors"
              >
                House Specialties
              </a>
              <a 
                href="#story" 
                className="text-sm font-semibold text-[#221E1C] hover:text-[#7A1C29] transition-colors"
              >
                Our Story
              </a>
              <a 
                href="#location" 
                className="text-sm font-semibold text-[#221E1C] hover:text-[#7A1C29] transition-colors"
              >
                Hours & Location
              </a>
              <a 
                href="#reviews" 
                className="text-sm font-semibold text-[#221E1C] hover:text-[#7A1C29] transition-colors"
              >
                Reviews
              </a>
            </nav>

            {/* Actions: Reserve Table & Cart Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenReserve}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-[#7A1C29] bg-[#FDF0F2] hover:bg-[#7A1C29] hover:text-white transition-all border border-[#7A1C29]/20"
              >
                <Calendar size={16} />
                Reserve Table
              </button>

              <button
                onClick={onOpenCart}
                className="relative inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-bold text-white bg-[#7A1C29] hover:bg-[#621420] shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <ShoppingBag size={18} />
                <span className="hidden md:inline">Order Cart</span>
                {cartCount > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs font-black text-[#7A1C29] bg-white rounded-full shadow-sm animate-scale">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl text-[#36312E] hover:bg-[#EFE7DA] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FDFAF5] border-t border-[#DFD5C4] px-4 pt-3 pb-6 animate-fade">
            <div className="flex flex-col space-y-3">
              <a 
                href="#menu" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-[#221E1C] hover:bg-[#F8F3EA]"
              >
                <span>Full Menu & Online Order</span>
                <ChevronRight size={18} className="text-[#A89F97]" />
              </a>
              <a 
                href="#signatures" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-[#221E1C] hover:bg-[#F8F3EA]"
              >
                <span>Signature Dishes & Ice Cream</span>
                <ChevronRight size={18} className="text-[#A89F97]" />
              </a>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-[#221E1C] hover:bg-[#F8F3EA]"
              >
                <span>About Massoni's</span>
                <ChevronRight size={18} className="text-[#A89F97]" />
              </a>
              <a 
                href="#location" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-[#221E1C] hover:bg-[#F8F3EA]"
              >
                <span>Hours & Directions</span>
                <ChevronRight size={18} className="text-[#A89F97]" />
              </a>
              <a 
                href="#reviews" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-[#221E1C] hover:bg-[#F8F3EA]"
              >
                <span>Customer Reviews</span>
                <ChevronRight size={18} className="text-[#A89F97]" />
              </a>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReserve();
                  }}
                  className="w-full py-3 rounded-xl bg-[#2D5A27] text-white font-semibold flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Book a Table Reservation
                </button>
                <a
                  href="tel:4109703700"
                  className="w-full py-3 rounded-xl bg-[#F8F3EA] text-[#7A1C29] font-bold text-center border border-[#DFD5C4] flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Call (410) 970-3700
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
