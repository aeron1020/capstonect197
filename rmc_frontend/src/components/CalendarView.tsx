// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   ChevronLeft, ChevronRight, Calendar, Clock, 
//   RefreshCw, InfoIcon 
// } from 'lucide-react';
// import axios from 'axios';

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// interface LiveEventItem {
//   id: string;
//   projectName: string;
//   client: string;
//   date: string; // YYYY-MM-DD
//   timeBlock: string;
//   volume: number;
//   mixDesign: string;
//   status: "Confirmed" | "Pending Verification" | "Completed";
// }

// export default function CalendarView() {
//   const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 12)); // June 2026 default
//   const [events, setEvents] = useState<LiveEventItem[]>([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const getAuthHeaders = () => {
//     if (typeof window === 'undefined') return {};
    
//     // Checks standard token naming structures defensively
//     const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
//     if (!token) {
//       console.warn("CalendarView: No authorization token found in localStorage.");
//       return {};
//     }
    
//     return { 
//       Authorization: `Bearer ${token.trim()}`,
//       'Content-Type': 'application/json'
//     };
//   };

//   // FETCH & TRANSFORM LIVE BACKEND DATA (INTEGRATED FIX 2)
//   const fetchSchedules = async (silent = false) => {
//     if (!silent) setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/schedules/`, { headers: getAuthHeaders() });
      
//       const mappedEvents: LiveEventItem[] = response.data.map((item: any) => {
//         // Safe exploration of nested order payload relations from your Django Serializer
//         const orderData = item.order || {};
//         const deliveryData = orderData.delivery || {};
        
//         // Handle prefetch_related order_items array structure fallbacks safely
//         const itemsArray = orderData.order_items || orderData.orderitem_set || [];
//         const firstItem = itemsArray[0];
//         const volumeNum = firstItem ? parseFloat(firstItem.volume) : 0;
        
//         // 🔴 FIX 2: Maps Django nested Delivery states explicitly to Calendar Legend specs
//         let rawDeliveryStatus = deliveryData.status || orderData.status || "Pending Dispatch";
//         let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" = "Confirmed";

//         if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
//           calendarStatus = "Completed";
//         } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification") {
//           calendarStatus = "Pending Verification";
//         } else {
//           calendarStatus = "Confirmed"; // Fallback for 'Ready for Pouring', 'In Transit'
//         }

//         // Capture the target schedule date string (YYYY-MM-DD)
//         const rawDate = item.delivery_date || orderData.proposed_schedule;

//         return {
//           id: `ORD-${orderData.id || item.id}`,
//           projectName: orderData.project_name || item.project_name || "Unnamed Project",
//           client: "Contractor Account", 
//           date: rawDate, 
//           timeBlock: "Flexible Schedule",
//           volume: volumeNum,
//           mixDesign: firstItem?.mix_design?.design_name || "Standard RMC Mix",
//           status: calendarStatus
//         };
//       });

//       setEvents(mappedEvents);
//     } catch (error) {
//       console.error("Failed parsing logistics payloads from endpoint:", error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchedules();
//   }, []);

//   const triggerManualSync = () => {
//     setIsRefreshing(true);
//     fetchSchedules(true);
//   };

//   const firstDayOfMonth = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
  
//   const blankDays = Array(firstDayOfMonth).fill(null);
//   const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const allDays = [...blankDays, ...monthDays];

//   const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
//   const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

//   const getDailyTotalVolume = (dayNum: number) => {
//     if (!dayNum) return 0;
//     const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
//     return events
//       .filter(e => e.date === dateString)
//       .reduce((acc, curr) => acc + curr.volume, 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="p-12 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-100 min-h-[300px]">
//         <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mb-3" />
//         <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Loading Master Production Plan...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 md:p-6 space-y-6">
      
//       {/* HEADER CONTROLS */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
//         <div>
//           <div className="flex items-center gap-2 text-cyan-600 font-black text-xs uppercase tracking-widest mb-1">
//             <Calendar className="w-4 h-4" /> Operations Master Schedule
//           </div>
//           <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
//             {monthNames[month]} {year}
//           </h2>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
//           <button
//             onClick={triggerManualSync}
//             className="p-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-1"
//             title="Refresh Live DB Data"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
//           </button>

