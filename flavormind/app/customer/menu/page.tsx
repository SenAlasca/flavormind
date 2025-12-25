"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdShoppingCart, MdRestaurantMenu, MdPerson, MdAdd, MdRemove, MdCheckCircle, MdClose } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { IoFastFood } from "react-icons/io5";

interface MenuItem {
  id: number;
  restaurant_id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function CustomerMenu() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [orderType, setOrderType] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [guestsCount, setGuestsCount] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    // Get restaurant info from session
    const session = sessionStorage.getItem('customerSession');
    if (session) {
      const data = JSON.parse(session);
      setRestaurantId(data.restaurantId);
      setRestaurantName(data.restaurantName);
      setCustomerName(data.customerName);
      setOrderType(data.orderType);
      setTableNumber(data.tableNumber);
      setGuestsCount(data.guestsCount);
      setAllergies(data.allergies);
      
      if (data.restaurantId) {
        loadMenuItems(data.restaurantId);
      }
    }
  }, []);

  useEffect(() => {
    // Filter items based on search and category
    let filtered = menuItems;
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredItems(filtered);
  }, [menuItems, selectedCategory, searchQuery]);

  const loadMenuItems = async (resId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/menu/${resId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMenuItems(data.menuItems);
        setFilteredItems(data.menuItems);
        
        // Extract unique categories
        const uniqueCategories: string[] = ["All", ...Array.from(new Set(data.menuItems.map((item: MenuItem) => item.category)))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId: number) => {
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(cartItem => 
        cartItem.id === itemId 
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      ));
    } else {
      setCart(cart.filter(cartItem => cartItem.id !== itemId));
    }
  };

  const getCartItemQuantity = (itemId: number) => {
    const item = cart.find(cartItem => cartItem.id === itemId);
    return item ? item.quantity : 0;
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: null,
      }));
      
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: parseInt(restaurantId),
          customerName,
          orderType,
          tableNumber,
          guestsCount,
          allergies,
          items: orderItems,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOrderId(data.order.id);
        setShowConfirmation(true);
        setCart([]);
      } else {
        alert('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <p className="text-xs sm:text-sm font-bold text-white opacity-90">{restaurantName || 'Restaurant'}</p>
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
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <div className="flex items-center gap-3">
              <BsSearch className="w-5 h-5 text-[#5A3A2E] opacity-60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="flex-1 bg-transparent text-base sm:text-lg font-bold text-[#5A3A2E] placeholder:text-[#5A3A2E] placeholder:opacity-40 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
            <h2 className="text-lg sm:text-xl font-black text-[#C84B3A] mb-3">CATEGORIES</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 sm:px-4 py-2 font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] shadow-[2px_2px_0px_rgba(90,58,46,0.4)] hover:shadow-[3px_3px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-0.5 ${
                    selectedCategory === category
                      ? 'bg-[#C84B3A] text-white'
                      : 'bg-[#E09A3A] hover:bg-[#D08A2A] text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#C84B3A] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
            {selectedCategory === "All" ? "ALL ITEMS" : selectedCategory.toUpperCase()} ({filteredItems.length})
          </h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl font-bold text-[#5A3A2E]">Loading menu...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-8 text-center">
              <IoFastFood className="w-16 h-16 text-[#5A3A2E] opacity-30 mx-auto mb-4" />
              <p className="text-lg font-bold text-[#5A3A2E]">
                {searchQuery ? 'No items match your search' : 'No items in this category'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const quantity = getCartItemQuantity(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.5)] transition-all hover:-translate-y-1"
                  >
                    {/* Image Placeholder */}
                    <div className="w-full h-32 sm:h-40 bg-[#E09A3A] rounded-lg border-2 border-[#5A3A2E] mb-3 flex items-center justify-center">
                      <IoFastFood className="w-12 h-12 sm:w-16 sm:h-16 text-white opacity-50" />
                    </div>
                    
                    {/* Item Info */}
                    <h3 className="text-lg sm:text-xl font-black text-[#5A3A2E] mb-1">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="text-xs sm:text-sm text-[#5A3A2E] opacity-75 mb-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xl sm:text-2xl font-black text-[#C84B3A]">
                        ${item.price.toFixed(2)}
                      </span>
                      
                      {quantity === 0 ? (
                        <button 
                          onClick={() => addToCart(item)}
                          className="px-3 sm:px-4 py-2 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-sm sm:text-base rounded-lg border-2 border-[#5A3A2E] shadow-[2px_2px_0px_rgba(90,58,46,0.4)] hover:shadow-[3px_3px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-0.5"
                        >
                          ADD
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 bg-[#C84B3A] hover:bg-[#A83D2F] text-white rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                          >
                            <MdRemove className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-black text-[#5A3A2E] min-w-[2rem] text-center">
                            {quantity}
                          </span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-2 bg-[#7FB24C] hover:bg-[#6FA23C] text-white rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                          >
                            <MdAdd className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Summary (sticky on mobile) */}
        {cart.length > 0 && (
          <div className="sticky bottom-4 bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[6px_6px_0px_rgba(90,58,46,0.4)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm sm:text-base font-black text-[#5A3A2E] opacity-75">CART TOTAL</p>
                <p className="text-2xl sm:text-3xl font-black text-[#C84B3A]">${cartTotal.toFixed(2)}</p>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#C84B3A] hover:bg-[#A83D2F] disabled:bg-gray-400 text-white font-black text-base sm:text-xl rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-1 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'PLACING ORDER...' : 'CHECKOUT'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Order Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFF7EB] border-4 border-[#5A3A2E] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_rgba(90,58,46,0.6)] text-center">
            <div className="mb-6">
              <div className="mx-auto w-20 h-20 bg-[#7FB24C] rounded-full flex items-center justify-center border-4 border-[#5A3A2E] mb-4">
                <MdCheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-black text-[#7FB24C] mb-2">ORDER PLACED!</h2>
              <p className="text-xl font-bold text-[#5A3A2E] mb-1">Order #{orderId}</p>
              <p className="text-sm text-[#5A3A2E] opacity-75">Your order has been sent to the kitchen</p>
            </div>

            <div className="bg-white border-3 border-[#5A3A2E] rounded-xl p-4 mb-6">
              <p className="text-lg font-black text-[#C84B3A] mb-2">Total: ${cartTotal.toFixed(2)}</p>
              <p className="text-sm font-bold text-[#5A3A2E]">
                {orderType === 'dine-in' ? `Table ${tableNumber}` : orderType === 'takeout' ? 'Takeout' : 'Delivery'}
              </p>
            </div>

            <button
              onClick={() => router.push('/customer')}
              className="w-full py-4 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black text-lg rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-1"
            >
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}