import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  Phone, 
  Mail, 
  User,
  Heart
} from 'lucide-react';

export default function ReservationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('6:30 PM');
  const [guests, setGuests] = useState('2 Guests');
  const [seating, setSeating] = useState('Main Dining Room');
  const [occasion, setOccasion] = useState('Casual Dining');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [reservationCode, setReservationCode] = useState('');

  const handleBook = (e) => {
    e.preventDefault();
    const code = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    setReservationCode(code);
    setIsBooked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-scale text-[#221E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#2D5A27] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">Reserve a Table</h3>
              <p className="text-xs text-white/80">
                Massoni's Trattoria Dining Experience
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {!isBooked ? (
          <form onSubmit={handleBook} className="p-6 space-y-4">
            
            {/* Date, Time, Guests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Time Slot
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs bg-white"
                >
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="1:00 PM">1:00 PM</option>
                  <option value="5:00 PM">5:00 PM</option>
                  <option value="5:30 PM">5:30 PM</option>
                  <option value="6:00 PM">6:00 PM</option>
                  <option value="6:30 PM">6:30 PM</option>
                  <option value="7:00 PM">7:00 PM</option>
                  <option value="7:30 PM">7:30 PM</option>
                  <option value="8:00 PM">8:00 PM</option>
                  <option value="8:30 PM">8:30 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Party Size
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs bg-white"
                >
                  <option value="1 Guest">1 Guest</option>
                  <option value="2 Guests">2 Guests</option>
                  <option value="3 Guests">3 Guests</option>
                  <option value="4 Guests">4 Guests</option>
                  <option value="5 Guests">5 Guests</option>
                  <option value="6 Guests">6 Guests</option>
                  <option value="7-8 Guests">7–8 Guests</option>
                  <option value="9+ Party Event">9+ Large Party</option>
                </select>
              </div>
            </div>

            {/* Seating & Occasion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Seating Area Preference
                </label>
                <select
                  value={seating}
                  onChange={(e) => setSeating(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs bg-white"
                >
                  <option value="Main Dining Room">Main Dining Room</option>
                  <option value="Cozy Booth">Cozy Booth</option>
                  <option value="Bar Area">Bar / Lounge</option>
                  <option value="Quiet Corner">Quiet Corner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Special Occasion
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs bg-white"
                >
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Romantic Anniversary">Romantic Anniversary</option>
                  <option value="Business Dinner">Business Dinner</option>
                  <option value="Family Gathering">Family Gathering</option>
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-2 border-t border-[#EFE7DA]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Full Name <span className="text-[#7A1C29]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maria Rossi"
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm focus:outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                    Phone Number <span className="text-[#7A1C29]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(410) 555-0199"
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maria@example.com"
                    className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-sm focus:outline-none focus:border-[#2D5A27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7D746D] mb-1">
                  Notes for Host (High chairs, anniversary dessert, etc.)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special requests or accommodation needs..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-[#DFD5C4] text-xs focus:outline-none focus:border-[#2D5A27]"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-[#EFE7DA] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary text-xs px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-accent text-sm py-3 px-6 flex-1"
              >
                Confirm Table Reservation
              </button>
            </div>

          </form>
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF5EB] text-[#2D5A27] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#EBF5EB] text-[#2D5A27] text-xs font-bold tracking-wider mb-2">
                RESERVATION CONFIRMED • {reservationCode}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#151312] mb-1">
                We Look Forward to Welcoming You, {name}!
              </h3>
              <p className="text-sm text-[#57504A]">
                Your table has been reserved at Massoni's Italian Restaurant.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F3EA] border border-[#DFD5C4] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="font-bold text-[#7D746D]">Date & Time:</span>
                <span className="font-bold text-[#151312]">{date} at {time}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#7D746D]">Party Size:</span>
                <span className="font-medium text-[#151312]">{guests} ({seating})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#7D746D]">Occasion:</span>
                <span className="font-medium text-[#151312]">{occasion}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-[#7D746D]">Restaurant Location:</span>
                <span className="font-medium text-[#151312]">8833 Belair Rd, Nottingham MD</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn btn-accent w-full text-sm py-3"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
