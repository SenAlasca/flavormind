"use client";

import { useState } from "react";
import { MdShoppingCart, MdRestaurantMenu, MdPerson } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { IoFastFood } from "react-icons/io5";

export default function CustomerMenu() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <div className="min-h-screen bg-[#F3E2C7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#C84B3A] border-b-4 border-[#5A3A2E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MdRestaurantMenu className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">MENU</h1>
                <p className="text-xs sm:text-sm font-bold text-white opacity-90">Restaurant Name</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="relative p-2 sm:p-3 bg-white rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <MdShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#C84B3A]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7FB24C] text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#5A3A2E]">
                    {cartCount}
                  </span>
                )}
              </button>
              <button className="p-2 sm:p-3 bg-white rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
                <MdPerson className="w-5 h-5 sm:w-6 sm:h-6 text-[#C84B3A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Search Bar Placeholder */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex items-center gap-3">
              <BsSearch className="w-5 h-5 text-[#5A3A2E] opacity-60" />
              <input
                type="text"
                placeholder="Search menu items..."
                className="flex-1 bg-transparent text-base sm:text-lg font-bold text-[#5A3A2E] placeholder:text-[#5A3A2E] placeholder:opacity-40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs Placeholder */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <h2 className="text-lg sm:text-xl font-black text-[#C84B3A] mb-3">CATEGORIES</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Appetizers', 'Mains', 'Desserts', 'Drinks'].map((category) => (
                <button
                  key={category}
                  className="px-3 sm:px-4 py-2 bg-[#E09A3A] hover:bg-[#D08A2A] text-white font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] shadow-[2px_2px_0px_rgba(90,58,46,0.4)] hover:shadow-[3px_3px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-0.5"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid Placeholder */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#C84B3A] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
            MENU ITEMS
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.5)] transition-all hover:-translate-y-1"
              >
                {/* Image Placeholder */}
                <div className="w-full h-32 sm:h-40 bg-[#E09A3A] rounded-lg border-2 border-[#5A3A2E] mb-3 flex items-center justify-center">
                  <IoFastFood className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" />
                </div>
                
                {/* Item Info */}
                <h3 className="text-lg sm:text-xl font-black text-[#5A3A2E] mb-1">
                  Item Name {item}
                </h3>
                <p className="text-xs sm:text-sm text-[#5A3A2E] opacity-75 mb-2">
                  Description of the menu item goes here...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-black text-[#C84B3A]">$12.99</span>
                  <button className="px-3 sm:px-4 py-2 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] shadow-[2px_2px_0px_rgba(90,58,46,0.4)] hover:shadow-[3px_3px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-0.5">
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary Placeholder (sticky on mobile) */}
        <div className="sticky bottom-4 bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[6px_6px_0px_rgba(90,58,46,0.4)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm sm:text-base font-black text-[#5A3A2E] opacity-75">CART TOTAL</p>
              <p className="text-2xl sm:text-3xl font-black text-[#C84B3A]">$0.00</p>
            </div>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black text-base sm:text-xl rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-1">
              CHECKOUT
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
