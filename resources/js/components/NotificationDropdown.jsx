import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { Bell, CheckCheck, MessageSquare, Calendar, BookOpen, Info, ShieldCheck, X } from 'lucide-react';

export default function NotificationDropdown({ isOpen, onClose, onOpenChat }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const data = await api.get('/notifications');
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Polling notifications every 8 seconds
        const interval = setInterval(() => {
            fetchNotifications(true);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const handleItemClick = async (notif) => {
        if (!notif.is_read) {
            try {
                await api.patch(`/notifications/${notif.id}/read`);
                setUnreadCount(prev => Math.max(0, prev - 1));
                setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n));
            } catch (err) {
                console.error('Failed to mark as read:', err);
            }
        }
        if (notif.type === 'message' && onOpenChat) {
            onOpenChat();
            onClose();
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'message':
                return <MessageSquare size={16} className="text-[#0f5c50]" />;
            case 'session':
                return <Calendar size={16} className="text-[#b87c1a]" />;
            case 'report':
            case 'quiz':
                return <BookOpen size={16} className="text-indigo-600" />;
            default:
                return <Info size={16} className="text-slate-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            ref={dropdownRef}
            className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-150"
        >
            {/* Header */}
            <div className="p-4 px-5 border-b border-slate-100 flex items-center justify-between bg-[#fafbfc]">
                <div className="flex items-center gap-2">
                    <Bell size={18} className="text-navy" />
                    <h3 className="font-bold text-sm text-navy">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                            {unreadCount} baru
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold text-[#0f5c50] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <CheckCheck size={14} /> Tandai Dibaca
                        </button>
                    )}
                    <button 
                        onClick={onClose}
                        className="p-1 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-200/60 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Notifications list */}
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <Bell size={18} />
                        </div>
                        <p className="font-semibold text-slate-600">Belum ada notifikasi</p>
                        <p>Aktivitas terbaru sistem akan muncul di sini.</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => handleItemClick(notif)}
                            className={`p-4 flex items-start gap-3.5 transition-colors cursor-pointer ${
                                !notif.is_read ? 'bg-[#f0fbf9]/70 hover:bg-[#e6f7f4]' : 'hover:bg-slate-50 bg-white'
                            }`}
                        >
                            <div className="w-9 h-9 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <h4 className={`text-xs font-bold truncate ${!notif.is_read ? 'text-navy' : 'text-slate-700'}`}>
                                        {notif.title}
                                    </h4>
                                    {!notif.is_read && (
                                        <span className="w-2 h-2 rounded-full bg-[#0f5c50] shrink-0"></span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                                    {notif.message}
                                </p>
                                <span className="text-[9px] text-slate-400 font-medium block mt-1">
                                    {new Date(notif.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
