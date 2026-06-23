
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
//   clientName: string;      
//   contactNumber: string;   
//   date: string; // YYYY-MM-DD
//   volume: number;
//   mixDesign: string;       
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

//         // 🟢 Safely extracts nested fields regardless of database state
//         const exactSpec = firstItem?.mix_design_spec || 
//                           firstItem?.mix_design?.design_name ||
//                           firstItem?.mix_design_name || 
//                           "ORD 3000 G-1 @ 28 DAYS";

//         // 🟢 Robust handling of dates to ensure formatting matches the cell logic (YYYY-MM-DD)
//         let cleanDate = item.date;
//         if (!cleanDate && item.delivery_date) {
//           cleanDate = item.delivery_date.split('T')[0]; // Safe fallback split for timestamps
//         }
//         if (!cleanDate) {
//           cleanDate = "2026-06-16"; // Global hard recovery configuration fallback
//         }

//         return {
//           id: `ORD-${item.order_id || item.id}`,
//           projectName: item.project_name || "Unnamed Project",
//           projectLocation: item.project_location || "Not Provided",
//           clientName: item.client_name || "Unknown Client",
//           contactNumber: item.contact_number || "No Contact #",
//           date: cleanDate, 
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

// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   ChevronLeft, ChevronRight, Calendar, Clock, 
//   RefreshCw, InfoIcon, MapPin, ShieldAlert, X, FileText, Layers, HardHat, User, Phone,
//   XCircle // Added icon for cancelled status visual feedback
// } from 'lucide-react';
// import api from '@/src/lib/api';

// interface LiveEventItem {
//   id: string;
//   projectName: string;
//   projectLocation: string;
//   clientName: string;      
//   contactNumber: string;   
//   date: string; // YYYY-MM-DD
//   volume: number;
//   mixDesign: string;       
//   status: "Confirmed" | "Pending Verification" | "Completed" | "Cancelled"; // 🌟 Added "Cancelled"
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
        
//         // 🌟 FIX: Safely dig through inner nested Django relational keys
//         let rawDeliveryStatus = item.order?.delivery?.status || item.delivery_status || "Pending Dispatch";
//         let rawOrderStatus = item.order?.status || ""; 
        
//         let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" | "Cancelled" = "Confirmed";

//         // Evaluate Cancellation status safely from Order status tree first
//         if (
//           rawOrderStatus === "Cancelled" || 
//           rawOrderStatus === "Canceled" || 
//           rawDeliveryStatus === "Cancelled" || 
//           rawDeliveryStatus === "Canceled"
//         ) {
//           calendarStatus = "Cancelled";
//         } else if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
//           calendarStatus = "Completed";
//         } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification" || rawOrderStatus === "For Payment Verification") {
//           calendarStatus = "Pending Verification";
//         } else {
//           calendarStatus = "Confirmed";
//         }

//         // Fallbacks for project metrics directly from the nested order model if needed
//         const cleanProjectName = item.project_name || item.order?.project_name || "Unnamed Project";
//         const cleanLocation = item.project_location || item.order?.project_location || "Not Provided";
//         const cleanClient = item.client_name || item.order?.client_name || "Unknown Client";
//         const cleanContact = item.contact_number || item.order?.contact_number || "No Contact #";

//         const exactSpec = firstItem?.mix_design_spec || 
//                           firstItem?.mix_design?.design_name ||
//                           firstItem?.mix_design_name || 
//                           "ORD 3000 G-1 @ 28 DAYS";

//         let cleanDate = item.date;
//         if (!cleanDate && item.delivery_date) {
//           cleanDate = item.delivery_date.split('T')[0]; 
//         }
//         if (!cleanDate) {
//           cleanDate = "2026-06-16"; 
//         }

//         return {
//           id: `ORD-${item.order_id || item.order?.id || item.id}`,
//           projectName: cleanProjectName,
//           projectLocation: cleanLocation,
//           clientName: cleanClient,
//           contactNumber: cleanContact,
//           date: cleanDate, 
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

//   // Modifying total daily volume to ignore Cancelled loads so metrics stay accurate
//   const getDailyTotalVolume = (dayNum: number) => {
//     if (!dayNum) return 0;
//     const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
//     return events
//       .filter(e => e.date === dateString && e.status !== 'Cancelled')
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
//             <option value="Cancelled">Cancelled Sequences</option> {/* 🌟 Filter Added */}
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
//                           event.status === 'Cancelled' ? 'bg-rose-50/60 border-rose-200 text-rose-900 opacity-75 strike-through-effect' : // 🌟 Cancelled Card Color
//                           'bg-emerald-50/50 border-emerald-200 text-emerald-900'
//                         }`}
//                       >
//                         <p className={`text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5 ${event.status === 'Cancelled' ? 'line-through decoration-rose-400 text-slate-500' : ''}`}>
//                           {event.projectName}
//                         </p>
                        
