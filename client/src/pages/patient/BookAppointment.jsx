import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Calendar, Clock, User, FileText, Search, ArrowLeft, CheckCircle } from 'lucide-react';

const BookAppointment = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // step 1: select doctor, step 2: fill details

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await axios.get('/doctors');
                setDoctors(data);
                setFilteredDoctors(data);
            } catch (error) {
                toast.error('Failed to load doctors');
            }
        };
        fetchDoctors();
    }, []);

    // Filter doctors by search
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredDoctors(doctors);
            return;
        }
        const term = searchTerm.toLowerCase();
        const filtered = doctors.filter(doc =>
            (doc.User?.name || doc.name || '').toLowerCase().includes(term) ||
            (doc.Specialization?.name || '').toLowerCase().includes(term)
        );
        setFilteredDoctors(filtered);
    }, [searchTerm, doctors]);

    const handleSelectDoctor = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDoctor || !appointmentDate || !appointmentTime) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const dateTime = `${appointmentDate}T${appointmentTime}:00`;

            await axios.post('/appointments', {
                doctor_id: selectedDoctor.id,
                appointment_date: dateTime,
                notes: notes || '',
            });

            toast.success('Appointment booked successfully!');
            navigate('/patient');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to book appointment');
        }
        setLoading(false);
    };

    // Get tomorrow's date as minimum for booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={() => step === 2 ? setStep(1) : navigate('/patient')}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
                    <p className="text-gray-500 text-sm">
                        {step === 1 ? 'Step 1: Select a Doctor' : 'Step 2: Choose Date & Time'}
                    </p>
                </div>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <div className={`flex-1 h-1 mx-3 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    2
                </div>
            </div>

            {/* Step 1: Select Doctor */}
            {step === 1 && (
                <div>
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by doctor name or specialization..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {/* Doctors Grid */}
                    {filteredDoctors.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">No doctors found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredDoctors.map((doc) => (
                                <div
                                    key={doc.id}
                                    onClick={() => handleSelectDoctor(doc)}
                                    className="bg-white rounded-2xl border border-gray-100 p-6 cursor-pointer hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all group"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors flex-shrink-0">
                                            <User className="h-7 w-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 text-lg truncate">
                                                {doc.User?.name || doc.name || 'Doctor'}
                                            </h3>
                                            <p className="text-blue-500 font-medium text-sm">
                                                {doc.Specialization?.name || 'General'}
                                            </p>
                                            {doc.bio && (
                                                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{doc.bio}</p>
                                            )}
                                            {doc.available_days && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {doc.available_days.split(',').map(day => (
                                                        <span key={day} className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                                                            {day.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Date, Time & Notes */}
            {step === 2 && selectedDoctor && (
                <div>
                    {/* Selected Doctor Card */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-8 text-white">
                        <p className="text-blue-100 text-sm mb-1">Selected Doctor</p>
                        <h2 className="text-2xl font-bold">{selectedDoctor.User?.name || selectedDoctor.name}</h2>
                        <p className="text-blue-100">{selectedDoctor.Specialization?.name || 'General'}</p>
                        {selectedDoctor.available_days && (
                            <p className="text-blue-200 text-sm mt-2">
                                Available: {selectedDoctor.available_days}
                            </p>
                        )}
                    </div>

                    {/* Booking Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="h-4 w-4 inline mr-2" />
                                    Appointment Date *
                                </label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    min={minDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>

                            {/* Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Clock className="h-4 w-4 inline mr-2" />
                                    Preferred Time *
                                </label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <FileText className="h-4 w-4 inline mr-2" />
                                Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                placeholder="Describe your symptoms or reason for visit..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                            >
                                Change Doctor
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Confirm Booking
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default BookAppointment;
