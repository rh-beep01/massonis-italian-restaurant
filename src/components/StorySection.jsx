import React from 'react';
import { Heart, Sparkles, Award, Users, CheckCircle2 } from 'lucide-react';
import { menuData } from '../data/menuData';

export default function StorySection() {
  return (
    <section id="story" className="py-20 bg-[#FDFAF5] border-b border-[#EFE7DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Showcase Frame */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="/hero-banner.jpg" 
                alt="Massoni's Family Hospitality & Kitchen Tradition"
                className="w-full h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4A373] mb-1 block">
                  Family Owned & Operated
                </span>
                <p className="font-serif text-2xl font-bold">
                  Nicole Massoni & Chuck Michael
                </p>
                <p className="text-xs text-white/80 mt-1">
                  Serving Nottingham, Perry Hall & Baltimore County with authentic passion
                </p>
              </div>
            </div>

            {/* Floating Decorative Badge */}
            <div className="absolute -bottom-6 -right-6 z-20 hidden sm:flex items-center gap-3 bg-[#7A1C29] text-white p-5 rounded-2xl shadow-xl border border-white/20 max-w-xs">
              <Award size={32} className="text-[#D4A373] shrink-0" />
              <div>
                <p className="font-bold text-sm leading-tight">Handcrafted Daily</p>
                <p className="text-xs text-white/80">Never cut corners. Real scratch cooking.</p>
              </div>
            </div>
          </div>

          {/* Text Story Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0F2] border border-[#7A1C29]/20 text-[#7A1C29] text-xs font-bold uppercase tracking-wider">
              <Heart size={14} className="fill-[#7A1C29]" />
              <span>Tradition & Hospitality</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#151312] leading-tight">
              Where Italian Tradition Feels Like Coming Home
            </h2>

            <p className="text-[#57504A] text-base leading-relaxed">
              At <strong className="text-[#151312]">Massoni's Italian Restaurant</strong>, we believe great food begins with 
              great ingredients, unhurried preparation, and heartfelt family service. When you sit in our dining room, 
              you're not just another guest—you're family at our table.
            </p>

            <p className="text-[#57504A] text-sm leading-relaxed">
              From our famous viral <em>Spaghetti Eggrolls</em> to 48-hour fermented wood-fired pizzas, 
              simmered San Marzano sauces, and our weekly churned artisan ice creams, our kitchen pours love 
              into every single plate that leaves our pass.
            </p>

            {/* Bullet Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#EFE7DA]">
              <div className="flex items-center gap-2 text-sm text-[#221E1C]">
                <CheckCircle2 size={18} className="text-[#2D5A27] shrink-0" />
                <span>Simmered Daily Sauces</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#221E1C]">
                <CheckCircle2 size={18} className="text-[#2D5A27] shrink-0" />
                <span>Maryland-Famous Eggrolls</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#221E1C]">
                <CheckCircle2 size={18} className="text-[#2D5A27] shrink-0" />
                <span>Imported Italian Cheeses</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#221E1C]">
                <CheckCircle2 size={18} className="text-[#2D5A27] shrink-0" />
                <span>House-Churned Ice Cream</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
