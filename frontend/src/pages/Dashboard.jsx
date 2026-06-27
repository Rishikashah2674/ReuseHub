import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Plus, 
  Search, 
  Settings, 
  BarChart3, 
  Trash2, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle,
  Inbox,
  Edit3
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  ResponsiveContainer, 
  XAxis, 
  Tooltip 
} from "recharts";
import { mockDataService } from "../services/mockData";
import { deleteWasteListing, getMyWasteListings } from "../services/wasteService";

const Dashboard = () => {
  const navigate = useNavigate();
  let user = { businessName: "Apex Packagers Ltd", accountType: "supplier" };
  try {
    const u = localStorage.getItem("user");
    if (u && u !== "undefined") {
      user = JSON.parse(u) || user;
    }
  } catch (e) {
    console.warn("Failed to parse user storage in Dashboard:", e);
  }
  
  const [stats, setStats] = useState({});
  const [myListings, setMyListings] = useState([]);
  const [allDemands, setAllDemands] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const globalStats = mockDataService.getGlobalStats();
    
    setStats(globalStats);
    setAllDemands(mockDataService.getDemands());
    setAllMessages(mockDataService.getMessages());
    setMonthlyData(mockDataService.getMonthlyData());

    try {
      setLoadingListings(true);
      const ownListings = await getMyWasteListings();
      setMyListings(ownListings);
    } catch (e) {
      console.error("Failed to load dashboard own listings:", e);
      // Fallback
      const listings = mockDataService.getListings();
      const ownListings = listings.filter(l => l.businessName === user.businessName);
      setMyListings(ownListings);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleDeleteListing = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this material listing?")) {
      await deleteWasteListing(id);
      fetchDashboardData();
    }
  };

  // Calculate user-specific metrics
  const ownCO2 = myListings.reduce((sum, l) => sum + (l.co2Saved || 0), 0);
  const ownExchanges = myListings.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-950 p-8 rounded-3xl text-white border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        
        <div className="z-10">
          <span className="inline-block px-2.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 text-[9px] font-extrabold tracking-wider uppercase mb-3">
            B2B Sustainability Portal
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {user.businessName} 👋
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Console node active. Registered as a <span className="text-emerald-400 font-bold uppercase">{user.accountType}</span>.
          </p>
        </div>

        {/* Dashboard Quick CTA */}
        {user.accountType === "supplier" ? (
          <Link 
            to="/add-listing" 
            className="z-10 inline-flex items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow transition-all hover:-translate-y-0.5 text-sm"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>List Reuse Material</span>
          </Link>
        ) : (
          <Link 
            to="/listings" 
            className="z-10 inline-flex items-center space-x-2 bg-primary hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow transition-all hover:-translate-y-0.5 text-sm"
          >
            <Search className="h-4.5 w-4.5" />
            <span>Source Materials</span>
          </Link>
        )}
      </div>

      {/* Grid 1: Core Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {user.accountType === "supplier" ? "My Active Listings" : "Platform Active Listings"}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">
              {user.accountType === "supplier" ? myListings.length : stats.activeListings}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Updated just now
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {user.accountType === "supplier" ? "My Circular Exchanges" : "My Demands Posted"}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1">
              {user.accountType === "supplier" ? ownExchanges : allDemands.length}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Direct matching active
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              My Carbon Offsets
            </span>
            <span className="text-3xl font-extrabold text-slate-900 block mt-1 text-primary">
              {ownCO2 || "0"} kg CO₂
            </span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-3 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Estimated ledger tally</span>
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Platform Status
            </span>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-extrabold text-slate-800">
                Verified Hub
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Certificate: Eligible
          </p>
        </div>
      </div>

      {/* Grid 2: Core Double-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 8 Columns - Tables & Interactive Lists */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* User Listings Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {user.accountType === "supplier" ? "Manage My Material Listings" : "Current Platform Demands"}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {user.accountType === "supplier" ? "Modify or delete listed materials in real-time." : "Active buy requests from local circular buyers."}
                </p>
              </div>
            </div>

            {/* List */}
            {user.accountType === "supplier" ? (
              loadingListings ? (
                <div className="text-center py-10 flex flex-col justify-center items-center">
                  <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">Loading material listings...</h4>
                </div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">No active listings posted</h4>
                  <Link to="/add-listing" className="text-xs font-bold text-primary hover:underline mt-1 inline-block">
                    Post your first waste listing now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {myListings.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs text-slate-950 font-bold block">{item.quantity}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase">{item.price}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button 
                            onClick={() => navigate(`/edit-listing/${item.id}`)}
                            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          
                          <button 
                            onClick={() => handleDeleteListing(item.id)}
                            className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              allDemands.length === 0 ? (
                <div className="text-center py-10">
                  <Inbox className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-xs">No current platform demands</h4>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {allDemands.map((demand) => (
                    <div key={demand.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{demand.materialName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase mt-0.5">{demand.category}</span>
                      </div>

                      <div className="flex items-center space-x-6 flex-shrink-0">
                        <div className="text-right">
                          <span className="text-xs text-slate-950 font-bold block">{demand.quantityNeeded}</span>
                          <span className={`inline-block mt-0.5 text-[8px] font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase ${demand.status === 'open' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                            {demand.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>

          {/* Secure Communications Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h3 className="font-bold text-slate-900 text-sm">Corporate Communications Inbox</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Encrypted coordination proposals submitted by trading nodes.</p>
            </div>

            {allMessages.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="h-7 w-7 text-slate-300 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-xs">No active proposal threads in inbox</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">When buyers contact your listings, threads show up here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {allMessages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-500">Proposal from: <strong className="text-slate-800">{msg.buyerBusiness}</strong></span>
                      <span className="text-slate-400">{new Date(msg.sentAt).toLocaleDateString()}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">RE: {msg.listingName}</span>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold italic bg-white p-3 rounded-xl border border-slate-100">
                      &ldquo;{msg.message}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Columns - Quick Actions & Mini Charts */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm pb-4 border-b border-slate-100 mb-4">Quick Console Actions</h3>
            <div className="space-y-2">
              <Link 
                to="/listings" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Search className="h-4.5 w-4.5" />
                  </div>
                  <span>Browse Marketplace</span>
                </div>
                <ArrowRight className="h-4.5 w-4.5 text-slate-400" />
              </Link>
              
              <Link 
                to="/analytics" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <span>Compliance Analytics</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>

              <Link 
                to="/profile" 
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors border border-slate-100 hover:border-slate-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-accent/10 text-accent">
                    <Settings className="h-4 w-4" />
                  </div>
                  <span>Edit Profile settings</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            </div>
          </div>

          {/* Mini Carbon Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="pb-3 border-b border-slate-100 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-xs">Circularity Trend</h3>
                <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Platform weights offset (kg)</span>
              </div>
              <span className="text-[10px] font-extrabold text-primary">+36%</span>
            </div>

            <div className="h-28 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData.slice(2, 6)}>
                  <XAxis dataKey="month" stroke="#CBD5E1" fontSize={8} fontStyle="bold" axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "8px", color: "#FFF", fontSize: "9px" }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={1.5} fill="#D1FAE5" name="Saved" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;