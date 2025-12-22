"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdRestaurant, MdVpnKey, MdLock, MdCheckCircle } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { HiRefresh } from "react-icons/hi";

export default function CreateRestaurant() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantCode, setRestaurantCode] = useState("");
  const [ownerPin, setOwnerPin] = useState("");
  const [ownerPinConfirm, setOwnerPinConfirm] = useState("");
  const [staffPin, setStaffPin] = useState("");
  const [staffPinConfirm, setStaffPinConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantName.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        // Auto-generate code
        const code = generateRestaurantCode();
        setRestaurantCode(code);
        setStep(2);
      }, 800);
    }
  };

  const generateRestaurantCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleRegenerateCode = () => {
    const newCode = generateRestaurantCode();
    setRestaurantCode(newCode);
  };

  const handleCodeContinue = () => {
    setStep(3);
  };

  const handlePinsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerPin === ownerPinConfirm && staffPin === staffPinConfirm && 
        ownerPin.length === 4 && staffPin.length === 4) {
      setIsLoading(true);
      // Simulate API call to create restaurant
      setTimeout(() => {
        setIsLoading(false);
        setStep(4);
      }, 1500);
    }
  };

  const handleFinish = () => {
    console.log("Restaurant Created:", {
      name: restaurantName,
      code: restaurantCode,
      ownerPin: ownerPin,
      staffPin: staffPin
    });
    // Navigate to kitchen dashboard
    router.push("/kitchen/dashboard");
  };

  return (
    <div className="min-h-screen h-screen bg-[#F3E2C7] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#7FB24C] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#4A78A8] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Step 1: Restaurant Name */}
        {step === 1 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#7FB24C] rounded-full">
                <MdRestaurant className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#7FB24C] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                CREATE RESTAURANT
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Let's get started!
              </p>
            </div>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g., Joe's Pizza"
                  disabled={isLoading}
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#7FB24C] disabled:opacity-50"
                  maxLength={50}
                />
              </div>

              <button
                type="submit"
                disabled={!restaurantName.trim() || isLoading}
                className="w-full bg-[#7FB24C] hover:bg-[#6FA23C] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    CREATING...
                  </>
                ) : (
                  'CONTINUE'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/kitchen")}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Restaurant Code Generated */}
        {step === 2 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#E09A3A] rounded-full">
                <MdVpnKey className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#E09A3A] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                YOUR RESTAURANT CODE
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Share this with staff & customers!
              </p>
            </div>

            <div className="space-y-4">
              {/* Code Display */}
              <div className="bg-white border-4 border-[#5A3A2E] rounded-xl p-6 text-center">
                <p className="text-sm font-black text-[#5A3A2E] mb-2 uppercase opacity-75">
                  Restaurant Code
                </p>
                <p className="text-4xl sm:text-5xl font-black text-[#E09A3A] tracking-widest mb-4">
                  {restaurantCode}
                </p>
                <button
                  onClick={handleRegenerateCode}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-[#5A3A2E] font-bold text-sm rounded-lg border-2 border-[#5A3A2E] transition-all"
                >
                  <HiRefresh className="w-4 h-4" />
                  Generate New Code
                </button>
              </div>

              <div className="bg-[#FFF7EB] border-2 border-[#E09A3A] rounded-lg p-4">
                <p className="text-xs sm:text-sm text-[#5A3A2E] font-bold">
                  💡 <strong>Important:</strong> Save this code! Staff will need it to access the kitchen, and customers will use it to place orders.
                </p>
              </div>

              <button
                onClick={handleCodeContinue}
                className="w-full bg-[#E09A3A] hover:bg-[#D08A2A] text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1"
              >
                CONTINUE
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

        {/* Step 3: PIN Setup */}
        {step === 3 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#4A78A8] rounded-full">
                <MdLock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#4A78A8] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                SETUP PINS
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Secure your kitchen access
              </p>
            </div>

            <form onSubmit={handlePinsSubmit} className="space-y-6">
              {/* Owner PIN */}
              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-3 uppercase">
                  Owner PIN (Your PIN)
                </label>
                <input
                  type="password"
                  value={ownerPin}
                  onChange={(e) => setOwnerPin(e.target.value)}
                  placeholder="4-digit PIN"
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] disabled:opacity-50 text-center tracking-widest mb-2"
                  maxLength={4}
                />
                <input
                  type="password"
                  value={ownerPinConfirm}
                  onChange={(e) => setOwnerPinConfirm(e.target.value)}
                  placeholder="Confirm PIN"
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] disabled:opacity-50 text-center tracking-widest"
                  maxLength={4}
                />
                {ownerPin && ownerPinConfirm && ownerPin !== ownerPinConfirm && (
                  <p className="text-xs text-[#C84B3A] font-bold mt-1">PINs don't match!</p>
                )}
              </div>

              {/* Staff PIN */}
              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-3 uppercase">
                  Staff PIN (For employees)
                </label>
                <input
                  type="password"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="4-digit PIN"
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] disabled:opacity-50 text-center tracking-widest mb-2"
                  maxLength={4}
                />
                <input
                  type="password"
                  value={staffPinConfirm}
                  onChange={(e) => setStaffPinConfirm(e.target.value)}
                  placeholder="Confirm PIN"
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] disabled:opacity-50 text-center tracking-widest"
                  maxLength={4}
                />
                {staffPin && staffPinConfirm && staffPin !== staffPinConfirm && (
                  <p className="text-xs text-[#C84B3A] font-bold mt-1">PINs don't match!</p>
                )}
              </div>

              <button
                type="submit"
                disabled={
                  !ownerPin || !ownerPinConfirm || !staffPin || !staffPinConfirm ||
                  ownerPin !== ownerPinConfirm || staffPin !== staffPinConfirm ||
                  ownerPin.length !== 4 || staffPin.length !== 4 || isLoading
                }
                className="w-full bg-[#4A78A8] hover:bg-[#3A6088] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">CREATING RESTAURANT...</span>
                    <span className="sm:hidden">CREATING...</span>
                  </>
                ) : (
                  'CREATE RESTAURANT'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(2)}
                disabled={isLoading}
                className="text-xs sm:text-sm font-bold text-[#5A3A2E] opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30"
              >
                ← Back
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success / Done */}
        {step === 4 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#7FB24C] rounded-full animate-bounce">
                <MdCheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#7FB24C] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                ALL SET!
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E] mb-4">
                Your restaurant is ready to go
              </p>
            </div>

            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-white border-3 border-[#5A3A2E] rounded-xl p-4 sm:p-6">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-black text-[#5A3A2E] opacity-60 uppercase">Restaurant Name</p>
                    <p className="text-lg sm:text-xl font-black text-[#5A3A2E]">{restaurantName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#5A3A2E] opacity-60 uppercase">Restaurant Code</p>
                    <p className="text-2xl sm:text-3xl font-black text-[#E09A3A] tracking-widest">{restaurantCode}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FFF7EB] border-2 border-[#7FB24C] rounded-lg p-4">
                <p className="text-xs sm:text-sm text-[#5A3A2E] font-bold">
                  ✅ PINs have been set successfully<br/>
                  ✅ You can now access the kitchen dashboard<br/>
                  ✅ Share the code with your staff and customers
                </p>
              </div>

              <button
                onClick={handleFinish}
                className="w-full bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1"
              >
                GO TO KITCHEN DASHBOARD
              </button>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-2">
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 1 ? 'bg-[#7FB24C]' : step > 1 ? 'bg-[#7FB24C]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 2 ? 'bg-[#7FB24C]' : step > 2 ? 'bg-[#7FB24C]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 3 ? 'bg-[#7FB24C]' : step > 3 ? 'bg-[#7FB24C]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 4 ? 'bg-[#7FB24C]' : 'bg-transparent'}`}></div>
        </div>
      </div>
    </div>
  );
}
