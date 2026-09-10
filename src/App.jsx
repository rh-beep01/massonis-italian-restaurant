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
  ExternalLink 
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
  const [pickupTime, setPickupTime] = useState('ASAP (Approx 25–35 mins)');
  const [deliveryAddress, setDeliveryAddress] = useState('');
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
  const grandTotal = taxableAmount + salesTax + deliveryFee;

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
      pickupTime,
      deliveryAddress,
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
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#181514] text-[#E5DDD0] px-4 py-2 text-xs font-medium border-b border-[#2C2725]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-accent">
            <Award className="size-3.5" /> Authentic Italian Kitchen • Nottingham, MD
          </span>
          <p className="mx-auto sm:mx-0 text-center">
            <strong>Fresh Handcrafted Pasta, Artisan Pizza &amp; Viral Spaghetti Eggrolls</strong> — Order ahead for fast pickup!
          </p>
          <div className="hidden md:inline-flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Open Today: 11:00 AM – 9:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* Tricolore Ribbon */}
      <div className="italian-ribbon"></div>

      {/* 2. MAIN STICKY NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Branding */}
          <a href="#top" className="flex items-center gap-3 shrink-0 py-1 group text-decoration-none">
            <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-2xl font-bold shadow-sm group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-primary leading-tight">
                Massoni's
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-muted-foreground">
                Italian Restaurant &amp; Bar
              </span>
            </div>
          </a>

          {/* Nav Links - Single Line, Centered, Crisp */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 gap-6 xl:gap-8 whitespace-nowrap">
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

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="tel:4109703700"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border border-border bg-card hover:border-primary transition-colors text-foreground"
            >
              <Phone className="size-3.5 text-accent shrink-0" />
              <span className="font-mono">(410) 970-3700</span>
            </a>

            <Button
              variant="outline"
              size="sm"
              onClick={() => { setReserveConfirmed(false); setReserveOpen(true); }}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs h-10 px-4 font-semibold text-primary hover:bg-primary hover:text-white"
            >
              <Calendar className="size-4" />
              <span>Reserve Table</span>
            </Button>

            {/* Cart Trigger */}
            <Button
              variant="default"
              size="sm"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 font-semibold text-xs h-10 px-4 whitespace-nowrap"
            >
              <ShoppingBag className="size-4" />
              <span className="hidden sm:inline">Order Tray</span>
              {cartItemCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white animate-scale">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Nav Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              {mobileNavOpen ? <X className="size-5" /> : <MenuIcon className="size-5" />}
            </Button>
          </div>

        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <nav className="border-t border-border bg-background px-6 py-5 shadow-xl lg:hidden animate-fade">
            <div className="flex flex-col gap-3.5 text-sm font-semibold">
              <a href="#featured-reel" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Featured Specialties
              </a>
              <a href="#signatures" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Signature Spaghetti Eggrolls
              </a>
              <a href="#menu" onClick={() => setMobileNavOpen(false)} className="py-1 hover:text-primary">
                Full Menu &amp; Takeout
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
              
              <div className="pt-3 border-t border-border flex flex-col gap-2.5">
                <Button
                  onClick={() => { setMobileNavOpen(false); setReserveConfirmed(false); setReserveOpen(true); }}
                  variant="outline"
                  className="w-full justify-center"
                >
                  <Calendar className="size-4 mr-2" /> Book Table Reservation
                </Button>
                <a
                  href="tel:4109703700"
                  className="btn btn-secondary w-full justify-center text-xs"
                >
                  <Phone className="size-3.5 mr-2 text-accent" /> Call (410) 970-3700
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="top" className="relative min-h-[580px] md:min-h-[640px] border-b border-border flex items-center bg-[#151312]">
        <img
          src="/hero-banner.jpg"
          alt="Massoni's Italian Restaurant Table Spread and Ambiance"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="hero-shade absolute inset-0" />
        
        <div className="relative mx-auto max-w-7xl px-5 py-20 text-white lg:px-8 w-full">
          <div className="max-w-2xl">
            <span className="eyebrow">Benvenuti a Massoni's • Nottingham, MD</span>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.12]">
              Classic Italian Comfort, Built for Seamless Ordering.
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-zinc-200">
              Hand-tossed stone-baked pizzas, slow-simmered San Marzano pasta, our viral 
              Maryland-famous <strong className="text-white font-semibold">Spaghetti Eggrolls</strong>, and weekly churned homemade gelato. Order online for swift curbside pickup.
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
            
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-card">
              <img
                src="/hero-banner.jpg"
                alt="Nicole Massoni & Chuck Michael Family Trattoria Hospitality"
                className="w-full h-[420px] object-cover"
              />
              <div className="hero-shade absolute inset-0" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="eyebrow text-accent block">Family Owned &amp; Operated</span>
                <h3 className="font-display text-2xl font-bold">Nicole Massoni &amp; Chuck Michael</h3>
                <p className="text-xs text-zinc-300 mt-1">
                  Dedicated to warmth, quality scratch recipes, and community hospitality.
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
                    onClick={() => setOrderType('pickup')}
                    className={`py-2 rounded-lg transition-all ${orderType === 'pickup' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'}`}
                  >
                    Curbside Pickup (Free)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('delivery')}
                    className={`py-2 rounded-lg transition-all ${orderType === 'delivery' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'}`}
                  >
                    Delivery ($4.99)
                  </button>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2 px-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="size-3.5 text-accent" /> Estimated: <strong className="text-foreground">25–35 mins</strong>
                  </span>
                  <span>8833 Belair Rd</span>
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
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span className="font-semibold text-foreground">${deliveryFee.toFixed(2)}</span>
                      </div>
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
                  {checkoutStep === 'confirmed' ? 'Order Confirmed!' : 'Checkout & Order Summary'}
                </h3>
                <p className="text-xs text-white/80">Massoni's Italian Restaurant • (410) 970-3700</p>
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
                    1. Customer &amp; Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => { if (customerName && customerPhone) setCheckoutStep('payment'); }}
                    className={`flex-1 py-3 text-center border-b-2 transition-all ${checkoutStep === 'payment' ? 'border-primary text-primary bg-card' : 'border-transparent text-muted-foreground'}`}
                  >
                    2. Payment &amp; Submit
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  {checkoutStep === 'details' ? (
                    <div className="space-y-3">
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Pickup Time Slot
                        </label>
                        <select
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                        >
                          <option value="ASAP (Approx 25–35 mins)">ASAP (Approx 25–35 mins)</option>
                          <option value="Today at 5:00 PM">Today at 5:00 PM</option>
                          <option value="Today at 6:00 PM">Today at 6:00 PM</option>
                          <option value="Today at 7:00 PM">Today at 7:00 PM</option>
                          <option value="Today at 8:00 PM">Today at 8:00 PM</option>
                        </select>
                      </div>

                      {orderType === 'delivery' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                            Delivery Address in Nottingham Area
                          </label>
                          <input
                            type="text"
                            required
                            value={deliveryAddress}
                            onChange={(e) => setDeliveryAddress(e.target.value)}
                            placeholder="Street address, Apt, Zip code"
                            className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Kitchen Packaging Notes
                        </label>
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          placeholder="e.g. Extra napkins, call upon arrival..."
                          rows={2}
                          className="w-full p-2.5 rounded-xl border border-input text-xs bg-background focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-3.5 bg-muted/40 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-foreground block">Order Total: ${grandTotal.toFixed(2)}</span>
                        <p className="text-muted-foreground">{cart.length} items for {customerName} ({customerPhone})</p>
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
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('counter')}
                            className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${paymentMethod === 'counter' ? 'border-primary bg-primary/10 text-primary' : 'border-border'}`}
                          >
                            <MapPin className="size-4 mx-auto mb-1" />
                            Pay at Pickup
                          </button>
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
                    Your order has been transmitted directly to the kitchen at Massoni's.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/40 text-left text-xs space-y-1.5 border border-border">
                  <div className="flex justify-between font-bold">
                    <span>Estimated Pickup:</span>
                    <span className="text-primary">{confirmedOrder?.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>8833 Belair Rd, Nottingham MD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Paid:</span>
                    <span className="font-bold text-foreground font-mono">${confirmedOrder?.grandTotal.toFixed(2)}</span>
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
        <div className="fixed bottom-6 right-6 z-50 animate-fade">
          <div className="bg-[#181514] text-white text-xs sm:text-sm font-semibold py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2 border border-[#2C2725]">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sticky Mobile Cart Bar */}
      {cartItemCount > 0 && !cartOpen && !checkoutOpen && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden animate-fade">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full py-3.5 px-5 rounded-2xl bg-primary text-white font-bold flex items-center justify-between shadow-2xl active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-primary flex items-center justify-center text-xs font-black">
                {cartItemCount}
              </span>
              <span>View Order Tray</span>
            </div>
            <div className="flex items-center gap-1 font-mono">
              <span>${subtotal.toFixed(2)}</span>
              <ArrowRight className="size-4" />
            </div>
          </button>
        </div>
      )}

    </main>
  );
}
