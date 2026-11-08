import { prisma } from "@/lib/db";
import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";

async function CategoryList() {
  // We just fetch the categories from the DB to get the real links (/category/snacks)
  const dbCategories = await prisma.category.findMany();
  
  // We force the order to match your screenshot
  const orderedSlugs = ["snacks", "drinks", "dairy", "pantry", "frozen", "cleaning"];
  
  // We map your exact image requests to the slugs
  const categoryImages: Record<string, string> = {
    "snacks": "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=400&auto=format&fit=crop", // Chips
    "drinks": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=400&auto=format&fit=crop", // Drinks
    "dairy": "https://images.unsplash.com/photo-1550583724-b2692b85b150?q=80&w=400&auto=format&fit=crop", // Milk/Cheese
    "pantry": "https://images.unsplash.com/photo-1584473457409-ceb3f73f6f22?q=80&w=400&auto=format&fit=crop", // Pasta/Oil
    "frozen": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop", // Frozen veg
    "cleaning": "https://images.unsplash.com/photo-1584820927498-cafe3c1571cb?q=80&w=400&auto=format&fit=crop", // Cleaning
  };

  // Find the 6 categories to display
  const categoriesToRender = orderedSlugs.map(slug => 
    dbCategories.find(c => c.slug === slug)
  ).filter(Boolean); // Remove any that don't exist

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 w-full">
      {categoriesToRender.map((category) => (
        <Link 
          key={category!.id} 
          href={`/category/${category!.slug}`}
          className="group bg-white p-5 rounded-3xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer"
        >
          <div className="w-24 h-24 rounded-full mb-4 group-hover:scale-105 transition-transform overflow-hidden">
            <img 
              src={categoryImages[category!.slug] || categoryImages["other"]} 
              alt={category!.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <h3 className="text-[14px] font-bold text-[#1E3A8A] text-center leading-tight">
            {category!.name}
          </h3>
        </Link>
      ))}
      
      {/* The "More" Button */}
      <Link href="/categories" className="group bg-white p-5 rounded-3xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center mb-4 text-3xl font-bold group-hover:scale-105 transition-transform">
          ...
        </div>
        <h3 className="text-[14px] font-bold text-[#1E3A8A]">More</h3>
      </Link>
    </div>
  );
}
async function FeaturedProducts() {
  // Fetch from DB: Only featured, not hidden, and limit to 5
  const dbProducts = await prisma.product.findMany({
    where: { 
      isFeatured: true, 
      isHidden: false ,
      needsMaintenance: false // <--- ADD THIS LINE

    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  // Fallback demo products if no featured products are set
  const demoProducts = [
    { id: "1", name: "Fresh Bananas", price: 0.99, description: "Fresh and ripe", imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop" },
    { id: "2", name: "Full Cream Milk", price: 1.49, description: "1L Fresh Milk", imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=300&fit=crop" },
    { id: "3", name: "Fresh Bread", price: 0.75, description: "Baked daily", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop" },
    { id: "4", name: "Lay's Chips", price: 1.29, description: "Classic salted", imageUrl: "https://images.unsplash.com/photo-1566478989037-e924e9231b24?w=300&h=300&fit=crop" },
    { id: "5", name: "Fresh Apples", price: 1.99, description: "Red apples", imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6faa6?w=300&h=300&fit=crop" },
  ];

  const productsToRender = dbProducts.length > 0 ? dbProducts : demoProducts;

  return (
    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {productsToRender.map((product) => (
        <div key={product.id} className="bg-white rounded-[1.2rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
          
          <div className="h-32 bg-[#F8F9FA] w-full flex items-center justify-center relative p-2">
            <img src={product.imageUrl || ""} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
          
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-bold text-[#1E3A8A] text-[14px] mb-1 line-clamp-1">{product.name}</h3>
            
            <div className="mt-auto flex flex-col gap-2">
              <span className="font-extrabold text-[#1E3A8A] text-[16px]">${product.price.toFixed(2)}</span>
              <button className="w-full bg-[#F97316] text-white py-2 rounded-lg text-[12px] font-bold hover:bg-orange-600 transition flex items-center justify-center gap-1.5">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen pb-16 bg-[#F8F9FA]">
      
      {/* HERO SECTION */}
      <div className="relative w-full bg-[#FFF4EC] overflow-hidden flex items-center">
        
        {/* The image is displayed exactly as it is, but scaled nicely */}
        <img 
          src="/hero-bg.png" 
          alt="Supermarket Background" 
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
        />
        
        {/* White Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        
        {/* Content Container */}
        <div className="relative w-full max-w-[1400px] mx-auto px-8 md:px-16 lg:px-24 py-16 md:py-24 z-10">
          <div className="w-full max-w-lg">
            
            <h1 className="text-[30px] md:text-[42px] font-extrabold text-[#1E3A8A] leading-[1.2] mb-4 tracking-tight">
              Your Everyday <br/>
              <span className="text-[#F97316] whitespace-nowrap">Essentials, All in One Place</span>
            </h1>
            
            <p className="text-[#1E3A8A] text-[14px] md:text-[15px] font-semibold mb-6 flex items-center gap-2">
              Fresh products <span className="w-1 h-1 rounded-full bg-[#F97316]"></span> 
              Great prices <span className="w-1 h-1 rounded-full bg-[#F97316]"></span> 
              Always nearby
            </p>
            
            <Link href="#categories" className="bg-[#F97316] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 inline-flex items-center gap-2">
              Shop Now
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        </div>

      </div>

      {/* CATEGORIES SECTION */}
      <div id="categories" className="max-w-[1400px] mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[22px] font-bold text-[#1E3A8A]">Shop by Category</h2>
        </div>
        
        <Suspense fallback={<p className="text-gray-500 animate-pulse">Loading categories...</p>}>
          <CategoryList />
        </Suspense>
      </div>

      {/* FEATURED PRODUCTS & PROMO SECTION */}
      <div className="max-w-[1400px] mx-auto px-8 py-8 mt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[22px] font-bold text-[#1E3A8A]">Featured Products</h2>
            <div className="w-10 h-1 bg-[#F97316] mt-2 rounded-full"></div>
          </div>
          <Link href="/" className="text-sm font-bold text-[#1E3A8A] hover:text-[#F97316] flex items-center gap-1 transition">
            View All 
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>

        {/* FLEXBOX Layout: The products take up the left space, the banner takes the right */}
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* LEFT SIDE: 5 Product Cards */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-white rounded-[1.2rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col hover:shadow-lg transition-all duration-300 overflow-hidden">
                
                {/* Image */}
                <div className="h-32 bg-[#F8F9FA] w-full flex items-center justify-center">
                  <span className="text-4xl">🍌</span> 
                </div>
                
                {/* Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-[#1E3A8A] text-[14px] mb-1 line-clamp-1">Fresh Bananas</h3>
                  <p className="text-[11px] text-gray-500 mb-3">$0.99 / kg</p>
                  
                  <button className="mt-auto w-full bg-[#F97316] text-white py-2 rounded-lg text-[12px] font-bold hover:bg-orange-600 transition flex items-center justify-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE: The wider Promo Banner */}
          <div className="lg:w-[280px] shrink-0 bg-[#FFF4EC] rounded-[1.2rem] relative overflow-hidden flex flex-col justify-center shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)] min-h-[250px]">
             
             {/* Text Content */}
             <div className="p-6 relative z-10 h-full flex flex-col justify-start">
                <h3 className="text-[28px] font-extrabold text-[#1E3A8A] leading-[1.05] mb-2">
                  Fresh <br/><span className="text-[#F97316]">Every Day</span>
                </h3>
                <p className="text-[12px] text-gray-600 font-medium mb-4">Quality products<br/>for your family</p>
                <button className="bg-[#1E3A8A] text-white px-5 py-2 rounded-full text-[12px] font-bold hover:bg-blue-900 transition w-max">
                  Explore Now
                </button>
             </div>

             {/* Grocery Bag Image */}
             <div className="absolute bottom-0 right-0 w-full flex justify-end items-end pointer-events-none">
               <img 
                 src="/promo-bag.png" 
                 alt="Grocery Bag" 
                 className="w-[80%] object-contain translate-x-2 translate-y-2"
               />
             </div>
          </div>

        </div>
      </div>


            {/* LOCATION MAP SECTION */}
            <div className="max-w-[1400px] mx-auto px-8 mt-12 mb-4">
        <div className="bg-white rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden flex flex-col md:flex-row h-auto md:h-[350px]">
          
          {/* Left Side: Text & Info */}
          <div className="p-8 md:p-12 md:w-1/3 flex flex-col justify-center bg-[#FFF4EC]">
            <h2 className="text-[28px] font-extrabold text-[#1E3A8A] leading-tight mb-4">
              Visit our <br/><span className="text-[#F97316]">Mini Market</span>
            </h2>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Come say hi! We are located in the heart of the city. Fresh products, great prices, and a warm welcome await you.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-[#1E3A8A] font-bold text-sm">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Beirut, Lebanon
              </div>
              <div className="flex items-center gap-3 text-[#1E3A8A] font-bold text-sm">
                <svg className="w-5 h-5 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Open Daily: 8:00 AM - 11:00 PM
              </div>
            </div>

            <a 
              href="https://maps.google.com/?q=Beirut,Lebanon" // <--- REPLACE THIS WITH YOUR ACTUAL GOOGLE MAPS LINK
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#1E3A8A] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-900 transition text-center inline-block w-full"
            >
              Get Directions
            </a>
          </div>

          {/* Right Side: The Map */}
          <div className="md:w-2/3 h-[300px] md:h-full w-full bg-gray-200 relative">
            {/* THIS IS THE MAP IFRAME. Replace the src with your shop's exact embed link */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13250.6668!2d35.501775!3d33.8886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215880a78f%3A0x729182bae99836b4!2sBeirut%2C%20Lebanon!5e0!3m2!1sen!2slb!4v1700000000000!5m2!1sen!2slb" 
              width="100%" 
              height="100%" 
              style={{ border: 0, position: 'absolute', inset: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>

      

      {/* BOTTOM FEATURES BAR */}
      <div className="max-w-[1400px] mx-auto px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#1E3A8A] text-xs">Fast & Easy Shopping</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Get your essentials quickly</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#1E3A8A] text-xs">Quality Guaranteed</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">We care about your health</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#1E3A8A] text-xs">Great Prices</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">More value, every day</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-[#1E3A8A] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-[#1E3A8A] text-xs">Always Nearby</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Your local mini market</p>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}