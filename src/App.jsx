import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Check, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Award, 
  Sparkles, 
  ArrowRight, 
  Menu as MenuIcon, 
  Sliders, 
  Star, 
  Heart, 
  Trash2, 
  CreditCard, 
  ShieldCheck, 
  Printer, 
  ExternalLink,
  Utensils,
  Truck,
  Home,
  Banknote 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Button from './components/ui/Button';
import { menuData } from './data/menuData';

export default function App() {
  // Navigation & UI States
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Cart State with localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('massonis_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('massonis_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Modal State
  const [modalOption, setModalOption] = useState(null);
  const [modalPasta, setModalPasta] = useState('');
  const [modalGelato, setModalGelato] = useState('');
  const [modalAddOns, setModalAddOns] = useState([]);
  const [modalInstructions, setModalInstructions] = useState('');
  const [modalQuantity, setModalQuantity] = useState(1);

  // Cart & Order Settings
  const [orderType, setOrderType] = useState('pickup');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState({ text: '', type: '' });

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState('details'); // details, payment, confirmed
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupTime, setPickupTime] = useState('ASAP (Ready in 20–30 mins)');
  const [deliveryTime, setDeliveryTime] = useState('ASAP (Estimated 35–50 mins)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryApt, setDeliveryApt] = useState('');
  const [deliveryZip, setDeliveryZip] = useState('Nottingham (21236)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [driverTip, setDriverTip] = useState(3.00);
  const [orderNotes, setOrderNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Table Reservation Form State
  const [reserveDate, setReserveDate] = useState(new Date().toISOString().split('T')[0]);
  const [reserveTime, setReserveTime] = useState('6:30 PM');
  const [reserveGuests, setReserveGuests] = useState('2 Guests');
  const [reserveSeating, setReserveSeating] = useState('Main Dining Room');
  const [reserveOccasion, setReserveOccasion] = useState('Casual Dining');
  const [reserveName, setReserveName] = useState('');
  const [reservePhone, setReservePhone] = useState('');
  const [reserveConfirmed, setReserveConfirmed] = useState(false);
  const [confirmedResCode, setConfirmedResCode] = useState('');

  // Animation trackers
  const [justAddedId, setJustAddedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  // Calculations
  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const salesTax = taxableAmount * 0.06;
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const tipAmount = orderType === 'delivery' ? driverTip : 0;
  const grandTotal = taxableAmount + salesTax + deliveryFee + tipAmount;

  // Filter products for featured reel
  const featuredItems = menuData.items.filter((i) => i.isSignature);

  // Filter products for menu section
  const filteredMenu = menuData.items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      item.name.toLowerCase().includes(q) || 
      item.description.toLowerCase().includes(q) || 
      item.italianName.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Open Product Customization Modal
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalOption(product.options?.[0] || null);
    setModalPasta(product.pastaTypes?.[0] || '');
    setModalGelato(product.gelatoFlavors?.[0] || '');
    setModalAddOns([]);
    setModalInstructions('');
    setModalQuantity(1);
  };

  // Quick Add Item to Cart
  const quickAddToCart = (product) => {
    const defaultOption = product.options?.[0]?.name || null;
    const uniqueId = `${product.id}-${defaultOption || 'std'}`;

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === uniqueId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [
        ...prev,
        {
          id: uniqueId,
          product,
          selectedOption: defaultOption,
          selectedPasta: product.pastaTypes?.[0] || null,
          selectedGelato: product.gelatoFlavors?.[0] || null,
          selectedAddOns: [],
          specialInstructions: null,
          unitPrice: product.price,
          quantity: 1
        }
      ];
    });

    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1500);
    setToastMessage(`Added ${product.name} to order!`);
  };

  // Add Customized Item from Modal
  const handleAddCustomized = () => {
    if (!selectedProduct) return;

    const basePrice = selectedProduct.price;
    const optionDelta = modalOption ? modalOption.priceDelta : 0;
    const addOnsTotal = modalAddOns.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = basePrice + optionDelta + addOnsTotal;

    const optionsStr = [
      modalOption ? modalOption.name : null,
      modalPasta ? modalPasta : null,
      modalGelato ? `Flavor: ${modalGelato}` : null,
      modalAddOns.length > 0 ? modalAddOns.map(a => a.name).join(', ') : null
    ].filter(Boolean).join(' • ');

    const uniqueId = `${selectedProduct.id}-${optionsStr || 'std'}-${modalInstructions || 'no-note'}`;

    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === uniqueId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].quantity += modalQuantity;
        return copy;
      }
      return [
        ...prev,
        {
          id: uniqueId,
          product: selectedProduct,
          selectedOption: modalOption ? modalOption.name : null,
          selectedPasta: modalPasta || null,
          selectedGelato: modalGelato || null,
          selectedAddOns: modalAddOns.map(a => a.name),
          specialInstructions: modalInstructions.trim() || null,
          unitPrice,
          quantity: modalQuantity
        }
      ];
    });

    setToastMessage(`Added ${selectedProduct.name} (${modalQuantity}x) to order!`);
    setSelectedProduct(null);
    setCartOpen(true);
  };

  // Update Cart item quantity
  const updateQuantity = (index, delta) => {
    setCart((prev) => {
      const copy = [...prev];
      const newQty = copy[index].quantity + delta;
      if (newQty <= 0) {
        copy.splice(index, 1);
      } else {
        copy[index].quantity = newQty;
      }
      return copy;
    });
  };

  // Remove item
  const removeItem = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Promo code
  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (code === 'MASSONI10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setDiscountCode(code);
      setPromoMsg({ text: '10% discount applied!', type: 'success' });
    } else if (code === 'VIP15') {
      setDiscountPercent(15);
      setDiscountCode(code);
      setPromoMsg({ text: '15% VIP discount applied!', type: 'success' });
    } else {
      setPromoMsg({ text: 'Invalid code. Try "MASSONI10"', type: 'error' });
    }
  };

  // Complete Order
  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const orderNumber = `MAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const confirmed = {
      orderNumber,
      customerName: customerName.trim() || 'Valued Guest',
      customerPhone,
      customerEmail,
      orderType,
      fulfillmentTime: orderType === 'delivery' ? deliveryTime : pickupTime,
      deliveryAddress,
      deliveryApt,
      deliveryZip,
      deliveryNotes,
      driverTip: orderType === 'delivery' ? driverTip : 0,
      orderNotes,
      paymentMethod,
      items: [...cart],
      subtotal,
      discountAmount,
      salesTax,
      deliveryFee,
      grandTotal,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConfirmedOrder(confirmed);
    setCheckoutStep('confirmed');
    setCart([]);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#7A1C29', '#C28522', '#2D5A27', '#F4ECE1']
      });
    } catch {
      // ignore
    }
  };

  // Book Reservation
  const handleBookReservation = (e) => {
    e.preventDefault();
    const resCode = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedResCode(resCode);
    setReserveConfirmed(true);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-background text-foreground selection:bg-accent/30">
      
      {/* 1. TOP ANNOUNCEMENT BAR WITH GOOGLE MAPS LINK & GET DIRECTIONS */}
      <div className="bg-[#181514] text-[#E5DDD0] px-4 py-2 text-xs font-medium border-b border-[#2C2725]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Address & Google Maps Direction Link */}
          <a
            href="https://maps.google.com/?q=Massoni's+Italian+Restaurant+8833+Belair+Rd+Nottingham+MD+21236"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-accent hover:text-white transition-colors group shrink-0"
            title="Open 8833 Belair Rd in Google Maps / Get Directions"
          >
            <MapPin className="size-3.5 text-accent group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold underline decoration-accent/50 underline-offset-2 group-hover:decoration-white">
              8833 Belair Rd, Nottingham, MD 21236
            </span>
            <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] bg-accent/20 text-accent group-hover:bg-accent group-hover:text-white px-2 py-0.5 rounded-full font-bold transition-all ml-1">
              Get Directions <ExternalLink className="size-2.5 ml-0.5" />
            </span>
          </a>

          {/* Center Special Announcement */}
          <p className="hidden md:block text-center text-xs text-[#E5DDD0]/90 truncate mx-2">
            <strong className="text-white">Handcrafted Pastas &amp; Viral Spaghetti Eggrolls</strong> — Dine-in, Curbside Pickup &amp; Delivery
          </p>

          {/* Right Hours & Contact */}
          <div className="flex items-center gap-3 text-xs shrink-0 ml-auto sm:ml-0">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="hidden sm:inline">Open Today:</span> 11:00 AM – 9:00 PM
            </span>
            <a
              href="tel:4109703700"
              className="hidden lg:flex items-center gap-1 text-[#E5DDD0] hover:text-white font-mono transition-colors"
              title="Call Massoni's Restaurant"
            >
              <Phone className="size-3 text-accent shrink-0" />
              <span>(410) 970-3700</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tricolore Ribbon */}
      <div className="italian-ribbon"></div>

      {/* 2. MAIN STICKY NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Branding */}
          <a href="#top" className="flex items-center gap-2.5 sm:gap-3 shrink-0 py-1 group text-decoration-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-xl sm:text-2xl font-bold shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-primary leading-tight">
                Massoni's
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
                Italian Restaurant &amp; Bar
              </span>
            </div>
          </a>

          {/* Nav Links - Spans comfortably on desktop/laptop */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-5 xl:gap-8 whitespace-nowrap">
            <a href="#featured-reel" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Featured Specialties
            </a>
            <a href="#signatures" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Eggrolls &amp; Signatures
            </a>
            <a href="#menu" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Full Menu &amp; Ordering
            </a>
            <a href="#story" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Our Story
            </a>
            <a href="#reviews" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Reviews
            </a>
            <a href="#visit" className="nav-link text-xs xl:text-sm text-foreground/90 hover:text-primary">
              Visit &amp; Hours
            </a>
          </nav>

          {/* Right Action Items: Direct Phone + Compact Cart Button + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Phone Quick Call */}
            <a
              href="tel:4109703700"
              className="flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-full border border-border bg-card hover:border-primary transition-colors text-foreground whitespace-nowrap shrink-0"
              title="Call Massoni's Restaurant"
            >
              <Phone className="size-3.5 text-accent shrink-0" />
              <span className="font-mono hidden sm:inline">(410) 970-3700</span>
            </a>

            {/* Maroon Header Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center justify-center gap-2 h-9 sm:h-10 px-3 sm:px-3.5 rounded-full bg-primary text-white border border-primary hover:bg-[#611420] shadow-xs hover:shadow-md transition-all duration-200 active:scale-95 shrink-0"
              title="View Cart / Order Tray"
              aria-label="Shopping Cart"
            >
              <div className="relative flex items-center">
                <ShoppingBag className="size-4 text-white" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px] font-black shadow-xs ring-1 ring-white/40 animate-scale">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="font-bold text-white text-xs">Cart</span>
              {cartItemCount > 0 && (
                <span className="font-mono font-bold text-xs pl-1.5 border-l border-white/30 text-amber-200 hidden sm:inline">
                  ${subtotal.toFixed(2)}
                </span>
              )}
            </button>

            {/* Mobile / Tablet Nav Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0 h-9 w-9 sm:h-10 sm:w-10 text-foreground"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </Button>
          </div>

        </div>

        {/* Mobile / Tablet Nav Drawer */}
        {mobileNavOpen && (
          <nav className="border-t border-border bg-background px-6 py-5 shadow-xl lg:hidden animate-fade">
            <div className="flex flex-col gap-3 text-sm font-semibold">
              <a href="#featured-reel" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Featured Specialties
              </a>
              <a href="#signatures" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Signature Spaghetti Eggrolls
              </a>
              <a href="#menu" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Full Menu &amp; Online Ordering
              </a>
              <a href="#story" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Our Family Heritage
              </a>
              <a href="#reviews" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Customer Reviews
              </a>
              <a href="#visit" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Hours &amp; Location
              </a>

              {/* Quick Actions inside mobile menu */}
              <div className="pt-3 border-t border-border flex flex-col gap-2.5">
                <Button
                  onClick={() => { setMobileNavOpen(false); setReserveConfirmed(false); setReserveOpen(true); }}
                  variant="outline"
                  className="w-full justify-center text-xs font-bold text-primary"
                >
                  <Calendar className="size-4 mr-2" /> Book Table Reservation
                </Button>
                
                <a
                  href="https://maps.google.com/?q=Massoni's+Italian+Restaurant+8833+Belair+Rd+Nottingham+MD+21236"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-2 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:border-accent transition-colors"
                >
                  <MapPin className="size-3.5 text-accent" />
                  <span>8833 Belair Rd, Nottingham MD • Get Directions ↗</span>
                </a>

                <a
                  href="tel:4109703700"
                  className="flex items-center justify-center gap-2 p-2 rounded-xl bg-muted/60 text-xs font-semibold text-foreground hover:bg-muted transition-colors font-mono"
                >
                  <Phone className="size-3.5 text-accent" /> Call (410) 970-3700
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="top" className="relative min-h-[580px] md:min-h-[640px] border-b border-border flex items-center overflow-hidden bg-black/40">
        <img
          src="/hero-banner.jpg"
          alt="Massoni's Italian Restaurant Table Spread and Ambiance"
          className="absolute inset-0 h-full w-full object-cover opacity-90 brightness-95"
        />
        <div className="hero-shade absolute inset-0" />
        
        <div className="relative mx-auto max-w-7xl px-5 py-20 text-white lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="eyebrow drop-shadow-xs">Benvenuti a Massoni's • Nottingham, MD</span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Classic Italian Comfort, Built for Seamless Ordering.
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Hand-tossed stone-baked pizzas, slow-simmered San Marzano pasta, our viral 
              Maryland-famous <strong className="text-white font-bold">Spaghetti Eggrolls</strong>, and weekly churned homemade gelato. Order online for swift curbside pickup.
            </p>
            
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-white hover:bg-accent/90 shadow-xl border border-amber-300/40 text-sm font-bold"
              >
                <a href="#menu" className="flex items-center gap-2">
                  Browse Online Menu <ArrowRight className="size-4" />
                </a>
              </Button>

              <Button
                onClick={() => { setReserveConfirmed(false); setReserveOpen(true); }}
                size="lg"
                variant="outline"
                className="border-white/40 bg-black/40 text-white hover:bg-white hover:text-black font-semibold text-sm backdrop-blur-xs"
              >
                <Calendar className="size-4 mr-2" />
                Reserve a Table
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SIGNATURE PRODUCT REEL (HORIZONTAL CAROUSEL) */}
      <section id="featured-reel" className="py-14 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="eyebrow">Chef's Signature Creations</span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Featured Restaurant Bestsellers</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Our most celebrated dishes in Nottingham &amp; Perry Hall. Click any card to customize size and options.
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCarouselIndex((prev) => Math.max(0, prev - 1))}
                disabled={carouselIndex === 0}
                className="size-9 rounded-full disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCarouselIndex((prev) => Math.min(featuredItems.length - 3, prev + 1))}
                disabled={carouselIndex >= Math.max(0, featuredItems.length - 3)}
                className="size-9 rounded-full disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Smooth Horizontal Carousel Reel */}
          <div className="relative overflow-hidden">
            <div
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${carouselIndex * 340}px)` }}
            >
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="w-[310px] shrink-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-background shadow-xs hover:shadow-xl hover:border-accent transition-all group"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-primary/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {item.badge}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      {item.italianName && (
                        <p className="text-[11px] italic text-muted-foreground mt-0.5">{item.italianName}</p>
                      )}
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/80 p-3.5 bg-muted/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-medium">Starts at</span>
                      <span className="font-display text-base font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductModal(item)}
                        className="text-xs h-8 px-2.5"
                      >
                        <Eye className="size-3 mr-1" /> Options
                      </Button>
                      <Button
                        variant={justAddedId === item.id ? "secondary" : "default"}
                        size="sm"
                        onClick={() => quickAddToCart(item)}
                        className={`text-xs h-8 px-3 transition-all ${
                          justAddedId === item.id
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold ring-2 ring-emerald-400 scale-105"
                            : ""
                        }`}
                      >
                        {justAddedId === item.id ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Added!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Plus className="size-3" /> Add
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEDICATED SIGNATURE SPOTLIGHT SECTION */}
      <section id="signatures" className="py-16 sm:py-20 bg-secondary/40 border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-10">
            <div>
              <span className="eyebrow">Viral Sensation &amp; Hearth Baking</span>
              <h2 className="section-title">The Dishes Massoni's is Famous For</h2>
              <p className="max-w-xl text-xs sm:text-sm text-muted-foreground mt-1">
                From our original Spaghetti Eggrolls to hand-stretched pizza dough and weekly churned gelato tubs.
              </p>
            </div>
            <Button
              onClick={() => {
                const el = document.getElementById('menu');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              variant="default"
              className="shrink-0 shadow-sm text-xs font-bold"
            >
              Explore Complete Menu &rarr;
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 'starter-spaghetti-eggrolls',
                title: 'Famous Spaghetti Eggrolls',
                tag: 'Viral Maryland Signature',
                img: '/spaghetti-eggrolls.jpg',
                desc: 'Crisp wonton eggroll shell stuffed with spaghetti, Italian sausage meat sauce, and mozzarella. Served with hot marinara.'
              },
              {
                id: 'pizza-margherita',
                title: 'Wood-Fired Margherita DOC',
                tag: '48-Hr Fermented Dough',
                img: '/artisan-pizza.jpg',
                desc: 'San Marzano tomatoes, fresh Fior di Latte mozzarella, fragrant basil, and extra virgin olive oil on stone-baked crust.'
              },
              {
                id: 'dessert-famous-ice-cream',
                title: 'Scratch Homemade Gelato',
                tag: 'Churned In-House Weekly',
                img: '/italian-desserts.jpg',
                desc: 'Ultra-creamy Sicilian Pistachio, Stracciatella, and Espresso Chip served by the cup, waffle dish, or to-go pint.'
              }
            ].map((spot) => {
              const fullItem = menuData.items.find(i => i.id === spot.id);
              if (!fullItem) return null;
              return (
                <div
                  key={spot.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-xl hover:border-accent transition-all"
                >
                  <div>
                    <div className="relative aspect-4/3 overflow-hidden bg-muted">
                      <img
                        src={spot.img}
                        alt={spot.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 rounded-full bg-primary text-white px-3 py-1 text-[11px] font-bold shadow-md">
                        {spot.tag}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full text-sm font-display font-bold text-primary shadow-md">
                        ${fullItem.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {spot.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {spot.desc}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-border/80 bg-muted/20 flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProductModal(fullItem)}
                      className="text-xs h-9 flex-1"
                    >
                      <Eye className="size-3.5 mr-1" /> Customize
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => quickAddToCart(fullItem)}
                      className="text-xs h-9 flex-1 font-bold"
                    >
                      <Plus className="size-3.5 mr-1" /> Add to Order
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FULL MENU CATALOG WITH INSTANT SEARCH & STICKY TABS */}
      <section id="menu" className="py-16 sm:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8">
            <div>
              <p className="eyebrow">Simmered Daily in Nottingham</p>
              <h2 className="section-title">Explore Our Full Trattoria Menu</h2>
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground mt-1">
                Filter by category or search our pasta, pizza, entrees, and desserts. Order online for swift curbside pickup.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="size-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pasta, pizza, eggrolls, desserts..."
                className="w-full rounded-full border border-input bg-card pl-10 pr-9 py-2.5 text-xs focus:border-primary focus:outline-none shadow-xs text-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Sticky Category Tabs Bar */}
          <div className="sticky top-20 z-30 mb-8 rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2 shrink-0">
                <Sliders className="size-4 text-primary hidden sm:inline" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
                  Categories:
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'starters', label: '🥖 Antipasti & Starters' },
                  { id: 'pastas', label: '🍝 Handcrafted Pastas' },
                  { id: 'pizzas', label: '🍕 Artisan Pizzas' },
                  { id: 'entrees', label: '🥩 Chef Entrees' },
                  { id: 'desserts', label: '🍨 Gelato & Sweets' },
                  { id: 'drinks', label: '🍷 Wines & Drinks' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedCategory(tab.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid - 3 columns, perfectly centered */}
          {filteredMenu.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground bg-card rounded-2xl border border-border p-8">
              <p className="font-display text-lg font-bold text-foreground">No dishes match your search</p>
              <p className="text-xs mt-1">Try searching for "eggroll", "fettuccine", "margherita", or "gelato".</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-4"
              >
                Clear Search &amp; Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-xs hover:shadow-xl hover:border-primary/50 transition-all"
                >
                  <div>
                    {/* Item Image with Badge */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {item.badge && (
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-primary/95 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      {item.italianName && (
                        <p className="text-[11px] italic text-muted-foreground mt-0.5">{item.italianName}</p>
                      )}
                      <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="border-t border-border/80 p-4 bg-muted/30 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-medium">
                        {item.options ? 'Starting at' : 'Price'}
                      </span>
                      <span className="font-display text-lg font-bold text-primary">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProductModal(item)}
                        className="text-xs h-8 px-2.5 hover:border-primary"
                      >
                        <Eye className="size-3 mr-1" /> Customize
                      </Button>
                      <Button
                        variant={justAddedId === item.id ? "secondary" : "default"}
                        size="sm"
                        onClick={() => quickAddToCart(item)}
                        className={`text-xs h-8 px-3 font-semibold transition-all ${
                          justAddedId === item.id
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold ring-2 ring-emerald-400 scale-105"
                            : ""
                        }`}
                      >
                        {justAddedId === item.id ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="size-3.5" /> Added!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Plus className="size-3" /> Add
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS SECTION */}
      <section id="reviews" className="py-16 sm:py-20 bg-secondary/30 border-t border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow">Local Dining Acclaim</span>
            <h2 className="section-title">Loved by Nottingham &amp; Perry Hall</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Over 450+ verified diner ratings celebrating our hospitality and scratch Italian recipes.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: 'Sarah M.',
                loc: 'Nottingham, MD',
                title: 'The spaghetti eggrolls are unbelievable!',
                comment: 'We heard about Massoni through neighbors raving about the spaghetti eggrolls and they did not disappoint! Crispy, cheesy, and with that homemade meat sauce—pure genius.'
              },
              {
                name: 'David L.',
                loc: 'Perry Hall, MD',
                title: 'Best homemade ice cream and cozy vibe',
                comment: 'Massoni is such a cozy Italian gem on Belair Rd. Super friendly staff, hearty pasta portions, and you CANNOT leave without trying their homemade pistachio gelato!'
              },
              {
                name: 'Jessica & Mark R.',
                loc: 'White Marsh, MD',
                title: 'Our new Friday night family staple',
                comment: 'Great wine and cocktails, authentic pizza crust with fresh basil, and generous pasta plates. Chuck and Nicole really care about quality. Ordering takeout is fast and always hot!'
              }
            ].map((rev, i) => (
              <div key={i} className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-accent mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="size-4 fill-accent" />
                    ))}
                  </div>
                  <h4 className="font-display font-bold text-base text-foreground mb-2">
                    "{rev.title}"
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-bold text-foreground">{rev.name}</span>
                  <span>{rev.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. OUR STORY & FAMILY HERITAGE */}
      <section id="story" className="py-16 sm:py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-card group">
              <img
                src="/hero-banner.jpg"
                alt="Nicole Massoni & Chuck Michael Family Trattoria Hospitality"
                className="w-full h-[440px] object-cover brightness-100 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Subtle bottom-only caption gradient so the entire image remains beautifully visible */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 pt-16 text-white">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300 block mb-1 drop-shadow-xs">Family Owned &amp; Operated</span>
                <h3 className="font-display text-2xl font-bold drop-shadow-sm">Nicole Massoni &amp; Chuck Michael</h3>
                <p className="text-xs text-white/95 mt-1 leading-relaxed drop-shadow-xs">
                  Dedicated to warmth, quality scratch recipes, and Baltimore County community hospitality.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <span className="eyebrow">Our Kitchen Heritage</span>
              <h2 className="section-title">Where Italian Tradition Feels Like Family</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                At <strong>Massoni's Italian Restaurant</strong>, every meal is prepared from scratch with the highest respect for Italian culinary tradition. When you dine with us or take our meals home, you're enjoying slow-simmered marinara, fresh meats, and hand-rolled pasta dough.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We're honored to serve Baltimore County from our 8833 Belair Road location, offering modern comfort classics like our Maryland-viral Spaghetti Eggrolls right alongside time-honored dishes like Lasagna Bolognese and handcrafted Gelato.
              </p>
              
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Button
                  onClick={() => { setReserveConfirmed(false); setReserveOpen(true); }}
                  variant="default"
                  className="font-bold text-xs"
                >
                  <Calendar className="size-4 mr-1.5" /> Book a Table
                </Button>
                <a
                  href="tel:4109703700"
                  className="btn btn-secondary text-xs"
                >
                  <Phone className="size-3.5 mr-1.5 text-accent" /> Call (410) 970-3700
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. VISIT & HOURS SECTION */}
      <section id="visit" className="py-16 sm:py-20 bg-card border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            
            <div className="p-8 rounded-3xl bg-background border border-border shadow-xs space-y-6">
              <div>
                <span className="eyebrow">Find Our Trattoria</span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold">Visit Us in Nottingham</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Located right on Belair Road with ample free parking for dining and curbside pickup.
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-border">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Address:</strong>
                    <p className="text-muted-foreground">8833 Belair Rd, Nottingham (Perry Hall area), MD 21236</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-foreground">Phone:</strong>
                    <p>
                      <a href="tel:4109703700" className="text-primary font-bold hover:underline font-mono">
                        (410) 970-3700
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  <Clock className="size-3.5 text-accent" />
                  <span>Weekly Hours of Operation</span>
                </div>
                <div className="text-xs space-y-1.5 text-foreground">
                  {menuData.restaurantInfo.hours.map((h, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{h.day}</span>
                      <span className="font-bold">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <a
                  href="https://maps.app.goo.gl/vcbJMU69c9UsBh658?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-xs flex-1 justify-center"
                >
                  <MapPin className="size-3.5 mr-1" /> Get Directions
                </a>
                <Button
                  onClick={() => { setReserveConfirmed(false); setReserveOpen(true); }}
                  variant="outline"
                  className="text-xs flex-1 justify-center font-semibold"
                >
                  <Calendar className="size-3.5 mr-1" /> Reserve Table
                </Button>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-3xl overflow-hidden shadow-md border border-border h-[430px] bg-muted relative">
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
      </section>

      {/* 10. RICH FOOTER */}
      <footer className="bg-[#151312] text-[#E5DDD0] pt-16 pb-12 border-t border-[#2C2725]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#2C2725]">
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-display text-xl font-bold">
                  M
                </div>
                <span className="font-display text-2xl font-bold text-white">Massoni's</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Classic Italian comfort, viral spaghetti eggrolls, wood-fired pizza, and weekly churned gelato in Nottingham, MD.
              </p>
              <p className="text-xs text-zinc-500">
                Owners: Nicole Massoni &amp; Chuck Michael
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                Quick Navigation
              </h4>
              <p><a href="#menu" className="text-zinc-400 hover:text-white">Full Menu &amp; Takeout</a></p>
              <p><a href="#signatures" className="text-zinc-400 hover:text-white">Spaghetti Eggrolls</a></p>
              <p><button onClick={() => { setReserveConfirmed(false); setReserveOpen(true); }} className="text-zinc-400 hover:text-white">Table Reservations</button></p>
              <p><a href="#story" className="text-zinc-400 hover:text-white">Family Heritage</a></p>
              <p><a href="#visit" className="text-zinc-400 hover:text-white">Hours &amp; Directions</a></p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                Hours
              </h4>
              <p className="flex justify-between text-zinc-400"><span>Mon:</span> <span className="text-white">5 PM – 9 PM</span></p>
              <p className="flex justify-between text-zinc-400"><span>Tue – Thu:</span> <span className="text-white">11 AM – 9 PM</span></p>
              <p className="flex justify-between text-zinc-400"><span>Fri – Sat:</span> <span className="text-white">11 AM – 10 PM</span></p>
              <p className="flex justify-between text-zinc-400"><span>Sun:</span> <span className="text-white">11 AM – 9 PM</span></p>
            </div>

            <div className="space-y-2.5 text-xs">
              <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
                Contact &amp; Ordering
              </h4>
              <p className="text-zinc-400">8833 Belair Rd, Nottingham MD 21236</p>
              <p><a href="tel:4109703700" className="font-mono font-bold text-accent text-sm">(410) 970-3700</a></p>
              <div className="pt-2 flex flex-col gap-1.5">
                <a 
                  href={menuData.restaurantInfo.toastUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-1"
                >
                  Massoni's Toast POS Link <ExternalLink className="size-3" />
                </a>
                <a 
                  href={menuData.restaurantInfo.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  Facebook Page <ExternalLink className="size-3" />
                </a>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
            <p>© {new Date().getFullYear()} Massoni's Italian Restaurant. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="size-3 text-primary fill-primary" /> for the Nottingham &amp; Perry Hall community
            </p>
          </div>
        </div>
      </footer>

      {/* --- MODAL 1: PRODUCT CUSTOMIZATION DIALOG --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade">
          <div className="relative w-full max-w-lg max-h-[90vh] bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
            >
              <X className="size-5" />
            </button>

            <div className="relative h-56 w-full bg-muted shrink-0">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              <div className="hero-shade absolute inset-0" />
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <p className="text-xs font-display italic text-accent">{selectedProduct.italianName}</p>
                <h3 className="font-display text-2xl font-bold">{selectedProduct.name}</h3>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-foreground">
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Portion Options */}
              {selectedProduct.options && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Select Size / Option <span className="text-primary">*</span>
                  </label>
                  <div className="space-y-1.5">
                    {selectedProduct.options.map((opt, i) => {
                      const isSel = modalOption?.name === opt.name;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setModalOption(opt)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                            isSel ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <span>{opt.name}</span>
                          <span className="text-muted-foreground">
                            {opt.priceDelta > 0 ? `+$${opt.priceDelta.toFixed(2)}` : 'Standard'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Pasta Types */}
              {selectedProduct.pastaTypes && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Choose Pasta Style
                  </label>
                  <div className="space-y-1.5">
                    {selectedProduct.pastaTypes.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setModalPasta(p)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                          modalPasta === p ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <span>{p}</span>
                        {modalPasta === p && <Check className="size-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gelato Flavors */}
              {selectedProduct.gelatoFlavors && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Choose Gelato Flavor <span className="text-primary">*</span>
                  </label>
                  <div className="space-y-1.5">
                    {selectedProduct.gelatoFlavors.map((f, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setModalGelato(f)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                          modalGelato === f ? 'border-accent bg-accent/15 text-accent-foreground font-bold' : 'border-border hover:bg-muted/50'
                        }`}
                      >
                        <span>{f}</span>
                        {modalGelato === f && <Check className="size-4 text-accent" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {selectedProduct.addOns && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Chef Extras &amp; Add-ons
                  </label>
                  <div className="space-y-1.5">
                    {selectedProduct.addOns.map((add, i) => {
                      const isChecked = modalAddOns.some(a => a.name === add.name);
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            if (isChecked) {
                              setModalAddOns(modalAddOns.filter(a => a.name !== add.name));
                            } else {
                              setModalAddOns([...modalAddOns, add]);
                            }
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all ${
                            isChecked ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold' : 'border-border hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-zinc-400'}`}>
                              {isChecked && <Check className="size-3" />}
                            </div>
                            <span>{add.name}</span>
                          </div>
                          <span className="font-bold">+${add.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Special Notes / Dietary Requests
                </label>
                <textarea
                  value={modalInstructions}
                  onChange={(e) => setModalInstructions(e.target.value)}
                  placeholder="e.g. Extra parmesan, sauce on side, allergy notes..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-input text-xs focus:border-primary focus:outline-none bg-background"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-muted/40 border-t border-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5">
                <button
                  type="button"
                  onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Minus className="size-4" />
                </button>
                <span className="font-bold text-sm w-6 text-center">{modalQuantity}</span>
                <button
                  type="button"
                  onClick={() => setModalQuantity(modalQuantity + 1)}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <Button
                onClick={handleAddCustomized}
                variant="default"
                className="flex-1 font-bold text-xs sm:text-sm h-11"
              >
                <span>Add to Order</span>
                <span className="ml-2 font-mono">
                  ${(((selectedProduct.price + (modalOption ? modalOption.priceDelta : 0) + modalAddOns.reduce((s, a) => s + a.price, 0)) * modalQuantity)).toFixed(2)}
                </span>
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* --- MODAL 2: SLIDE-OVER CART DRAWER --- */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden animate-fade">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-card shadow-2xl flex flex-col animate-slide-right text-foreground">
              
              {/* Cart Header */}
              <div className="p-6 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    <ShoppingBag className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold">Your Takeout Tray</h3>
                    <p className="text-xs text-muted-foreground">{cart.length} unique items</p>
                  </div>
                </div>
                <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
                  <X className="size-5" />
                </button>
              </div>

              {/* Fulfillment Toggle */}
              <div className="p-4 bg-muted/20 border-b border-border">
                <div className="grid grid-cols-2 p-1 bg-card rounded-xl border border-border text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('pickup');
                      if (paymentMethod === 'cod') setPaymentMethod('counter');
                    }}
                    className={`py-2 rounded-lg transition-all ${orderType === 'pickup' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Curbside Pickup (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('delivery');
                      if (paymentMethod === 'counter') setPaymentMethod('card');
                    }}
                    className={`py-2 rounded-lg transition-all ${orderType === 'delivery' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Delivery ($4.99)
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
                  {orderType === 'pickup' ? (
                    <>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="size-3.5 text-accent" /> Ready in: <strong className="text-foreground">20–30 mins</strong>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                        <MapPin className="size-3" /> 8833 Belair Rd (Pickup)
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="size-3.5 text-accent" /> Estimated: <strong className="text-foreground">35–50 mins</strong>
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                        <Truck className="size-3" /> To Your Door
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingBag className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="font-display font-bold text-base">Your cart is empty</p>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Add your favorite pasta, pizza, or eggrolls.</p>
                    <Button onClick={() => setCartOpen(false)} variant="default" size="sm">
                      Explore Menu
                    </Button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-border bg-background flex gap-3">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="font-display font-bold text-xs truncate">{item.product.name}</h4>
                          <span className="font-bold text-xs text-primary shrink-0">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5 space-y-0.5">
                          {item.selectedOption && <p>Size: {item.selectedOption}</p>}
                          {item.selectedPasta && <p>Pasta: {item.selectedPasta}</p>}
                          {item.selectedGelato && <p className="text-accent font-semibold">{item.selectedGelato}</p>}
                          {item.selectedAddOns?.length > 0 && <p className="text-emerald-700">+{item.selectedAddOns.join(', ')}</p>}
                          {item.specialInstructions && <p className="italic">Note: "{item.specialInstructions}"</p>}
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/50">
                          <div className="flex items-center gap-2 border border-border rounded-full px-2 py-0.5 text-xs">
                            <button onClick={() => updateQuantity(idx, -1)} className="text-muted-foreground hover:text-primary">
                              <Minus className="size-3" />
                            </button>
                            <span className="font-bold px-1">{item.quantity}</span>
                            <button onClick={() => updateQuantity(idx, 1)} className="text-muted-foreground hover:text-primary">
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button onClick={() => removeItem(idx)} className="text-[11px] text-muted-foreground hover:text-destructive flex items-center gap-1">
                            <Trash2 className="size-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-border bg-muted/20 space-y-3">
                  
                  {/* Promo Code */}
                  <form onSubmit={applyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder='Promo code (try "MASSONI10")'
                      className="flex-1 p-2 rounded-xl border border-input text-xs uppercase font-semibold bg-background"
                    />
                    <Button type="submit" variant="secondary" size="sm" className="text-xs">
                      Apply
                    </Button>
                  </form>
                  {promoMsg.text && (
                    <p className={`text-xs font-semibold ${promoMsg.type === 'success' ? 'text-emerald-600' : 'text-destructive'}`}>
                      {promoMsg.text}
                    </p>
                  )}

                  {/* Calculations */}
                  <div className="space-y-1 text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({discountCode} - {discountPercent}%)</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Maryland Sales Tax (6%)</span>
                      <span className="font-semibold text-foreground">${salesTax.toFixed(2)}</span>
                    </div>
                    {orderType === 'delivery' && (
                      <>
                        <div className="flex justify-between">
                          <span>Delivery Fee (Nottingham Area)</span>
                          <span className="font-semibold text-foreground">${deliveryFee.toFixed(2)}</span>
                        </div>
                        {driverTip > 0 && (
                          <div className="flex justify-between">
                            <span>Driver Tip</span>
                            <span className="font-semibold text-foreground">${driverTip.toFixed(2)}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex justify-between text-base font-bold text-foreground pt-1.5 border-t border-border">
                      <span>Total Due</span>
                      <span className="font-display text-primary text-lg">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => { setCartOpen(false); setCheckoutStep('details'); setCheckoutOpen(true); }}
                    variant="default"
                    className="w-full h-12 text-sm font-bold shadow-md"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 3: CHECKOUT MODAL --- */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade overflow-y-auto">
          <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale text-foreground">
            
            <div className="bg-primary text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">
                  {checkoutStep === 'confirmed' 
                    ? (confirmedOrder?.orderType === 'delivery' ? 'Delivery Order Confirmed!' : 'Pickup Order Confirmed!')
                    : (orderType === 'delivery' ? 'Local Delivery Checkout' : 'Curbside Pickup Checkout')}
                </h3>
                <p className="text-xs text-white/80">
                  {orderType === 'delivery' ? 'Delivered hot to your door in Nottingham & Perry Hall' : 'Massoni\'s Trattoria • 8833 Belair Rd'}
                </p>
              </div>
              {checkoutStep !== 'confirmed' && (
                <button onClick={() => setCheckoutOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-white/80">
                  <X className="size-5" />
                </button>
              )}
            </div>

            {checkoutStep !== 'confirmed' ? (
              <form onSubmit={checkoutStep === 'details' ? (e) => { e.preventDefault(); setCheckoutStep('payment'); } : handleCompleteOrder}>
                
                <div className="flex border-b border-border bg-muted/40 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('details')}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${checkoutStep === 'details' ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground'}`}
                  >
                    {orderType === 'delivery' ? '1. Delivery Details' : '1. Pickup Details'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { 
                      if (customerName && customerPhone && (orderType === 'pickup' || deliveryAddress.trim())) {
                        setCheckoutStep('payment'); 
                      }
                    }}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${checkoutStep === 'payment' ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground'}`}
                  >
                    2. Payment &amp; Submit
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {checkoutStep === 'details' ? (
                    <div className="space-y-4">
                      
                      {/* Fulfillment Switcher in Checkout */}
                      <div className="p-1 bg-muted/60 rounded-xl border border-border grid grid-cols-2 text-xs font-bold">
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType('pickup');
                            if (paymentMethod === 'cod') setPaymentMethod('counter');
                          }}
                          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            orderType === 'pickup' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <MapPin className="size-3.5" />
                          <span>Curbside Pickup (Free)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderType('delivery');
                            if (paymentMethod === 'counter') setPaymentMethod('card');
                          }}
                          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            orderType === 'delivery' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Truck className="size-3.5" />
                          <span>Doorstep Delivery ($4.99)</span>
                        </button>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Full Name <span className="text-primary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="e.g. Maria Rossi"
                              className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Phone Number <span className="text-primary">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="(410) 555-0199"
                              className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                            />
                            <span className="text-[10px] text-muted-foreground">
                              {orderType === 'delivery' ? 'Used for driver text/arrival notice' : 'Used for pickup ready notification'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="maria@example.com"
                            className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* PICKUP SPECIFIC SECTION */}
                      {orderType === 'pickup' && (
                        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-3">
                          <div className="flex items-start gap-2.5">
                            <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-xs text-foreground block">Pickup Location</span>
                              <p className="text-xs font-semibold text-primary">8833 Belair Rd, Nottingham, MD 21236</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                Designated curbside bays in front of the restaurant. We'll bring your order out or you can pick up at the bar.
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Pickup Time Preference
                            </label>
                            <select
                              value={pickupTime}
                              onChange={(e) => setPickupTime(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                            >
                              <option value="ASAP (Ready in 20–30 mins)">ASAP (Ready in 20–30 mins)</option>
                              <option value="Today at 5:00 PM">Today at 5:00 PM</option>
                              <option value="Today at 5:30 PM">Today at 5:30 PM</option>
                              <option value="Today at 6:00 PM">Today at 6:00 PM</option>
                              <option value="Today at 6:30 PM">Today at 6:30 PM</option>
                              <option value="Today at 7:00 PM">Today at 7:00 PM</option>
                              <option value="Today at 7:30 PM">Today at 7:30 PM</option>
                              <option value="Today at 8:00 PM">Today at 8:00 PM</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {/* DELIVERY SPECIFIC SECTION */}
                      {orderType === 'delivery' && (
                        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                            <Truck className="size-4 text-amber-700" />
                            <span>Local Doorstep Delivery Information</span>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Street Address <span className="text-primary">*</span>
                            </label>
                            <div className="relative">
                              <Home className="size-4 absolute left-3 top-3 text-muted-foreground" />
                              <input
                                type="text"
                                required
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                placeholder="e.g. 8920 Belair Rd"
                                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                Apt / Suite / Gate Code
                              </label>
                              <input
                                type="text"
                                value={deliveryApt}
                                onChange={(e) => setDeliveryApt(e.target.value)}
                                placeholder="Apt 3B, Gate #1234"
                                className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                                Delivery Area / Zip Code
                              </label>
                              <select
                                value={deliveryZip}
                                onChange={(e) => setDeliveryZip(e.target.value)}
                                className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                              >
                                <option value="Nottingham (21236)">Nottingham (21236)</option>
                                <option value="Perry Hall (21128)">Perry Hall (21128)</option>
                                <option value="Parkville (21234)">Parkville (21234)</option>
                                <option value="White Marsh (21162)">White Marsh (21162)</option>
                                <option value="Rosedale (21237)">Rosedale (21237)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Delivery Time Window
                            </label>
                            <select
                              value={deliveryTime}
                              onChange={(e) => setDeliveryTime(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                            >
                              <option value="ASAP (Estimated 35–50 mins)">ASAP (Estimated 35–50 mins)</option>
                              <option value="Today at 5:30 PM – 6:00 PM">Today at 5:30 PM – 6:00 PM</option>
                              <option value="Today at 6:00 PM – 6:30 PM">Today at 6:00 PM – 6:30 PM</option>
                              <option value="Today at 6:30 PM – 7:00 PM">Today at 6:30 PM – 7:00 PM</option>
                              <option value="Today at 7:00 PM – 7:30 PM">Today at 7:00 PM – 7:30 PM</option>
                              <option value="Today at 7:30 PM – 8:00 PM">Today at 7:30 PM – 8:00 PM</option>
                              <option value="Today at 8:00 PM – 8:30 PM">Today at 8:00 PM – 8:30 PM</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                              Drop-off Instructions for Driver
                            </label>
                            <textarea
                              value={deliveryNotes}
                              onChange={(e) => setDeliveryNotes(e.target.value)}
                              placeholder="e.g. Ring doorbell, leave on front porch chair, call when arriving..."
                              rows={2}
                              className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                            />
                          </div>

                          {/* Driver Tip Selection */}
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                              Driver Tip (100% goes to driver)
                            </label>
                            <div className="grid grid-cols-4 gap-1.5">
                              {[0, 3, 5, 7].map((tip) => (
                                <button
                                  key={tip}
                                  type="button"
                                  onClick={() => setDriverTip(tip)}
                                  className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all ${
                                    driverTip === tip 
                                      ? 'border-primary bg-primary text-white shadow-xs' 
                                      : 'border-border bg-background text-foreground hover:bg-muted'
                                  }`}
                                >
                                  {tip === 0 ? 'No Tip' : `$${tip}.00`}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* General Kitchen Notes */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Kitchen Packaging / Allergy Notes
                        </label>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="e.g. Extra parmesan, utensils, allergy alerts..."
                          rows={2}
                          className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Summary Banner */}
                      <div className="p-3.5 bg-muted/40 rounded-xl text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-foreground">Total Due:</span>
                          <span className="font-display text-primary text-base font-bold">${grandTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-muted-foreground font-medium">
                          {cartItemCount} items for {customerName} ({customerPhone})
                        </p>
                        {orderType === 'delivery' ? (
                          <div className="pt-1.5 border-t border-border/60 flex items-start gap-1.5 text-xs text-foreground">
                            <Truck className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              Delivering to: <strong>{deliveryAddress || 'Address on file'}{deliveryApt ? `, ${deliveryApt}` : ''} ({deliveryZip})</strong> • {deliveryTime}
                            </span>
                          </div>
                        ) : (
                          <div className="pt-1.5 border-t border-border/60 flex items-start gap-1.5 text-xs text-foreground">
                            <MapPin className="size-3.5 text-primary shrink-0 mt-0.5" />
                            <span>
                              Curbside Pickup at: <strong>8833 Belair Rd, Nottingham MD</strong> • {pickupTime}
                            </span>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                          Select Payment Preference
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('card')}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${paymentMethod === 'card' ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
                          >
                            <CreditCard className="size-4 mx-auto mb-1" />
                            Credit Card
                          </button>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('applepay')}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${paymentMethod === 'applepay' ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
                          >
                            <span className="block text-sm"> / G Pay</span>
                            Digital Wallet
                          </button>
                          {orderType === 'delivery' ? (
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('cod')}
                              className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${paymentMethod === 'cod' ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
                            >
                              <Banknote className="size-4 mx-auto mb-1" />
                              Cash on Delivery
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('counter')}
                              className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${paymentMethod === 'counter' ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
                            >
                              <MapPin className="size-4 mx-auto mb-1" />
                              Pay at Pickup
                            </button>
                          )}
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="p-3.5 rounded-xl bg-muted/30 border border-border space-y-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block mb-1">Card Number (Simulated)</span>
                            <input type="text" readOnly value="4242 •••• •••• 8833" className="w-full p-2 rounded-lg border border-input font-mono bg-card" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-muted-foreground block mb-1">Exp</span>
                              <input type="text" readOnly value="09/28" className="w-full p-2 rounded-lg border border-input font-mono bg-card" />
                            </div>
                            <div>
                              <span className="text-muted-foreground block mb-1">CVC</span>
                              <input type="text" readOnly value="789" className="w-full p-2 rounded-lg border border-input font-mono bg-card" />
                            </div>
                          </div>
                          <p className="text-[11px] text-emerald-700 flex items-center gap-1 pt-1">
                            <ShieldCheck className="size-3.5" /> 256-Bit SSL Encrypted Checkout
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/40 border-t border-border flex justify-between gap-3">
                  {checkoutStep === 'payment' ? (
                    <Button type="button" variant="outline" size="sm" onClick={() => setCheckoutStep('details')}>
                      Back
                    </Button>
                  ) : (
                    <Button type="button" variant="outline" size="sm" onClick={() => setCheckoutOpen(false)}>
                      Cancel
                    </Button>
                  )}

                  {checkoutStep === 'details' ? (
                    <Button type="submit" variant="default" size="sm" className="flex-1 font-bold">
                      Continue to Payment &rarr;
                    </Button>
                  ) : (
                    <Button type="submit" variant="default" size="sm" className="flex-1 font-bold">
                      Place Order • ${grandTotal.toFixed(2)}
                    </Button>
                  )}
                </div>

              </form>
            ) : (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-1">
                    ORDER ID: {confirmedOrder?.orderNumber}
                  </span>
                  <h3 className="font-display text-2xl font-bold">Grazie, {confirmedOrder?.customerName}!</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {confirmedOrder?.orderType === 'delivery'
                      ? 'Your delivery order has been received by Massoni\'s kitchen and a driver will be dispatched.'
                      : 'Your curbside order has been transmitted directly to the kitchen at Massoni\'s.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 text-left text-xs space-y-2 border border-border">
                  <div className="flex justify-between font-bold">
                    <span>{confirmedOrder?.orderType === 'delivery' ? 'Estimated Delivery Window:' : 'Estimated Ready Time:'}</span>
                    <span className="text-primary">{confirmedOrder?.fulfillmentTime}</span>
                  </div>

                  {confirmedOrder?.orderType === 'delivery' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery Destination:</span>
                        <span className="font-semibold text-right max-w-[60%] truncate">
                          {confirmedOrder?.deliveryAddress}{confirmedOrder?.deliveryApt ? `, ${confirmedOrder.deliveryApt}` : ''} ({confirmedOrder?.deliveryZip})
                        </span>
                      </div>
                      {confirmedOrder?.deliveryNotes && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Driver Note:</span>
                          <span className="italic text-right max-w-[60%]">"{confirmedOrder.deliveryNotes}"</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Driver Updates:</span>
                        <span>Sent via SMS to {confirmedOrder?.customerPhone}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pickup Counter:</span>
                        <span>8833 Belair Rd, Nottingham MD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Curbside Bay:</span>
                        <span>Dedicated spots in front • Call (410) 970-3700</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between pt-1 border-t border-border">
                    <span className="text-muted-foreground">Payment Method:</span>
                    <span className="font-semibold">
                      {confirmedOrder?.paymentMethod === 'cod' 
                        ? 'Cash upon Delivery' 
                        : confirmedOrder?.paymentMethod === 'counter' 
                        ? 'Pay at Pickup Counter' 
                        : confirmedOrder?.paymentMethod === 'applepay'
                        ? 'Digital Wallet ( / G Pay)'
                        : 'Credit Card (Paid Online)'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-bold pt-1 border-t border-border">
                    <span>Total {confirmedOrder?.paymentMethod === 'cod' || confirmedOrder?.paymentMethod === 'counter' ? 'Due' : 'Paid'}:</span>
                    <span className="font-display text-primary">${confirmedOrder?.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => window.print()} variant="outline" size="sm" className="flex-1">
                    <Printer className="size-3.5 mr-1" /> Print Receipt
                  </Button>
                  <Button onClick={() => setCheckoutOpen(false)} variant="default" size="sm" className="flex-1 font-bold">
                    Back to Menu
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* --- MODAL 4: TABLE RESERVATION MODAL --- */}
      {reserveOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade overflow-y-auto">
          <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale text-foreground">
            
            <div className="bg-primary text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold">Table Reservation</h3>
                <p className="text-xs text-white/80">Massoni's Trattoria Dining Room</p>
              </div>
              <button onClick={() => setReserveOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-white/80">
                <X className="size-5" />
              </button>
            </div>

            {!reserveConfirmed ? (
              <form onSubmit={handleBookReservation} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Date</label>
                    <input type="date" required value={reserveDate} onChange={(e) => setReserveDate(e.target.value)} className="w-full p-2.5 rounded-xl border border-input text-xs bg-background" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Time</label>
                    <select value={reserveTime} onChange={(e) => setReserveTime(e.target.value)} className="w-full p-2.5 rounded-xl border border-input text-xs bg-background">
                      <option value="5:00 PM">5:00 PM</option>
                      <option value="5:30 PM">5:30 PM</option>
                      <option value="6:00 PM">6:00 PM</option>
                      <option value="6:30 PM">6:30 PM</option>
                      <option value="7:00 PM">7:00 PM</option>
                      <option value="7:30 PM">7:30 PM</option>
                      <option value="8:00 PM">8:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Party</label>
                    <select value={reserveGuests} onChange={(e) => setReserveGuests(e.target.value)} className="w-full p-2.5 rounded-xl border border-input text-xs bg-background">
                      <option value="1 Guest">1 Guest</option>
                      <option value="2 Guests">2 Guests</option>
                      <option value="4 Guests">4 Guests</option>
                      <option value="6 Guests">6 Guests</option>
                      <option value="8+ Large Party">8+ Party</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Seating Area</label>
                    <select value={reserveSeating} onChange={(e) => setReserveSeating(e.target.value)} className="w-full p-2.5 rounded-xl border border-input text-xs bg-background">
                      <option value="Main Dining Room">Main Dining Room</option>
                      <option value="Cozy Booth">Cozy Booth</option>
                      <option value="Bar Area">Bar Lounge</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Occasion</label>
                    <select value={reserveOccasion} onChange={(e) => setReserveOccasion(e.target.value)} className="w-full p-2.5 rounded-xl border border-input text-xs bg-background">
                      <option value="Casual Dinner">Casual Dinner</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Anniversary">Anniversary</option>
                      <option value="Business Gathering">Business Gathering</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-border space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Name <span className="text-primary">*</span></label>
                    <input type="text" required value={reserveName} onChange={(e) => setReserveName(e.target.value)} placeholder="Your full name" className="w-full p-2.5 rounded-xl border border-input text-xs bg-background" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-muted-foreground mb-1">Phone <span className="text-primary">*</span></label>
                    <input type="tel" required value={reservePhone} onChange={(e) => setReservePhone(e.target.value)} placeholder="(410) 555-0199" className="w-full p-2.5 rounded-xl border border-input text-xs bg-background" />
                  </div>
                </div>

                <div className="pt-2 flex justify-between gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => setReserveOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" size="sm" className="flex-1 font-bold">
                    Confirm Reservation
                  </Button>
                </div>
              </form>
            ) : (
              <div className="p-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="size-8" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
                    BOOKING CODE: {confirmedResCode}
                  </span>
                  <h3 className="font-display text-2xl font-bold">We Look Forward to Seeing You!</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Table reserved for {reserveName} on {reserveDate} at {reserveTime} ({reserveGuests}).
                  </p>
                </div>
                <Button onClick={() => setReserveOpen(false)} variant="default" size="sm" className="w-full font-bold">
                  Done
                </Button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 animate-fade">
          <div className="bg-[#181514] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 border border-[#2C2725]">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Omnipresent Floating Order Now & Cart Dock */}
      {!cartOpen && !checkoutOpen && !reserveOpen && (
        <aside aria-label="Quick Ordering Bar" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center drop-shadow-2xl animate-fade max-w-[calc(100vw-2rem)]">
          <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-full bg-[#7A1C29] text-white border border-amber-400/40 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-red-950/60 hover:scale-[1.02]">
            {/* Quick Order Now Button */}
            <a
              href="#menu"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-white/95 hover:text-white hover:bg-white/15 active:scale-95 transition-all duration-200"
            >
              <Utensils className="size-3.5 sm:size-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap">Order Now</span>
            </a>

            {/* Visual Divider */}
            <div className="h-5 sm:h-6 w-px bg-white/25 my-auto shrink-0" />

            {/* Quick Cart / Order Tray Trigger */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                cartItemCount > 0 
                  ? 'bg-accent text-white hover:brightness-110 shadow-lg ring-2 ring-amber-300/50' 
                  : 'text-white/95 hover:text-white hover:bg-white/15'
              }`}
            >
              <div className="relative shrink-0 flex items-center">
                <ShoppingBag className="size-3.5 sm:size-4" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-primary text-[10px] font-black shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="whitespace-nowrap">Cart</span>
              {cartItemCount > 0 && (
                <span className="font-mono text-xs font-semibold pl-1 border-l border-white/30 whitespace-nowrap">
                  ${subtotal.toFixed(2)}
                </span>
              )}
            </button>
          </div>
        </aside>
      )}

    </main>
  );
}
