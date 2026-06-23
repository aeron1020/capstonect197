

// "use client";
// import { useState, useEffect } from 'react';
// import { 
//   Truck, Calendar, MapPin, Search, Filter, 
//   Play, RefreshCw, Layers, Package 
// } from 'lucide-react';
// import Swal from 'sweetalert2';
// import axios from 'axios';
// import ReusableCalendarView from '@/src/components/CalendarView';

// const API_BASE_URL = "http://127.0.0.1:8000/api";

// interface DeliveryItem {
//   id: string; 
//   orderId: string;
//   projectName: string;
//   location: string;
//   date: string;
//   volume: string;
//   volumeNum: number;
//   mixDesign: string;
//   status: string;
//   driver: string;
//   truckNo: string;
//   dispatchedTime: string;
//   timeLimitMins: number;
//   elapsedMins: number;
// }

// export default function DispatcherDashboard() {
//   const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
//   const [activeTab, setActiveTab] = useState<'live' | 'calendar'>('live');
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Auth helper configuration
//   const getAuthHeaders = () => {
//     const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
//     return token ? { Authorization: `Bearer ${token}` } : {};
//   };

//   const fetchSchedulesFromBackend = async (silent = false) => {
//     if (!silent) setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE_URL}/schedules/`, { headers: getAuthHeaders() });
      
//       const mappedData: DeliveryItem[] = response.data.map((item: any) => {
//         const firstItem = item.order_items?.[0];
//         const computedVolume = firstItem ? parseFloat(firstItem.volume) : 0;
        
//         return {
//           id: `SCH-${item.id}`,
//           orderId: `ORD-${item.order_id}`,
//           projectName: item.project_name || "Unnamed Project",
//           location: item.project_location || "No Site Location Provided",
//           date: item.date, 
//           volume: `${computedVolume.toFixed(2)} m³`,
//           volumeNum: computedVolume,
//           mixDesign: firstItem?.mix_design?.design_name || "Standard RMC Mix",
//           status: item.delivery_status || "Pending Dispatch",
//           driver: item.driver_name || "Unassigned Driver", 
//           truckNo: item.truck_plate || "Unassigned Truck",
//           dispatchedTime: "--:--",
//           timeLimitMins: 90,
//           elapsedMins: 0
//         };
//       });

//       setDeliveries(mappedData);
//     } catch (error) {
//       console.error("Failed parsing logistics payloads from endpoint:", error);
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchSchedulesFromBackend();
//   }, []);

//   const triggerSync = () => {
//     setIsRefreshing(true);
//     fetchSchedulesFromBackend(true);
//   };

//   const handleUpdateStatus = (scheduleId: string, currentStatus: string) => {
//     const statusSequence = ["Pending Dispatch", "Batching", "In Transit", "Pouring", "Completed"];
//     const currentIndex = statusSequence.indexOf(currentStatus);
//     if (currentIndex === -1 || currentIndex === statusSequence.length - 1) return;
    
//     const nextStatus = statusSequence[currentIndex + 1];
//     const numericId = scheduleId.replace("SCH-", "");

