import React, { useState } from 'react';

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors px-4 -mx-4"
      >
        <span className="text-base font-semibold text-slate-900 pr-8">
          {question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isOpen ? 'bg-emerald-500 text-white rotate-180' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-slate-600 leading-relaxed px-4">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What services do you offer?",
      answer: "We offer comprehensive appliance repair services including AC repair, refrigerator repair, washing machine repair, microwave repair, and more. Our certified technicians can handle all major brands and models."
    },
    {
      question: "How do I book a service?",
      answer: "Booking is simple! Click on 'Book Now', select your appliance type, choose a convenient time slot, and confirm your booking. You'll receive instant confirmation with technician details."
    },
    {
      question: "Are your technicians certified?",
      answer: "Yes, all our technicians are thoroughly vetted, background-checked, and certified with minimum 5+ years of experience. They undergo regular training to stay updated with the latest technologies."
    },
    {
      question: "What is the warranty on repairs?",
      answer: "We provide a 30-day service warranty on all repairs. This covers both labor and any replacement parts used. If the same issue persists within 30 days, we'll fix it at no additional cost."
    },
    {
      question: "How long does a typical service take?",
      answer: "Most repairs are completed within 1-2 hours. Complex issues might take longer, but our technician will provide an accurate time estimate after diagnosis."
    },
    {
      question: "Do you charge for diagnosis?",
      answer: "No, diagnosis is completely free! You only pay if you decide to proceed with the repair. The technician will explain the issue and provide a transparent quote before starting any work."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major payment methods including credit/debit cards, UPI, net banking, and cash. Payment is collected only after you're satisfied with the service."
    },
    {
      question: "Can I reschedule my appointment?",
      answer: "Yes, you can reschedule your appointment up to 2 hours before the scheduled time through your account dashboard or by contacting our customer support team."
    },
    {
      question: "Which areas do you serve?",
      answer: "We currently operate in 20+ major cities across India. Enter your pincode during booking to check if we service your area. We're expanding rapidly to more locations."
    },
    {
      question: "What safety measures do you follow?",
      answer: "Our technicians follow strict safety protocols including wearing masks, sanitization before and after service, maintaining social distance, and carrying sanitized tools and equipment."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-500">
            Got questions? We've got answers. Find what you need to know about our services.
          </p>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-2xl">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={index === openIndex}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Still have questions?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            Contact our support team
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
