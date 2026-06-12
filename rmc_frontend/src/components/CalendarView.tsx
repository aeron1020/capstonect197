"use client";
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, 
  RefreshCw, InfoIcon 
} from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface LiveEventItem {
  id: string;
  projectName: string;
  client: string;
  date: string; // YYYY-MM-DD
  timeBlock: string;
  volume: number;
  mixDesign: string;
  status: "Confirmed" | "Pending Verification" | "Completed";
}

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 12)); // June 2026 default
  const [events, setEvents] = useState<LiveEventItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    
    // Checks standard token naming structures defensively
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn("CalendarView: No authorization token found in localStorage.");
      return {};
    }
    
    return { 
      Authorization: `Bearer ${token.trim()}`,
      'Content-Type': 'application/json'
    };
  };

  // FETCH & TRANSFORM LIVE BACKEND DATA (INTEGRATED FIX 2)
  const fetchSchedules = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/`, { headers: getAuthHeaders() });
      
      const mappedEvents: LiveEventItem[] = response.data.map((item: any) => {
        // Safe exploration of nested order payload relations from your Django Serializer
        const orderData = item.order || {};
        const deliveryData = orderData.delivery || {};
        
        // Handle prefetch_related order_items array structure fallbacks safely
        const itemsArray = orderData.order_items || orderData.orderitem_set || [];
        const firstItem = itemsArray[0];
        const volumeNum = firstItem ? parseFloat(firstItem.volume) : 0;
        
        // 🔴 FIX 2: Maps Django nested Delivery states explicitly to Calendar Legend specs
        let rawDeliveryStatus = deliveryData.status || orderData.status || "Pending Dispatch";
        let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" = "Confirmed";

        if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
          calendarStatus = "Completed";
        } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification") {
          calendarStatus = "Pending Verification";
        } else {
          calendarStatus = "Confirmed"; // Fallback for 'Ready for Pouring', 'In Transit'
        }

        // Capture the target schedule date string (YYYY-MM-DD)
        const rawDate = item.delivery_date || orderData.proposed_schedule;

        return {
          id: `ORD-${orderData.id || item.id}`,
          projectName: orderData.project_name || item.project_name || "Unnamed Project",
          client: "Contractor Account", 
          date: rawDate, 
          timeBlock: "Flexible Schedule",
          volume: volumeNum,
          mixDesign: firstItem?.mix_design?.design_name || "Standard RMC Mix",
          status: calendarStatus
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Failed parsing logistics payloads from endpoint:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const triggerManualSync = () => {
    setIsRefreshing(true);
    fetchSchedules(true);
  };

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const blankDays = Array(firstDayOfMonth).fill(null);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...blankDays, ...monthDays];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getDailyTotalVolume = (dayNum: number) => {
    if (!dayNum) return 0;
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return events
      .filter(e => e.date === dateString)
      .reduce((acc, curr) => acc + curr.volume, 0);
  };

  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 min-h-[300px]">
        <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Master Production Plan...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest mb-1">
            <Calendar className="w-4 h-4" /> Operations Master Schedule
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={triggerManualSync}
            className="p-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-1"
            title="Refresh Live DB Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-xs">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600 border-l border-gray-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500/20"
          >
            <option value="All">All Bookings</option>
            <option value="Confirmed">Confirmed Only</option>
            <option value="Pending Verification">Pending Payments</option>
            <option value="Completed">Completed Jobs</option>
          </select>
        </div>
      </div>

      {/* LEGEND BAR */}
      <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Confirmed / Paid</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Pending Verification</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Job Completed</div>
        <div className="ml-auto text-cyan-600 flex items-center gap-1 normal-case font-bold"><InfoIcon className="w-3.5 h-3.5" /> Total m³ shows aggregate daily production weight.</div>
      </div>

      {/* GRID CONTAINER */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] border border-gray-200 rounded-2xl overflow-hidden">
          
          <div className="grid grid-cols-7 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest text-center py-3 border-b border-gray-900">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
            {allDays.map((day, idx) => {
              const currentPaddedMonth = String(month + 1).padStart(2, '0');
              const currentPaddedDay = day ? String(day).padStart(2, '0') : "";
              const dateString = day ? `${year}-${currentPaddedMonth}-${currentPaddedDay}` : "";
              
              const dayEvents = events.filter(e => {
                if (e.date !== dateString) return false;
                if (filterStatus !== "All" && e.status !== filterStatus) return false;
                return true;
              });

              const dailyTotalM3 = getDailyTotalVolume(day);

              return (
                <div 
                  key={idx} 
                  className={`min-h-[140px] bg-white p-2 flex flex-col justify-between transition-colors ${
                    day ? 'hover:bg-gray-50/50' : 'bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black p-1 block min-w-[24px] text-center ${
                      day === 12 && month === 5 ? 'bg-cyan-600 text-white rounded-full' : 'text-gray-400'
                    }`}>
                      {day || ""}
                    </span>
                    
                    {dailyTotalM3 > 0 && (
                      <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                        {dailyTotalM3.toFixed(2)} m³
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[100px] pr-0.5">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        className={`p-2 border rounded-xl text-left transition-all hover:shadow-xs ${
                          event.status === 'Completed' ? 'bg-blue-50/60 border-blue-200 text-blue-900' :
                          event.status === 'Pending Verification' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
                          'bg-green-50/60 border-green-200 text-green-900'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-[10px] font-black tracking-tight truncate uppercase leading-none">{event.projectName}</p>
                        </div>
                        
                        <div className="flex items-center justify-between text-[8px] font-bold text-gray-500 uppercase tracking-wider mt-1 border-t border-gray-200/40 pt-1">
                          <span className="text-cyan-700">{event.mixDesign}</span>
                          <span className="bg-white px-1 border rounded-sm font-black">{event.volume.toFixed(1)} m³</span>
                        </div>
                        
                        <p className="text-[8px] text-gray-400 font-medium mt-0.5 truncate flex items-center gap-0.5">
                          <Clock className="w-2 h-2 shrink-0" /> {event.timeBlock}
                        </p>
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
  );
}