//           <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-xs">
//             <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600">
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-gray-600 border-l border-gray-200">
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-cyan-500/20"
//           >
//             <option value="All">All Bookings</option>
//             <option value="Confirmed">Confirmed Only</option>
//             <option value="Pending Verification">Pending Payments</option>
//             <option value="Completed">Completed Jobs</option>
//           </select>
//         </div>
//       </div>

//       {/* LEGEND BAR */}
//       <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
//         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Confirmed / Paid</div>
//         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Pending Verification</div>
//         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Job Completed</div>
//         <div className="ml-auto text-cyan-600 flex items-center gap-1 normal-case font-bold"><InfoIcon className="w-3.5 h-3.5" /> Total m³ shows aggregate daily production weight.</div>
//       </div>

//       {/* GRID CONTAINER */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[800px] border border-gray-200 rounded-2xl overflow-hidden">
          
//           <div className="grid grid-cols-7 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest text-center py-3 border-b border-gray-900">
//             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
//           </div>

//           <div className="grid grid-cols-7 bg-gray-100 gap-[1px]">
//             {allDays.map((day, idx) => {
//               const currentPaddedMonth = String(month + 1).padStart(2, '0');
//               const currentPaddedDay = day ? String(day).padStart(2, '0') : "";
//               const dateString = day ? `${year}-${currentPaddedMonth}-${currentPaddedDay}` : "";
              
//               const dayEvents = events.filter(e => {
//                 if (e.date !== dateString) return false;
//                 if (filterStatus !== "All" && e.status !== filterStatus) return false;
//                 return true;
//               });

//               const dailyTotalM3 = getDailyTotalVolume(day);

//               return (
//                 <div 
//                   key={idx} 
//                   className={`min-h-[140px] bg-white p-2 flex flex-col justify-between transition-colors ${
//                     day ? 'hover:bg-gray-50/50' : 'bg-gray-50/50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className={`text-xs font-black p-1 block min-w-[24px] text-center ${
//                       day === 12 && month === 5 ? 'bg-cyan-600 text-white rounded-full' : 'text-gray-400'
//                     }`}>
//                       {day || ""}
//                     </span>
                    
//                     {dailyTotalM3 > 0 && (
//                       <span className="text-[9px] font-black bg-gray-900 text-white px-1.5 py-0.5 rounded-md uppercase tracking-wide">
//                         {dailyTotalM3.toFixed(2)} m³
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[100px] pr-0.5">
//                     {dayEvents.map(event => (
//                       <div 
//                         key={event.id}
//                         className={`p-2 border rounded-xl text-left transition-all hover:shadow-xs ${
//                           event.status === 'Completed' ? 'bg-blue-50/60 border-blue-200 text-blue-900' :
//                           event.status === 'Pending Verification' ? 'bg-amber-50/70 border-amber-200 text-amber-900' :
//                           'bg-green-50/60 border-green-200 text-green-900'
//                         }`}
//                       >
//                         <div className="flex items-center justify-between gap-1 mb-0.5">
//                           <p className="text-[10px] font-black tracking-tight truncate uppercase leading-none">{event.projectName}</p>
//                         </div>
                        
//                         <div className="flex items-center justify-between text-[8px] font-bold text-gray-500 uppercase tracking-wider mt-1 border-t border-gray-200/40 pt-1">
//                           <span className="text-cyan-700">{event.mixDesign}</span>
//                           <span className="bg-white px-1 border rounded-sm font-black">{event.volume.toFixed(1)} m³</span>
//                         </div>
                        
//                         <p className="text-[8px] text-gray-400 font-medium mt-0.5 truncate flex items-center gap-0.5">
//                           <Clock className="w-2 h-2 shrink-0" /> {event.timeBlock}
//                         </p>
//                       </div>
//                     ))}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }


// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   ChevronLeft, ChevronRight, Calendar, Clock, 
//   RefreshCw, InfoIcon, MapPin, ShieldAlert 
// } from 'lucide-react';
// import api from '@/src/lib/api';

// interface LiveEventItem {
//   id: string;
//   projectName: string;
//   projectLocation: string;
//   date: string; // YYYY-MM-DD
//   volume: number;
//   mixDesign: string;
//   status: "Confirmed" | "Pending Verification" | "Completed";
// }

// export default function ReusableCalendarView() {
//   const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 16)); // Today's Date Vector Focus
//   const [events, setEvents] = useState<LiveEventItem[]>([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
  
