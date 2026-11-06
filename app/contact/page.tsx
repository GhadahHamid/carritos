"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate sending an email/request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-16 pt-12">
      <div className="max-w-[1200px] mx-auto px-8">
        
        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Side: Text Info */}
          <div className="pt-4">
            <h1 className="text-[40px] font-extrabold text-[#1E3A8A] leading-[1.1] mb-6">
              Get in touch <br/>
              <span className="text-[#F97316]">with Carritos.</span>
            </h1>
            <p className="text-gray-600 text-[16px] leading-relaxed mb-8 max-w-md">
              Have a question about your order, need help finding something, or just want to say hi? Send us a message and we'll get back to you as soon as possible.
            </p>

            {/* Special Note for Product Requests */}
            <div className="bg-[#FFF4EC] border border-[#F97316]/20 p-6 rounded-[1.2rem] mb-8">
              <h3 className="font-bold text-[#1E3A8A] text-[18px] mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Looking for a specific product?
              </h3>
              <p className="text-[14px] text-gray-600 leading-relaxed">
                If you can't find an item you need in our store, let us know! We take product requests and will do our best to stock them for you on our next supplier run.
              </p>
            </div>

            {/* Contact Details (Optional but looks pro) */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1E3A8A]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <span className="font-medium">+961 XX XXX XXX</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center text-[#1E3A8A]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="font-medium">hello@carritos.com</span>
              </div>
            </div>
          </div>

          {/* Right Side: The Form */}
          <div className="bg-white p-8 md:p-10 rounded-[1.5rem] shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] border border-gray-100 w-full relative">
            {submitted ? (
              <div className="text-center py-20 h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We will get back to you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-[#F97316] font-bold hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="John Doe"
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="+961 XX XXX XXX"
                      className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="john@example.com"
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-1.5">Message or Request</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Tell us what you need or if you have any suggestions..."
                    className="w-full bg-[#F8F9FA] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#F97316] text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 flex justify-center items-center mt-2"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}