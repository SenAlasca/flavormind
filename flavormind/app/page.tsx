"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen h-screen bg-[#F3E2C7] relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-shape absolute top-20 left-10 w-32 h-32 bg-[#C84B3A] opacity-20 rounded-full blur-3xl animate-float"></div>
        <div className="floating-shape absolute top-40 right-20 w-40 h-40 bg-[#4A78A8] opacity-20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="floating-shape absolute bottom-20 left-1/4 w-36 h-36 bg-[#7FB24C] opacity-20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="floating-shape absolute bottom-40 right-1/3 w-44 h-44 bg-[#E09A3A] opacity-20 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Main content */}
      <main className="relative z-10 flex h-screen flex-col items-center justify-between px-4 sm:px-6 py-6 sm:py-8">
        {/* Logo/Title area with animation */}
        <div className="text-center animate-fade-in-down">
          <div className="text-3xl sm:text-4xl md:text-5xl mb-1 animate-bounce-subtle">🍔✨🌮</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#C84B3A] mb-2 sm:mb-3 tracking-tight drop-shadow-[4px_4px_0px_rgba(90,58,46,0.3)] transform -rotate-2 animate-pulse-subtle">
            FLAVORMIND
          </h1>
          <div className="relative inline-block mb-2 sm:mb-3">
            <div className="absolute -inset-2 bg-[#E09A3A] transform rotate-1 rounded-lg"></div>
            <p className="relative text-xs sm:text-sm md:text-base lg:text-lg font-black text-[#5A3A2E] px-3 sm:px-4 py-1.5 sm:py-2 bg-[#FFF7EB] border-2 sm:border-3 border-[#5A3A2E] rounded-lg shadow-lg transform -rotate-1">
              Customer & Kitchen Order Management
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 mt-2 sm:mt-3">
            <div className="px-2 sm:px-3 py-1 bg-[#7FB24C] text-white text-xs sm:text-sm font-bold rounded-full border-2 border-[#5A3A2E] shadow-md transform rotate-2">
              PICK YOUR PATH! 👇
            </div>
          </div>
        </div>

        {/* Portal buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl animate-fade-in-up px-2">
          {/* Customer Portal Button */}
          <button
            onClick={() => router.push("/customer")}
            className="group relative flex-1 bg-[#C84B3A] hover:bg-[#A83D2F] text-[#FFF7EB] rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] hover:shadow-[10px_10px_0px_rgba(90,58,46,0.6)] border-3 border-[#5A3A2E] transition-all duration-200 hover:-translate-y-2 hover:translate-x-1 transform hover:rotate-1"
          >
            <div className="relative z-10 text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 animate-bounce-subtle">🍕</div>
              <div className="bg-[#FFF7EB] text-[#C84B3A] inline-block px-2 py-0.5 sm:py-1 rounded-lg border-2 border-[#5A3A2E] mb-2 font-bold text-xs sm:text-sm transform -rotate-2">
                HUNGRY?
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">I'M A CUSTOMER!</h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold opacity-95 mb-2 sm:mb-3">Browse the menu & grab some grub!</p>
              <div className="mt-2 text-lg sm:text-xl md:text-2xl font-black">
                👉 <span className="inline-block">LET'S GO!</span> 👈
              </div>
            </div>
          </button>

          {/* Kitchen Portal Button */}
          <button
            onClick={() => router.push("/kitchen")}
            className="group relative flex-1 bg-[#4A78A8] hover:bg-[#3A6088] text-[#FFF7EB] rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] hover:shadow-[10px_10px_0px_rgba(90,58,46,0.6)] border-3 border-[#5A3A2E] transition-all duration-200 hover:-translate-y-2 hover:translate-x-1 transform hover:-rotate-1"
          >
            <div className="relative z-10 text-center">
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 sm:mb-3 animate-bounce-subtle-delayed">👨‍🍳</div>
              <div className="bg-[#FFF7EB] text-[#4A78A8] inline-block px-2 py-0.5 sm:py-1 rounded-lg border-2 border-[#5A3A2E] mb-2 font-bold text-xs sm:text-sm transform rotate-2">
                CHEF MODE
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black mb-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.3)]">I'M ON THE LINE!</h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold opacity-95 mb-2 sm:mb-3">Fire up orders & run the kitchen!</p>
              <div className="mt-2 text-lg sm:text-xl md:text-2xl font-black">
                🔪 <span className="inline-block">LET'S COOK!</span> 🍳
              </div>
            </div>
          </button>
        </div>

        {/* Footer credit */}
        <div className="text-center animate-fade-in-up pb-2">
          <p className="text-xs sm:text-sm text-[#5A3A2E] opacity-75">
            This project has been created for the <span className="font-bold text-[#C84B3A]">FlavorTown Hackable</span> event
          </p>
        </div>
      </main>
    </div>
  );
}
