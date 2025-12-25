"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdRestaurant, MdLogout, MdAdd, MdCheckCircle, MdPending, MdLocalFireDepartment, MdEdit, MdDelete, MdClose } from "react-icons/md";
import { IoFastFood, IoSettings } from "react-icons/io5";
import { BsClipboardCheck } from "react-icons/bs";

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

interface OrderItem {
  id: number;
  menuItemId: number;
  itemName: string;
  quantity: number;
  price: number;
  notes: string | null;
}

interface Order {
  id: number;
  customer_name: string;
  order_type: string;
  table_number: number | null;
  guests_count: number | null;
  allergies: string | null;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export default function KitchenDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "menu">("orders");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [restaurantId, setRestaurantId] = useState<string>("");
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [restaurantCode, setRestaurantCode] = useState<string>("");
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Main",
  });

  useEffect(() => {
    // Get restaurant info from session
    const id = sessionStorage.getItem('restaurantId');
    const name = sessionStorage.getItem('restaurantName');
    const code = sessionStorage.getItem('restaurantCode');
    
    if (id) setRestaurantId(id);
    if (name) setRestaurantName(name);
    if (code) setRestaurantCode(code);
    
    // Load data based on active tab
    if (id) {
      if (activeTab === 'orders') {
        loadOrders(id);
      } else {
        loadMenuItems(id);
      }
    }
  }, [activeTab]);

  const loadMenuItems = async (resId: string) => {
    setIsLoadingMenu(true);
    try {
      const response = await fetch(`/api/menu/${resId}`);
      const data = await response.json();
      
      if (response.ok && data.menuItems) {
        // Ensure numeric fields are properly typed
        const items = data.menuItems.map((item: any) => ({
          ...item,
          id: Number(item.id),
          restaurant_id: Number(item.restaurant_id),
          price: Number(item.price),
          available: Boolean(item.available),
        }));
        setMenuItems(items);
      }
    } catch (error) {
      console.error('Error loading menu items:', error);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const loadOrders = async (resId: string) => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(`/api/orders/${resId}`);
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        // Update order in local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleAddMenuItem = async () => {
    if (!formData.name || !formData.price || !restaurantId) return;
    
    try {
      const response = await fetch('/api/menu/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: parseInt(restaurantId),
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.menuItem) {
        // Ensure numeric fields are properly typed
        const newItem = {
          ...data.menuItem,
          id: Number(data.menuItem.id),
          restaurant_id: Number(data.menuItem.restaurant_id),
          price: Number(data.menuItem.price),
          available: Boolean(data.menuItem.available),
        };
        setMenuItems([...menuItems, newItem]);
        setShowAddModal(false);
        resetForm();
      } else {
        console.error('Failed to add menu item:', data);
        alert('Failed to add menu item: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Error adding menu item. Please try again.');
    }
  };

  const handleEditMenuItem = async () => {
    if (!editingItem || !formData.name || !formData.price) return;
    
    try {
      const response = await fetch(`/api/menu/item/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.menuItem) {
        // Ensure numeric fields are properly typed
        const updatedItem = {
          ...data.menuItem,
          id: Number(data.menuItem.id),
          restaurant_id: Number(data.menuItem.restaurant_id),
          price: Number(data.menuItem.price),
          available: Boolean(data.menuItem.available),
        };
        setMenuItems(menuItems.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        setEditingItem(null);
        resetForm();
      } else {
        console.error('Failed to update menu item:', data);
        alert('Failed to update menu item: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
      alert('Error updating menu item. Please try again.');
    }
  };

  const handleDeleteMenuItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      const response = await fetch(`/api/menu/item/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      category: item.category,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Main",
    });
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingItem(null);
    resetForm();
  };

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
                <p className="text-xs sm:text-sm font-bold text-white opacity-90">
                  {restaurantName || 'Restaurant'} • Code: {restaurantCode || 'ABC123'}
                </p>
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
                <p className="text-3xl sm:text-4xl font-black text-[#E09A3A]">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#C84B3A] rounded-lg">
                    <MdLocalFireDepartment className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">COOKING</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#C84B3A]">
                  {orders.filter(o => o.status === 'cooking').length}
                </p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#7FB24C] rounded-lg">
                    <MdCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">READY</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#7FB24C]">
                  {orders.filter(o => o.status === 'ready').length}
                </p>
              </div>

              <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#4A78A8] rounded-lg">
                    <BsClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs sm:text-sm font-black text-[#5A3A2E] opacity-75">TODAY</p>
                </div>
                <p className="text-3xl sm:text-4xl font-black text-[#4A78A8]">{orders.length}</p>
              </div>
            </div>

            {/* Active Orders */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#C84B3A] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                ACTIVE ORDERS ({orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length})
              </h2>
              
              {isLoadingOrders ? (
                <div className="text-center py-8">
                  <p className="text-lg font-bold text-[#5A3A2E]">Loading orders...</p>
                </div>
              ) : orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 ? (
                <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-8 text-center">
                  <BsClipboardCheck className="w-16 h-16 text-[#5A3A2E] opacity-30 mx-auto mb-4" />
                  <p className="text-lg font-bold text-[#5A3A2E]">No active orders</p>
                  <p className="text-sm text-[#5A3A2E] opacity-75">Orders will appear here when customers place them</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders
                    .filter(order => order.status !== 'completed' && order.status !== 'cancelled')
                    .map((order) => {
                      const statusColors = {
                        pending: 'bg-[#E09A3A]',
                        cooking: 'bg-[#C84B3A]',
                        ready: 'bg-[#7FB24C]',
                      };
                      const statusColor = statusColors[order.status as keyof typeof statusColors] || 'bg-gray-500';
                      
                      return (
                        <div
                          key={order.id}
                          className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)]"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="text-xs font-black text-[#5A3A2E] opacity-60">ORDER #{order.id}</p>
                              <p className="text-xl font-black text-[#5A3A2E]">{order.customer_name}</p>
                              {order.table_number && (
                                <p className="text-sm font-bold text-[#5A3A2E] opacity-75">Table {order.table_number}</p>
                              )}
                              <p className="text-xs font-bold text-[#5A3A2E] opacity-60">{order.order_type}</p>
                            </div>
                            <span className={`px-3 py-1 ${statusColor} text-white text-xs font-black rounded-full border-2 border-[#5A3A2E]`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          
                          {order.allergies && (
                            <div className="mb-3 p-2 bg-[#C84B3A] bg-opacity-10 border-2 border-[#C84B3A] rounded-lg">
                              <p className="text-xs font-black text-[#C84B3A]">⚠️ ALLERGIES: {order.allergies}</p>
                            </div>
                          )}
                          
                          <div className="space-y-1 mb-3">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex justify-between">
                                <p className="text-sm font-bold text-[#5A3A2E]">• {item.quantity}x {item.itemName}</p>
                                {item.notes && (
                                  <p className="text-xs text-[#5A3A2E] opacity-60 italic">{item.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="mb-3">
                            <p className="text-lg font-black text-[#C84B3A]">Total: ${order.total_amount.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'cooking')}
                                className="flex-1 py-2 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                              >
                                START COOKING
                              </button>
                            )}
                            {order.status === 'cooking' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="flex-1 py-2 bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                              >
                                MARK READY
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="flex-1 py-2 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                              >
                                COMPLETE
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Menu Tab */}
        {activeTab === "menu" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add Item Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full bg-[#7FB24C] hover:bg-[#6FA23C] text-white font-black text-lg sm:text-xl py-4 rounded-xl border-3 border-[#5A3A2E] shadow-[4px_4px_0px_rgba(90,58,46,0.4)] hover:shadow-[6px_6px_0px_rgba(90,58,46,0.6)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <MdAdd className="w-6 h-6" />
              ADD NEW MENU ITEM
            </button>

            {/* Menu Items List */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#4A78A8] mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                CURRENT MENU ({menuItems.length})
              </h2>
              
              {isLoadingMenu ? (
                <div className="text-center py-8">
                  <p className="text-lg font-bold text-[#5A3A2E]">Loading menu...</p>
                </div>
              ) : menuItems.length === 0 ? (
                <div className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-8 text-center">
                  <IoFastFood className="w-16 h-16 text-[#5A3A2E] opacity-30 mx-auto mb-4" />
                  <p className="text-lg font-bold text-[#5A3A2E]">No menu items yet</p>
                  <p className="text-sm text-[#5A3A2E] opacity-75">Click "ADD NEW MENU ITEM" to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FFF7EB] border-3 border-[#5A3A2E] rounded-xl p-4 shadow-[4px_4px_0px_rgba(90,58,46,0.3)] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-[#E09A3A] rounded-lg border-2 border-[#5A3A2E] flex items-center justify-center">
                          <IoFastFood className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-black text-[#5A3A2E]">{item.name}</h3>
                          <p className="text-sm text-[#5A3A2E] opacity-75">Category: {item.category}</p>
                          {item.description && (
                            <p className="text-xs text-[#5A3A2E] opacity-60 mt-1">{item.description}</p>
                          )}
                          <p className="text-lg font-black text-[#C84B3A]">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditModal(item)}
                          className="px-4 py-2 bg-[#4A78A8] hover:bg-[#3A6088] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                        >
                          EDIT
                        </button>
                        <button 
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="px-4 py-2 bg-[#C84B3A] hover:bg-[#A83D2F] text-white font-black text-sm rounded-lg border-2 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Menu Item Modal */}
      {(showAddModal || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#FFF7EB] border-4 border-[#5A3A2E] rounded-2xl p-6 max-w-md w-full shadow-[8px_8px_0px_rgba(90,58,46,0.6)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-[#4A78A8]">
                {editingItem ? 'EDIT MENU ITEM' : 'ADD MENU ITEM'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-[#F3E2C7] rounded-full transition-colors"
              >
                <MdClose className="w-6 h-6 text-[#5A3A2E]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-2">ITEM NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Cheeseburger"
                  className="w-full px-4 py-3 bg-white border-3 border-[#5A3A2E] rounded-xl font-bold text-[#5A3A2E] focus:outline-none focus:ring-2 focus:ring-[#4A78A8]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-2">DESCRIPTION (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description..."
                  rows={2}
                  className="w-full px-4 py-3 bg-white border-3 border-[#5A3A2E] rounded-xl font-bold text-[#5A3A2E] focus:outline-none focus:ring-2 focus:ring-[#4A78A8] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-2">PRICE ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="9.99"
                  className="w-full px-4 py-3 bg-white border-3 border-[#5A3A2E] rounded-xl font-bold text-[#5A3A2E] focus:outline-none focus:ring-2 focus:ring-[#4A78A8]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-[#5A3A2E] mb-2">CATEGORY</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white border-3 border-[#5A3A2E] rounded-xl font-bold text-[#5A3A2E] focus:outline-none focus:ring-2 focus:ring-[#4A78A8]"
                >
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main">Main</option>
                  <option value="Side">Side</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Drink">Drink</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={closeModal}
                  className="flex-1 py-3 bg-gray-400 hover:bg-gray-500 text-white font-black rounded-xl border-3 border-[#5A3A2E] transition-all hover:-translate-y-0.5"
                >
                  CANCEL
                </button>
                <button
                  onClick={editingItem ? handleEditMenuItem : handleAddMenuItem}
                  disabled={!formData.name || !formData.price}
                  className="flex-1 py-3 bg-[#7FB24C] hover:bg-[#6FA23C] disabled:bg-gray-300 text-white font-black rounded-xl border-3 border-[#5A3A2E] transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
                >
                  {editingItem ? 'UPDATE' : 'ADD ITEM'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
