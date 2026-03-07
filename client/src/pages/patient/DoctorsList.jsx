import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Search,
    User,
    Phone,
    Mail,
    Calendar,
    Stethoscope,
    ArrowRight,
} from 'lucide-react';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get('/doctors');
                setDoctors(data);
                setFilteredDoctors(data);
            } catch (error) {
                toast.error('Failed to load doctors.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Filter by search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredDoctors(doctors);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = doctors.filter(doc =>
            (doc.User?.name || '').toLowerCase().includes(term) ||
            (doc.Specialization?.name || '').toLowerCase().includes(term)
        );
        setFilteredDoctors(filtered);
    }, [searchTerm, doctors]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="h-14 w-14 bg-gray-200 rounded-xl animate-pulse"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                </div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-slate-800">Our Doctors</h1>
                <p className="text-slate-500 mt-1">
                    Browse all {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} at our clinic
                </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by doctor name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                />
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 text-gray-400">
                    <User className="h-16 w-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No doctors found</p>
                    <p className="text-sm mt-1">
                        {searchTerm ? 'Try adjusting your search term.' : 'No doctors have been added to the clinic yet.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doc) => (
                        <div
                            key={doc.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
                        >
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-5 relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
                                <div className="absolute -right-2 -bottom-6 w-16 h-16 bg-white/5 rounded-full"></div>
                                <div className="flex items-center space-x-4 relative z-10">
                                    <div className="h-14 w-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white flex-shrink-0 border border-white/20">
                                        <Stethoscope className="h-7 w-7" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-white text-lg truncate">
                                            Dr. {doc.User?.name || 'Unknown'}
                                        </h3>
                                        <p className="text-blue-100 text-sm font-medium">
                                            {doc.Specialization?.name || 'General Medicine'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-4">
                                {/* Bio */}
                                {doc.bio && (
                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                        {doc.bio}
                                    </p>
                                )}

                                {/* Contact Info */}
                                <div className="space-y-2">
                                    {doc.phone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{doc.phone}</span>
                                        </div>
                                    )}
                                    {doc.User?.email && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                            <span className="truncate">{doc.User.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Available Days */}
                                {doc.available_days && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                            Available
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {doc.available_days.split(',').map(day => (
                                                <span
                                                    key={day}
                                                    className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium border border-emerald-100"
                                                >
                                                    {day.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Book Button */}
                                <button
                                    onClick={() => navigate('/patient/book')}
                                    className="w-full mt-2 flex items-center justify-center px-4 py-2.5 bg-blue-50 hover:bg-blue-500 text-blue-600 hover:text-white rounded-xl font-semibold text-sm transition-all duration-200 group/btn"
                                >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Book Appointment
                                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorsList;
