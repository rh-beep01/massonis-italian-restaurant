import React from 'react';
import { Sparkles, Plus, Star, ArrowRight } from 'lucide-react';

export default function SignatureSpotlight({ onSelectProduct, menuItems }) {
  const eggrolls = menuItems.find(i => i.id === 'starter-spaghetti-eggrolls');
  const pizza = menuItems.find(i => i.id === 'pizza-margherita');
  const dessert = menuItems.find(i => i.id === 'dessert-famous-ice-cream');

  const spotlights = [
    {
      item: eggrolls,
      title: "Famous Spaghetti Eggrolls",
      subtitle: "The Maryland Viral Sensation",
      desc: "Our signature original: crispy fried eggrolls stuffed with al dente spaghetti, savory bolognese, and gooey melted mozzarella. Served with warm homemade marinara.",
      badge: "House Specialty",
      tagColor: "bg-[#7A1C29] text-white"
    },
    {
      item: pizza,
      title: "Artisan Wood-Fired Margherita",
      subtitle: "48-Hour Cold Fermented Dough",
      desc: "San Marzano D.O.P. tomatoes, fresh Fior di Latte mozzarella, fragrant sweet basil, and extra virgin olive oil baked over high heat for blistered airy crust.",
      badge: "Stone Hearth Baked",
      tagColor: "bg-[#2D5A27] text-white"
    },
    {
      item: dessert,
      title: "House-Made Italian Ice Cream",
      subtitle: "Churned Fresh In-House Weekly",
      desc: "Massoni's is locally celebrated for this ultra-creamy, velvety gelato. Choose from Sicilian Pistachio, Stracciatella, Espresso Chip, and seasonal flavors.",
      badge: "Local Legend",
      tagColor: "bg-[#B8860B] text-white"
    }
  ];

  return (
    <section id="signatures" className="py-20 bg-[#F8F3EA] border-b border-[#EFE7DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E8] border border-[#D4A373]/40 text-[#8A6400] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} className="text-[#B8860B]" />
            <span>Culinary Masterpieces</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#151312] mb-4">
            Massoni's Famous Signatures
          </h2>
          <p className="text-[#57504A] text-base sm:text-lg">
            Dishes crafted with time-honored family recipes that have made our Nottingham dining room a beloved neighborhood staple.
          </p>
        </div>

        {/* 3-Column Spotlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {spotlights.map((spot, index) => {
            if (!spot.item) return null;
            return (
              <div 
                key={index} 
                className="bg-white rounded-2xl overflow-hidden border border-[#EFE7DA] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container with Badge */}
                <div className="relative h-64 overflow-hidden bg-[#221E1C]">
                  <img 
                    src={spot.item.image} 
                    alt={spot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${spot.tagColor}`}>
                      {spot.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full shadow-lg">
                    <span className="font-serif font-bold text-lg text-[#7A1C29]">
                      ${spot.item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-[#B8860B]">
                      {spot.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#151312] mt-1 mb-2">
                      {spot.title}
                    </h3>
                    <p className="text-[#57504A] text-sm leading-relaxed mb-6">
                      {spot.desc}
                    </p>
                  </div>

                  {/* Add to order button */}
                  <button
                    onClick={() => onSelectProduct(spot.item)}
                    className="w-full py-3 px-4 rounded-xl bg-[#FDF0F2] hover:bg-[#7A1C29] text-[#7A1C29] hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all group-hover:bg-[#7A1C29] group-hover:text-white"
                  >
                    <Plus size={16} />
                    <span>Customize & Add to Order</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
