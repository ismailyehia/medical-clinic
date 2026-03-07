import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, User, FileText, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const handleBookAppointment = () => {
        navigate('/patient/book');
    };

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

    const upcomingAppts = appointments.filter(a => dayjs(a.appointment_date).isAfter(dayjs()) && a.status !== 'cancelled');

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">My Health Portal</h1>
                <p className="text-slate-500 mt-1">Manage your appointments and view medical history.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <button onClick={handleBookAppointment} className="bg-medical-blue hover:bg-[#026cac] text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all flex flex-col items-center justify-center text-center group">
                    <Calendar className="h-8 w-8 mb-3 opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-lg">Book Appointment</span>
                </button>

                <button onClick={() => navigate('/patient/records')} className="bg-white border hover:border-medical-blue border-gray-200 text-slate-800 p-6 rounded-xl shadow-sm hover:shadow transition-all flex flex-col items-center justify-center text-center group">
                    <FileText className="h-8 w-8 mb-3 text-medical-blue opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-lg">Medical Records</span>
                </button>

                <button onClick={() => navigate('/patient/doctors')} className="bg-white border hover:border-medical-blue border-gray-200 text-slate-800 p-6 rounded-xl shadow-sm hover:shadow transition-all flex flex-col items-center justify-center text-center group">
                    <User className="h-8 w-8 mb-3 text-medical-blue opacity-90 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-lg">Find a Doctor</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Next Appointment */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <CheckCircle className="mr-2 text-emerald-500 h-6 w-6" />
                        Your Appointment
                    </h3>

                    {upcomingAppts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-slate-50 rounded-lg">
                            <Calendar className="h-10 w-10 text-slate-300 mb-2" />
                            <p className="text-slate-500">You have no upcoming appointments.</p>
                            <button className="mt-4 text-sm font-semibold text-medical-blue hover:underline">Book one now</button>
                        </div>
                    ) : (
                        <div className="bg-medical-dark text-white p-6 rounded-xl relative overflow-hidden shadow-xl">
                            <Calendar className="absolute opacity-10 -right-4 -bottom-4 h-32 w-32" />
                            <div className="relative z-10 flex flex-col">
                                <div className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-1">Upcoming</div>
                                <h4 className="text-2xl font-black mb-1">
                                    {dayjs(upcomingAppts[0].appointment_date).format('dddd, MMMM DD')}
                                </h4>
                                <p className="text-xl text-blue-100 flex items-center mb-6">
                                    <Clock className="w-5 h-5 mr-2" />
                                    {dayjs(upcomingAppts[0].appointment_date).format('h:mm A')}
                                </p>

                                <div className="flex items-center pt-4 border-t border-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-medical-blue flex items-center justify-center mr-3 font-bold">
                                        Dr
                                    </div>
                                    <div>
                                        <p className="font-semibold">{upcomingAppts[0].Doctor?.User?.name || 'Doctor'}</p>
                                        <p className="text-xs text-blue-300">Consultation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* History Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                        <FileText className="mr-2 text-medical-blue h-6 w-6" />
                        Recent History
                    </h3>

                    <ul className="divide-y divide-gray-100">
                        {appointments.filter(a => dayjs(a.appointment_date).isBefore(dayjs())).slice(0, 3).map(app => (
                            <li key={app.id} className="py-3 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {dayjs(app.appointment_date).format('MMM DD, YYYY')}
                                    </p>
                                    <p className="text-sm text-slate-500">Dr. {app.Doctor?.User?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        Completed
                                    </span>
                                </div>
                            </li>
                        ))}

                        {appointments.filter(a => dayjs(a.appointment_date).isBefore(dayjs())).length === 0 && (
                            <li className="text-sm text-slate-500 py-4 text-center">No past appointments found.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
