"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdRestaurant, MdTableRestaurant, MdPerson, MdGroup } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsBoxSeam } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

export default function CustomerLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [restaurantCode, setRestaurantCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [orderType, setOrderType] = useState<"takeout" | "dine-in" | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState("");
  const [allergies, setAllergies] = useState("");

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantCode.trim()) {
      setIsLoading(true);
      // Simulate API call to verify restaurant code
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1500);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim()) {
      setStep(3);
    }
  };

  const handleOrderTypeSelect = (type: "takeout" | "dine-in") => {
    setOrderType(type);
    if (type === "takeout") {
      // Takeout goes to allergies step
      setTimeout(() => {
        setStep(6);
      }, 300);
    } else {
      // Dine-in needs table number
      setTimeout(() => {
        setStep(4);
      }, 300);
    }
  };

  const handleTableNumberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tableNumber.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(5);
      }, 1000);
    }
  };

  const handleGuestsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numberOfGuests.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setStep(6);
      }, 1000);
    }
  };

  const handleAllergiesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateToMenu();
  };

  const handleSkipAllergies = () => {
    navigateToMenu();
  };

  const navigateToMenu = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      
      // Log customer info to console
      if (orderType === "takeout") {
        console.log("Customer Order Details:", {
          name: customerName,
          type: "Takeout",
          allergies: allergies || "None",
          restaurantCode: restaurantCode
        });
      } else {
        console.log("Customer Order Details:", {
          name: customerName,
          type: "Dine-in",
          table: tableNumber,
          guests: numberOfGuests,
          allergies: allergies || "None",
          restaurantCode: restaurantCode
        });
      }
      
      // Navigate to menu page
      router.push("/customer/menu");
    }, 1000);
  };

  return (
    <div className="min-h-screen h-screen bg-[#F3E2C7] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#C84B3A] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#7FB24C] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Step 1: Restaurant Code */}
        {step === 1 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Restaurant Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#C84B3A] rounded-full">
                <MdRestaurant className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                WELCOME!
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Let's get you started
              </p>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Restaurant Code
                </label>
                <input
                  type="text"
                  value={restaurantCode}
                  onChange={(e) => setRestaurantCode(e.target.value.toUpperCase())}
                  placeholder="Enter code..."
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E09A3A] uppercase disabled:opacity-50"
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={!restaurantCode.trim() || isLoading}
                className="w-full bg-[#C84B3A] hover:bg-[#A83D2F] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">CHECKING CODE...</span>
                    <span className="sm:hidden">CHECKING...</span>
                  </>
                ) : (
                  'CONTINUE'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => window.history.back()}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back to home
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Customer Name */}
        {step === 2 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Person Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#7FB24C] rounded-full">
                <MdPerson className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                WHAT'S YOUR NAME?
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                So we know who you are
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E09A3A]"
                  maxLength={50}
                />
              </div>

              <button
                type="submit"
                disabled={!customerName.trim()}
                className="w-full bg-[#7FB24C] hover:bg-[#6FA23C] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)]"
              >
                CONTINUE
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Order Type Selection */}
        {step === 3 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                HOW'RE YOU DINING?
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Choose your order type
              </p>
            </div>

            <div className="space-y-4">
              {/* Takeout Button */}
              <button
                onClick={() => handleOrderTypeSelect("takeout")}
                className="group w-full bg-[#E09A3A] hover:bg-[#D08A2A] text-white rounded-xl p-6 sm:p-8 border-3 border-[#5A3A2E] shadow-[6px_6px_0px_rgba(90,58,46,0.4)] hover:shadow-[8px_8px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                    <BsBoxSeam className="w-7 h-7 sm:w-8 sm:h-8 text-[#E09A3A]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl sm:text-3xl font-black mb-1">TAKEOUT</h2>
                    <p className="text-sm sm:text-base font-bold opacity-90">Grab & go!</p>
                  </div>
                </div>
              </button>

              {/* Dine In Button */}
              <button
                onClick={() => handleOrderTypeSelect("dine-in")}
                className="group w-full bg-[#4A78A8] hover:bg-[#3A6088] text-white rounded-xl p-6 sm:p-8 border-3 border-[#5A3A2E] shadow-[6px_6px_0px_rgba(90,58,46,0.4)] hover:shadow-[8px_8px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center">
                    <MdTableRestaurant className="w-7 h-7 sm:w-8 sm:h-8 text-[#4A78A8]" />
                  </div>
                  <div className="flex-1 text-left">
                    <h2 className="text-2xl sm:text-3xl font-black mb-1">DINE IN</h2>
                    <p className="text-sm sm:text-base font-bold opacity-90">Eat here!</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(1)}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Table Number (only for dine-in) */}
        {step === 4 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Table Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#4A78A8] rounded-full">
                <MdTableRestaurant className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                WHAT'S YOUR TABLE?
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Enter your table number
              </p>
            </div>

            <form onSubmit={handleTableNumberSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Table Number
                </label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="e.g., 5 or A12"
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E09A3A] uppercase disabled:opacity-50"
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={!tableNumber.trim() || isLoading}
                className="w-full bg-[#4A78A8] hover:bg-[#3A6088] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">LOADING PORTAL...</span>
                    <span className="sm:hidden">LOADING...</span>
                  </>
                ) : (
                  "LET'S EAT!"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(3)}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Number of Guests (only for dine-in) */}
        {step === 5 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Group Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#9DBB6F] rounded-full">
                <MdGroup className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                HOW MANY GUESTS?
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Including yourself
              </p>
            </div>

            <form onSubmit={handleGuestsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Number of Guests
                </label>
                <input
                  type="number"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(e.target.value)}
                  placeholder="e.g., 2"
                  disabled={isLoading}
                  min="1"
                  max="20"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E09A3A] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={!numberOfGuests.trim() || isLoading}
                className="w-full bg-[#9DBB6F] hover:bg-[#8DAB5F] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">LOADING PORTAL...</span>
                    <span className="sm:hidden">LOADING...</span>
                  </>
                ) : (
                  'CONTINUE'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(4)}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Allergies/Dietary Preferences (optional for everyone) */}
        {step === 6 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Warning Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#E09A3A] rounded-full">
                <IoWarningOutline className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#C84B3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                ANY ALLERGIES?
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Let us know so we can help
              </p>
              <p className="text-xs sm:text-sm text-[#5A3A2E] opacity-75 mt-2">
                (Optional - you can skip this)
              </p>
            </div>

            <form onSubmit={handleAllergiesSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Allergies or Dietary Restrictions
                </label>
                <textarea
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="e.g., Peanuts, gluten, dairy..."
                  disabled={isLoading}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#E09A3A] disabled:opacity-50 resize-none"
                  maxLength={200}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSkipAllergies}
                  disabled={isLoading}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)]"
                >
                  SKIP
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#E09A3A] hover:bg-[#D08A2A] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                      <span className="hidden sm:inline">LOADING...</span>
                    </>
                  ) : (
                    'CONTINUE'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(orderType === "takeout" ? 3 : 5)}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-2">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 1 ? 'bg-[#C84B3A]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 2 ? 'bg-[#C84B3A]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 3 ? 'bg-[#C84B3A]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${(step === 4 || step === 5) ? 'bg-[#C84B3A]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 6 ? 'bg-[#C84B3A]' : 'bg-transparent'}`}></div>
        </div>
      </div>
    </div>
  );
}
