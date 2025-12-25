"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdRestaurant, MdLock } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function KitchenLogin() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [restaurantCode, setRestaurantCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [staffPin, setStaffPin] = useState("");
  const [error, setError] = useState("");
  const [restaurantData, setRestaurantData] = useState<any>(null);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantCode.trim()) {
      setIsLoading(true);
      setError("");
      
      try {
        console.log('[KITCHEN] Starting restaurant verification for code:', restaurantCode);
        const apiUrl = `/api/restaurants/${restaurantCode}`;
        console.log('[KITCHEN] API URL:', apiUrl);
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('[KITCHEN] Request timeout - aborting');
          controller.abort();
        }, 10000); // 10 second timeout
        
        console.log('[KITCHEN] Sending fetch request...');
        const response = await fetch(apiUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        clearTimeout(timeoutId);
        
        console.log('[KITCHEN] Response received, status:', response.status);
        const data = await response.json();
        console.log('[KITCHEN] Response data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Restaurant not found');
        }

        console.log('[KITCHEN] Restaurant found:', data);
        setRestaurantData(data.restaurant);
        setIsLoading(false);
        setStep(2);
      } catch (err: any) {
        console.error('[KITCHEN] Error verifying code:', err);
        if (err.name === 'AbortError') {
          setError('Request timeout - please check your connection and try again');
        } else {
          setError(err.message || 'Invalid restaurant code');
        }
        setIsLoading(false);
      }
    }
  };

  const handleCreateRestaurant = () => {
    // Navigate to restaurant creation flow
    router.push("/kitchen/create");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (staffPin.trim()) {
      setIsLoading(true);
      setError("");
      
      try {
        console.log('[KITCHEN] Starting PIN verification');
        
        // Add timeout to fetch
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('[KITCHEN] PIN verification timeout - aborting');
          controller.abort();
        }, 10000); // 10 second timeout
        
        console.log('[KITCHEN] Sending PIN verification request...');
        const response = await fetch('/api/auth/verify-pin', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: restaurantCode,
            pin: staffPin,
          }),
        });
        clearTimeout(timeoutId);

        console.log('[KITCHEN] PIN verification response status:', response.status);
        const data = await response.json();
        console.log('[KITCHEN] PIN verification response data:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Invalid PIN');
        }

        console.log('[KITCHEN] Authentication successful:', data);
        
        // Store restaurant info in sessionStorage
        sessionStorage.setItem('restaurantId', data.restaurantId);
        sessionStorage.setItem('restaurantCode', data.restaurant.code);
        sessionStorage.setItem('restaurantName', data.restaurant.name);
        sessionStorage.setItem('userRole', data.role);
        
        setIsLoading(false);
        
        // Navigate based on role
        if (data.role === 'owner' || data.role === 'manager') {
          router.push('/kitchen/admin');
        } else {
          router.push('/kitchen/dashboard');
        }
      } catch (err: any) {
        console.error('Error verifying PIN:', err);
        setError(err.message || 'Invalid PIN');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#F3E2C7] relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#4A78A8] opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#C84B3A] opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Step 1: Restaurant Code */}
        {step === 1 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Restaurant Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#4A78A8] rounded-full">
                <MdRestaurant className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#4A78A8] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                KITCHEN ACCESS
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Join your restaurant
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
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] uppercase disabled:opacity-50"
                  maxLength={10}
                />
              </div>

              {error && (
                <div className="bg-[#C84B3A] border-2 border-[#5A3A2E] rounded-lg p-3 text-white text-sm font-bold">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!restaurantCode.trim() || isLoading}
                className="w-full bg-[#4A78A8] hover:bg-[#3A6088] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">CHECKING CODE...</span>
                    <span className="sm:hidden">CHECKING...</span>
                  </>
                ) : (
                  'JOIN KITCHEN'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-[#5A3A2E] opacity-20"></div>
                </div>
                <div className="relative flex justify-center text-xs sm:text-sm">
                  <span className="px-2 bg-[#FFF7EB] text-[#5A3A2E] font-bold opacity-60">OR</span>
                </div>
              </div>

              <button
                onClick={handleCreateRestaurant}
                disabled={isLoading}
                className="mt-4 w-full bg-[#7FB24C] hover:bg-[#6FA23C] disabled:bg-gray-400 text-white font-black text-base sm:text-lg py-3 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0"
              >
                CREATE NEW RESTAURANT
              </button>
            </div>

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

        {/* Step 2: Staff PIN Entry */}
        {step === 2 && (
          <div className="bg-[#FFF7EB] border-3 sm:border-4 border-[#5A3A2E] rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_rgba(90,58,46,0.4)] sm:shadow-[8px_8px_0px_rgba(90,58,46,0.4)]">
            <div className="text-center mb-6">
              {/* Lock Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mb-3 bg-[#4A78A8] rounded-full">
                <MdLock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#4A78A8] mb-2 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                ENTER YOUR PIN
              </h1>
              <p className="text-base sm:text-lg font-bold text-[#5A3A2E]">
                Staff authentication required
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-black text-[#5A3A2E] mb-2 uppercase">
                  Staff PIN
                </label>
                <input
                  type="password"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  placeholder="Enter 4-digit PIN..."
                  disabled={isLoading}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full px-3 sm:px-4 py-3 text-base sm:text-lg font-bold text-[#5A3A2E] bg-white border-3 border-[#5A3A2E] rounded-lg sm:rounded-xl focus:outline-none focus:ring-4 focus:ring-[#4A78A8] disabled:opacity-50 text-center tracking-widest"
                  maxLength={4}
                />
              </div>

              {error && (
                <div className="bg-[#C84B3A] border-2 border-[#5A3A2E] rounded-lg p-3 text-white text-sm font-bold">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={staffPin.length !== 4 || isLoading}
                className="w-full bg-[#4A78A8] hover:bg-[#3A6088] disabled:bg-gray-400 text-white font-black text-lg sm:text-xl py-3 sm:py-4 rounded-lg sm:rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all duration-200 hover:-translate-y-1 disabled:hover:translate-y-0 disabled:shadow-[4px_4px_0px_rgba(90,58,46,0.4)] flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin h-5 w-5" />
                    <span className="hidden sm:inline">VERIFYING PIN...</span>
                    <span className="sm:hidden">VERIFYING...</span>
                  </>
                ) : (
                  'ACCESS KITCHEN'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep(1)}
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
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 1 ? 'bg-[#4A78A8]' : 'bg-transparent'}`}></div>
          <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#5A3A2E] ${step === 2 ? 'bg-[#4A78A8]' : 'bg-transparent'}`}></div>
        </div>
      </div>
    </div>
  );
}
