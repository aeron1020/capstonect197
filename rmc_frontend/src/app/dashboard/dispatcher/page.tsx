"use client";
import { useState, useEffect } from 'react';
import { 
  Truck, Calendar, Clock, MapPin, Search, Filter, 
  AlertTriangle, Play, RefreshCw, Layers, Package, 
  User2, ChevronLeft, ChevronRight, InfoIcon
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

// Configure this helper or swap it out for your existing central Axios helper module instance
const API_BASE_URL = "http://127.0.0.1:8000/api";

interface DeliveryItem {
  id: string; 
  orderId: string;
  projectName: string;
  location: string;
  date: string;
  volume: string;
  volumeNum: number;
  mixDesign: string;
  status: string;
  driver: string;
  truckNo: string;
  dispatchedTime: string;
  timeLimitMins: number;
  elapsedMins: number;
}

export default function DispatcherDashboard() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'live' | 'calendar'>('live');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date(2026, 5, 12)); // June 2026

  // GET Token from your chosen auth solution (localStorage fallback illustrated)
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchSchedulesFromBackend = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/`, { headers: getAuthHeaders() });
      
      // Map nested Django serializer attributes cleanly into our dashboard layout state
      const mappedData: DeliveryItem[] = response.data.map((item: any) => {
        const firstItem = item.order_items?.[0];
        const computedVolume = firstItem ? parseFloat(firstItem.volume) : 0;
        
        return {
          id: `SCH-${item.id}`,
          orderId: `ORD-${item.order_id}`,
          projectName: item.project_name || "Unnamed Project",
          location: item.project_location || "No Site Location Provided",
          date: item.date, 
          volume: `${computedVolume.toFixed(2)} m³`,
          volumeNum: computedVolume,
          mixDesign: firstItem?.mix_design?.design_name || "Standard RMC Mix",
          status: item.delivery_status || "Pending Dispatch",
          driver: "Unassigned Driver", // Placeholder for active fleet assignments
          truckNo: "Unassigned Truck",
          dispatchedTime: "--:--",
          timeLimitMins: 90,
          elapsedMins: 0
        };
      });

      setDeliveries(mappedData);
    } catch (error) {
      console.error("Failed parsing logistics payloads from endpoint:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedulesFromBackend();
  }, []);

  const triggerSync = () => {
    setIsRefreshing(true);
    fetchSchedulesFromBackend(true);
  };

  const handleUpdateStatus = (scheduleId: string, currentStatus: string) => {
    const statusSequence = ["Pending Dispatch", "Batching", "In Transit", "Pouring", "Completed"];
    const currentIndex = statusSequence.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === statusSequence.length - 1) return;
    
    const nextStatus = statusSequence[currentIndex + 1];
    const numericId = scheduleId.replace("SCH-", "");

    Swal.fire({
      title: 'UPDATE DISPATCH STAGE?',
      text: `Advance production workflow tracking status to ${nextStatus.toUpperCase()}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#0284c7',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'CONFIRM STATE TRANSITION'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post(
            `${API_BASE_URL}/schedules/${numericId}/update_delivery_status/`, 
            { status: nextStatus },
            { headers: getAuthHeaders() }
          );
          
          Swal.fire('LOGISTICS UPDATED', `State successfully updated to ${nextStatus}.`, 'success');
          fetchSchedulesFromBackend(true); // Pull fresh database values quietly
        } catch (err) {
          Swal.fire('ERROR', 'Could not save the updated status to the database.', 'error');
        }
      }
    });
  };

  const filteredDeliveries = deliveries.filter(item => {
    const matchesSearch = item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const totalActiveTransits = deliveries.filter(d => d.status !== "Completed" && d.status !== "Pending Dispatch").length;

  // --- CALENDAR GRID ENGINE ---
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blankDays = Array(firstDayOfMonth).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allCalendarCells = [...blankDays, ...monthDays];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f6]">
        <RefreshCw className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Scheduled Dispatches...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased">
      
      {/* HEADER STATS */}
      <header className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Active Transits</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">{totalActiveTransits} <span className="text-xs text-gray-400 font-normal">Active Trucks</span></h2>
          </div>
          <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Runs In Queue</p>
            <h2 className="text-3xl font-black text-gray-900 mt-1">
              {deliveries.filter(d => d.status === "Pending Dispatch").length} <span className="text-xs text-gray-400 font-normal">Queued</span>
            </h2>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-end">
          <button 
            onClick={triggerSync}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors w-full md:w-auto justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? "Fetching Database Rows..." : "Sync Logistics Board"}
          </button>
        </div>
      </header>

      {/* VIEW SELECTION SWITCHER */}
      <div className="flex justify-between items-center bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex-col sm:flex-row gap-3">
        <p className="text-xs font-bold text-gray-400 pl-2 uppercase tracking-wider">Operational Node Terminal</p>
        <div className="bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner inline-flex gap-1 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all justify-center flex-1 sm:flex-initial ${
              activeTab === 'live' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Approved Delivery List
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all justify-center flex-1 sm:flex-initial ${
              activeTab === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Approved Production Calendar
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB CANVAS */}
      {activeTab === 'live' ? (
        <div className="space-y-4">
          <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search approved projects, IDs, or target destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 shrink-0 px-2">
                <Filter className="w-3 h-3" /> Delivery Stage:
              </span>
              {["All", "Pending Dispatch", "Batching", "In Transit", "Pouring", "Completed"].map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => setStatusFilter(statusOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    statusFilter === statusOption ? "bg-cyan-600 text-white shadow-xs" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                  }`}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </section>

          <main className="space-y-3">
            {filteredDeliveries.length > 0 ? (
              filteredDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded-md">
                          {delivery.id} ({delivery.orderId})
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
                          delivery.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          delivery.status === 'Pouring' ? 'bg-purple-100 text-purple-700' :
                          delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                          delivery.status === 'Batching' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          ● {delivery.status}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-md uppercase">
                          Pour Date: {delivery.date}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">{delivery.projectName}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> {delivery.location}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100/70">
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Batch Volume</span>
                          <p className="text-xs font-bold text-gray-800">{delivery.volume}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Mix Specification</span>
                          <p className="text-xs font-bold text-cyan-700 uppercase">{delivery.mixDesign}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Mixer Asset ID</span>
                          <p className="text-xs font-bold text-gray-500 italic">{delivery.truckNo}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Assigned Driver</span>
                          <p className="text-xs font-bold text-gray-500 italic flex items-center gap-1">
                            <User2 className="w-3 h-3 text-gray-400" /> {delivery.driver}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:pl-6 lg:border-l lg:border-gray-100 min-w-[200px]">
                      {delivery.status !== "Completed" ? (
                        <button 
                          onClick={() => handleUpdateStatus(delivery.id, delivery.status)}
                          className="flex items-center gap-1.5 bg-gray-900 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap w-full lg:w-auto justify-center"
                        >
                          {delivery.status === "Pending Dispatch" && <Play className="w-3.5 h-3.5 fill-current" />}
                          Update Delivery Step
                        </button>
                      ) : (
                        <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-green-700 text-[10px] font-black uppercase tracking-widest text-center w-full">
                          Pour Discharged ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center border-2 border-dashed rounded-3xl border-gray-200 bg-white">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No matching approved active runs found in database.</p>
              </div>
            )}
          </main>
        </div>
      ) : (
        /* --- CALENDAR VIEW COMPONENT --- */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest mb-1">
                <Calendar className="w-4 h-4" /> Final Post-Inspection Approved Production Schedule
              </div>
              <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                {monthNames[month]} {year}
              </h2>
            </div>

            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-xs">
              <button onClick={() => setCalendarDate(new Date(year, month - 1, 1))} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setCalendarDate(new Date(year, month + 1, 1))} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600 border-l border-gray-200">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[800px] border border-gray-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest text-center py-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
               {allCalendarCells.map((day, idx) => {
                // Ensure month and day strings are strictly padded with leading zeros matching ISO format
                const currentPaddedMonth = String(month + 1).padStart(2, '0');
                const currentPaddedDay = day ? String(day).padStart(2, '0') : "";
                const dayStr = day ? `${year}-${currentPaddedMonth}-${currentPaddedDay}` : "";
                
                // Isolate records by cleaning up potential whitespace anomalies
                const dayEvents = deliveries.filter(e => e.date?.trim() === dayStr);
                const aggregateM3 = dayEvents.reduce((acc, curr) => acc + curr.volumeNum, 0);

                return (
                    <div key={idx} className="min-h-[140px] bg-white p-2 flex flex-col justify-between border-b border-r border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-black p-1 ${dayStr === "2026-06-12" ? 'bg-cyan-600 text-white rounded-full min-w-[24px] text-center' : 'text-gray-400'}`}>
                        {day || ""}
                        </span>
                        {aggregateM3 > 0 && (
                        <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded-md">
                            {aggregateM3.toFixed(2)} m³
                        </span>
                        )}
                    </div>

                    <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[100px]">
                        {dayEvents.map(event => (
                        <div key={event.id} className="p-2 border border-green-200 bg-green-50/60 rounded-xl text-left">
                            <p className="text-[10px] font-black tracking-tight truncate uppercase leading-none text-green-900">
                            {event.projectName}
                            </p>
                            <div className="flex items-center justify-between text-[8px] font-bold text-gray-500 uppercase mt-1 pt-1 border-t border-gray-200/40">
                            <span className="text-cyan-700">{event.mixDesign}</span>
                            <span className="bg-white px-1 border rounded-sm font-black text-gray-700">{event.volume}</span>
                            </div>
                        </div>
                        ))}
                    </div>
                    </div>
                );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}