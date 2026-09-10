import React from 'react';
import { Star, Quote, ThumbsUp } from 'lucide-react';

export default function ReviewsSection() {
  const reviews = [
    {
      author: 'Sarah M.',
      location: 'Nottingham, MD',
      rating: 5,
      date: '2 weeks ago',
      title: 'The spaghetti eggrolls are unbelievable!',
      comment: 'We heard about Massoni through neighbors raving about the spaghetti eggrolls and they did not disappoint! Crispy, cheesy, and with that homemade meat sauce—pure genius. The lasagna and chicken parm were also top tier.'
    },
    {
      author: 'David L.',
      location: 'Perry Hall, MD',
      rating: 5,
      date: '1 month ago',
      title: 'Best homemade ice cream and cozy vibe',
      comment: 'Massonis is such a cozy Italian gem in Nottingham. Super friendly staff, hearty portions, and you CANNOT leave without trying their homemade ice cream. The pistachio gelato blew me away.'
    },
    {
      author: 'Jessica & Mark R.',
      location: 'White Marsh, MD',
      rating: 5,
      date: '3 weeks ago',
      title: 'Our new Friday night family staple',
      comment: 'Great drinks, authentic pizza crust with fresh basil, and generous pasta plates. Chuck and Nicole really care about quality and making you feel welcomed. Ordering takeout is fast and always hot!'
    }
  ];

  return (
    <section id="reviews" className="py-20 bg-[#F8F3EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF3E8] border border-[#D4A373]/40 text-[#8A6400] text-xs font-bold uppercase tracking-wider mb-3">
            <Star size={14} className="fill-[#B8860B] text-[#B8860B]" />
            <span>Community Love</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#151312] mb-4">
            Loved by Local Diners
          </h2>
          <p className="text-[#57504A] text-base">
            Over 450+ five-star reviews from families across Baltimore County.
          </p>
        </div>

        {/* 3-Column Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-white p-7 rounded-2xl border border-[#EFE7DA] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#B8860B] text-[#B8860B]" />
                  ))}
                </div>

                <h4 className="font-serif font-bold text-lg text-[#151312] mb-2">
                  "{rev.title}"
                </h4>

                <p className="text-sm text-[#57504A] leading-relaxed mb-6">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFE7DA] flex items-center justify-between text-xs text-[#7D746D]">
                <div>
                  <p className="font-bold text-[#221E1C]">{rev.author}</p>
                  <p>{rev.location}</p>
                </div>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
