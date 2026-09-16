import React, { useState } from 'react';
import { api } from '../../utils/api';
import { 
    MessageCircle, Mail, MapPin, Send, ChevronDown, CalendarDays, 
    CheckCircle2, Shield, X, Clock, AlertTriangle, ExternalLink, Sparkles 
} from 'lucide-react';

export default function KontakKami() {
    // Form State
    const [formData, setFormData] = useState({
        nama: '',
        whatsapp: '',
        jenjang: 'SD',
        pesan: ''
    });
    const [formStatus, setFormStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [formError, setFormError] = useState('');

    // Schedule Visit Modal State
    const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
    const [visitData, setVisitData] = useState({
        nama: '',
        whatsapp: '',
        jenjang: 'SD',
        tanggal: '',
        catatan: ''
    });
    const [visitStatus, setVisitStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [visitError, setVisitError] = useState('');

    // Calculate minimum date for visit (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const handleSubmitContact = async (e) => {
        e.preventDefault();
        setFormStatus('loading');
        setFormError('');

        const { nama, whatsapp, jenjang, pesan } = formData;
        
        // Clean WhatsApp number
        let cleanWA = whatsapp.replace(/\D/g, '');
        if (cleanWA.startsWith('0')) {
            cleanWA = '62' + cleanWA.substring(1);
        }

        // Format WA message
        const waText = `Halo Sinau Bareng, saya ingin berkonsultasi:\n` +
            `• Nama Orang Tua: ${nama}\n` +
            `• No. WhatsApp: ${cleanWA || whatsapp}\n` +
            `• Jenjang Sekolah Anak: ${jenjang}\n` +
            `• Pesan:\n${pesan}`;

        const waUrl = `https://wa.me/6287752439572?text=${encodeURIComponent(waText)}`;

        try {
            // Dual-channel: send email via backend API
            await api.post('/contact', {
                nama,
                whatsapp: cleanWA || whatsapp,
                jenjang,
                pesan
            });

            // Open WhatsApp in new tab
            window.open(waUrl, '_blank', 'noopener,noreferrer');

            setFormStatus('success');
            setFormData({ nama: '', whatsapp: '', jenjang: 'SD', pesan: '' });
            setTimeout(() => setFormStatus('idle'), 6000);
        } catch (err) {
            console.error('Contact submit error:', err);
            // Even if API fails, still allow WhatsApp opening
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            setFormStatus('success');
        }
    };

    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        if (!selectedDate) {
            setVisitData({ ...visitData, tanggal: '' });
            setVisitError('');
            return;
        }

        const dateObj = new Date(selectedDate);
        // Day 0 is Sunday (Ahad)
        if (dateObj.getDay() === 0) {
            setVisitError('Mohon maaf, layanan offline tutup pada hari Ahad. Silakan pilih hari operasional (Senin - Sabtu).');
            setVisitData({ ...visitData, tanggal: '' });
            return;
        }

        setVisitError('');
        setVisitData({ ...visitData, tanggal: selectedDate });
    };

    const handleSubmitVisit = async (e) => {
        e.preventDefault();
        if (!visitData.tanggal) {
            setVisitError('Silakan pilih tanggal kunjungan terlebih dahulu.');
            return;
        }

        setVisitStatus('loading');
        setVisitError('');

        const { nama, whatsapp, jenjang, tanggal, catatan } = visitData;

        // Clean WhatsApp number
        let cleanWA = whatsapp.replace(/\D/g, '');
        if (cleanWA.startsWith('0')) {
            cleanWA = '62' + cleanWA.substring(1);
        }

        const formattedDate = new Intl.DateTimeFormat('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(new Date(tanggal));

        // Format WA message
        const waText = `Halo Sinau Bareng, saya ingin menjadwalkan kunjungan:\n` +
            `• Nama: ${nama}\n` +
            `• No. WhatsApp: ${cleanWA || whatsapp}\n` +
            `• Jenjang Peminatan: ${jenjang}\n` +
            `• Tanggal Kunjungan: ${formattedDate}\n` +
            `• Catatan/Keperluan: ${catatan || '-'}`;

        const waUrl = `https://wa.me/6287752439572?text=${encodeURIComponent(waText)}`;

        try {
            // Dual-channel: send email via backend API
            await api.post('/schedule-visit', {
                nama,
                whatsapp: cleanWA || whatsapp,
                jenjang,
                tanggal,
                catatan
            });

            // Open WhatsApp
            window.open(waUrl, '_blank', 'noopener,noreferrer');

            setVisitStatus('success');
            setTimeout(() => {
                setIsVisitModalOpen(false);
                setVisitStatus('idle');
                setVisitData({ nama: '', whatsapp: '', jenjang: 'SD', tanggal: '', catatan: '' });
            }, 2500);
        } catch (err) {
            console.error('Schedule visit error:', err);
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            setVisitStatus('success');
            setTimeout(() => {
                setIsVisitModalOpen(false);
                setVisitStatus('idle');
            }, 2500);
        }
    };

    const faqs = [
        "Berapa biaya pendaftaran awal?",
        "Apakah ada kelas percobaan gratis?",
        "Bagaimana kurikulum syar'i diterapkan?",
        "Apakah tersedia program beasiswa?"
    ];

    return (
        <div className="w-full">
            {/* Header Section */}
            <section className="w-full max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
                <h1 className="text-4xl lg:text-5xl font-extrabold text-primary mb-4">Hubungi Kami</h1>
                <p className="text-on-surface-variant text-sm">
                    Kami siap membantu Anda memilih jalur pendidikan terbaik yang syar'i dan profesional untuk masa depan buah hati Anda.
                </p>
            </section>

            {/* Contact Info & Form */}
            <section className="w-full max-w-7xl mx-auto px-6 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Info Cards */}
                    <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                        {/* Saluran Komunikasi */}
                        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Saluran Komunikasi</h3>
                            
                            {/* WhatsApp Support */}
                            <a 
                                href="https://wa.me/6287752439572" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-between mb-4 pb-4 border-b border-surface-variant cursor-pointer group hover:opacity-90 transition-all block text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#e6f7f4] rounded-full flex items-center justify-center text-teal group-hover:scale-105 transition-transform">
                                        <MessageCircle size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant">WhatsApp Support</p>
                                        <p className="text-sm font-bold text-navy group-hover:text-teal transition-colors">+62 877 - 5243 - 9572</p>
                                    </div>
                                </div>
                                <span className="text-outline-variant group-hover:text-teal font-bold transition-colors">›</span>
                            </a>
                            
                            {/* Email Resmi */}
                            <a 
                                href="mailto:ahmadnurdiyansyah26@gmail.com"
                                className="flex items-center justify-between cursor-pointer group hover:opacity-90 transition-all block text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#e6f7f4] rounded-full flex items-center justify-center text-teal group-hover:scale-105 transition-transform">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-on-surface-variant">Email Resmi</p>
                                        <p className="text-sm font-bold text-navy group-hover:text-teal transition-colors truncate max-w-[200px]">ahmadnurdiyansyah26@gmail.com</p>
                                    </div>
                                </div>
                                <span className="text-outline-variant group-hover:text-teal font-bold transition-colors">›</span>
                            </a>
                        </div>

                        {/* Jam Layanan */}
                        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-navy mb-4">Jam Layanan</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm text-on-surface-variant">Senin - Jumat</span>
                                <span className="text-sm font-bold text-navy">08:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-surface-variant">
                                <span className="text-sm text-on-surface-variant">Sabtu</span>
                                <span className="text-sm font-bold text-navy">09:00 - 15:00</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-on-surface-variant">Ahad & Libur Nasional</span>
                                <span className="text-sm font-bold text-error">Tutup</span>
                            </div>
                        </div>

                        {/* Alamat Kantor & Google Maps */}
                        <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-navy mb-2">Alamat Kantor</h3>
                            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                                3H69+JQ Medina Residence 3, Istanbul K-5, Merjosari, Lowokwaru, Malang City, East Java 65151
                            </p>
                            <div className="w-full h-44 bg-surface-container-high rounded-2xl relative overflow-hidden border border-outline-variant/20 shadow-inner">
                                <iframe
                                    title="Google Maps Medina Residence 3 Malang"
                                    src="https://maps.google.com/maps?q=-7.935142,112.597652+(Medina+Residence+3+Merjosari+Malang)&t=&z=16&ie=UTF8&iwloc=&output=embed"
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                ></iframe>
                                <div className="absolute bottom-2 right-2 z-10">
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=3H69%2BJQ+Medina+Residence+3+Istanbul+K-5+Merjosari+Lowokwaru+Malang"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-navy font-bold text-xs rounded-full shadow-md flex items-center gap-1.5 hover:bg-white hover:text-teal transition-all"
                                    >
                                        <MapPin size={13} className="text-teal" /> Buka di Maps <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden text-left">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-surface-container-high rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
                        
                        <h2 className="text-2xl font-bold text-primary mb-2 relative z-10">Kirim Pesan</h2>
                        <p className="text-sm text-on-surface-variant mb-8 relative z-10">
                            Isi formulir di bawah ini. Pesan Anda akan langsung terhubung ke WhatsApp Support kami sekaligus tercatat di sistem konsultasi.
                        </p>

                        {formStatus === 'success' && (
                            <div className="bg-[#dcfce7] border border-[#bbf7d0] text-[#116e63] p-6 rounded-2xl flex items-center gap-3 mb-6 relative z-10 animate-fade-in">
                                <CheckCircle2 size={24} className="shrink-0" /> 
                                <div>
                                    <h4 className="font-bold">Pesan Berhasil Dikirim!</h4>
                                    <p className="text-xs mt-0.5">Alhamdulillah, formulir terkirim ke email tim dan diarahkan ke WhatsApp Support kami.</p>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmitContact} className="flex flex-col gap-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-navy">Nama Orang Tua <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        placeholder="Masukkan nama lengkap..." 
                                        required 
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        className="px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" 
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold text-navy">Nomor WhatsApp <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="tel" 
                                        placeholder="Contoh: 087752439572" 
                                        required 
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" 
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-navy">Jenjang Sekolah Anak <span className="text-rose-500">*</span></label>
                                <div className="relative">
                                    <select 
                                        required 
                                        value={formData.jenjang}
                                        onChange={(e) => setFormData({ ...formData, jenjang: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                                    >
                                        <option value="SD">Sekolah Dasar (SD)</option>
                                        <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-navy">Pesan Anda <span className="text-rose-500">*</span></label>
                                <textarea 
                                    rows={4} 
                                    placeholder="Ceritakan kebutuhan atau pertanyaan tentang program bimbingan..." 
                                    required 
                                    value={formData.pesan}
                                    onChange={(e) => setFormData({ ...formData, pesan: e.target.value })}
                                    className="px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm resize-none focus:outline-none focus:border-primary transition-colors"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={formStatus === 'loading'}
                                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                <Send size={18} /> {formStatus === 'loading' ? 'Mengirim Pesan...' : 'Kirim Pesan Sekarang'}
                            </button>

                            <div className="bg-orange/10 p-4 rounded-xl flex gap-3 items-start border border-orange/20 mt-2">
                                <Shield size={18} className="text-orange shrink-0 mt-0.5" />
                                <p className="text-xs text-orange font-medium leading-relaxed">
                                    Insya Allah, data Anda terjaga kerahasiaannya dan hanya akan kami gunakan untuk kepentingan konsultasi pendidikan.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="w-full max-w-4xl mx-auto px-6 py-12 text-center">
                <h2 className="text-2xl font-bold text-navy mb-2">Pertanyaan Umum (FAQ)</h2>
                <p className="text-sm text-on-surface-variant mb-8">Menjawab rasa penasaran Anda tentang Sinau Bareng</p>

                <div className="flex flex-col gap-4 text-left">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-surface-container-low p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-surface-container transition-colors">
                            <span className="text-sm text-navy">{faq}</span>
                            <ChevronDown size={16} className="text-on-surface-variant" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Banner Jadwalkan Kunjungan */}
            <section className="w-full max-w-7xl mx-auto px-6 py-12 mb-12">
                <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center">
                    <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" alt="Campus" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/85"></div>
                    
                    <div className="relative z-10 p-10 md:p-16 max-w-xl text-left">
                        <h3 className="text-3xl font-bold text-white mb-4">Mari Bangun Masa Depan Bersama</h3>
                        <p className="text-sm text-white/90 mb-8 leading-relaxed">
                            Kunjungi pusat bimbingan kami di Malang untuk konsultasi tatap muka langsung dan melihat fasilitas belajar yang nyaman.
                        </p>
                        <button 
                            type="button"
                            onClick={() => setIsVisitModalOpen(true)}
                            className="px-6 py-3.5 bg-orange text-white font-bold rounded-xl hover:bg-[#6d4400] transition-all flex items-center gap-2 w-fit cursor-pointer shadow-lg hover:scale-105 transform duration-200"
                        >
                            <CalendarDays size={18} /> Jadwalkan Kunjungan
                        </button>
                    </div>
                </div>
            </section>

            {/* MODAL JADWALKAN KUNJUNGAN */}
            {isVisitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm animate-fade-in text-left">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
                        {/* Close button */}
                        <button 
                            onClick={() => setIsVisitModalOpen(false)}
                            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-orange/15 text-orange flex items-center justify-center">
                                <CalendarDays size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-navy">Jadwalkan Kunjungan</h3>
                                <p className="text-xs text-on-surface-variant">Pilih tanggal dan isi detail kunjungan Anda</p>
                            </div>
                        </div>

                        {visitStatus === 'success' ? (
                            <div className="bg-[#dcfce7] border border-[#bbf7d0] text-teal p-6 rounded-2xl flex items-center gap-3">
                                <CheckCircle2 size={28} className="shrink-0" />
                                <div>
                                    <h4 className="font-bold text-sm">Jadwal Berhasil Dikonfirmasi!</h4>
                                    <p className="text-xs mt-1">Kami membuka percakapan WhatsApp untuk tindak lanjut kunjungan Anda.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitVisit} className="flex flex-col gap-4">
                                {visitError && (
                                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                                        <AlertTriangle size={16} className="shrink-0" />
                                        <span>{visitError}</span>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-bold text-navy block mb-1.5">Nama Lengkap / Orang Tua <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="text" 
                                        required 
                                        placeholder="Masukkan nama lengkap..."
                                        value={visitData.nama}
                                        onChange={(e) => setVisitData({ ...visitData, nama: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-navy block mb-1.5">Nomor WhatsApp Aktif <span className="text-rose-500">*</span></label>
                                    <input 
                                        type="tel" 
                                        required 
                                        placeholder="Contoh: 087752439572"
                                        value={visitData.whatsapp}
                                        onChange={(e) => setVisitData({ ...visitData, whatsapp: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-navy block mb-1.5">Jenjang <span className="text-rose-500">*</span></label>
                                        <select 
                                            value={visitData.jenjang}
                                            onChange={(e) => setVisitData({ ...visitData, jenjang: e.target.value })}
                                            className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary"
                                        >
                                            <option value="SD">Paket SD</option>
                                            <option value="SMP">Paket SMP</option>
                                            <option value="Umum">Konsultasi Umum</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-navy block mb-1.5">Pilih Tanggal Kunjungan <span className="text-rose-500">*</span></label>
                                        <input 
                                            type="date" 
                                            required 
                                            min={minDate}
                                            value={visitData.tanggal}
                                            onChange={handleDateChange}
                                            className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm focus:outline-none focus:border-primary cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2.5 rounded-xl">
                                    <Clock size={14} className="text-teal shrink-0" />
                                    <span>Jam Kunjungan: Senin-Jumat 08:00 - 17:00 | Sabtu 09:00 - 15:00 (Ahad Tutup)</span>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-navy block mb-1.5">Catatan / Rencana Diskusi (Opsional)</label>
                                    <textarea 
                                        rows={3} 
                                        placeholder="Tuliskan jika ada kebutuhan khusus atau topik yang ingin dikonsultasikan..."
                                        value={visitData.catatan}
                                        onChange={(e) => setVisitData({ ...visitData, catatan: e.target.value })}
                                        className="w-full px-4 py-3 bg-surface-bright border border-outline-variant/50 rounded-xl text-sm resize-none focus:outline-none focus:border-primary"
                                    ></textarea>
                                </div>

                                <div className="mt-4 flex gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsVisitModalOpen(false)}
                                        className="w-1/3 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={visitStatus === 'loading'}
                                        className="w-2/3 py-3.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                                    >
                                        <CalendarDays size={16} /> {visitStatus === 'loading' ? 'Mengonfirmasi...' : 'Konfirmasi Jadwal'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
