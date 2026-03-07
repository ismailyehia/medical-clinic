import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
    Search,
    User,
    Phone,
    Mail,
    Calendar,
    Users,
    X,
    FileText,
    Clock,
    Activity,
    ChevronRight,
} from 'lucide-react';

const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    // Detail panel state
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientRecords, setPatientRecords] = useState([]);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const { data } = await axios.get('/patients');
                setPatients(data);
                setFilteredPatients(data);
            } catch (error) {
                toast.error('Failed to load patients.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    // Filter by search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPatients(patients);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = patients.filter(p =>
            (p.User?.name || '').toLowerCase().includes(term) ||
            (p.User?.email || '').toLowerCase().includes(term) ||
            (p.phone || '').includes(term)
        );
        setFilteredPatients(filtered);
    }, [searchTerm, patients]);

    // Open patient detail panel
    const openPatientDetail = async (patient) => {
        setSelectedPatient(patient);
        setDetailLoading(true);
        setPatientRecords([]);
        setPatientAppointments([]);

        try {
            // Fetch medical records and appointments in parallel
            const [recordsRes, appointmentsRes] = await Promise.all([
                axios.get(`/records/${patient.id}`).catch(() => ({ data: [] })),
                axios.get('/appointments').catch(() => ({ data: [] })),
            ]);

            setPatientRecords(recordsRes.data);

            // Filter appointments for this specific patient
            const thisPatientAppts = appointmentsRes.data.filter(
                a => a.patient_id === patient.id
            );
            setPatientAppointments(thisPatientAppts);
        } catch (error) {
            console.error(error);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setSelectedPatient(null);
        setPatientRecords([]);
        setPatientAppointments([]);
    };

    const statusConfig = {
        pending: { bg: 'bg-amber-100', text: 'text-amber-800' },
        approved: { bg: 'bg-blue-100', text: 'text-blue-800' },
        completed: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 bg-gray-200 rounded-full animate-pulse"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">Patient Profiles</h1>
                <p className="text-slate-500 mt-1">
                    Browse all {patients.length} registered patient{patients.length !== 1 ? 's' : ''}. Click a card to view full details.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Patients</p>
                        <p className="text-2xl font-bold text-slate-800">{patients.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-500">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Male</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {patients.filter(p => p.gender === 'male').length}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-pink-50 text-pink-500">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Female</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {patients.filter(p => p.gender === 'female').length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
            </div>

            {/* Patients Grid */}
            {filteredPatients.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
                    <Users className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No patients found</p>
                    <p className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search term.' : 'No patients have registered yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <div
                            key={patient.id}
                            onClick={() => openPatientDetail(patient)}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer group"
                        >
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-5 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/5 rounded-full"></div>
                                <div className="flex items-center space-x-4 relative z-10">
                                    <div className="h-14 w-14 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white flex-shrink-0 border border-white/20">
                                        <span className="text-xl font-bold">
                                            {(patient.User?.name || 'U').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-white text-lg truncate">
                                            {patient.User?.name || 'Unknown'}
                                        </h3>
                                        {patient.gender && (
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${patient.gender === 'male' ? 'bg-blue-500/20 text-blue-200' :
                                                    patient.gender === 'female' ? 'bg-pink-500/20 text-pink-200' :
                                                        'bg-gray-500/20 text-gray-200'
                                                }`}>
                                                {patient.gender}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all flex-shrink-0" />
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-3">
                                {patient.User?.email && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{patient.User.email}</span>
                                    </div>
                                )}
                                {patient.phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span>{patient.phone}</span>
                                    </div>
                                )}
                                {patient.date_of_birth && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                        <span>
                                            {dayjs(patient.date_of_birth).format('MMM DD, YYYY')}
                                            <span className="text-gray-400 ml-1">
                                                ({dayjs().diff(dayjs(patient.date_of_birth), 'year')} yrs)
                                            </span>
                                        </span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs text-gray-400">
                                        Registered {dayjs(patient.created_at).format('MMM DD, YYYY')}
                                    </p>
                                    <span className="text-xs text-blue-500 font-semibold group-hover:underline">
                                        View Details →
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ========== Detail Slide-Over Panel ========== */}
            {selectedPatient && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                        onClick={closeDetail}
                    ></div>

                    {/* Panel */}
                    <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl overflow-y-auto animate-slide-in">
                        {/* Panel Header */}
                        <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6 sticky top-0 z-10">
                            <button
                                onClick={closeDetail}
                                className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            <div className="flex items-center space-x-4">
                                <div className="h-16 w-16 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white border border-white/20">
                                    <span className="text-2xl font-bold">
                                        {(selectedPatient.User?.name || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">
                                        {selectedPatient.User?.name || 'Unknown'}
                                    </h2>
                                    <p className="text-slate-300 text-sm">Patient Profile</p>
                                </div>
                            </div>
                        </div>

                        {detailLoading ? (
                            <div className="p-6 space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                        <User className="h-4 w-4 mr-2" />
                                        Personal Information
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Full Name</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {selectedPatient.User?.name || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Email</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {selectedPatient.User?.email || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Phone</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {selectedPatient.phone || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Gender</span>
                                            <span className="text-sm font-semibold text-slate-800 capitalize">
                                                {selectedPatient.gender || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Date of Birth</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {selectedPatient.date_of_birth
                                                    ? `${dayjs(selectedPatient.date_of_birth).format('MMM DD, YYYY')} (${dayjs().diff(dayjs(selectedPatient.date_of_birth), 'year')} yrs)`
                                                    : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Registered</span>
                                            <span className="text-sm font-semibold text-slate-800">
                                                {dayjs(selectedPatient.created_at).format('MMM DD, YYYY')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment History */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Appointment History ({patientAppointments.length})
                                    </h3>

                                    {patientAppointments.length === 0 ? (
                                        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400">
                                            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No appointments with this patient.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {patientAppointments.map(app => {
                                                const sc = statusConfig[app.status] || statusConfig.pending;
                                                return (
                                                    <div key={app.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="bg-white p-2 rounded-lg shadow-sm text-center min-w-[48px]">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase block">{dayjs(app.appointment_date).format('MMM')}</span>
                                                                <span className="text-lg font-black text-slate-800 leading-none">{dayjs(app.appointment_date).format('DD')}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-800 flex items-center">
                                                                    <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                                                                    {dayjs(app.appointment_date).format('h:mm A')}
                                                                </p>
                                                                {app.notes && (
                                                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{app.notes}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${sc.bg} ${sc.text}`}>
                                                            {app.status}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Medical Records */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Medical Records ({patientRecords.length})
                                    </h3>

                                    {patientRecords.length === 0 ? (
                                        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400">
                                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No medical records for this patient.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {patientRecords.map(record => (
                                                <div key={record.id} className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-400">
                                                            {dayjs(record.created_at).format('MMM DD, YYYY')}
                                                        </span>
                                                        <Activity className="h-4 w-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Diagnosis</p>
                                                        <p className="text-sm text-slate-800 font-medium">{record.diagnosis}</p>
                                                    </div>
                                                    {record.prescription && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prescription</p>
                                                            <p className="text-sm text-slate-700">{record.prescription}</p>
                                                        </div>
                                                    )}
                                                    {record.notes && (
                                                        <div>
                                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</p>
                                                            <p className="text-sm text-slate-600">{record.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Animation CSS */}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default DoctorPatients;
