import React, { useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi2';

/* ─── TAG ─── */
const Tag = ({ children }) => (
  <div className="inline-flex items-center gap-2 mb-5">
    <div className="w-7 h-[2px] rounded-full bg-amber-500" />
    <span style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#d97706" }}>
      {children}
    </span>
  </div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div style={{ borderTop: "1px solid #efefef" }}>
      <button
        onClick={onClick}
        className="w-full text-left bg-transparent border-none py-5 cursor-pointer outline-none"
      >
        <div className="flex items-center justify-between gap-4">
          <span
            className="text-sm font-medium transition-colors"
            style={{ color: isOpen ? "#111" : "#555", fontFamily: "'DM Serif Display', serif", fontSize: "15px" }}
          >
            {question}
          </span>
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border transition-all duration-300"
            style={{
              borderColor: isOpen ? "#111" : "#ddd",
              background: isOpen ? "#111" : "transparent",
            }}
          >
            <HiOutlineChevronDown
              size={13}
              style={{
                color: isOpen ? "#fff" : "#888",
                transform: isOpen ? "rotate(180deg)" : "none",
                transition: "transform .35s",
              }}
            />
          </div>
        </div>
      </button>
      <div
        style={{
          overflow: "hidden",
          maxHeight: isOpen ? "240px" : "0",
          transition: "max-height .45s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <p className="pb-5" style={{ fontSize: "14px", lineHeight: 1.8, color: "#6b7280", maxWidth: "600px" }}>
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
    <section className="py-[110px] px-4 md:px-8" style={{ background: "#f9fafb" }}>
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-16 items-start">

          {/* Left side - Sticky */}
          <div className="lg:sticky lg:top-20">
            <Tag>FAQ</Tag>
            <h2 style={{ 
              fontSize: 'clamp(30px, 3.8vw, 54px)', 
              fontWeight: 700, 
              lineHeight: 1.06, 
              letterSpacing: '-0.03em', 
              marginBottom: '24px', 
              color: '#111', 
              fontFamily: "'DM Serif Display', serif"
            }}>
              Questions?{" "}
              <em style={{ fontStyle: 'italic', color: '#d97706' }}>We've got answers.</em>
            </h2>
            <p className="mb-8" style={{ fontSize: "15px", lineHeight: 1.8, color: "#6b7280" }}>
              Find quick answers to common questions about our services, booking process, pricing, and warranty policies.
            </p>
            <div className="flex flex-wrap gap-2 mb-9">
              {["Free diagnosis", "30-day warranty", "Same-day service", "Verified technicians"].map((l, i) => (
                <span key={i} className="inline-flex items-center gap-2 rounded-full py-2 px-4"
                  style={{ fontSize: "11px", fontWeight: 500, background: "#f9fafb", border: "1px solid #f3f4f6", color: "#6b7280" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                  {l}
                </span>
              ))}
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=85"
                alt="Expert Technician"
                className="w-full object-cover rounded-[20px]"
                style={{ border: "1px solid #efefef", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
              />
            </div>
          </div>

          {/* Right side - FAQ List */}
          <div>
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={index === openIndex}
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
              />
            ))}
            <div style={{ borderTop: "1px solid #efefef" }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
