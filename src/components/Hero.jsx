import React from 'react';
import { 
  ArrowRight, 
  ShoppingBag, 
  Calendar, 
  Sparkles, 
  MapPin, 
  Star, 
  Clock3, 
  PhoneCall,
  UtensilsCrossed
} from 'lucide-react';

export default function Hero({ onOpenReserve, onScrollToMenu }) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#151312] text-white">
      {/* Background Hero Photography with Warm Moody Gradients */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-banner.jpg" 
          alt="Massoni's Italian Restaurant Dining Atmosphere and Pasta Spread"
          className="w-full h-full object-cover object-center opacity-40 transform scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-[#151312]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#151312]/90 via-[#151312]/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          
          {/* Quality Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#7A1C29]/80 border border-[#AB2D3E]/40 backdrop-blur-md text-[#FAF3E8] text-xs sm:text-sm font-semibold mb-6 shadow-wine">
            <Sparkles size={15} className="text-[#D4A373]" />
            <span>Nottingham & Perry Hall's Favorite Italian Dining</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Classic Italian Comfort, <br />
            <span className="text-[#D4A373] italic font-normal">Crafted with Heart.</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-[#DFD5C4] font-normal leading-relaxed mb-8 max-w-2xl">
            From our Maryland-famous <strong className="text-white font-semibold">Spaghetti Eggrolls</strong> to 
            hand-tossed stone pizzas, fresh simmered pastas, and our renowned scratch-made ice cream. 
            Enjoy warm family hospitality right here on Belair Road.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onScrollToMenu}
              className="btn btn-primary text-base px-7 py-3.5 shadow-xl flex items-center gap-3 group"
            >
              <ShoppingBag size={19} />
              <span>Order Online for Pickup</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenReserve}
              className="btn bg-[#221E1C]/90 text-white border border-[#DFD5C4]/30 hover:bg-white hover:text-[#7A1C29] text-base px-6 py-3.5 backdrop-blur-md"
            >
              <Calendar size={18} />
              <span>Book Table</span>
            </button>

            <a
              href="tel:4109703700"
              className="inline-flex items-center gap-2 text-sm text-[#D4A373] hover:text-white font-semibold px-4 py-3 transition-colors"
            >
              <PhoneCall size={16} />
              <span>(410) 970-3700</span>
            </a>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4A373]">
                <Star size={18} fill="#D4A373" />
              </div>
              <div>
                <p className="font-bold text-white">4.2+ Star Rating</p>
                <p className="text-[#A89F97] text-xs">450+ Diner Reviews</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#D4A373]">
                <UtensilsCrossed size={18} />
              </div>
              <div>
                <p className="font-bold text-white">Scratch-Made</p>
                <p className="text-[#A89F97] text-xs">Daily Fresh Pasta & Sauce</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[#2D5A27]">
                <Clock3 size={18} />
              </div>
              <div>
                <p className="font-bold text-white">Fast Pickup</p>
                <p className="text-[#A89F97] text-xs">Ready in 20–30 Mins</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
