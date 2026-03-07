import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const DoctorDashboard = () => {
    const { user } = useContext(AuthContext);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setAppointments(appointments.map(app =>
                app.id === id ? { ...app, status } : app
            ));
            toast.success(`Appointment marked as ${status}`);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const pendingAppointments = appointments.filter(a => a.status === 'pending');
    const todaysAppointments = appointments.filter(a =>
        dayjs(a.appointment_date).isSame(dayjs(), 'day')
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Doctor Dashboard</h1>
                <p className="text-slate-500 mt-1">Manage your appointments and patient records.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Today's Appointments</p>
                        <h4 className="text-3xl font-bold text-medical-blue mt-1">{todaysAppointments.length}</h4>
                    </div>
                    <div className="p-4 rounded-full bg-medical-light text-medical-blue">
                        <Calendar className="h-6 w-6" />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pending Requests</p>
                        <h4 className="text-3xl font-bold text-amber-500 mt-1">{pendingAppointments.length}</h4>
                    </div>
                    <div className="p-4 rounded-full bg-amber-50 text-amber-500">
                        <Clock className="h-6 w-6" />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <Calendar className="mr-2 text-medical-blue h-6 w-6" />
                    Upcoming Appointments
                </h3>

                {appointments.length === 0 ? (
                    <div className="bg-white p-8 text-center rounded-xl shadow-sm border border-gray-100 text-gray-500">
                        No appointments scheduled at the moment.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <ul className="divide-y divide-gray-100">
                            {appointments.slice(0, 5).map((app) => (
                                <li key={app.id} className="p-4 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between transition-colors">
                                    <div className="flex items-start mb-4 md:mb-0">
                                        <div className="bg-medical-light text-medical-blue p-3 rounded-lg mr-4 flex-shrink-0 flex flex-col items-center">
                                            <span className="text-xs font-bold uppercase">{dayjs(app.appointment_date).format('MMM')}</span>
                                            <span className="text-xl font-black leading-none">{dayjs(app.appointment_date).format('DD')}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 text-lg flex items-center">
                                                {app.Patient?.User?.name || 'Unknown Patient'}
                                            </h4>
                                            <div className="text-sm text-slate-500 flex items-center mt-1">
                                                <Clock className="h-3.5 w-3.5 mr-1" />
                                                {dayjs(app.appointment_date).format('h:mm A')}
                                            </div>
                                            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                            ${app.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                              app.status === 'approved' ? 'bg-blue-100 text-blue-800' : 
                              app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 
                              'bg-red-100 text-red-800'}">
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        {app.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'approved')}
                                                className="flex py-2 px-3 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {(app.status === 'pending' || app.status === 'approved') && (
                                            <button
                                                onClick={() => handleStatusUpdate(app.id, 'completed')}
                                                className="flex py-2 px-3 text-sm font-medium rounded-lg text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition"
                                            >
                                                Mark Complete
                                            </button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
                            <span className="text-medical-blue hover:text-blue-800 text-sm font-semibold cursor-pointer">
                                View All Appointments &rarr;
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
