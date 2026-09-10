import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SignatureSpotlight from './components/SignatureSpotlight';
import MenuSection from './components/MenuSection';
import StorySection from './components/StorySection';
import ReviewsSection from './components/ReviewsSection';
import LocationHoursSection from './components/LocationHoursSection';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReservationModal from './components/ReservationModal';
import { menuData } from './data/menuData';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function App() {
  // Cart state stored in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('massonis_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('massonis_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Modals & Drawers state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Cart settings
  const [orderType, setOrderType] = useState('pickup'); // 'pickup' | 'delivery'
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountCode, setDiscountCode] = useState('');

  // Added animation tracker
  const [justAddedId, setJustAddedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  // Auto hide toast after 3.5s
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Quick Add Item from menu card (default options)
  const handleQuickAdd = (product) => {
    const defaultOption = product.options?.[0]?.name || null;
    const newItem = {
      product,
      selectedOption: defaultOption,
      selectedPasta: product.pastaTypes?.[0] || null,
      selectedGelato: product.gelatoFlavors?.[0] || null,
      selectedAddOns: [],
      specialInstructions: null,
      unitPrice: product.price,
      quantity: 1,
      totalPrice: product.price
    };

    setCart((prev) => {
      // Check if exact same item exists
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === product.id &&
          i.selectedOption === defaultOption &&
          !i.selectedAddOns?.length
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, newItem];
    });

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1200);

    setToastMessage(`Added ${product.name} to your order!`);
  };

  // Add customized item from ProductModal
  const handleAddCustomized = (customItem) => {
    setCart((prev) => {
      // Look for identical matching custom item
      const existingIdx = prev.findIndex(
        (i) =>
          i.product.id === customItem.product.id &&
          i.selectedOption === customItem.selectedOption &&
          i.selectedPasta === customItem.selectedPasta &&
          i.selectedGelato === customItem.selectedGelato &&
          JSON.stringify(i.selectedAddOns) === JSON.stringify(customItem.selectedAddOns) &&
          i.specialInstructions === customItem.specialInstructions
      );

      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx].quantity += customItem.quantity;
        return updated;
      }
      return [...prev, customItem];
    });

    setToastMessage(`Added ${customItem.product.name} (${customItem.quantity}x) to order!`);
    setCartOpen(true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (index, delta) => {
    setCart((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  // Remove item from cart
  const handleRemoveItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFAF5] text-[#221E1C]">
      
      {/* Navbar */}
      <Navbar 
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenReserve={() => setReserveOpen(true)}
      />

      {/* Hero */}
      <Hero 
        onOpenReserve={() => setReserveOpen(true)}
        onScrollToMenu={scrollToMenu}
      />

      {/* Signature Spotlight */}
      <SignatureSpotlight 
        menuItems={menuData.items}
        onSelectProduct={(item) => setSelectedProduct(item)}
      />

      {/* Full Menu Section */}
      <MenuSection 
        menuData={menuData}
        onSelectProduct={(item) => setSelectedProduct(item)}
        onQuickAdd={handleQuickAdd}
        justAddedId={justAddedId}
      />

      {/* Story & Heritage */}
      <StorySection />

      {/* Reviews */}
      <ReviewsSection />

      {/* Location & Operating Hours */}
      <LocationHoursSection 
        onOpenReserve={() => setReserveOpen(true)}
      />

      {/* Footer */}
      <Footer 
        onOpenReserve={() => setReserveOpen(true)}
        onScrollToMenu={scrollToMenu}
      />

      {/* Product Customizer Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddCustomized}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        orderType={orderType}
        setOrderType={setOrderType}
        discountCode={discountCode}
        setDiscountCode={setDiscountCode}
        discountPercent={discountPercent}
        setDiscountPercent={setDiscountPercent}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        orderType={orderType}
        discountPercent={discountPercent}
        discountCode={discountCode}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* Table Reservation Modal */}
      <ReservationModal 
        isOpen={reserveOpen}
        onClose={() => setReserveOpen(false)}
      />

      {/* Floating Sticky Bottom Mobile Cart Bar */}
      {totalCartCount > 0 && !cartOpen && !checkoutOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-fade">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#7A1C29] text-white font-bold flex items-center justify-between shadow-2xl active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-white text-[#7A1C29] flex items-center justify-center text-xs font-black">
                {totalCartCount}
              </span>
              <span>View Your Order</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-serif">${cartSubtotal.toFixed(2)}</span>
              <ArrowRight size={17} />
            </div>
          </button>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade">
          <div className="bg-[#151312] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 border border-[#36302C]">
            <div className="w-5 h-5 rounded-full bg-[#2D5A27] flex items-center justify-center text-white">
              <Check size={12} />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

    </div>
  );
}
