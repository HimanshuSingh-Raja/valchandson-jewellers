"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  XCircle,
  AlertCircle,
  Eye,
  X,
  ExternalLink,
  Loader2,
  Check,
  Save,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Gift,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  selectedMaterial: string;
  selectedSize: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  product?: {
    id: string;
    slug: string;
    sku: string;
    images: Array<{ url: string }>;
  };
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingApartment: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPincode: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  appliedPromo: string | null;
  giftNote: string | null;
  trackingNumber: string | null;
  adminNotes: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Edit fields inside modal
  const [editStatus, setEditStatus] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editTrackingNumber, setEditTrackingNumber] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");

  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const STATUS_TABS = [
    { id: "all", label: "All Orders" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "QC_HALLMARKING", label: "QC & Hallmarking" },
    { id: "DISPATCHED", label: "In Transit" },
    { id: "DELIVERED", label: "Delivered" },
    { id: "CANCELLED", label: "Cancelled" },
  ];

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (paymentFilter !== "all") params.set("payment", paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, paymentFilter]);

  // Open Order Detail
  const handleOpenDetail = async (orderSummary: Order) => {
    setIsLoadingDetail(true);
    setSelectedOrder(orderSummary);
    setEditStatus(orderSummary.orderStatus);
    setEditPaymentStatus(orderSummary.paymentStatus);
    setEditTrackingNumber(orderSummary.trackingNumber || "");
    setEditAdminNotes(orderSummary.adminNotes || "");
    setModalError(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderSummary.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setSelectedOrder(data.order);
          setEditStatus(data.order.orderStatus);
          setEditPaymentStatus(data.order.paymentStatus);
          setEditTrackingNumber(data.order.trackingNumber || "");
          setEditAdminNotes(data.order.adminNotes || "");
        }
      }
    } catch (err) {
      console.error("Error loading full order:", err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  // Submit Order Updates
  const handleSaveOrderUpdates = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    setModalError(null);

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: editStatus,
          paymentStatus: editPaymentStatus,
          trackingNumber: editTrackingNumber.trim() || null,
          adminNotes: editAdminNotes.trim() || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToastMessage(`Order ${selectedOrder.id} status updated to ${editStatus}!`);
        setSelectedOrder(data.order);
        fetchOrders();
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        setModalError(data.error || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Update order error:", err);
      setModalError("Network error while updating order.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingCount = orders.filter(
    (o) => o.orderStatus === "PENDING" || o.orderStatus === "CONFIRMED"
  ).length;
  const qcCount = orders.filter((o) => o.orderStatus === "QC_HALLMARKING").length;
  const dispatchedCount = orders.filter((o) => o.orderStatus === "DISPATCHED").length;

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "QC_HALLMARKING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
            <ShieldCheck className="w-3 h-3" /> QC & Hallmarking
          </span>
        );
      case "DISPATCHED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-200">
            <Truck className="w-3 h-3" /> In Transit
          </span>
        );
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
            <Check className="w-3 h-3" /> Delivered
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-rose-50 text-rose-700 text-[11px] font-medium border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-stone-100 text-stone-700 text-[11px] font-medium">
            <Clock className="w-3 h-3" /> {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-6">
        <div>
          <h1 className="font-serif-luxury text-2xl lg:text-3xl text-[#1C1917] tracking-tight">
            Order Fulfillment & Dispatch
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage high jewellery customer orders, national hallmark certification stages, and insured logistics.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 text-xs rounded-r flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Total Orders
          </span>
          <div className="mt-2 text-2xl font-serif-luxury font-bold text-[#1C1917]">
            {orders.length}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">All recorded transactions</p>
        </div>

        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Confirmed & Pending
          </span>
          <div className="mt-2 text-2xl font-serif-luxury font-bold text-blue-700">
            {pendingCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Awaiting dispatch</p>
        </div>

        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            QC & Hallmarking
          </span>
          <div className="mt-2 text-2xl font-serif-luxury font-bold text-amber-700">
            {qcCount}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Under Bureau inspection</p>
        </div>

        <div className="bg-white border border-[#E8E2D8] p-5 rounded shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            Total Order Volume
          </span>
          <div className="mt-2 text-2xl font-serif-luxury font-bold text-[#A68A5D]">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">Cumulative sales revenue</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-[#E8E2D8] flex items-center gap-2 overflow-x-auto pb-1">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-colors border-b-2 ${
              statusFilter === tab.id
                ? "border-[#1C1917] text-[#1C1917]"
                : "border-transparent text-stone-400 hover:text-stone-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 border border-[#E8E2D8] rounded shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, phone, tracking..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-800 focus:outline-none focus:border-[#A68A5D]"
          >
            <option value="all">All Payment Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="AUTHORIZED">Authorized Only</option>
            <option value="PENDING">Pending / COD</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E8E2D8] rounded overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#A68A5D] animate-spin" />
            <p className="text-xs uppercase tracking-wider text-stone-500">
              Loading orders...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-700">No orders found</h3>
            <p className="text-xs text-stone-500 mt-1">Try modifying your search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8E2D8] bg-[#FAF7F2] text-stone-600 uppercase tracking-wider text-[11px] font-semibold">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Patron</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D8]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-stone-900">{o.id}</div>
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(o.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-stone-900">{o.customerName}</div>
                      <div className="text-[11px] text-stone-500">
                        {o.shippingCity}, {o.shippingState}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-stone-800 font-medium">
                        {o.items?.length || 0} item{o.items?.length === 1 ? "" : "s"}
                      </div>
                      <div className="text-[11px] text-stone-500 truncate max-w-xs">
                        {o.items?.map((it) => it.productTitle).join(", ")}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      ₹{o.totalAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          o.paymentStatus === "PAID" || o.paymentStatus === "AUTHORIZED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                      <div className="text-[10px] text-stone-400 uppercase mt-0.5">
                        {o.paymentMethod}
                      </div>
                    </td>

                    <td className="py-3 px-4">{renderStatusBadge(o.orderStatus)}</td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#A68A5D]/60 hover:bg-[#A68A5D] hover:text-white text-stone-800 text-[11px] uppercase tracking-wider font-semibold transition-colors rounded shadow-xs"
                      >
                        <Eye className="w-3 h-3" /> Inspect Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full p-6 shadow-2xl border border-[#E8E2D8] rounded my-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif-luxury text-xl font-semibold text-[#1C1917]">
                    Order {selectedOrder.id}
                  </h3>
                  {renderStatusBadge(selectedOrder.orderStatus)}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Placed on{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF7F2] p-4 border border-[#E8E2D8] rounded text-xs">
              <div>
                <h4 className="font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#A68A5D]" /> Customer & Delivery Address
                </h4>
                <div className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</div>
                <div className="text-stone-600 mt-1 leading-relaxed">
                  {selectedOrder.shippingAddress}
                  {selectedOrder.shippingApartment && `, ${selectedOrder.shippingApartment}`}
                  <br />
                  {selectedOrder.shippingCity}, {selectedOrder.shippingState} -{" "}
                  {selectedOrder.shippingPincode}
                </div>
                <div className="mt-2 space-y-0.5 text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-stone-400" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-stone-400" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold uppercase tracking-wider text-stone-700 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#A68A5D]" /> Payment & Dispatch Method
                </h4>
                <div className="space-y-1.5 text-stone-700">
                  <div>
                    Payment Method:{" "}
                    <span className="font-semibold uppercase font-mono">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div>
                    Payment Status:{" "}
                    <span className="font-semibold text-emerald-700">
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  <div>
                    Shipping Tier:{" "}
                    <span className="font-semibold capitalize">
                      {selectedOrder.shippingMethod === "priority"
                        ? "Priority Insured Air Courier (₹350)"
                        : "Complimentary Insured Ground Delivery"}
                    </span>
                  </div>
                  {selectedOrder.giftNote && (
                    <div className="mt-2 p-2 bg-white border border-[#E8E2D8] rounded text-[11px] text-stone-600">
                      <div className="flex items-center gap-1 font-semibold text-stone-800">
                        <Gift className="w-3 h-3 text-[#A68A5D]" /> Patron Gift Note:
                      </div>
                      <div className="italic mt-0.5">&quot;{selectedOrder.giftNote}&quot;</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div>
              <h4 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] mb-2">
                Order Contents ({selectedOrder.items?.length || 0})
              </h4>
              <div className="border border-[#E8E2D8] rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#FAF7F2] border-b border-[#E8E2D8] text-stone-500 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Metal / Spec</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Unit Price</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]">
                    {selectedOrder.items?.map((it) => (
                      <tr key={it.id}>
                        <td className="py-2.5 px-3 font-semibold text-stone-900">
                          {it.productTitle}
                          {it.selectedSize && (
                            <span className="block text-[10px] text-stone-500 font-normal">
                              Size: {it.selectedSize}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">{it.selectedMaterial}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-medium">
                          {it.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-stone-600">
                          ₹{it.unitPrice.toLocaleString("en-IN")}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          ₹{it.totalPrice.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {/* Financial Summary */}
                  <tfoot className="bg-[#FAF7F2] border-t border-[#E8E2D8] text-stone-700">
                    <tr>
                      <td colSpan={4} className="py-2 px-3 text-right text-stone-500">
                        Subtotal:
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        ₹{selectedOrder.subtotal.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    {selectedOrder.discountAmount > 0 && (
                      <tr>
                        <td colSpan={4} className="py-1 px-3 text-right text-emerald-600">
                          Promotional Privilege ({selectedOrder.appliedPromo || "Voucher"}):
                        </td>
                        <td className="py-1 px-3 text-right font-mono text-emerald-600">
                          -₹{selectedOrder.discountAmount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={4} className="py-1 px-3 text-right text-stone-500">
                        Insured Shipping:
                      </td>
                      <td className="py-1 px-3 text-right font-mono">
                        {selectedOrder.shippingCost === 0
                          ? "FREE"
                          : `₹${selectedOrder.shippingCost.toLocaleString("en-IN")}`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="py-1 px-3 text-right text-stone-500">
                        GST (3% National Hallmarked Precious Metals):
                      </td>
                      <td className="py-1 px-3 text-right font-mono">
                        ₹{selectedOrder.taxAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr className="border-t border-[#E8E2D8] font-bold text-sm text-[#1C1917]">
                      <td colSpan={4} className="py-2.5 px-3 text-right uppercase tracking-wider">
                        Grand Total:
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-base text-[#A68A5D]">
                        ₹{selectedOrder.totalAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Status & Tracking Updaters */}
            <div className="bg-white border border-[#E8E2D8] p-4 rounded space-y-4">
              <h4 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1C1917] border-b border-[#E8E2D8] pb-2">
                Order Fulfillment Actions
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  >
                    <option value="CONFIRMED">Confirmed (Order Accepted)</option>
                    <option value="QC_HALLMARKING">QC & Bureau Hallmarking Verification</option>
                    <option value="DISPATCHED">In Transit / Dispatched</option>
                    <option value="DELIVERED">Delivered to Patron</option>
                    <option value="CANCELLED">Cancelled / Voided</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={editPaymentStatus}
                    onChange={(e) => setEditPaymentStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  >
                    <option value="PAID">PAID</option>
                    <option value="AUTHORIZED">AUTHORIZED</option>
                    <option value="PENDING">PENDING (COD / Bank Transfer)</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Courier AWB / Air Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editTrackingNumber}
                    onChange={(e) => setEditTrackingNumber(e.target.value)}
                    placeholder="e.g. BlueDart AWB: BD-928401928"
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs font-mono text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Internal Atelier Notes
                  </label>
                  <textarea
                    rows={2}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="Private notes visible only to atelier staff..."
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E8E2D8] text-xs text-stone-900 focus:outline-none focus:border-[#A68A5D]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-[#E8E2D8] text-xs uppercase tracking-wider text-stone-700 hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveOrderUpdates}
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#1C1917] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#A68A5D] disabled:opacity-50 shadow-sm"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Save Order Updates
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