//   // 🔴 Dynamic Role Tracking
//   const [userRole, setUserRole] = useState<string | null>(null);

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   useEffect(() => {
//     // Safely extract the role from your system profile or token storage payload
//     if (typeof window !== 'undefined') {
//       const savedRole = localStorage.getItem('userRole') || 'dispatcher'; // Fallback mapping
//       setUserRole(savedRole.toLowerCase());
//     }
//     fetchSchedules();
//   }, []);

//   // Determine permissions parameters smoothly
//   const hasWriteAccess = userRole === 'admin' || userRole === 'dispatcher';

//   const fetchSchedules = async (silent = false) => {
//     if (!silent) setIsLoading(true);
//     try {
//       const response = await api.get('schedules/');
      
//       const mappedEvents: LiveEventItem[] = response.data.map((item: any) => {
//         const firstItem = item.order_items?.[0];
//         const volumeNum = firstItem ? parseFloat(firstItem.volume) : 0;
        
//         let rawDeliveryStatus = item.delivery_status || "Pending Dispatch";
//         let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" = "Confirmed";

//         if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
//           calendarStatus = "Completed";
//         } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification") {
//           calendarStatus = "Pending Verification";
//         } else {
//           calendarStatus = "Confirmed";
//         }

//         return {
//           id: `ORD-${item.order_id || item.id}`,
//           projectName: item.project_name || "Unnamed Project",
//           projectLocation: item.project_location || "Not Provided",
//           date: item.date || item.delivery_date, 
//           volume: volumeNum,
//           mixDesign: firstItem?.mix_design_name || "Standard RMC Mix",
//           status: calendarStatus
//         };
//       });

//       setEvents(mappedEvents);
//     } catch (error) {
//       console.error("Logistics pull execution error:", error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   const triggerManualSync = () => {
//     setIsRefreshing(true);
//     fetchSchedules(true);
//   };

//   const handleCellClick = (eventItem: LiveEventItem) => {
//     if (!hasWriteAccess) return; // Prevent raw client screens from opening modification actions
    
//     // Dispatchers and Admins can trigger order update logs here
//     console.log(`Routing dispatcher focus matrix to item context: ${eventItem.id}`);
//   };

//   const firstDayOfMonth = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
  
//   const blankDays = Array(firstDayOfMonth).fill(null);
//   const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const allDays = [...blankDays, ...monthDays];

//   const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
//   const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

//   const getDailyTotalVolume = (dayNum: number) => {
//     if (!dayNum) return 0;
//     const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
//     return events
//       .filter(e => e.date === dateString)
//       .reduce((acc, curr) => acc + curr.volume, 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 min-h-[400px]">
//         <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin mb-3" />
//         <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">Loading Fleet Logistics Array...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xs p-6 space-y-6">
      
//       {/* CARD RUNTIME CONTROLS HEADER */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
//         <div>
//           <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
//             <Calendar className="w-3.5 h-3.5" /> Operations Master Dashboard
//           </div>
//           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//             {monthNames[month]} {year}
//           </h2>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
//           {/* Dynamic Badge showing view level access context */}
//           <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-lg bg-slate-100 border text-slate-600 flex items-center gap-1 mr-2">
//             <ShieldAlert className="w-3 h-3 text-cyan-500" /> Mode: {userRole}
//           </span>

//           <button
//             onClick={triggerManualSync}
//             className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center"
//             title="Force Synchronize Backend Vectors"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
//           </button>

//           <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
//             <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600">
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600 border-l border-gray-200">
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-cyan-500/20"
//           >
//             <option value="All">All Structural Pours</option>
//             <option value="Confirmed">Confirmed Projects</option>
//             <option value="Pending Verification">Awaiting Clearances</option>
//             <option value="Completed">Completed Runs</option>
//           </select>
//         </div>
//       </div>

//       {/* RENDER MASTER GRID FRAME */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[900px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          
//           <div className="grid grid-cols-7 bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-widest text-center py-3">
//             {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <div key={d}>{d}</div>)}
//           </div>

//           <div className="grid grid-cols-7 bg-gray-200 gap-[1px]">
//             {allDays.map((day, idx) => {
//               const currentPaddedMonth = String(month + 1).padStart(2, '0');
//               const currentPaddedDay = day ? String(day).padStart(2, '0') : "";
//               const dateString = day ? `${year}-${currentPaddedMonth}-${currentPaddedDay}` : "";
              
//               const dayEvents = events.filter(e => {
//                 if (e.date !== dateString) return false;
//                 if (filterStatus !== "All" && e.status !== filterStatus) return false;
//                 return true;
//               });

//               const dailyTotalM3 = getDailyTotalVolume(day);

//               return (
//                 <div 
//                   key={idx} 
//                   className={`min-h-[150px] bg-white p-2.5 flex flex-col justify-between transition-colors ${
//                     day ? 'hover:bg-slate-50/40' : 'bg-slate-50/50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className={`text-xs font-black p-1 block min-w-[26px] text-center ${
//                       day === 16 && month === 5 ? 'bg-cyan-500 text-slate-900 rounded-lg shadow-sm font-black' : 'text-slate-400'
//                     }`}>
//                       {day || ""}
//                     </span>
                    
//                     {dailyTotalM3 > 0 && (
//                       <span className="text-[9px] font-black bg-slate-900 text-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
//                         {dailyTotalM3.toFixed(1)} m³
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[110px] pr-0.5 scrollbar-thin">
//                     {dayEvents.map(event => (
//                       <div 
//                         key={event.id}
//                         onClick={() => handleCellClick(event)}
//                         className={`p-2 border rounded-xl text-left transition-all ${
//                           hasWriteAccess ? 'hover:translate-y-[-1px] hover:shadow-xs cursor-pointer' : 'cursor-default'
//                         } ${
//                           event.status === 'Completed' ? 'bg-cyan-50/50 border-cyan-200 text-cyan-900' :
//                           event.status === 'Pending Verification' ? 'bg-amber-50/60 border-amber-200 text-amber-900' :
//                           'bg-emerald-50/50 border-emerald-200 text-emerald-900'
//                         }`}
//                       >
//                         <p className="text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5">
//                           {event.projectName}
//                         </p>
                        
//                         <p className="text-[8px] text-slate-400 font-semibold truncate uppercase flex items-center gap-0.5">
//                           <MapPin className="w-2 h-2 text-slate-400 shrink-0" /> {event.projectLocation}
//                         </p>

//                         <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider mt-1.5 border-t border-slate-200/60 pt-1">
//                           <span className="text-slate-500 max-w-[65%] truncate">{event.mixDesign}</span>
//                           <span className="bg-white/90 px-1 border border-slate-200/80 rounded-sm font-black text-slate-800">
//                             {event.volume.toFixed(1)}m³
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>

//     </div>
//   );
// }

// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   ChevronLeft, ChevronRight, Calendar, Clock, 
//   RefreshCw, InfoIcon, MapPin, ShieldAlert, X, FileText, Layers, HardHat, User, Phone
// } from 'lucide-react';
// import api from '@/src/lib/api';

// interface LiveEventItem {
//   id: string;
//   projectName: string;
//   projectLocation: string;
//   clientName: string;      // 🔴 Added Client Name Vector
//   contactNumber: string;   // 🔴 Added Contact Number Vector
//   date: string; // YYYY-MM-DD
//   volume: number;
//   mixDesign: string;       // Will capture exact specification structure strings
//   status: "Confirmed" | "Pending Verification" | "Completed";
// }

// export default function ReusableCalendarView() {
//   const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 16)); 
//   const [events, setEvents] = useState<LiveEventItem[]>([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
  
//   const [selectedEvent, setSelectedEvent] = useState<LiveEventItem | null>(null);
//   const [userRole, setUserRole] = useState<string | null>(null);

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const savedRole = localStorage.getItem('userRole') || 'dispatcher'; 
//       setUserRole(savedRole.toLowerCase());
//     }
//     fetchSchedules();
//   }, []);

//   const hasWriteAccess = userRole === 'admin' || userRole === 'dispatcher';

//   const fetchSchedules = async (silent = false) => {
//     if (!silent) setIsLoading(true);
//     try {
//       const response = await api.get('schedules/');
      
//       const mappedEvents: LiveEventItem[] = response.data.map((item: any) => {
//         const firstItem = item.order_items?.[0];
//         const volumeNum = firstItem ? parseFloat(firstItem.volume) : 0;
        
//         let rawDeliveryStatus = item.delivery_status || "Pending Dispatch";
//         let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" = "Confirmed";

//         if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
//           calendarStatus = "Completed";
//         } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification") {
//           calendarStatus = "Pending Verification";
//         } else {
//           calendarStatus = "Confirmed";
//         }

//         // 🔴 Safely constructs structural details or falls back to standard naming
//         const exactSpec = firstItem?.mix_design_spec || 
//                           firstItem?.mix_design_name || 
//                           "ORD 3000 G-1 @ 28 DAYS";

//         return {
//           id: `ORD-${item.order_id || item.id}`,
//           projectName: item.project_name || "Unnamed Project",
//           projectLocation: item.project_location || "Not Provided",
//           clientName: item.client_name || item.customer_name || "Unknown Client",
//           contactNumber: item.contact_number || item.client_phone || "No Contact #",
//           date: item.date || item.delivery_date, 
//           volume: volumeNum,
//           mixDesign: exactSpec, 
//           status: calendarStatus
//         };
//       });

//       setEvents(mappedEvents);
//     } catch (error) {
//       console.error("Logistics pull execution error:", error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   const triggerManualSync = () => {
//     setIsRefreshing(true);
//     fetchSchedules(true);
//   };

//   const handleCellClick = (eventItem: LiveEventItem) => {
//     if (!hasWriteAccess) return; 
//     setSelectedEvent(eventItem); 
//   };

//   const firstDayOfMonth = new Date(year, month, 1).getDay();
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
  
//   const blankDays = Array(firstDayOfMonth).fill(null);
//   const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const allDays = [...blankDays, ...monthDays];

//   const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
//   const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

//   const getDailyTotalVolume = (dayNum: number) => {
//     if (!dayNum) return 0;
//     const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
//     return events
//       .filter(e => e.date === dateString)
//       .reduce((acc, curr) => acc + curr.volume, 0);
//   };

//   if (isLoading) {
//     return (
//       <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 min-h-[400px]">
//         <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin mb-3" />
//         <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">Loading Fleet Logistics Array...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xs p-6 space-y-6 relative">
      
//       {/* HEADER BAR CONTROLS */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
//         <div>
//           <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
//             <Calendar className="w-3.5 h-3.5" /> Operations Master Dashboard
//           </div>
//           <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
//             {monthNames[month]} {year}
//           </h2>
//         </div>

//         <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
//           <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-lg bg-slate-100 border text-slate-600 flex items-center gap-1 mr-2">
//             <ShieldAlert className="w-3 h-3 text-cyan-500" /> Mode: {userRole}
//           </span>

//           <button
//             onClick={triggerManualSync}
//             className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
//           </button>

//           <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
//             <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600">
//               <ChevronLeft className="w-4 h-4" />
//             </button>
//             <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600 border-l border-gray-200">
//               <ChevronRight className="w-4 h-4" />
//             </button>
//           </div>

//           <select
//             value={filterStatus}
//             onChange={(e) => setFilterStatus(e.target.value)}
//             className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
//           >
//             <option value="All">All Structural Pours</option>
//             <option value="Confirmed">Confirmed Projects</option>
//             <option value="Pending Verification">Awaiting Clearances</option>
//             <option value="Completed">Completed Runs</option>
//           </select>
//         </div>
//       </div>

//       {/* RENDER MASTER GRID FRAME */}
//       <div className="overflow-x-auto">
//         <div className="min-w-[900px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          
//           <div className="grid grid-cols-7 bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-widest text-center py-3">
//             {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <div key={d}>{d}</div>)}
//           </div>

//           <div className="grid grid-cols-7 bg-gray-200 gap-[1px]">
//             {allDays.map((day, idx) => {
//               const currentPaddedMonth = String(month + 1).padStart(2, '0');
//               const currentPaddedDay = day ? String(day).padStart(2, '0') : "";
//               const dateString = day ? `${year}-${currentPaddedMonth}-${currentPaddedDay}` : "";
              
//               const dayEvents = events.filter(e => {
//                 if (e.date !== dateString) return false;
//                 if (filterStatus !== "All" && e.status !== filterStatus) return false;
//                 return true;
//               });

//               const dailyTotalM3 = getDailyTotalVolume(day);

//               return (
//                 <div 
//                   key={idx} 
//                   className={`min-h-[150px] bg-white p-2.5 flex flex-col justify-between transition-colors ${
//                     day ? 'hover:bg-slate-50/40' : 'bg-slate-50/50'
//                   }`}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className={`text-xs font-black p-1 block min-w-[26px] text-center ${
//                       day === 16 && month === 5 ? 'bg-cyan-500 text-slate-900 rounded-lg shadow-sm font-black' : 'text-slate-400'
//                     }`}>
//                       {day || ""}
//                     </span>
                    
//                     {dailyTotalM3 > 0 && (
//                       <span className="text-[9px] font-black bg-slate-900 text-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
//                         {dailyTotalM3.toFixed(1)} m³
//                       </span>
//                     )}
//                   </div>

//                   <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[110px] pr-0.5 scrollbar-thin">
//                     {dayEvents.map(event => (
//                       <div 
//                         key={event.id}
//                         onClick={() => handleCellClick(event)}
//                         className={`p-2 border rounded-xl text-left transition-all ${
//                           hasWriteAccess ? 'hover:translate-y-[-1px] hover:shadow-xs cursor-pointer' : 'cursor-default'
//                         } ${
//                           event.status === 'Completed' ? 'bg-cyan-50/50 border-cyan-200 text-cyan-900' :
//                           event.status === 'Pending Verification' ? 'bg-amber-50/60 border-amber-200 text-amber-900' :
//                           'bg-emerald-50/50 border-emerald-200 text-emerald-900'
//                         }`}
//                       >
//                         <p className="text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5">
//                           {event.projectName}
//                         </p>
                        
//                         <p className="text-[8px] text-slate-400 font-semibold truncate uppercase flex items-center gap-0.5">
//                           <MapPin className="w-2 h-2 text-slate-400 shrink-0" /> {event.projectLocation}
//                         </p>

//                         <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider mt-1.5 border-t border-slate-200/60 pt-1">
//                           <span className="text-slate-500 max-w-[65%] truncate">{event.mixDesign}</span>
//                           <span className="bg-white/90 px-1 border border-slate-200/80 rounded-sm font-black text-slate-800">
//                             {event.volume.toFixed(1)}m³
//                           </span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                 </div>
//               );
//             })}
//           </div>

//         </div>
//       </div>

//       {/* RECONNAISSANCE MODAL DIALOG OVERLAY */}
//       {selectedEvent && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
//           <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 p-6 space-y-5">
            
//             {/* Modal Header */}
//             <div className="flex justify-between items-center border-b border-gray-100 pb-4">
//               <div className="flex items-center gap-2">
//                 <span className={`w-2.5 h-2.5 rounded-full ${
//                   selectedEvent.status === 'Completed' ? 'bg-cyan-500' :
//                   selectedEvent.status === 'Pending Verification' ? 'bg-amber-500' : 'bg-emerald-500'
//                 }`} />
//                 <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase">
//                   {selectedEvent.id} • Logistics Record
//                 </p>
//               </div>
//               <button 
//                 onClick={() => setSelectedEvent(null)}
//                 className="p-1.5 rounded-xl text-gray-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>

//             {/* Main Job Metric Details */}
//             <div className="space-y-3.5">
              
//               {/* 1. Project Name */}
//               <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
//                 <HardHat className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" />
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Name</p>
//                   <p className="font-extrabold text-sm text-slate-900 uppercase leading-snug">{selectedEvent.projectName}</p>
//                 </div>
//               </div>

//               {/* 2. Client Identity Info Panel */}
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
//                   <User className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
//                   <div>
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Client Name</p>
//                     <p className="font-bold text-xs text-slate-800 uppercase max-w-full truncate">{selectedEvent.clientName}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
//                   <Phone className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
//                   <div>
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Contact Number</p>
//                     <p className="font-mono text-xs font-bold text-slate-700 tracking-tight">{selectedEvent.contactNumber}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* 3. Project Site Location */}
//               <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
//                 <MapPin className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Site / Destination</p>
//                   <p className="font-bold text-xs text-slate-700 uppercase leading-snug">{selectedEvent.projectLocation}</p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 {/* 4. Ready Mix Design Spec */}
//                 <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
//                   <Layers className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
//                   <div>
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Ready Mix Design</p>
//                     <p className="font-black text-[11px] text-slate-800 uppercase tracking-tight leading-tight mt-0.5">
//                       {selectedEvent.mixDesign}
//                     </p>
//                   </div>
//                 </div>

//                 {/* 5. Target Load Volume */}
//                 <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0f172a] text-white">
//                   <FileText className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
//                   <div>
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Target Volume</p>
//                     <p className="font-black text-base text-cyan-400 tracking-tight leading-none mt-1">
//                       {selectedEvent.volume.toFixed(1)} m³
//                     </p>
//                   </div>
//                 </div>
//               </div>

//             </div>

//             {/* Modal Closing Trigger */}
//             <div className="pt-2">
//               <button
//                 onClick={() => setSelectedEvent(null)}
//                 className="w-full bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-md transition-all"
//               >
//                 Close Metrics View
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, 
  RefreshCw, InfoIcon, MapPin, ShieldAlert, X, FileText, Layers, HardHat, User, Phone
} from 'lucide-react';
import api from '@/src/lib/api';

interface LiveEventItem {
  id: string;
  projectName: string;
  projectLocation: string;
  clientName: string;      
  contactNumber: string;   
  date: string; // YYYY-MM-DD
  volume: number;
  mixDesign: string;       
  status: "Confirmed" | "Pending Verification" | "Completed";
}

export default function ReusableCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 16)); 
  const [events, setEvents] = useState<LiveEventItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [selectedEvent, setSelectedEvent] = useState<LiveEventItem | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('userRole') || 'dispatcher'; 
      setUserRole(savedRole.toLowerCase());
    }
    fetchSchedules();
  }, []);

  const hasWriteAccess = userRole === 'admin' || userRole === 'dispatcher';

  const fetchSchedules = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await api.get('schedules/');
      
      const mappedEvents: LiveEventItem[] = response.data.map((item: any) => {
        const firstItem = item.order_items?.[0];
        const volumeNum = firstItem ? parseFloat(firstItem.volume) : 0;
        
        let rawDeliveryStatus = item.delivery_status || "Pending Dispatch";
        let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" = "Confirmed";

        if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
          calendarStatus = "Completed";
        } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification") {
          calendarStatus = "Pending Verification";
        } else {
          calendarStatus = "Confirmed";
        }

        // 🟢 Safely extracts nested fields regardless of database state
        const exactSpec = firstItem?.mix_design_spec || 
                          firstItem?.mix_design?.design_name ||
                          firstItem?.mix_design_name || 
                          "ORD 3000 G-1 @ 28 DAYS";

        // 🟢 Robust handling of dates to ensure formatting matches the cell logic (YYYY-MM-DD)
        let cleanDate = item.date;
        if (!cleanDate && item.delivery_date) {
          cleanDate = item.delivery_date.split('T')[0]; // Safe fallback split for timestamps
        }
        if (!cleanDate) {
          cleanDate = "2026-06-16"; // Global hard recovery configuration fallback
        }

        return {
          id: `ORD-${item.order_id || item.id}`,
          projectName: item.project_name || "Unnamed Project",
          projectLocation: item.project_location || "Not Provided",
          clientName: item.client_name || "Unknown Client",
          contactNumber: item.contact_number || "No Contact #",
          date: cleanDate, 
          volume: volumeNum,
          mixDesign: exactSpec, 
          status: calendarStatus
        };
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Logistics pull execution error:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const triggerManualSync = () => {
    setIsRefreshing(true);
    fetchSchedules(true);
  };

  const handleCellClick = (eventItem: LiveEventItem) => {
    if (!hasWriteAccess) return; 
    setSelectedEvent(eventItem); 
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
      <div className="p-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100 min-h-[400px]">
        <RefreshCw className="w-6 h-6 text-cyan-500 animate-spin mb-3" />
        <p className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400">Loading Fleet Logistics Array...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 shadow-xs p-6 space-y-6 relative">
      
      {/* HEADER BAR CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
            <Calendar className="w-3.5 h-3.5" /> Operations Master Dashboard
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[9px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-lg bg-slate-100 border text-slate-600 flex items-center gap-1 mr-2">
            <ShieldAlert className="w-3 h-3 text-cyan-500" /> Mode: {userRole}
          </span>

          <button
            onClick={triggerManualSync}
            className="p-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center justify-center"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-gray-100 transition-colors text-slate-600 border-l border-gray-200">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
          >
            <option value="All">All Structural Pours</option>
            <option value="Confirmed">Confirmed Projects</option>
            <option value="Pending Verification">Awaiting Clearances</option>
            <option value="Completed">Completed Runs</option>
          </select>
        </div>
      </div>

      {/* RENDER MASTER GRID FRAME */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px] border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
          
          <div className="grid grid-cols-7 bg-slate-900 text-slate-300 text-[10px] font-black uppercase tracking-widest text-center py-3">
            {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 bg-gray-200 gap-[1px]">
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
                  className={`min-h-[150px] bg-white p-2.5 flex flex-col justify-between transition-colors ${
                    day ? 'hover:bg-slate-50/40' : 'bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black p-1 block min-w-[26px] text-center ${
                      day === 16 && month === 5 ? 'bg-cyan-500 text-slate-900 rounded-lg shadow-sm font-black' : 'text-slate-400'
                    }`}>
                      {day || ""}
                    </span>
                    
                    {dailyTotalM3 > 0 && (
                      <span className="text-[9px] font-black bg-slate-900 text-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wide">
                        {dailyTotalM3.toFixed(1)} m³
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[110px] pr-0.5 scrollbar-thin">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id}
                        onClick={() => handleCellClick(event)}
                        className={`p-2 border rounded-xl text-left transition-all ${
                          hasWriteAccess ? 'hover:translate-y-[-1px] hover:shadow-xs cursor-pointer' : 'cursor-default'
                        } ${
                          event.status === 'Completed' ? 'bg-cyan-50/50 border-cyan-200 text-cyan-900' :
                          event.status === 'Pending Verification' ? 'bg-amber-50/60 border-amber-200 text-amber-900' :
                          'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <p className="text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5">
                          {event.projectName}
                        </p>
                        
                        <p className="text-[8px] text-slate-400 font-semibold truncate uppercase flex items-center gap-0.5">
                          <MapPin className="w-2 h-2 text-slate-400 shrink-0" /> {event.projectLocation}
                        </p>

                        <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider mt-1.5 border-t border-slate-200/60 pt-1">
                          <span className="text-slate-500 max-w-[65%] truncate">{event.mixDesign}</span>
                          <span className="bg-white/90 px-1 border border-slate-200/80 rounded-sm font-black text-slate-800">
                            {event.volume.toFixed(1)}m³
                          </span>
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

      {/* RECONNAISSANCE MODAL DIALOG OVERLAY */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 p-6 space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedEvent.status === 'Completed' ? 'bg-cyan-500' :
                  selectedEvent.status === 'Pending Verification' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase">
                  {selectedEvent.id} • Logistics Record
                </p>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Main Job Metric Details */}
            <div className="space-y-3.5">
              
              {/* 1. Project Name */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <HardHat className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Name</p>
                  <p className="font-extrabold text-sm text-slate-900 uppercase leading-snug">{selectedEvent.projectName}</p>
                </div>
              </div>

              {/* 2. Client Identity Info Panel */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <User className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Client Name</p>
                    <p className="font-bold text-xs text-slate-800 uppercase max-w-full truncate">{selectedEvent.clientName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <Phone className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Contact Number</p>
                    <p className="font-mono text-xs font-bold text-slate-700 tracking-tight">{selectedEvent.contactNumber}</p>
                  </div>
                </div>
              </div>

              {/* 3. Project Site Location */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                <MapPin className="w-5 h-5 text-cyan-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Site / Destination</p>
                  <p className="font-bold text-xs text-slate-700 uppercase leading-snug">{selectedEvent.projectLocation}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 4. Ready Mix Design Spec */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <Layers className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Ready Mix Design</p>
                    <p className="font-black text-[11px] text-slate-800 uppercase tracking-tight leading-tight mt-0.5">
                      {selectedEvent.mixDesign}
                    </p>
                  </div>
                </div>

                {/* 5. Target Load Volume */}
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0f172a] text-white">
                  <FileText className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Target Volume</p>
                    <p className="font-black text-base text-cyan-400 tracking-tight leading-none mt-1">
                      {selectedEvent.volume.toFixed(1)} m³
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Closing Trigger */}
            <div className="pt-2">
              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-md transition-all"
              >
                Close Metrics View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}