import React from 'react';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Calendar } from 'lucide-react';
import { menuData } from '../data/menuData';

export default function LocationHoursSection({ onOpenReserve }) {
  const info = menuData.restaurantInfo;

  return (
    <section id="location" className="py-20 bg-[#FDFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Hours & Contact Card */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#EFE7DA] shadow-lg space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF5EB] text-[#2D5A27] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-[#2D5A27] animate-pulse"></span>
                <span>Open for Dining & Takeout</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#151312]">
                Visit Our Nottingham Trattoria
              </h2>
              <p className="text-[#57504A] text-sm mt-2">
                Conveniently located on Belair Road in Nottingham (serving Perry Hall & White Marsh).
              </p>
            </div>

            {/* Address & Phone */}
            <div className="space-y-4 pt-4 border-t border-[#EFE7DA]">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FDF0F2] text-[#7A1C29] flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#151312]">Physical Address</h4>
                  <p className="text-sm text-[#57504A]">{info.address}</p>
                  <p className="text-xs text-[#7D746D]">{info.neighborhood}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FDF0F2] text-[#7A1C29] flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#151312]">Phone Inquiries & Orders</h4>
                  <a href={`tel:${info.phone.replace(/\D/g, '')}`} className="text-sm font-bold text-[#7A1C29] hover:underline">
                    {info.phone}
                  </a>
                  <p className="text-xs text-[#7D746D]">Call us anytime for takeout or reservations</p>
                </div>
              </div>
            </div>

            {/* Operating Hours Table */}
            <div className="space-y-3 pt-4 border-t border-[#EFE7DA]">
              <h4 className="font-serif font-bold text-base text-[#151312] flex items-center gap-2">
                <Clock size={18} className="text-[#B8860B]" />
                <span>Operating Hours</span>
              </h4>

              <div className="space-y-2 text-xs text-[#36312E]">
                {info.hours.map((h, i) => (
                  <div key={i} className="flex justify-between py-1.5 border-b border-[#EFE7DA]/60 last:border-0">
                    <span className="font-semibold text-[#57504A]">{h.day}</span>
                    <span className="font-bold text-[#151312]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <a
                href="https://maps.app.goo.gl/vcbJMU69c9UsBh658?g_st=ac"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-xs py-3 flex-1 flex items-center justify-center gap-2"
              >
                <Navigation size={15} />
                Get Driving Directions
              </a>

              <button
                onClick={onOpenReserve}
                className="btn btn-secondary text-xs py-3 flex-1 flex items-center justify-center gap-2"
              >
                <Calendar size={15} />
                Reserve Table
              </button>
            </div>

          </div>

          {/* Interactive Map Embed Visual Container */}
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#EFE7DA] bg-white h-full min-h-[460px] flex flex-col">
            <div className="p-4 bg-[#F8F3EA] border-b border-[#EFE7DA] flex items-center justify-between text-xs">
              <span className="font-bold text-[#151312] flex items-center gap-1.5">
                <MapPin size={14} className="text-[#7A1C29]" />
                Google Maps Location: 8833 Belair Rd
              </span>
              <a 
                href="https://maps.app.goo.gl/vcbJMU69c9UsBh658?g_st=ac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#7A1C29] font-semibold hover:underline flex items-center gap-1"
              >
                Open in App <ExternalLink size={12} />
              </a>
            </div>

            <div className="flex-1 w-full h-[400px] lg:h-full relative bg-[#EAE1D2]">
              <iframe
                title="Massoni's Italian Restaurant Map"
                src="https://maps.google.com/maps?q=8833+Belair+Rd,+Nottingham,+MD+21236&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
