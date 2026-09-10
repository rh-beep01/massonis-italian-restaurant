import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Sparkles, 
  Utensils, 
  Soup, 
  Wheat, 
  Pizza, 
  Flame, 
  IceCream, 
  Wine,
  Check,
  Filter
} from 'lucide-react';

export default function MenuSection({ 
  menuData, 
  onSelectProduct, 
  onQuickAdd, 
  justAddedId 
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('all'); // all, signature, vegetarian, gf

  const iconMap = {
    Utensils: <Utensils size={18} />,
    Soup: <Soup size={18} />,
    Wheat: <Wheat size={18} />,
    Pizza: <Pizza size={18} />,
    Flame: <Flame size={18} />,
    IceCream: <IceCream size={18} />,
    Wine: <Wine size={18} />
  };

  // Filter items
  const filteredItems = menuData.items.filter((item) => {
    // Category filter
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;

    // Search query
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      item.name.toLowerCase().includes(query) || 
      item.italianName.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query);

    // Dietary filter
    let matchesDiet = true;
    if (dietaryFilter === 'signature') {
      matchesDiet = !!item.isSignature;
    } else if (dietaryFilter === 'vegetarian') {
      matchesDiet = item.badge?.toLowerCase().includes('vegetarian');
    } else if (dietaryFilter === 'gf') {
      matchesDiet = item.badge?.toLowerCase().includes('gluten-free');
    }

    return matchesCategory && matchesSearch && matchesDiet;
  });

  return (
    <section id="menu" className="py-20 bg-[#FDFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF0F2] border border-[#7A1C29]/20 text-[#7A1C29] text-xs font-bold uppercase tracking-wider mb-3">
            <span>Freshly Made to Order</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#151312] mb-4">
            Explore Our Dining & Takeout Menu
          </h2>
          <p className="text-[#57504A] text-base sm:text-lg">
            Every dish is prepared using fresh ingredients, time-tested recipes, and imported Italian goods.
          </p>
        </div>

        {/* Search Bar & Quick Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7D746D]" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pasta, eggrolls, pizza..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm shadow-sm text-[#221E1C]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7D746D] hover:text-[#221E1C]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Dietary Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                dietaryFilter === 'all'
                  ? 'bg-[#151312] text-white shadow-sm'
                  : 'bg-white text-[#57504A] border border-[#DFD5C4] hover:bg-[#F8F3EA]'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setDietaryFilter('signature')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                dietaryFilter === 'signature'
                  ? 'bg-[#7A1C29] text-white shadow-sm'
                  : 'bg-white text-[#57504A] border border-[#DFD5C4] hover:bg-[#F8F3EA]'
              }`}
            >
              ★ Chef Signatures
            </button>
            <button
              onClick={() => setDietaryFilter('vegetarian')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                dietaryFilter === 'vegetarian'
                  ? 'bg-[#2D5A27] text-white shadow-sm'
                  : 'bg-white text-[#57504A] border border-[#DFD5C4] hover:bg-[#F8F3EA]'
              }`}
            >
              Vegetarian
            </button>
            <button
              onClick={() => setDietaryFilter('gf')}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all shrink-0 ${
                dietaryFilter === 'gf'
                  ? 'bg-[#B8860B] text-white shadow-sm'
                  : 'bg-white text-[#57504A] border border-[#DFD5C4] hover:bg-[#F8F3EA]'
              }`}
            >
              Gluten-Free Options
            </button>
          </div>
        </div>

        {/* Category Pills Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-[#DFD5C4] scrollbar-none">
          {menuData.categories.map((cat) => {
            const count = cat.id === 'all' 
              ? menuData.items.length 
              : menuData.items.filter(i => i.category === cat.id).length;
            const isActive = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-[#7A1C29] text-white shadow-wine'
                    : 'bg-white text-[#57504A] border border-[#DFD5C4] hover:border-[#7A1C29] hover:text-[#7A1C29]'
                }`}
              >
                <span>{iconMap[cat.icon]}</span>
                <span>{cat.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#F8F3EA] text-[#7D746D]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#DFD5C4] p-8">
            <Utensils size={48} className="mx-auto text-[#A89F97] mb-4" />
            <h3 className="font-serif text-2xl font-bold text-[#151312] mb-2">No matching dishes found</h3>
            <p className="text-[#57504A] text-sm mb-6">Try clearing your search query or selecting another category.</p>
            <button 
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); setDietaryFilter('all'); }}
              className="btn btn-secondary text-sm"
            >
              View Full Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const isJustAdded = justAddedId === item.id;

              return (
                <div 
                  key={item.id} 
                  className="food-card flex flex-col justify-between group"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-52 overflow-hidden bg-[#221E1C]">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    
                    {/* Badge */}
                    {item.badge && (
                      <div className="absolute top-3 left-3">
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm ${
                          item.badge.includes('Signature') || item.badge.includes('House') 
                            ? 'bg-[#7A1C29] text-white' 
                            : item.badge.includes('Vegetarian')
                            ? 'bg-[#2D5A27] text-white'
                            : 'bg-[#151312]/80 backdrop-blur-md text-[#FAF3E8]'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {/* Price Bubble */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md font-serif font-bold text-base text-[#7A1C29]">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-serif italic text-xs text-[#B8860B] mb-1">
                        {item.italianName}
                      </p>
                      <h3 className="font-serif text-xl font-bold text-[#151312] mb-2 leading-snug group-hover:text-[#7A1C29] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[#57504A] text-xs leading-relaxed line-clamp-3 mb-6">
                        {item.description}
                      </p>
                    </div>

                    {/* Buttons Footer */}
                    <div className="pt-4 border-t border-[#EFE7DA] flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="flex-1 py-2.5 px-3 rounded-full text-xs font-bold text-[#7A1C29] bg-[#FDF0F2] hover:bg-[#7A1C29] hover:text-white transition-all text-center"
                      >
                        Customize & Options
                      </button>

                      <button
                        onClick={() => onQuickAdd(item)}
                        aria-label={`Quick add ${item.name}`}
                        className={`p-2.5 rounded-full transition-all flex items-center justify-center ${
                          isJustAdded
                            ? 'bg-[#2D5A27] text-white scale-110'
                            : 'bg-[#7A1C29] text-white hover:bg-[#621420] active:scale-95'
                        }`}
                        title="Quick Add to Cart"
                      >
                        {isJustAdded ? <Check size={16} /> : <Plus size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
