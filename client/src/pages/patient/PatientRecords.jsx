import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import {
    FileText,
    Search,
    Activity,
    Pill,
    StickyNote,
    Calendar,
    User,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

const PatientRecords = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                // Get patient profile ID from auth/profile endpoint
                const { data: profileData } = await axios.get('/auth/profile');
                const patientId = profileData.patient?.id;

                if (!patientId) {
                    setRecords([]);
                    setLoading(false);
                    return;
                }

                const { data } = await axios.get(`/records/${patientId}`);
                setRecords(data);
                setFilteredRecords(data);
            } catch (error) {
                toast.error('Failed to load medical records.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [user]);

    // Filter by search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredRecords(records);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = records.filter(r =>
            (r.diagnosis || '').toLowerCase().includes(term) ||
            (r.prescription || '').toLowerCase().includes(term) ||
            (r.notes || '').toLowerCase().includes(term)
        );
        setFilteredRecords(filtered);
    }, [searchTerm, records]);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">My Medical Records</h1>
                <p className="text-slate-500 mt-1">
                    View your complete medical history — {records.length} record{records.length !== 1 ? 's' : ''} on file.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Records</p>
                        <p className="text-2xl font-bold text-slate-800">{records.length}</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-emerald-50 text-emerald-500">
                        <Activity className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Diagnoses</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {new Set(records.map(r => r.diagnosis)).size}
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-purple-50 text-purple-500">
                        <Pill className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Prescriptions</p>
                        <p className="text-2xl font-bold text-slate-800">
                            {records.filter(r => r.prescription).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            {records.length > 0 && (
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by diagnosis, prescription, or notes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>
            )}

            {/* Records List */}
            {filteredRecords.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
                    <FileText className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No medical records found</p>
                    <p className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search term.' : 'Your medical history will appear here after doctor visits.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredRecords.map(record => {
                        const isExpanded = expandedId === record.id;

                        return (
                            <div
                                key={record.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                {/* Record Header — Always visible */}
                                <button
                                    onClick={() => toggleExpand(record.id)}
                                    className="w-full p-5 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-blue-50 text-blue-600 p-3 rounded-lg flex-shrink-0 flex flex-col items-center min-w-[52px]">
                                            <span className="text-[10px] font-bold uppercase text-blue-400">
                                                {dayjs(record.created_at).format('MMM')}
                                            </span>
                                            <span className="text-lg font-black leading-none">
                                                {dayjs(record.created_at).format('DD')}
                                            </span>
                                            <span className="text-[10px] font-medium text-blue-400 mt-0.5">
                                                {dayjs(record.created_at).format('YYYY')}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">
                                                {record.diagnosis}
                                            </h4>
                                            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                                                {record.Doctor?.User?.name && (
                                                    <span className="flex items-center">
                                                        <User className="h-3.5 w-3.5 mr-1" />
                                                        Dr. {record.Doctor.User.name}
                                                    </span>
                                                )}
                                                {record.prescription && (
                                                    <span className="flex items-center text-purple-500">
                                                        <Pill className="h-3.5 w-3.5 mr-1" />
                                                        Has prescription
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {isExpanded
                                        ? <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        : <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                    }
                                </button>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-0 border-t border-gray-100 space-y-4 animate-fadeIn">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            {/* Diagnosis */}
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center mb-2">
                                                    <Activity className="h-3.5 w-3.5 mr-1.5" />
                                                    Diagnosis
                                                </p>
                                                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                                    {record.diagnosis}
                                                </p>
                                            </div>

                                            {/* Prescription */}
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center mb-2">
                                                    <Pill className="h-3.5 w-3.5 mr-1.5" />
                                                    Prescription
                                                </p>
                                                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                                                    {record.prescription || 'No prescription provided.'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Notes */}
                                        {record.notes && (
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center mb-2">
                                                    <StickyNote className="h-3.5 w-3.5 mr-1.5" />
                                                    Doctor's Notes
                                                </p>
                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                    {record.notes}
                                                </p>
                                            </div>
                                        )}

                                        {/* Doctor Info */}
                                        {record.Doctor?.User && (
                                            <div className="flex items-center space-x-3 pt-2">
                                                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        Dr. {record.Doctor.User.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        Recorded on {dayjs(record.created_at).format('MMMM DD, YYYY [at] h:mm A')}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Fade-in animation */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default PatientRecords;
