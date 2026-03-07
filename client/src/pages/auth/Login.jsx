import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success('Successfully logged in!');
            // Redirect to role-specific dashboard
            if (result.role === 'admin') navigate('/admin');
            else if (result.role === 'doctor') navigate('/doctor');
            else if (result.role === 'patient') navigate('/patient');
            else navigate('/');
        } else {
            setError(result.message);
            toast.error(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-medical-dark flex items-center justify-center p-4">
            <div className="bg-medical-dark shadow-2xl rounded-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden text-white border border-gray-800">

                {/* Left Side Branding */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-medical-blue to-[#026cac] p-10 flex flex-col justify-between hidden md:flex">
                    <div>
                        <div className="flex items-center space-x-2 text-white mb-10 text-3xl font-bold uppercase tracking-wider">
                            <Activity className="h-10 w-10 text-white" />
                            <span>MediClinic</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-6">
                            Empowering Healthcare Through Technology
                        </h2>
                        <p className="text-blue-100 text-lg">
                            Manage appointments, patient records, and clinic schedules all in one modern platform.
                        </p>
                    </div>
                    <div className="text-blue-200 text-sm">
                        © {new Date().getFullYear()} MediClinic Systems. All rights reserved.
                    </div>
                </div>

                {/* Right Side Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 bg-white text-slate-800">
                    <div className="md:hidden flex items-center space-x-2 text-medical-blue mb-8 text-2xl font-bold uppercase tracking-wider">
                        <Activity className="h-8 w-8" />
                        <span>MediClinic</span>
                    </div>

                    <h3 className="text-3xl font-bold mb-2">Welcome Back</h3>
                    <p className="text-slate-500 mb-8">Please enter your credentials to login.</p>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center">
                            <AlertCircle className="h-5 w-5 mr-2" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="doctor@clinic.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="block text-sm font-medium text-slate-700">Password</label>
                                <Link to="/forgot-password" className="text-sm text-medical-blue hover:text-[#026cac] font-medium">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center justify-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-medical-blue focus:border-medical-blue bg-slate-50 focus:bg-white transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-medical-blue hover:bg-[#026cac] text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center group"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-medical-blue font-semibold hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
