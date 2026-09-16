import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { MessageSquare, Send, X, User, Search, Check, CheckCheck, Loader, ChevronLeft, Shield } from 'lucide-react';

export default function ChatDrawer({ isOpen, onClose, currentUser, initialContactId = null }) {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const messagesEndRef = useRef(null);

    // Fetch contacts
    const fetchContacts = async (silent = false) => {
        if (!silent) setLoadingContacts(true);
        try {
            const data = await api.get('/messages');
            setContacts(data || []);
            if (initialContactId && !selectedContact) {
                const target = data.find(c => c.id === Number(initialContactId));
                if (target) setSelectedContact(target);
            }
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        } finally {
            if (!silent) setLoadingContacts(false);
        }
    };

    // Fetch messages thread for selected contact
    const fetchThread = async (contactId, silent = false) => {
        if (!silent) setLoadingMessages(true);
        try {
            const data = await api.get(`/messages/${contactId}`);
            setMessages(data.messages || []);
            if (data.contact) {
                setSelectedContact(prev => ({ ...prev, ...data.contact }));
            }
        } catch (err) {
            console.error('Failed to fetch messages thread:', err);
        } finally {
            if (!silent) setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchContacts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (selectedContact) {
            fetchThread(selectedContact.id);
        }
    }, [selectedContact?.id]);

    // Polling interval every 4 seconds when open
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            fetchContacts(true);
            if (selectedContact) {
                fetchThread(selectedContact.id, true);
            }
        }, 4000);

        return () => clearInterval(interval);
    }, [isOpen, selectedContact?.id]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact || sending) return;

        setSending(true);
        setErrorMsg('');
        const contentToSend = newMessage.trim();
        setNewMessage('');

        try {
            await api.post('/messages', {
                receiver_id: selectedContact.id,
                content: contentToSend
            });
            await fetchThread(selectedContact.id, true);
            fetchContacts(true);
        } catch (err) {
            setErrorMsg(err.message || 'Gagal mengirim pesan');
            setNewMessage(contentToSend);
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm flex justify-end transition-opacity duration-300">
            <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col md:flex-row overflow-hidden border-l border-slate-200">
                
                {/* Contact List Sidebar */}
                <div className={`w-full md:w-72 bg-[#f8fafc] border-r border-slate-200 flex flex-col h-full ${
                    selectedContact ? 'hidden md:flex' : 'flex'
                }`}>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-[#0f5c50] text-white flex items-center justify-center">
                                <MessageSquare size={16} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-navy">Pusat Pesan</h3>
                                <p className="text-[10px] text-slate-400 font-medium">stugether Inbox</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Cari kontak percakapan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50]"
                            />
                        </div>
                    </div>

                    {/* Contacts scroll list */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                        {loadingContacts && contacts.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                                <Loader className="animate-spin text-[#0f5c50]" size={20} />
                                Memuat kontak...
                            </div>
                        ) : filteredContacts.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400 leading-relaxed">
                                Tidak ada kontak yang dapat dihubungi sesuai izin peran Anda.
                            </div>
                        ) : (
                            filteredContacts.map(contact => {
                                const isSelected = selectedContact?.id === contact.id;
                                return (
                                    <button
                                        key={contact.id}
                                        onClick={() => setSelectedContact(contact)}
                                        className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                                            isSelected ? 'bg-white border-l-4 border-[#0f5c50] shadow-sm' : 'hover:bg-slate-100/80 bg-transparent'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                                                contact.role === 'admin' ? 'bg-[#161938] text-white' :
                                                contact.role === 'guru' ? 'bg-[#e6f4f1] text-[#0f5c50]' :
                                                'bg-[#f0edff] text-indigo-700'
                                            }`}>
                                                {contact.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {contact.unread_count > 0 && (
                                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                                                    {contact.unread_count}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-xs font-bold text-navy truncate">{contact.name}</h4>
                                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                                    contact.role === 'admin' ? 'bg-slate-200 text-slate-700' :
                                                    contact.role === 'guru' ? 'bg-[#e6f4f1] text-[#0f5c50]' :
                                                    'bg-indigo-50 text-indigo-700'
                                                }`}>
                                                    {contact.role} {contact.jenjang ? `(${contact.jenjang})` : ''}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 truncate">
                                                {contact.last_message ? (
                                                    <span>
                                                        {contact.last_message.is_mine && <span className="font-semibold text-[#0f5c50]">Anda: </span>}
                                                        {contact.last_message.content}
                                                    </span>
                                                ) : (
                                                    <span className="italic text-slate-400">Mulai percakapan baru</span>
                                                )}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Chat Messages Main Panel */}
                <div className={`flex-1 flex flex-col h-full bg-white ${
                    !selectedContact ? 'hidden md:flex' : 'flex'
                }`}>
                    {selectedContact ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => setSelectedContact(null)}
                                        className="md:hidden p-1 text-slate-500 hover:text-navy"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                                        selectedContact.role === 'admin' ? 'bg-[#161938] text-white' :
                                        selectedContact.role === 'guru' ? 'bg-[#e6f4f1] text-[#0f5c50]' :
                                        'bg-[#f0edff] text-indigo-700'
                                    }`}>
                                        {selectedContact.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-navy flex items-center gap-2">
                                            {selectedContact.name}
                                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                                                {selectedContact.role} {selectedContact.jenjang ? `• ${selectedContact.jenjang}` : ''}
                                            </span>
                                        </h3>
                                        <p className="text-[10px] text-slate-400">{selectedContact.email}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer hidden md:block"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Chat Messages List */}
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-3 bg-[#fafbfc] no-scrollbar">
                                {loadingMessages && messages.length === 0 ? (
                                    <div className="m-auto text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                                        <Loader className="animate-spin text-[#0f5c50]" size={24} />
                                        Memuat riwayat chat...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="m-auto text-center max-w-xs text-slate-400 text-xs">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-200 text-[#0f5c50]">
                                            <MessageSquare size={24} />
                                        </div>
                                        <p className="font-bold text-navy mb-1">Belum ada pesan</p>
                                        <p>Kirim pesan pertama Anda kepada {selectedContact.name}.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = msg.sender_id === currentUser.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col max-w-[80%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
                                            >
                                                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                                    isMine 
                                                        ? 'bg-[#0f5c50] text-white rounded-br-none' 
                                                        : 'bg-white text-slate-700 border border-slate-200/80 rounded-bl-none'
                                                }`}>
                                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                                <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 px-1">
                                                    <span>{new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {isMine && (
                                                        msg.is_read ? <CheckCheck size={12} className="text-teal-600" /> : <Check size={12} />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Error banner if any */}
                            {errorMsg && (
                                <div className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-medium border-t border-rose-100 flex items-center justify-between">
                                    <span>{errorMsg}</span>
                                    <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-700">✕</button>
                                </div>
                            )}

                            {/* Message Input Form */}
                            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder={`Tulis pesan untuk ${selectedContact.name}...`}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-[#f5f7fa] border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-[#0f5c50] focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="p-3 bg-[#0f5c50] hover:bg-[#0a423a] disabled:opacity-50 text-white rounded-2xl transition-colors cursor-pointer shadow-sm flex items-center justify-center"
                                >
                                    {sending ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                            <div className="w-16 h-16 rounded-3xl bg-[#f0fbf9] text-[#0f5c50] flex items-center justify-center mb-4">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-base font-bold text-navy mb-1">Pilih Kontak</h3>
                            <p className="text-xs max-w-xs leading-relaxed">
                                Pilih salah satu percakapan di sebelah kiri untuk melihat pesan atau memulai obrolan baru.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
