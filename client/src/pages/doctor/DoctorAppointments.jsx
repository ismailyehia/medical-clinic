import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
    Calendar,
    Clock,
    User,
    Search,
    CheckCircle,
    XCircle,
    Filter,
    AlertCircle,
} from 'lucide-react';

const statusConfig = {
    pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
    approved: { label: 'Approved', bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    completed: { label: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
};

const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await axios.get('/appointments');
                setAppointments(data);
            } catch (error) {
                toast.error('Failed to load appointments.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const handleStatusUpdate = async (id, status) => {
        try {
            await axios.put(`/appointments/${id}`, { status });
            setAppointments(prev =>
                prev.map(app => (app.id === id ? { ...app, status } : app))
            );
            toast.success(`Appointment marked as ${status}`);
        } catch (error) {
            toast.error('Failed to update status.');
        }
    };

    // Filter and search
    const filtered = appointments.filter(app => {
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const patientName = (app.Patient?.User?.name || '').toLowerCase();
        const matchesSearch = !searchTerm.trim() || patientName.includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Stats
    const stats = {
        total: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        approved: appointments.filter(a => a.status === 'approved').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        today: appointments.filter(a => dayjs(a.appointment_date).isSame(dayjs(), 'day')).length,
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
                    ))}
                </div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Appointments</h1>
                <p className="text-slate-500 mt-1">Manage and track all your patient appointments.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Today</p>
                    <p className="text-2xl font-bold text-medical-blue mt-1">{stats.today}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Pending</p>
                    <p className="text-2xl font-bold text-amber-500 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Approved</p>
                    <p className="text-2xl font-bold text-blue-500 mt-1">{stats.approved}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-emerald-500 mt-1">{stats.completed}</p>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by patient name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400 hidden sm:block" />
                    {['all', 'pending', 'approved', 'completed', 'cancelled'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all ${statusFilter === status
                                    ? 'bg-blue-500 text-white shadow-sm'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
                    <Calendar className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No appointments found</p>
                    <p className="text-sm mt-1">
                        {searchTerm || statusFilter !== 'all'
                            ? 'Try adjusting your filters.'
                            : 'No appointments have been scheduled yet.'}
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <ul className="divide-y divide-gray-100">
                        {filtered.map((app) => {
                            const sc = statusConfig[app.status] || statusConfig.pending;
                            return (
                                <li key={app.id} className="p-5 hover:bg-slate-50 transition-colors">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Left: Date + Patient Info */}
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg flex-shrink-0 flex flex-col items-center min-w-[60px]">
                                                <span className="text-xs font-bold uppercase">{dayjs(app.appointment_date).format('MMM')}</span>
                                                <span className="text-xl font-black leading-none">{dayjs(app.appointment_date).format('DD')}</span>
                                                <span className="text-[10px] font-medium mt-0.5">{dayjs(app.appointment_date).format('YYYY')}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 text-lg flex items-center">
                                                    <User className="h-4 w-4 mr-2 text-gray-400" />
                                                    {app.Patient?.User?.name || 'Unknown Patient'}
                                                </h4>
                                                <div className="flex items-center text-sm text-slate-500 mt-1">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {dayjs(app.appointment_date).format('h:mm A')}
                                                    {app.Patient?.User?.email && (
                                                        <span className="ml-4 text-gray-400">
                                                            {app.Patient.User.email}
                                                        </span>
                                                    )}
                                                </div>
                                                {app.notes && (
                                                    <p className="text-sm text-gray-400 mt-2 line-clamp-1">
                                                        <span className="font-medium text-gray-500">Notes:</span> {app.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right: Status + Actions */}
                                        <div className="flex items-center space-x-3 ml-[76px] md:ml-0">
                                            {/* Status Badge */}
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${sc.bg} ${sc.text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${sc.dot}`}></span>
                                                {sc.label}
                                            </span>

                                            {/* Action Buttons */}
                                            {app.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                    className="flex items-center py-2 px-3 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Approve
                                                </button>
                                            )}
                                            {(app.status === 'pending' || app.status === 'approved') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                    className="flex items-center py-2 px-3 text-sm font-medium rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Complete
                                                </button>
                                            )}
                                            {app.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                                    className="flex items-center py-2 px-3 text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 transition"
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
