import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserCheck, Calendar as CalendarIcon, Activity } from 'lucide-react';
import { toast } from 'react-toastify';

const StatsCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
        <div className={`p-4 rounded-full mr-4 ${colorClass}`}>
            <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{title}</p>
            <h4 className="text-3xl font-bold text-gray-800 mt-1">{value}</h4>
        </div>
    </div>
);

const AdminOverview = () => {
    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [docRes, patRes, apptRes] = await Promise.all([
                    axios.get('/doctors'),
                    axios.get('/patients'),
                    axios.get('/appointments'),
                ]);

                setStats({
                    doctors: docRes.data.length || 0,
                    patients: patRes.data.length || 0,
                    appointments: apptRes.data.length || 0,
                });
            } catch (error) {
                toast.error('Failed to load dashboard statistics.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading statistics...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Admin Overview</h1>
                    <p className="text-slate-500 mt-1">Monitor your clinic's performance and staff management.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Doctors"
                    value={stats.doctors}
                    icon={UserCheck}
                    colorClass="bg-blue-500 shadow-blue-500/30 shadow-lg"
                />
                <StatsCard
                    title="Total Patients"
                    value={stats.patients}
                    icon={Users}
                    colorClass="bg-indigo-500 shadow-indigo-500/30 shadow-lg"
                />
                <StatsCard
                    title="Total Appointments"
                    value={stats.appointments}
                    icon={CalendarIcon}
                    colorClass="bg-emerald-500 shadow-emerald-500/30 shadow-lg"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-64">
                    <Activity className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700">Recent Activity Log</h3>
                    <p className="text-sm text-slate-500 mt-2">Activity timeline feature coming soon.</p>
                </div>
                <div className="bg-gradient-to-br from-medical-dark to-slate-800 rounded-xl shadow-lg p-6 text-white flex flex-col justify-end h-64 relative overflow-hidden">
                    <div className="z-10 relative">
                        <h3 className="text-xl font-bold mb-2">System Status</h3>
                        <p className="text-slate-300 text-sm mb-4">All services are running normally. API endpoint connected.</p>
                        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Operational</span>
                        </div>
                    </div>
                    <CalendarIcon className="absolute -bottom-6 -right-6 h-48 w-48 text-white/5" />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
