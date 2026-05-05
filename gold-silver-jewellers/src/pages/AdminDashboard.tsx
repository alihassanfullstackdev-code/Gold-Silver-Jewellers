import { motion } from 'framer-motion';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/admin/Sidebar';
import { StatsCard } from '../components/admin/StatsCard';
import { TopHeader } from '../components/admin/TopHeader';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/login');
    };

    // Hum check karenge ke kya hum main dashboard par hain ya kisi child page par
    const isMainDashboard = location.pathname === '/admin' || location.pathname === '/admin/';

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex">
            <Sidebar />

            <div className="flex-1 overflow-y-auto">
                <TopHeader onLogout={handleLogout} />

                <div className="p-8">
                    {/* Agar URL sirf /admin hai, toh Stats aur Form dikhao */}
                    {isMainDashboard ? (
                        <>
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                                <StatsCard title="Total Products" value="0" detail="+0 this month" />
                                <StatsCard title="Active Collections" value="3" detail="Gold, Silver, Diamond" />
                                <StatsCard title="Pending Tasks" value="5" detail="Requires attention" />
                            </div>

                            {/* Form Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-8"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-semibold">Quick Product Upload</h3>
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">System Ready</span>
                                </div>

                                <div className="h-64 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-slate-500 gap-4">
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm">Main Dashboard Content</p>
                                </div>
                            </motion.div>
                        </>
                    ) : (
                        /* Agar URL /admin/rates ya /admin/categories hai, toh child component yahan load hoga */
                        <Outlet />
                    )}
                </div>
            </div>
        </div>
    );
}