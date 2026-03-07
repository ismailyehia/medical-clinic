import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, UserCheck, Search, Calendar, Heart } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <header className="bg-gradient-to-r from-medical-dark via-slate-800 to-medical-blue pt-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 text-white z-10 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
                            <Activity className="h-8 w-8 text-blue-400" />
                            <span className="text-xl font-bold tracking-widest uppercase">MediClinic</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                            Modern Care <br />
                            <span className="text-blue-400">Simplified.</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                            Experience healthcare management designed for the future. Book appointments, manage records, and connect with top specialists instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/register" className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
                                Get Started
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full font-bold transition-all w-full sm:w-auto text-center">
                                Patient Login
                            </Link>
                        </div>
                    </div>

                    <div className="md:w-1/2 mt-16 md:mt-0 relative hidden md:block">
                        {/* Abstract Graphic */}
                        <div className="relative w-full aspect-square max-w-md mx-auto">
                            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute top-10 right-10 w-32 h-32 bg-medical-light/10 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-2xl skew-y-6 transform animate-[bounce_5s_infinite]">
                                <Heart className="h-10 w-10 text-red-400 mb-2" />
                                <div className="h-2 w-16 bg-white/20 rounded mb-2"></div>
                                <div className="h-2 w-10 bg-white/20 rounded"></div>
                            </div>
                            <div className="absolute bottom-10 left-10 w-40 h-32 bg-medical-dark/40 backdrop-blur border border-white/10 rounded-2xl p-4 shadow-2xl -skew-y-3 transform animate-[bounce_7s_infinite]">
                                <Calendar className="h-10 w-10 text-blue-400 mb-2" />
                                <div className="h-2 w-20 bg-white/20 rounded flex space-x-1"><div className="w-1/3 bg-blue-400 rounded"></div><div className="w-2/3 bg-white/20 rounded"></div></div>
                            </div>
                            <Activity className="absolute inset-0 m-auto h-48 w-48 text-white opacity-10" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-20 -mt-16 px-6 relative z-20">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all">
                        <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-medical-blue">
                            <Calendar className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Easy Booking</h3>
                        <p className="text-slate-500 leading-relaxed">Schedule appointments with preferred specialists in real-time, avoiding lengthy phone calls.</p>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all md:-mt-8">
                        <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-500">
                            <Shield className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Secure Records</h3>
                        <p className="text-slate-500 leading-relaxed">Your medical history, prescriptions, and test results securely stored and easily accessible.</p>
                    </div>

                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 transform hover:-translate-y-2 transition-all">
                        <div className="h-16 w-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-purple-500">
                            <UserCheck className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Care</h3>
                        <p className="text-slate-500 leading-relaxed">Connect with our team of verified and experienced medical specialists across various departments.</p>
                    </div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 px-6 mt-10">
                <div className="max-w-4xl mx-auto bg-medical-blue rounded-3xl p-12 text-center shadow-2xl shadow-medical-blue/30 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>

                    <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to prioritize your health?</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto relative z-10">
                        Join thousands of patients who have already transformed their healthcare experience with MediClinic.
                    </p>
                    <Link to="/register" className="inline-block px-10 py-4 bg-white text-medical-blue hover:bg-slate-50 rounded-full font-bold shadow-lg transition-all relative z-10">
                        Create a Free Account
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