//                         <p className="text-[8px] text-slate-400 font-semibold truncate uppercase flex items-center gap-0.5">
//                           {event.status === 'Cancelled' ? <XCircle className="w-2 h-2 text-rose-500 shrink-0" /> : <MapPin className="w-2 h-2 text-slate-400 shrink-0" />} 
//                           {event.projectLocation}
//                         </p>

//                         <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider mt-1.5 border-t border-slate-200/60 pt-1">
//                           <span className="text-slate-500 max-w-[65%] truncate">{event.mixDesign}</span>
//                           <span className={`px-1 border rounded-sm font-black ${event.status === 'Cancelled' ? 'bg-rose-100/80 border-rose-200 text-rose-700 line-through' : 'bg-white/90 border-slate-200/80 text-slate-800'}`}>
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
//                   selectedEvent.status === 'Pending Verification' ? 'bg-amber-500' : 
//                   selectedEvent.status === 'Cancelled' ? 'bg-rose-500' : 'bg-emerald-500' // 🌟 Modal Header dot status color
//                 }`} />
//                 <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase">
//                   {selectedEvent.id} • {selectedEvent.status === 'Cancelled' ? 'CANCELLED SEQUENCE RECORD' : 'Logistics Record'}
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
//               <div className={`flex items-start gap-3 p-3 rounded-2xl border ${selectedEvent.status === 'Cancelled' ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50/80 border-slate-100'}`}>
//                 <HardHat className={`w-5 h-5 mt-0.5 shrink-0 ${selectedEvent.status === 'Cancelled' ? 'text-rose-600' : 'text-slate-700'}`} />
//                 <div>
//                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Name</p>
//                   <p className={`font-extrabold text-sm uppercase leading-snug ${selectedEvent.status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{selectedEvent.projectName}</p>
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
//                 <div className={`flex items-start gap-3 p-3 rounded-2xl text-white ${selectedEvent.status === 'Cancelled' ? 'bg-rose-950 border border-rose-900/50' : 'bg-[#0f172a]'}`}>
//                   <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${selectedEvent.status === 'Cancelled' ? 'text-rose-400' : 'text-cyan-400'}`} />
//                   <div>
//                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Target Volume</p>
//                     <p className={`font-black text-base tracking-tight leading-none mt-1 ${selectedEvent.status === 'Cancelled' ? 'text-rose-400 line-through' : 'text-cyan-400'}`}>
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
//                 className={`w-full text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-md transition-all ${selectedEvent.status === 'Cancelled' ? 'bg-rose-900 hover:bg-rose-800' : 'bg-slate-900 hover:bg-slate-800'}`}
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
  RefreshCw, InfoIcon, MapPin, ShieldAlert, X, FileText, Layers, HardHat, User, Phone,
  XCircle,
  Building
} from 'lucide-react';
import api from '@/src/lib/api';

interface LiveEventItem {
  id: string;
  companyName: string;
  projectName: string;
  projectLocation: string;
  clientName: string;      
  contactNumber: string;   
  date: string; // YYYY-MM-DD
  volume: number;
  mixDesign: string;       
  status: "Confirmed" | "Pending Verification" | "Completed" | "Cancelled";
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
        
        let rawDeliveryStatus = item.order?.delivery?.status || item.delivery_status || "Pending Dispatch";
        let rawOrderStatus = item.order?.status || ""; 
        
        let calendarStatus: "Confirmed" | "Pending Verification" | "Completed" | "Cancelled" = "Confirmed";

        if (
          rawOrderStatus === "Cancelled" || 
          rawOrderStatus === "Canceled" || 
          rawDeliveryStatus === "Cancelled" || 
          rawDeliveryStatus === "Canceled"
        ) {
          calendarStatus = "Cancelled";
        } else if (rawDeliveryStatus === "Completed" || rawDeliveryStatus === "Delivered") {
          calendarStatus = "Completed";
        } else if (rawDeliveryStatus === "Pending Dispatch" || rawDeliveryStatus === "For Payment Verification" || rawOrderStatus === "For Payment Verification") {
          calendarStatus = "Pending Verification";
        } else {
          calendarStatus = "Confirmed";
        }

        const cleanProjectName = item.project_name || item.order?.project_name || "Unnamed Project";
        const cleanLocation = item.project_location || item.order?.project_location || "Not Provided";
        const cleanClient = item.client_name || item.order?.client_name || "Unknown Client";
        const cleanContact = item.contact_number || item.order?.contact_number || "No Contact #";

