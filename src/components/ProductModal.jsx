import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check, Sparkles, ChefHat } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  // Selected option / size
  const [selectedOption, setSelectedOption] = useState(
    product.options?.[0] || null
  );

  // Selected pasta type if available
  const [selectedPasta, setSelectedPasta] = useState(
    product.pastaTypes?.[0] || ''
  );

  // Selected gelato flavor if available
  const [selectedGelato, setSelectedGelato] = useState(
    product.gelatoFlavors?.[0] || ''
  );

  // Selected Add-ons (array of add-on objects)
  const [selectedAddOns, setSelectedAddOns] = useState([]);

  // Kitchen notes
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    setSelectedOption(product.options?.[0] || null);
    setSelectedPasta(product.pastaTypes?.[0] || '');
    setSelectedGelato(product.gelatoFlavors?.[0] || '');
    setSelectedAddOns([]);
    setSpecialInstructions('');
    setQuantity(1);
  }, [product]);

  // Toggle add-on
  const toggleAddOn = (addon) => {
    if (selectedAddOns.some((a) => a.name === addon.name)) {
      setSelectedAddOns(selectedAddOns.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  // Calculate unit price
  const basePrice = product.price;
  const optionDelta = selectedOption ? selectedOption.priceDelta : 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + optionDelta + addOnsTotal;
  const totalPrice = unitPrice * quantity;

  // Submit to cart
  const handleAdd = () => {
    const customizedItem = {
      product,
      selectedOption: selectedOption ? selectedOption.name : null,
      selectedPasta: selectedPasta || null,
      selectedGelato: selectedGelato || null,
      selectedAddOns: selectedAddOns.map((a) => a.name),
      specialInstructions: specialInstructions.trim() || null,
      unitPrice,
      quantity,
      totalPrice
    };
    onAddToCart(customizedItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div 
        className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header Image */}
        <div className="relative h-56 w-full bg-[#221E1C] shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <p className="font-serif italic text-xs text-[#D4A373] mb-0.5">
              {product.italianName}
            </p>
            <h2 className="font-serif text-2xl font-bold leading-tight">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#221E1C]">
          
          {/* Description */}
          <p className="text-sm text-[#57504A] leading-relaxed">
            {product.description}
          </p>

          {/* Portion / Size Options */}
          {product.options && product.options.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-3">
                Select Size / Portion <span className="text-[#7A1C29]">*</span>
              </label>
              <div className="space-y-2">
                {product.options.map((opt, idx) => {
                  const isSelected = selectedOption?.name === opt.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedOption(opt)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                        isSelected
                          ? 'border-[#7A1C29] bg-[#FDF0F2] text-[#7A1C29]'
                          : 'border-[#DFD5C4] hover:bg-[#F8F3EA] text-[#36312E]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#7A1C29] bg-[#7A1C29]' : 'border-[#A89F97]'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                        <span>{opt.name}</span>
                      </div>
                      <span className="text-xs text-[#7D746D]">
                        {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pasta Type Selection */}
          {product.pastaTypes && product.pastaTypes.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-3">
                Choose Pasta Style
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.pastaTypes.map((pasta, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPasta(pasta)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedPasta === pasta
                        ? 'border-[#7A1C29] bg-[#FDF0F2] text-[#7A1C29] font-bold'
                        : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                    }`}
                  >
                    <span>{pasta}</span>
                    {selectedPasta === pasta && <Check size={16} className="text-[#7A1C29]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gelato Flavor Selection */}
          {product.gelatoFlavors && product.gelatoFlavors.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-3">
                Select House Gelato Flavor <span className="text-[#7A1C29]">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {product.gelatoFlavors.map((flavor, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGelato(flavor)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                      selectedGelato === flavor
                        ? 'border-[#B8860B] bg-[#FAF3E8] text-[#8A6400] font-bold'
                        : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                    }`}
                  >
                    <span>{flavor}</span>
                    {selectedGelato === flavor && <Check size={16} className="text-[#B8860B]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Add-Ons */}
          {product.addOns && product.addOns.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-3">
                Chef Add-Ons & Extras
              </label>
              <div className="space-y-2">
                {product.addOns.map((addon, idx) => {
                  const isChecked = selectedAddOns.some((a) => a.name === addon.name);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm transition-all ${
                        isChecked
                          ? 'border-[#2D5A27] bg-[#EBF5EB] text-[#2D5A27] font-semibold'
                          : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#2D5A27] border-[#2D5A27] text-white' : 'border-[#A89F97]'
                        }`}>
                          {isChecked && <Check size={12} />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold">+${addon.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-2">
              Special Instructions or Dietary Notes
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra sauce on side, dressing separate, allergy note..."
              rows={2}
              className="w-full p-3 rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm text-[#221E1C]"
            />
          </div>

        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-6 bg-[#F8F3EA] border-t border-[#EFE7DA] flex items-center justify-between gap-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 bg-white border border-[#DFD5C4] rounded-full px-3 py-1.5 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 rounded-full text-[#7D746D] hover:text-[#7A1C29] hover:bg-[#FDF0F2] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center font-bold text-sm text-[#221E1C]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 rounded-full text-[#7D746D] hover:text-[#7A1C29] hover:bg-[#FDF0F2] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 btn btn-primary py-3 px-6 shadow-md hover:shadow-lg flex items-center justify-between"
          >
            <span>Add to Order</span>
            <span className="font-extrabold text-white">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}
