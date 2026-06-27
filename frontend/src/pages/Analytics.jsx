import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { 
  Sparkles, 
  TrendingUp, 
  Leaf, 
  Handshake, 
  ShieldCheck, 
  Download,
  Calendar,
  Layers
} from "lucide-react";
import axios from "axios";

const Analytics = () => {
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

 useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
      setMonthlyData(res.data.monthlyData || []);
      setCategoryData(res.data.categoryData || []);
    } catch (error) {
      console.log("Analytics fetch error:", error);
    }
  };

  fetchAnalytics();
}, []);
  return (
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Title with CTA */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Sustainability Analytics
          </h1>
          <strong>{stats.title || "Sustainability Analytics"}</strong>
          <p className="text-sm text-slate-400 font-semibold mt-1">
            Real-time calculation of material circularity, carbon offloads, and trading ratios.
          </p>
        </div>

        {/* Download Button */}
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center space-x-1.5 bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-sm hover:shadow transition-all self-start sm:self-center"
        >
          <Download className="h-4 w-4 text-slate-500" />
          <span>Export ESG Report</span>
        </button>
      </div>

      {/* Analytics Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Leaf className="h-5 w-5" />
            </div>
           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
  {stats.cards?.card1Label || "Estimated CO₂ Saved"}
</span>
<span className="text-2xl font-extrabold text-slate-900 mt-1 block">
  {stats.cards?.card1Value || 0} {stats.cards?.card1Unit}
</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-3 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% offset this month</span>
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center mb-4">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
  {stats.cards?.card2Label || "Total Quantity"}
</span>
<span className="text-2xl font-extrabold text-slate-900 mt-1 block">
  {stats.cards?.card2Value || 0} {stats.cards?.card2Unit}
</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-bold mt-3 flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1,450 kg added this week</span>
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4">
              <Handshake className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
  {stats.cards?.card3Label || "Active Records"}
</span>
<span className="text-2xl font-extrabold text-slate-900 mt-1 block">
  {stats.cards?.card3Value || 0} {stats.cards?.card3Unit}
</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            100% successful coordination rate
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
  {stats.cards?.card4Label || "My Records"}
</span>
<span className="text-2xl font-extrabold text-slate-900 mt-1 block">
  {stats.cards?.card4Value || 0} {stats.cards?.card4Unit}
</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold mt-3">
            Circular compliance validated
          </p>
        </div>
      </div>

      {/* Main Analytical Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        
        {/* Area Chart - Weight Reused Trend */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Circularity Volumetric Trend</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Month-over-month tonnage accumulated in secondary reuse.</p>
            </div>
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[9px] font-bold text-slate-500">
              <Calendar className="h-3 w-3" />
              <span>Last 6 Months</span>
            </span>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} unit="kg" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF" }}
                  labelStyle={{ fontWeight: "extrabold", fontSize: "11px", marginBottom: "4px" }}
                  itemStyle={{ color: "#34D399", fontSize: "11px" }}
                />
                <Area type="monotone" dataKey="weight" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" name="Material Saved (kg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie/Donut Chart - Sector Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="pb-4 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Material Breakdown</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Volumetric composition by trading sector.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF", fontSize: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text Badge */}
            <div className="absolute text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Top Sector</span>
              <span className="block text-sm font-extrabold text-slate-800 mt-0.5">Packaging</span>
            </div>
          </div>

          {/* Custom Labels List */}
          <div className="space-y-1.5 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
            {categoryData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="text-slate-900 font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart - Monthly CO2 Savings Ledgers */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Carbon Offset Equivalency</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Monthly offset calculations matching organic decay and combustion parameters.</p>
          </div>
        </div>

        <div className="h-64 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} fontStyle="bold" axisLine={false} tickLine={false} unit="kg" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0F172A", border: "none", borderRadius: "12px", color: "#FFF" }}
                labelStyle={{ fontWeight: "extrabold", fontSize: "11px", marginBottom: "4px" }}
                itemStyle={{ color: "#22D3EE", fontSize: "11px" }}
              />
              <Bar dataKey="co2" fill="#14B8A6" radius={[4, 4, 0, 0]} name="CO₂ Offset (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
