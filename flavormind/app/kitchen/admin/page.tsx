"use client";

import { useState } from "react";
import { MdRestaurant, MdLogout, MdEdit, MdDelete, MdRefresh, MdSave } from "react-icons/md";
import { IoSettings, IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [restaurantName, setRestaurantName] = useState("Restaurant Name");
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [restaurantCode, setRestaurantCode] = useState("ABC123");
  const [newCode, setNewCode] = useState("ABC123");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const generateNewCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    setNewCode(code);
  };

  const saveRestaurantName = () => {
    console.log("Saving restaurant name:", restaurantName);
    setIsEditingName(false);
    // TODO: API call to update restaurant name
  };

  const saveRestaurantCode = () => {
    console.log("Saving restaurant code:", newCode);
    setRestaurantCode(newCode);
    setIsEditingCode(false);
    // TODO: API call to update restaurant code
  };

  const deleteRestaurant = () => {
    console.log("Deleting restaurant...");
    // TODO: API call to delete restaurant
    router.push("/kitchen");
  };

  return (
    <div className="min-h-screen bg-[#F3E2C7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#4A78A8] border-b-4 border-[#5A3A2E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/kitchen/dashboard")}
                className="p-2 bg-white rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <IoArrowBack className="w-5 h-5 text-[#4A78A8]" />
              </button>
              <MdRestaurant className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">ADMIN DASHBOARD</h1>
                <p className="text-xs sm:text-sm font-bold text-white opacity-90">Restaurant Management</p>
              </div>
            </div>
            
            <button
              onClick={() => router.push("/kitchen")}
              className="p-2 sm:p-3 bg-[#C84B3A] hover:bg-[#A83D2F] rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <MdLogout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="space-y-6">
          {/* Restaurant Name Card */}
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-6 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-[#4A78A8] flex items-center gap-2">
                <MdRestaurant className="w-6 h-6" />
                RESTAURANT NAME
              </h2>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="px-4 py-2 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MdEdit className="w-4 h-4" />
                  EDIT
                </button>
              )}
            </div>

            {isEditingName ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-3 border-[#5A3A2E] rounded-xl text-lg font-bold text-[#5A3A2E] focus:outline-none focus:ring-2 focus:ring-[#4A78A8]"
                  placeholder="Enter restaurant name"
                />
                <div className="flex gap-3">
                  <button
                    onClick={saveRestaurantName}
                    className="flex-1 py-3 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <MdSave className="w-5 h-5" />
                    SAVE
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingName(false);
                      setRestaurantName("Restaurant Name");
                    }}
                    className="flex-1 py-3 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-3xl font-black text-[#5A3A2E]">{restaurantName}</p>
            )}
          </div>

          {/* Restaurant Code Card */}
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-6 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-[#E09A3A] flex items-center gap-2">
                <IoSettings className="w-6 h-6" />
                ACCESS CODE
              </h2>
              {!isEditingCode && (
                <button
                  onClick={() => setIsEditingCode(true)}
                  className="px-4 py-2 bg-[#E09A3A] hover:bg-[#D08A2A] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MdEdit className="w-4 h-4" />
                  CHANGE
                </button>
              )}
            </div>

            {isEditingCode ? (
              <div className="space-y-4">
                <div className="bg-white border-3 border-[#5A3A2E] rounded-xl p-4">
                  <p className="text-xs font-black text-[#5A3A2E] opacity-60 mb-2">NEW CODE</p>
                  <p className="text-4xl font-black text-[#E09A3A] tracking-widest text-center">{newCode}</p>
                </div>
                <button
                  onClick={generateNewCode}
                  className="w-full py-3 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <MdRefresh className="w-5 h-5" />
                  GENERATE NEW CODE
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={saveRestaurantCode}
                    className="flex-1 py-3 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  >
                    <MdSave className="w-5 h-5" />
                    SAVE
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingCode(false);
                      setNewCode(restaurantCode);
                    }}
                    className="flex-1 py-3 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-black text-[#5A3A2E] opacity-60 mb-2">CURRENT CODE</p>
                <p className="text-4xl font-black text-[#E09A3A] tracking-widest">{restaurantCode}</p>
              </div>
            )}
          </div>

          {/* Danger Zone Card */}
          <div className="bg-[#C84B3A] border-3 border-[#5A3A2E] rounded-xl p-6 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <MdDelete className="w-6 h-6 text-white" />
              <h2 className="text-2xl font-black text-white">DANGER ZONE</h2>
            </div>
            
            {!showDeleteConfirm ? (
              <div>
                <p className="text-white text-sm font-bold mb-4 opacity-90">
                  Deleting your restaurant will permanently remove all data including menu items, orders, and staff. This action cannot be undone.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 bg-white hover:bg-gray-100 text-[#C84B3A] font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <MdDelete className="w-5 h-5" />
                  DELETE RESTAURANT
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white border-3 border-[#5A3A2E] rounded-xl p-4">
                  <p className="text-lg font-black text-[#C84B3A] mb-2">⚠️ ARE YOU SURE?</p>
                  <p className="text-sm font-bold text-[#5A3A2E]">
                    This will permanently delete all restaurant data. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={deleteRestaurant}
                    className="flex-1 py-3 bg-[#5A3A2E] hover:bg-[#4A2A1E] text-white font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                  >
                    YES, DELETE
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 bg-white hover:bg-gray-100 text-[#5A3A2E] font-black rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
