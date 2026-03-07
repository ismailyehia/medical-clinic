import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, User, Phone, Calendar, ArrowRight, AlertCircle, Users } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        phone: '', date_of_birth: '', gender: 'male'
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        const result = await register({
            name: formData.name, email: formData.email, password: formData.password,
            phone: formData.phone, date_of_birth: formData.date_of_birth, gender: formData.gender
        });

        if (result.success) {
            toast.success('Registration successful. Welcome!');
            navigate('/patient');
        } else {
            setError(result.message);
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-12">
            <div className="bg-white shadow-xl rounded-2xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-5">

                {/* Left Side branding */}
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-medical-dark p-10 flex flex-col justify-center text-white hidden md:flex">
                    <div className="flex items-center space-x-2 text-white mb-6 text-2xl font-bold uppercase tracking-wider justify-center">
                        <Activity className="h-8 w-8 text-medical-blue" />
                        <span>MediClinic</span>
                    </div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Patient Portal Gateway</h2>
                        <p className="text-indigo-200">Gain access to top medical professionals and manage your health seamlessly.</p>
                    </div>
                    <div className="space-y-6 text-sm text-indigo-100 font-medium">
                        <div className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-medical-blue" /> Easy Appointment Booking</div>
                        <div className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-medical-blue" /> Secure Medical Records</div>
                        <div className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-medical-blue" /> Track Medical History</div>
                    </div>
                </div>

                {/* Right form */}
                <div className="md:col-span-3 p-8 md:p-10 text-slate-800">
                    <h3 className="text-2xl font-bold mb-2">Create Patient Account</h3>
                    <p className="text-slate-500 mb-6">Fill in your details to register as a new patient.</p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-6 flex items-center text-sm rounded">
                            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name / Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" placeholder="John Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Phone Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" placeholder="123-456-7890" />
                                </div>
                            </div>
                        </div>

                        {/* DOB & Gender */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Date of Birth</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="date" name="date_of_birth" required value={formData.date_of_birth} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Gender</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm appearance-none cursor-pointer">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                </div>
                                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" placeholder="john@example.com" />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" placeholder="••••••••" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wide">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white text-sm" placeholder="••••••••" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-medical-dark hover:bg-slate-800 text-white py-2.5 rounded-lg font-semibold transition-all shadow mt-6 flex justify-center items-center text-sm">
                            {loading ? <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div> : 'Create Account'}
                        </button>

                    </form>

                    <p className="mt-6 text-center text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-medical-blue font-bold hover:underline text-sm ml-1">
                            Sign In
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Register;
