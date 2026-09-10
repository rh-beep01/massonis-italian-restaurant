import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Tag, 
  Check, 
  ExternalLink,
  ChefHat
} from 'lucide-react';
import { menuData } from '../data/menuData';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  orderType,
  setOrderType,
  discountCode,
  setDiscountCode,
  discountPercent,
  setDiscountPercent
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  if (!isOpen) return null;

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const salesTax = taxableAmount * 0.06; // Maryland 6% sales tax
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const grandTotal = taxableAmount + salesTax + deliveryFee;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'MASSONI10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setDiscountCode(code);
      setPromoSuccess('10% discount applied!');
      setPromoError('');
    } else if (code === 'VIP15') {
      setDiscountPercent(15);
      setDiscountCode(code);
      setPromoSuccess('15% VIP discount applied!');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try "MASSONI10"');
      setPromoSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-right text-[#221E1C]">
          
          {/* Header */}
          <div className="p-6 border-b border-[#EFE7DA] bg-[#FDFAF5] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDF0F2] text-[#7A1C29] flex items-center justify-center font-bold shadow-sm">
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-[#151312]">Your Order</h2>
                <p className="text-xs text-[#7D746D]">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#EFE7DA] text-[#7D746D] transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Fulfillment Toggle: Pickup vs Delivery */}
          <div className="p-4 bg-[#F8F3EA] border-b border-[#EFE7DA]">
            <div className="grid grid-cols-2 p-1 bg-white rounded-xl border border-[#DFD5C4] text-xs font-bold">
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  orderType === 'pickup'
                    ? 'bg-[#7A1C29] text-white shadow-sm'
                    : 'text-[#57504A] hover:text-[#151312]'
                }`}
              >
                <span>Curbside Pickup</span>
                <span className="text-[10px] opacity-80">(Free)</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  orderType === 'delivery'
                    ? 'bg-[#7A1C29] text-white shadow-sm'
                    : 'text-[#57504A] hover:text-[#151312]'
                }`}
              >
                <span>Local Delivery</span>
                <span className="text-[10px] opacity-80">($4.99)</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-[#57504A] mt-2.5 px-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock size={13} className="text-[#B8860B]" />
                Estimated Ready: <strong className="text-[#151312]">25–35 mins</strong>
              </span>
              <span className="text-[#7D746D]">8833 Belair Rd</span>
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[#FDF0F2] text-[#7A1C29] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#151312] mb-1">Your cart is empty</h3>
                <p className="text-sm text-[#7D746D] mb-6">
                  Add signature spaghetti eggrolls, pasta, or artisan pizza to get started.
                </p>
                <button
                  onClick={onClose}
                  className="btn btn-primary text-sm px-6"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-[#EFE7DA] text-xs font-semibold text-[#7D746D]">
                  <span>Items</span>
                  <button 
                    onClick={onClearCart}
                    className="text-[#7A1C29] hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-2xl border border-[#EFE7DA] bg-[#FDFAF5] flex gap-4 transition-all"
                  >
                    {/* Item Thumbnail */}
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#DFD5C4]"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-[#151312] truncate">
                          {item.product.name}
                        </h4>
                        <span className="font-bold text-sm text-[#7A1C29] shrink-0">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Customization Details */}
                      <div className="text-[11px] text-[#7D746D] mt-1 space-y-0.5">
                        {item.selectedOption && (
                          <p className="font-medium text-[#221E1C]">
                            Size: {item.selectedOption}
                          </p>
                        )}
                        {item.selectedPasta && (
                          <p>Pasta: {item.selectedPasta}</p>
                        )}
                        {item.selectedGelato && (
                          <p className="text-[#8A6400] font-semibold">Flavor: {item.selectedGelato}</p>
                        )}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <p className="text-[#2D5A27]">
                            + {item.selectedAddOns.join(', ')}
                          </p>
                        )}
                        {item.specialInstructions && (
                          <p className="italic text-[#57504A]">
                            Note: "{item.specialInstructions}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#EFE7DA]/60">
                        <div className="flex items-center gap-2 bg-white rounded-full border border-[#DFD5C4] px-2 py-0.5 text-xs">
                          <button
                            onClick={() => onUpdateQuantity(idx, -1)}
                            className="p-1 text-[#7D746D] hover:text-[#7A1C29]"
                            aria-label="Decrease"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="font-bold px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(idx, 1)}
                            className="p-1 text-[#7D746D] hover:text-[#7A1C29]"
                            aria-label="Increase"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(idx)}
                          className="text-xs text-[#A89F97] hover:text-[#7A1C29] flex items-center gap-1 transition-colors"
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FDFAF5] border-t border-[#EFE7DA] space-y-4">
              
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D746D]" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder='Promo code (Try "MASSONI10")'
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] uppercase font-semibold"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#221E1C] hover:bg-[#36312E] text-white text-xs font-bold transition-colors"
                >
                  Apply
                </button>
              </form>

              {promoSuccess && (
                <p className="text-xs font-semibold text-[#2D5A27] flex items-center gap-1">
                  <Check size={13} /> {promoSuccess}
                </p>
              )}
              {promoError && (
                <p className="text-xs font-semibold text-[#AB2D3E]">
                  {promoError}
                </p>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#57504A] pt-2 border-t border-[#EFE7DA]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#221E1C]">${subtotal.toFixed(2)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#2D5A27] font-semibold">
                    <span>Discount ({discountCode} - {discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Maryland Sales Tax (6%)</span>
                  <span className="font-semibold text-[#221E1C]">${salesTax.toFixed(2)}</span>
                </div>

                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Local Delivery Fee</span>
                    <span className="font-semibold text-[#221E1C]">${deliveryFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-base font-bold text-[#151312] pt-2 border-t border-[#DFD5C4]">
                  <span>Total</span>
                  <span className="font-serif text-xl text-[#7A1C29]">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={onOpenCheckout}
                className="w-full btn btn-primary py-3.5 px-6 shadow-md hover:shadow-lg flex items-center justify-between text-sm"
              >
                <span>Proceed to Checkout</span>
                <span className="flex items-center gap-2 font-bold">
                  ${grandTotal.toFixed(2)}
                  <ArrowRight size={16} />
                </span>
              </button>

              {/* Alternative Direct Toast Ordering Link */}
              <div className="pt-2 text-center">
                <a
                  href={menuData.restaurantInfo.toastUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#7D746D] hover:text-[#7A1C29] font-medium transition-colors"
                >
                  <span>Or order directly via Massoni's Toast POS</span>
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
