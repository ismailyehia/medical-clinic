import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
    Home,
    Users,
    UserPlus,
    Calendar,
    Activity,
    Settings,
    FileText,
    Stethoscope
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: Home },
        { name: 'Doctors', path: '/admin/doctors', icon: UserPlus },
        { name: 'Patients', path: '/admin/patients', icon: Users },
        { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    ];

    const doctorLinks = [
        { name: 'Dashboard', path: '/doctor', icon: Home },
        { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { name: 'Patients', path: '/doctor/patients', icon: Users },
    ];

    const patientLinks = [
        { name: 'Dashboard', path: '/patient', icon: Home },
        { name: 'Book Appointment', path: '/patient/book', icon: Calendar },
        { name: 'My Records', path: '/patient/records', icon: FileText },
        { name: 'Doctors', path: '/patient/doctors', icon: Stethoscope },
    ];

    let links = [];
    if (user?.role === 'admin') links = adminLinks;
    if (user?.role === 'doctor') links = doctorLinks;
    if (user?.role === 'patient') links = patientLinks;

    return (
        <div className="w-64 bg-medical-dark text-white flex flex-col shadow-xl hidden md:flex">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <Activity className="h-8 w-8 text-medical-blue mr-2" />
                <h1 className="text-xl font-bold tracking-wider">MediClinic</h1>
            </div>
            <div className="p-4 flex-1">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
                    MENU
                </p>
                <ul className="space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path ||
                            (link.path !== '/' && location.pathname.startsWith(link.path) && link.path !== `/${user?.role}`);

                        return (
                            <li key={link.name}>
                                <Link
                                    to={link.path}
                                    className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-medical-blue text-white shadow-md'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="h-5 w-5 mr-3" />
                                    <span className="font-medium">{link.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <div className="p-4 border-t border-gray-800">
                <button className="flex items-center text-gray-400 hover:text-white transition-colors">
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