//     Swal.fire({
//       title: 'UPDATE DISPATCH STAGE?',
//       text: `Advance production workflow tracking status to ${nextStatus.toUpperCase()}?`,
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonColor: '#0284c7',
//       cancelButtonColor: '#6b7280',
//       confirmButtonText: 'CONFIRM STATE TRANSITION'
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.post(
//             `${API_BASE_URL}/schedules/${numericId}/update_delivery_status/`, 
//             { status: nextStatus },
//             { headers: getAuthHeaders() }
//           );
          
//           Swal.fire('LOGISTICS UPDATED', `State successfully updated to ${nextStatus}.`, 'success');
//           fetchSchedulesFromBackend(true); 
//         } catch (err) {
//           Swal.fire('ERROR', 'Could not save the updated status to the database.', 'error');
//         }
//       }
//     });
//   };

//   const filteredDeliveries = deliveries.filter(item => {
//     const matchesSearch = item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
//                           item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                           item.location.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesFilter = statusFilter === "All" || item.status === statusFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const totalActiveTransits = deliveries.filter(d => d.status !== "Completed" && d.status !== "Pending Dispatch").length;

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-[#f3f4f6]">
//         <RefreshCw className="w-12 h-12 text-cyan-600 animate-spin mb-4" />
//         <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Scheduled Dispatches...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-4 bg-[#f3f4f6] min-h-screen font-sans text-gray-800 antialiased">
      
//       {/* HEADER STATS */}
//       <header className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Active Transits</p>
//             <h2 className="text-3xl font-black text-gray-900 mt-1">{totalActiveTransits} <span className="text-xs text-gray-400 font-normal">Active Trucks</span></h2>
//           </div>
//           <div className="p-3.5 bg-cyan-50 text-cyan-600 rounded-2xl">
//             <Truck className="w-6 h-6" />
//           </div>
//         </div>

//         <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
//           <div>
//             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Approved Runs In Queue</p>
//             <h2 className="text-3xl font-black text-gray-900 mt-1">
//               {deliveries.filter(d => d.status === "Pending Dispatch").length} <span className="text-xs text-gray-400 font-normal">Queued</span>
//             </h2>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
//             <Package className="w-6 h-6" />
//           </div>
//         </div>

//         <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center items-end">
//           <button 
//             onClick={triggerSync}
//             className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-cyan-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors w-full md:w-auto justify-center"
//           >
//             <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
//             {isRefreshing ? "Fetching Database Rows..." : "Sync Logistics Board"}
//           </button>
//         </div>
//       </header>

//       {/* VIEW SELECTION SWITCHER */}
//       <div className="flex justify-between items-center bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex-col sm:flex-row gap-3">
//         <p className="text-xs font-bold text-gray-400 pl-2 uppercase tracking-wider">Operational Node Terminal</p>
//         <div className="bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner inline-flex gap-1 w-full sm:w-auto">
//           <button
//             onClick={() => setActiveTab('live')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all justify-center flex-1 sm:flex-initial ${
//               activeTab === 'live' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50/50'
//             }`}
//           >
//             <Layers className="w-3.5 h-3.5" /> Approved Delivery List
//           </button>
//           <button
//             onClick={() => setActiveTab('calendar')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all justify-center flex-1 sm:flex-initial ${
//               activeTab === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50/50'
//             }`}
//           >
//             <Calendar className="w-3.5 h-3.5" /> Approved Production Calendar
//           </button>
//         </div>
//       </div>

//       {/* RENDER ACTIVE TAB CANVAS */}
//       {activeTab === 'live' ? (
//         <div className="space-y-4">
//           <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
//             <div className="relative w-full md:max-w-md">
//               <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search approved projects, IDs, or target destinations..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder-gray-400"
//               />
//             </div>

//             <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
//               <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 shrink-0 px-2">
//                 <Filter className="w-3 h-3" /> Delivery Stage:
//               </span>
//               {["All", "Pending Dispatch", "Batching", "In Transit", "Pouring", "Completed"].map((statusOption) => (
//                 <button
//                   key={statusOption}
//                   onClick={() => setStatusFilter(statusOption)}
//                   className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
//                     statusFilter === statusOption ? "bg-cyan-600 text-white shadow-xs" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
//                   }`}
//                 >
//                   {statusOption}
//                 </button>
//               ))}
//             </div>
//           </section>

//           <main className="space-y-3">
//             {filteredDeliveries.length > 0 ? (
//               filteredDeliveries.map((delivery) => (
//                 <div key={delivery.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all shadow-xs">
//                   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
//                     <div className="space-y-2 flex-1">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded-md">
//                           {delivery.id} ({delivery.orderId})
//                         </span>
//                         <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide ${
//                           delivery.status === 'Completed' ? 'bg-green-100 text-green-700' :
//                           delivery.status === 'Pouring' ? 'bg-purple-100 text-purple-700' :
//                           delivery.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
//                           delivery.status === 'Batching' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
//                         }`}>
//                           ● {delivery.status}
//                         </span>
//                         <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-md uppercase">
//                           Pour Date: {delivery.date}
//                         </span>
//                       </div>

//                       <div>
//                         <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">{delivery.projectName}</h3>
//                         <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
//                           <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> {delivery.location}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100/70">
//                         <div>
//                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Batch Volume</span>
//                           <p className="text-xs font-bold text-gray-800">{delivery.volume}</p>
//                         </div>
//                         <div>
//                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Mix Specification</span>
//                           <p className="text-xs font-bold text-cyan-700 uppercase">{delivery.mixDesign}</p>
//                         </div>
//                         <div>
//                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Mixer Asset ID</span>
//                           <p className="text-xs font-bold text-gray-500 italic">{delivery.truckNo}</p>
//                         </div>
//                         <div>
//                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Assigned Driver</span>
//                           <p className="text-xs font-bold text-gray-500 italic flex items-center gap-1">
//                             <MapPin className="w-3 h-3 text-gray-400" /> {delivery.driver}
//                           </p>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:pl-6 lg:border-l lg:border-gray-100 min-w-[200px]">
//                       {delivery.status !== "Completed" ? (
//                         <button 
//                           onClick={() => handleUpdateStatus(delivery.id, delivery.status)}
//                           className="flex items-center gap-1.5 bg-gray-900 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap w-full lg:w-auto justify-center"
//                         >
//                           {delivery.status === "Pending Dispatch" && <Play className="w-3.5 h-3.5 fill-current" />}
//                           Update Delivery Step
//                         </button>
//                       ) : (
//                         <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-green-700 text-[10px] font-black uppercase tracking-widest text-center w-full">
//                           Pour Discharged ✓
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="p-16 text-center border-2 border-dashed rounded-3xl border-gray-200 bg-white">
//                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No matching approved active runs found in database.</p>
//               </div>
//             )}
//           </main>
//         </div>
//       ) : (
//         /* --- INTEGRATED REUSABLE CALENDAR VIEW --- */
//         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 md:p-4">
//           <ReusableCalendarView  />
//         </div>
//       )}
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from 'react';
import { 
  Truck, Calendar, MapPin, Search, Filter, 
  Play, RefreshCw, Layers, Package, Archive, CheckCircle2, AlertTriangle, User, Building 
} from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import ReusableCalendarView from '@/src/components/CalendarView';

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface DeliveryItem {
  id: string; 
  orderId: string;
  companyName: string;
  projectName: string;
  clientName: string; 
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
  const [activeTab, setActiveTab] = useState<'live' | 'calendar' | 'archive'>('live');
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [archiveFilter, setArchiveFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusSequence = ["Pending Dispatch", "Batching", "In Transit", "Pouring", "Completed"];

  const statusActionLabels: Record<string, string> = {
    "Pending Dispatch": "Dispatch Batch",
    "Batching": "Start Transit",
    "In Transit": "Confirm Pouring",
    "Pouring": "Complete Delivery",
    "Completed": "Delivery Closed"
  };

  const getNextActionLabel = (status: string) => statusActionLabels[status] || "Update Delivery Step";

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "Pouring":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "In Transit":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      case "Batching":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchSchedulesFromBackend = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/schedules/`, { headers: getAuthHeaders() });
      
      const mappedData: DeliveryItem[] = response.data.map((item: any) => {
        const firstItem = item.order_items?.[0];
        const computedVolume = firstItem ? parseFloat(firstItem.volume) : 0;
        
        return {
          id: `SCH-${item.id}`,
          orderId: `ORD-${item.order_id}`,
          projectName: item.project_name || "Unnamed Project",
          companyName: item.company_name || "Direct Account",
          clientName: item.client_name || "Standard Client", 
          location: item.project_location || "No Site Location Provided",
          date: item.date, 
          volume: `${computedVolume.toFixed(2)} m³`,
          volumeNum: computedVolume,
          mixDesign: firstItem?.mix_design?.design_name || "Standard RMC Mix",
          status: item.delivery_status || "Pending Dispatch",
          driver: item.driver_name || "Unassigned Driver", 
          truckNo: item.truck_plate || "Unassigned Truck",
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
          fetchSchedulesFromBackend(true); 
        } catch (err) {
          Swal.fire('ERROR', 'Could not save the updated status to the database.', 'error');
        }
      }
    });
  };

  const activeDeliveries = deliveries.filter(d => d.status !== "Completed" && d.status !== "Cancelled");
  const archivedDeliveries = deliveries.filter(d => d.status === "Completed" || d.status === "Cancelled");

  const filteredLiveDeliveries = activeDeliveries.filter(item => {
    const matchesSearch = item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = statusFilter === "All" || item.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredArchivedDeliveries = archivedDeliveries.filter(item => {
    const matchesSearch = item.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = archiveFilter === "All" || item.status === archiveFilter;
    return matchesSearch && matchesFilter;
  });

  const totalActiveTransits = deliveries.filter(d => d.status !== "Completed" && d.status !== "Cancelled" && d.status !== "Pending Dispatch").length;

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
      {/* VIEW SELECTION SWITCHER */}
      <div className="flex justify-between items-center bg-white p-3 rounded-3xl border border-gray-100 shadow-sm flex-col sm:flex-row gap-3">
        <div className="space-y-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Operational Node Terminal</p>
          <p className="text-sm text-slate-600">Monitor delivery runs, update status stages, and keep dispatch assignments on track.</p>
        </div>
        <div className="bg-gray-100 p-1 rounded-2xl border border-gray-200 shadow-inner inline-flex gap-1 w-full sm:w-auto flex-wrap">
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
          <button
            onClick={() => setActiveTab('archive')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all justify-center flex-1 sm:flex-initial ${
              activeTab === 'archive' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50/50'
            }`}
          >
            <Archive className="w-3.5 h-3.5" /> Logistics Archive Box
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB CANVAS */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4 items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-gray-400">
                <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-700 px-2 py-1 rounded-full">Live dispatches: {activeDeliveries.length}</span>
                <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-2 py-1 rounded-full">In progress: {totalActiveTransits}</span>
              </div>
              <h2 className="text-lg font-black text-slate-900">Approved deliveries awaiting dispatcher action</h2>
              <p className="text-sm text-slate-600">Use the quick filters and stage buttons to advance the workflow clearly. Completed runs move to archive automatically.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {statusSequence.slice(0, 4).map((step) => (
                <div key={step} className="rounded-3xl border border-gray-100 bg-slate-50 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.26em] text-gray-500 mb-2">{step}</p>
                  <p className="text-sm font-bold text-slate-800">{filteredLiveDeliveries.filter(d => d.status === step).length}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search approved projects, clients, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-cyan-500/20 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 shrink-0 px-2">
                <Filter className="w-3 h-3" /> Delivery Stage:
              </span>
              {["All", "Pending Dispatch", "Batching", "In Transit", "Pouring"].map((statusOption) => (
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

            <button
              onClick={triggerSync}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-800 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing dispatch list' : 'Sync delivery status'}
            </button>
          </section>

          <main className="space-y-3">
            {filteredLiveDeliveries.length > 0 ? (
              filteredLiveDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 transition-all shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded-md">
                          {delivery.id} ({delivery.orderId})
                        </span>
                        <span className={`${getStatusBadgeClasses(delivery.status)} text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1`}>
                          <span className="text-xs">●</span> {delivery.status}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-cyan-50 text-cyan-700 rounded-md uppercase">
                          Pour Date: {delivery.date}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                          <Building className="w-5 h-5 text-gray-400 shrink-0" /> 
                          {delivery.companyName}
                        </h1>
                        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                          <User className="w-5 h-5 text-gray-400 shrink-0" /> 
                          <span>{delivery.clientName}</span>
                        </h2>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide pl-7">
                          {delivery.projectName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 pl-7">
                          <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> 
                          {delivery.location}
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
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:pl-6 lg:border-l lg:border-gray-100 min-w-[200px]">
                      <div className="text-xs text-gray-500 text-center">
                        <p className="font-black uppercase tracking-widest">Next action</p>
                        <p className="mt-2 text-sm text-slate-700">{getNextActionLabel(delivery.status)}</p>
                      </div>
                      <button 
                        onClick={() => handleUpdateStatus(delivery.id, delivery.status)}
                        className="flex items-center gap-1.5 bg-gray-900 hover:bg-cyan-600 text-white px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap w-full lg:w-auto justify-center"
                      >
                        {delivery.status !== 'Completed' ? getNextActionLabel(delivery.status) : 'Delivery Closed'}
                      </button>
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
      )}

      {activeTab === 'calendar' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-2 md:p-4">
          <ReusableCalendarView />
        </div>
      )}

      {/* LOGISTICS ARCHIVE VIEW CANVAS */}
      {activeTab === 'archive' && (
        <div className="space-y-4">
          <section className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search archived historic runs, clients, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-slate-500/20 outline-none transition-all placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest flex items-center gap-1 shrink-0 px-2">
                <Filter className="w-3 h-3" /> Archive State:
              </span>
              {["All", "Completed", "Cancelled"].map((archiveOption) => (
                <button
                  key={archiveOption}
                  onClick={() => setArchiveFilter(archiveOption)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    archiveFilter === archiveOption ? "bg-slate-800 text-white shadow-xs" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60"
                  }`}
                >
                  {archiveOption}
                </button>
              ))}
            </div>
          </section>

          <main className="space-y-3">
            {filteredArchivedDeliveries.length > 0 ? (
              filteredArchivedDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white rounded-3xl p-6 border border-gray-100 opacity-85 hover:opacity-100 transition-all shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border px-2 py-0.5 rounded-md">
                          {delivery.id} ({delivery.orderId})
                        </span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1 ${
                          delivery.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {delivery.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {delivery.status}
                        </span>
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md uppercase">
                          Pour Date: {delivery.date}
                        </span>
                      </div>

                      {/* Stacked Details Canvas */}
                    <div className="space-y-1">
                      {/* Company Name Header */}
                      <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-400 shrink-0" /> 
                        {delivery.companyName}
                      </h1>

                      {/* Client Info Subtitle */}
                      <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400 shrink-0" /> 
                        <span>{delivery.clientName} <span className="text-gray-400 font-normal">of</span> {delivery.companyName}</span>
                      </h2>

                      {/* Project Name */}
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide pl-7">
                        {delivery.projectName}
                      </h3>

                      {/* Location Pin */}
                      <p className="text-xs text-gray-500 flex items-center gap-1 pl-7">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" /> 
                        {delivery.location}
                      </p>
                    </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t border-gray-100/70">
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Discharged Volume</span>
                          <p className="text-xs font-bold text-gray-600">{delivery.volume}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">Mix Formulation</span>
                          <p className="text-xs font-bold text-gray-600 uppercase">{delivery.mixDesign}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col justify-between lg:justify-center items-end gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 lg:pl-6 lg:border-l lg:border-gray-100 min-w-[200px]">
                      {delivery.status === 'Completed' ? (
                        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest text-center w-full">
                          Pour Discharged ✓
                        </div>
                      ) : (
                        <div className="bg-rose-50 border border-rose-200 px-4 py-2.5 rounded-xl text-rose-700 text-[10px] font-black uppercase tracking-widest text-center w-full">
                          Cancelled ✕
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-16 text-center border-2 border-dashed rounded-3xl border-gray-200 bg-white">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No historic files or records found under this filter query.</p>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}