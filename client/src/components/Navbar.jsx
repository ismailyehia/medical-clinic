import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, Menu, Check, CheckCheck, Calendar, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const notifIcons = {
    appointment: Calendar,
    status_update: AlertCircle,
    general: Info,
};

const notifColors = {
    appointment: 'text-blue-500 bg-blue-50',
    status_update: 'text-amber-500 bg-amber-50',
    general: 'text-gray-500 bg-gray-50',
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loadingNotifs, setLoadingNotifs] = useState(false);
    const dropdownRef = useRef(null);

    // Fetch unread count on mount and every 30 seconds
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const { data } = await axios.get('/notifications/unread-count');
                setUnreadCount(data.count);
            } catch (err) {
                // silently fail
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = async () => {
        const opening = !dropdownOpen;
        setDropdownOpen(opening);

        if (opening) {
            setLoadingNotifs(true);
            try {
                const { data } = await axios.get('/notifications');
                setNotifications(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingNotifs(false);
            }
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await axios.put(`/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 z-10">
            <div className="flex items-center md:hidden">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <div className="hidden md:flex flex-1">
                <h2 className="text-xl font-semibold text-gray-800 capitalize">
                    Welcome back, {user?.name?.split(' ')[0]}!
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropdown}
                        className="relative p-2 text-gray-400 hover:text-medical-blue transition-colors"
                    >
                        <Bell className="h-6 w-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Dropdown */}
                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 text-lg">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center transition-colors"
                                    >
                                        <CheckCheck className="h-3.5 w-3.5 mr-1" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notification List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {loadingNotifs ? (
                                    <div className="p-6 space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-start space-x-3">
                                                <div className="h-10 w-10 bg-gray-100 rounded-lg animate-pulse flex-shrink-0"></div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                                                    <div className="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-10 text-center text-gray-400">
                                        <Bell className="h-10 w-10 mx-auto mb-3 opacity-40" />
                                        <p className="font-medium">No notifications yet</p>
                                        <p className="text-sm mt-1">We'll let you know when something comes up.</p>
                                    </div>
                                ) : (
                                    <ul>
                                        {notifications.map(notif => {
                                            const Icon = notifIcons[notif.type] || notifIcons.general;
                                            const iconColor = notifColors[notif.type] || notifColors.general;

                                            return (
                                                <li
                                                    key={notif.id}
                                                    className={`px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex items-start space-x-3 ${!notif.is_read ? 'bg-blue-50/40' : ''
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg flex-shrink-0 ${iconColor}`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between">
                                                            <p className={`text-sm font-semibold ${!notif.is_read ? 'text-slate-800' : 'text-gray-500'}`}>
                                                                {notif.title}
                                                            </p>
                                                            {!notif.is_read && (
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleMarkAsRead(notif.id);
                                                                    }}
                                                                    className="ml-2 p-1 text-gray-300 hover:text-blue-500 transition-colors flex-shrink-0"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <p className={`text-sm mt-0.5 leading-snug ${!notif.is_read ? 'text-gray-600' : 'text-gray-400'}`}>
                                                            {notif.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1.5">
                                                            {dayjs(notif.created_at).fromNow()}
                                                        </p>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center bg-slate-50 rounded-full pl-2 pr-4 py-1 border border-gray-200 cursor-pointer hover:shadow-sm transition-shadow">
                    <div className="h-8 w-8 rounded-full bg-medical-light text-medical-blue flex items-center justify-center mr-2">
                        <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-gray-700 leading-tight">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="p-2 ml-2 text-gray-400 hover:text-red-500 transition-colors tooltip-bottom"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