        const exactSpec = firstItem?.mix_design_spec || 
                          firstItem?.mix_design?.design_name ||
                          firstItem?.mix_design_name || 
                          "ORD 3000 G-1 @ 28 DAYS";

        let cleanDate = item.date;
        if (!cleanDate && item.delivery_date) {
          cleanDate = item.delivery_date.split('T')[0]; 
        }
        if (!cleanDate) {
          cleanDate = "2026-06-16"; 
        }

        return {
          id: `ORD-${item.order_id || item.order?.id || item.id}`,
          companyName: item.company_name || item.order?.company_name || "Unknown Company",
          projectName: cleanProjectName,
          projectLocation: cleanLocation,
          clientName: cleanClient,
          contactNumber: cleanContact,
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
      .filter(e => e.date === dateString && e.status !== 'Cancelled')
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
            <option value="Cancelled">Cancelled Sequences</option>
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
                          event.status === 'Cancelled' ? 'bg-rose-50/80 border-rose-200/80 text-rose-900 bg-linear-to-r opacity-65 lines-diagonal' :
                          'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <p className={`text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5 ${event.status === 'Cancelled' ? 'line-through decoration-rose-500 decoration-2 text-slate-400' : ''}`}>
                          {event.companyName}
                        </p>
                        <p className={`text-[10px] font-black tracking-tight truncate uppercase leading-tight mb-0.5 ${event.status === 'Cancelled' ? 'line-through decoration-rose-500 decoration-2 text-slate-400' : ''}`}>
                          {event.projectName}
                        </p>
                        
                        <p className="text-[8px] text-slate-400 font-semibold truncate uppercase flex items-center gap-0.5">
                          {event.status === 'Cancelled' ? <XCircle className="w-2 h-2 text-rose-500 shrink-0" /> : <MapPin className="w-2 h-2 text-slate-400 shrink-0" />} 
                          {event.projectLocation}
                        </p>

                        <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider mt-1.5 border-t border-slate-200/60 pt-1">
                          <span className="text-slate-500 max-w-[65%] truncate">{event.mixDesign}</span>
                          <span className={`px-1 border rounded-sm font-black ${event.status === 'Cancelled' ? 'bg-rose-100/80 border-rose-200 text-rose-700 line-through' : 'bg-white/90 border-slate-200/80 text-slate-800'}`}>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden p-6 space-y-5">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  selectedEvent.status === 'Completed' ? 'bg-cyan-500' :
                  selectedEvent.status === 'Pending Verification' ? 'bg-amber-500' : 
                  selectedEvent.status === 'Cancelled' ? 'bg-rose-500' : 'bg-emerald-500'
                }`} />
                <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase">
                  {selectedEvent.id} • {selectedEvent.status === 'Cancelled' ? 'CANCELLED SEQUENCE RECORD' : 'Logistics Record'}
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

               {/* 0. Company Name */}
              <div className={`flex items-start gap-3 p-3 rounded-2xl border ${selectedEvent.status === 'Cancelled' ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50/80 border-slate-100'}`}>
                <Building className={`w-5 h-5 mt-0.5 shrink-0 ${selectedEvent.status === 'Cancelled' ? 'text-rose-600' : 'text-slate-700'}`} />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Company Name</p>
                  <p className={`font-extrabold text-sm uppercase leading-snug ${selectedEvent.status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{selectedEvent.companyName}</p>
                </div>
              </div>
              
              {/* 1. Project Name */}
              <div className={`flex items-start gap-3 p-3 rounded-2xl border ${selectedEvent.status === 'Cancelled' ? 'bg-rose-50/30 border-rose-100' : 'bg-slate-50/80 border-slate-100'}`}>
                <HardHat className={`w-5 h-5 mt-0.5 shrink-0 ${selectedEvent.status === 'Cancelled' ? 'text-rose-600' : 'text-slate-700'}`} />
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Name</p>
                  <p className={`font-extrabold text-sm uppercase leading-snug ${selectedEvent.status === 'Cancelled' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{selectedEvent.projectName}</p>
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
                <div className={`flex items-start gap-3 p-3 rounded-2xl text-white ${selectedEvent.status === 'Cancelled' ? 'bg-rose-950 border border-rose-900/50' : 'bg-[#0f172a]'}`}>
                  <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${selectedEvent.status === 'Cancelled' ? 'text-rose-400' : 'text-cyan-400'}`} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Target Volume</p>
                    <p className={`font-black text-base tracking-tight leading-none mt-1 ${selectedEvent.status === 'Cancelled' ? 'text-rose-400 line-through' : 'text-cyan-400'}`}>
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
                className={`w-full text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl shadow-md transition-all ${selectedEvent.status === 'Cancelled' ? 'bg-rose-900 hover:bg-rose-800' : 'bg-slate-900 hover:bg-slate-800'}`}
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