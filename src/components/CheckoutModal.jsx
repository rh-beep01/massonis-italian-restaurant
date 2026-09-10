import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck, 
  Printer, 
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { menuData } from '../data/menuData';

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  orderType,
  discountPercent,
  discountCode,
  onOrderSuccess
}) {
  if (!isOpen) return null;

  // Checkout Step
  const [step, setStep] = useState('details'); // details, payment, confirmed

  // Form fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [pickupTime, setPickupTime] = useState('ASAP (Approx 25–35 mins)');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliverySuite, setDeliverySuite] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Nottingham');
  const [deliveryZip, setDeliveryZip] = useState('21236');
  const [kitchenNotes, setKitchenNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, applepay, counter
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8833');
  const [cardExp, setCardExp] = useState('09/28');
  const [cardCvc, setCardCvc] = useState('789');

  // Confirmed order data
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const salesTax = taxableAmount * 0.06;
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const grandTotal = taxableAmount + salesTax + deliveryFee;

  const handleCompleteOrder = (e) => {
    e.preventDefault();
    const orderNumber = `MAS-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      orderType,
      pickupTime,
      deliveryStreet: orderType === 'delivery' ? `${deliveryStreet} ${deliverySuite}` : null,
      kitchenNotes,
      paymentMethod,
      items: [...cart],
      subtotal,
      discountAmount,
      salesTax,
      deliveryFee,
      grandTotal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConfirmedOrder(newOrder);
    setStep('confirmed');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7A1C29', '#2D5A27', '#D4A373', '#FAF3E8']
      });
    } catch (err) {
      // ignore
    }

    if (onOrderSuccess) {
      onOrderSuccess();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale text-[#221E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#7A1C29] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
              {step === 'confirmed' ? <CheckCircle2 size={22} className="text-emerald-300" /> : <ShoppingBag size={20} />}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">
                {step === 'confirmed' ? 'Order Placed Successfully!' : 'Complete Your Order'}
              </h3>
              <p className="text-xs text-white/80">
                Massoni's Italian Restaurant • 8833 Belair Rd
              </p>
            </div>
          </div>

          {step !== 'confirmed' && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* --- STEP 1 & 2 FORM --- */}
        {step !== 'confirmed' && (
          <form onSubmit={step === 'details' ? (e) => { e.preventDefault(); setStep('payment'); } : handleCompleteOrder}>
            
            {/* Step Navigation Indicator */}
            <div className="flex border-b border-[#EFE7DA] bg-[#FDFAF5] text-xs font-bold text-[#57504A]">
              <button
                type="button"
                onClick={() => setStep('details')}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  step === 'details' ? 'border-[#7A1C29] text-[#7A1C29] bg-white' : 'border-transparent'
                }`}
              >
                1. Customer & Fulfillment
              </button>
              <button
                type="button"
                onClick={() => {
                  if (customerName && customerPhone) setStep('payment');
                }}
                className={`flex-1 py-3 text-center border-b-2 transition-all ${
                  step === 'payment' ? 'border-[#7A1C29] text-[#7A1C29] bg-white' : 'border-transparent'
                }`}
              >
                2. Review & Payment
              </button>
            </div>

            <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
              
              {/* DETAILS STEP */}
              {step === 'details' && (
                <div className="space-y-4">
                  <div className="bg-[#F8F3EA] p-3.5 rounded-xl text-xs flex items-center justify-between font-medium">
                    <span className="flex items-center gap-1.5 text-[#7A1C29] font-bold">
                      <Clock size={15} />
                      {orderType === 'pickup' ? 'Curbside Pickup at Counter' : 'Local Delivery'}
                    </span>
                    <span className="text-[#57504A]">8833 Belair Rd</span>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                        Full Name <span className="text-[#7A1C29]">*</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D746D]" />
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. John Doe"
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                          Phone Number <span className="text-[#7A1C29]">*</span>
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D746D]" />
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="(410) 555-0199"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D746D]" />
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ready Time Slot */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                        Requested Pickup Time
                      </label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#DFD5C4] focus:outline-none focus:border-[#7A1C29] text-sm bg-white"
                      >
                        <option value="ASAP (Approx 25–35 mins)">ASAP (Approx 25–35 mins)</option>
                        <option value="Today at 5:00 PM">Today at 5:00 PM</option>
                        <option value="Today at 6:00 PM">Today at 6:00 PM</option>
                        <option value="Today at 7:00 PM">Today at 7:00 PM</option>
                        <option value="Today at 8:00 PM">Today at 8:00 PM</option>
                      </select>
                    </div>

                    {/* Delivery Fields */}
                    {orderType === 'delivery' && (
                      <div className="pt-2 space-y-3 border-t border-[#EFE7DA]">
                        <h4 className="font-serif font-bold text-sm text-[#151312]">Delivery Address</h4>
                        <div>
                          <input
                            type="text"
                            required
                            value={deliveryStreet}
                            onChange={(e) => setDeliveryStreet(e.target.value)}
                            placeholder="Street address"
                            className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm mb-2"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={deliverySuite}
                            onChange={(e) => setDeliverySuite(e.target.value)}
                            placeholder="Apt/Suite"
                            className="p-2.5 rounded-xl border border-[#DFD5C4] text-sm"
                          />
                          <input
                            type="text"
                            value={deliveryCity}
                            onChange={(e) => setDeliveryCity(e.target.value)}
                            placeholder="City"
                            className="p-2.5 rounded-xl border border-[#DFD5C4] text-sm"
                          />
                          <input
                            type="text"
                            value={deliveryZip}
                            onChange={(e) => setDeliveryZip(e.target.value)}
                            placeholder="ZIP"
                            className="p-2.5 rounded-xl border border-[#DFD5C4] text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {/* Kitchen Instructions */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                        Kitchen & Packaging Requests
                      </label>
                      <textarea
                        value={kitchenNotes}
                        onChange={(e) => setKitchenNotes(e.target.value)}
                        placeholder="e.g. Call upon curbside arrival, cutlery needed, allergy note..."
                        rows={2}
                        className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm focus:outline-none focus:border-[#7A1C29]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT STEP */}
              {step === 'payment' && (
                <div className="space-y-5">
                  <div className="bg-[#FDFAF5] p-4 rounded-2xl border border-[#EFE7DA] space-y-2">
                    <h4 className="font-serif font-bold text-sm text-[#151312]">Order Breakdown</h4>
                    <div className="text-xs text-[#57504A] space-y-1">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span className="font-semibold">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-[#2D5A27] font-semibold">
                          <span>Discount ({discountCode})</span>
                          <span>-${discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-[#EFE7DA]">
                        <span>MD Tax (6%)</span>
                        <span>${salesTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold text-[#7A1C29] pt-1">
                        <span>Total Due</span>
                        <span>${grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === 'card'
                            ? 'border-[#7A1C29] bg-[#FDF0F2] text-[#7A1C29]'
                            : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                        }`}
                      >
                        <CreditCard size={18} />
                        <span>Credit Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('applepay')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === 'applepay'
                            ? 'border-[#7A1C29] bg-[#FDF0F2] text-[#7A1C29]'
                            : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                        }`}
                      >
                        <span className="text-base font-bold"> / G Pay</span>
                        <span>Digital Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('counter')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                          paymentMethod === 'counter'
                            ? 'border-[#7A1C29] bg-[#FDF0F2] text-[#7A1C29]'
                            : 'border-[#DFD5C4] hover:bg-[#F8F3EA]'
                        }`}
                      >
                        <MapPin size={18} />
                        <span>Pay at Pickup</span>
                      </button>
                    </div>
                  </div>

                  {/* Credit Card Input Details */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-2xl bg-[#F8F3EA] border border-[#DFD5C4] space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm bg-white font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                            Expires
                          </label>
                          <input
                            type="text"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                            CVC
                          </label>
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm bg-white font-mono"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-[#7D746D] flex items-center gap-1">
                        <ShieldCheck size={13} className="text-[#2D5A27]" />
                        256-Bit Encrypted Secure SSL Checkout
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'counter' && (
                    <div className="p-4 rounded-xl bg-[#EBF5EB] border border-[#2D5A27]/20 text-xs text-[#264E24]">
                      <strong>Pay at Counter:</strong> You can pay with Cash, Debit, or Credit upon arriving at 8833 Belair Rd for your order pickup.
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Buttons Footer */}
            <div className="p-6 bg-[#FDFAF5] border-t border-[#EFE7DA] flex items-center justify-between gap-4">
              {step === 'payment' ? (
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="btn btn-secondary text-xs px-4"
                >
                  <ArrowLeft size={14} />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary text-xs px-4"
                >
                  Cancel
                </button>
              )}

              {step === 'details' ? (
                <button
                  type="submit"
                  className="btn btn-primary py-3 px-6 text-sm flex-1 flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary py-3 px-6 text-sm flex-1 flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={17} />
                  <span>Place Order • ${grandTotal.toFixed(2)}</span>
                </button>
              )}
            </div>

          </form>
        )}

        {/* --- STEP 3: CONFIRMED RECEIPT SCREEN --- */}
        {step === 'confirmed' && confirmedOrder && (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[#EBF5EB] text-[#2D5A27] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#FDF0F2] text-[#7A1C29] text-xs font-bold tracking-wider mb-2">
                ORDER ID: {confirmedOrder.orderNumber}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#151312] mb-1">
                Grazie, {confirmedOrder.customerName}!
              </h3>
              <p className="text-sm text-[#57504A]">
                Your order has been sent directly to the kitchen at Massoni's Italian Restaurant.
              </p>
            </div>

            {/* Estimated time alert */}
            <div className="p-4 rounded-2xl bg-[#F8F3EA] border border-[#DFD5C4] text-left text-xs space-y-2">
              <div className="flex justify-between items-center font-bold text-[#151312]">
                <span className="flex items-center gap-1.5 text-[#7A1C29]">
                  <Clock size={16} />
                  Estimated Pickup Time:
                </span>
                <span>{confirmedOrder.pickupTime}</span>
              </div>
              <div className="flex justify-between items-center text-[#57504A]">
                <span>Pickup Location:</span>
                <span className="font-medium text-[#221E1C]">8833 Belair Rd, Nottingham MD</span>
              </div>
              <div className="flex justify-between items-center text-[#57504A]">
                <span>Contact Phone:</span>
                <a href="tel:4109703700" className="font-bold text-[#7A1C29] hover:underline">(410) 970-3700</a>
              </div>
            </div>

            {/* Receipt items breakdown */}
            <div className="text-left text-xs space-y-1.5 p-4 bg-[#FDFAF5] rounded-2xl border border-[#EFE7DA]">
              <h5 className="font-bold text-[#151312] uppercase tracking-wider text-[11px] mb-2">
                Order Summary ({confirmedOrder.items.length} Items)
              </h5>
              {confirmedOrder.items.map((it, i) => (
                <div key={i} className="flex justify-between text-[#57504A]">
                  <span>{it.quantity}x {it.product.name} {it.selectedOption ? `(${it.selectedOption})` : ''}</span>
                  <span className="font-medium">${(it.unitPrice * it.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#DFD5C4] flex justify-between font-bold text-sm text-[#151312]">
                <span>Grand Total Paid</span>
                <span className="font-serif text-[#7A1C29] text-base">${confirmedOrder.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="btn btn-secondary text-xs flex-1 flex items-center justify-center gap-2"
              >
                <Printer size={15} />
                Print Receipt
              </button>

              <button
                onClick={onClose}
                className="btn btn-primary text-xs flex-1"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
