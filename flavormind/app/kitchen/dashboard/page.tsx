"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdRestaurant, MdLogout, MdAdd, MdCheckCircle, MdPending, MdLocalFireDepartment } from "react-icons/md";
import { IoFastFood, IoSettings } from "react-icons/io5";
import { BsClipboardCheck } from "react-icons/bs";

export default function KitchenDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");

  return (
    <div className="min-h-screen bg-[#F3E2C7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#4A78A8] border-b-4 border-[#5A3A2E] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MdRestaurant className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white">KITCHEN DASHBOARD</h1>
                <p className="text-xs sm:text-sm font-bold text-white opacity-90">Restaurant Name • Code: ABC123</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => router.push("/kitchen/admin")}
                className="p-2 sm:p-3 bg-white rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <IoSettings className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A78A8]" />
              </button>
              <button
                onClick={() => router.push("/kitchen")}
                className="p-2 sm:p-3 bg-[#C84B3A] hover:bg-[#A83D2F] rounded-full border-3 border-[#5A3A2E] shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <MdLogout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Navigation Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-2 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] transition-all ${
                  activeTab === "orders"
                    ? "bg-[#C84B3A] text-white shadow-[2px_2px_0px_rgba(90,58,46,0.4)]"
                    : "bg-white text-[#5A3A2E] hover:bg-gray-100"
                }`}
              >
                <BsClipboardCheck className="w-5 h-5" />
                ORDERS
              </button>
              <button
                onClick={() => setActiveTab("menu")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] transition-all ${
                  activeTab === "menu"
                    ? "bg-[#4A78A8] text-white shadow-[2px_2px_0px_rgba(90,58,46,0.4)]"
                    : "bg-white text-[#5A3A2E] hover:bg-gray-100"
                }`}
              >
                <IoFastFood className="w-5 h-5" />
                MENU
              </button>
            </div>
          </div>
        </div>

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#E09A3A] rounded-lg">
                    <MdPending className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">PENDING</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#E09A3A]">8</p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#C84B3A] rounded-lg">
                    <MdLocalFireDepartment className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">COOKING</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#C84B3A]">5</p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#7FB24C] rounded-lg">
                    <MdCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">READY</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#7FB24C]">3</p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#4A78A8] rounded-lg">
                    <BsClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">TODAY</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#4A78A8]">47</p>
              </div>
            </div>

            {/* Active Orders */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#C84B3A] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                ACTIVE ORDERS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((order) => (
                  <div
                    key={order}
                    className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-black text-[#5A3A2E] opacity-60">ORDER #{order}23</p>
                        <p className="text-xl font-black text-[#5A3A2E]">Table {order + 4}</p>
                      </div>
                      <span className="px-3 py-1 bg-[#E09A3A] text-white text-xs font-black rounded-full border-2 border-[#5A3A2E]">
                        PENDING
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm font-bold text-[#5A3A2E]">• 2x Burger</p>
                      <p className="text-sm font-bold text-[#5A3A2E]">• 1x Pizza</p>
                      <p className="text-sm font-bold text-[#5A3A2E]">• 3x Fries</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5">
                        START
                      </button>
                      <button className="flex-1 py-2 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5">
                        DONE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add Item Button */}
            <button className="w-full bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-lg sm:text-xl py-4 rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              <MdAdd className="w-6 h-6" />
              ADD NEW MENU ITEM
            </button>

            {/* Menu Items List */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#4A78A8] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                CURRENT MENU
              </h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#E09A3A] rounded-lg border-2 border-[#5A3A2E] flex items-center justify-center">
                        <IoFastFood className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-black text-[#5A3A2E]">Menu Item {item}</h3>
                        <p className="text-sm text-[#5A3A2E] opacity-75">Category: Main</p>
                        <p className="text-lg font-black text-[#C84B3A]">$12.99</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5">
                        EDIT
                      </button>
                      <button className="px-4 py-2 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5">
                        DELETE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
