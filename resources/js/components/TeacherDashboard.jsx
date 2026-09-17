import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { resilientMediaUpload } from '../utils/upload';
import Logo from './Logo';
import ChatDrawer from './ChatDrawer';
import NotificationDropdown from './NotificationDropdown';
import Modal from './common/Modal';
import { 
    BookOpen, FileText, Upload, Plus, Trash2, Edit3, Save, CheckSquare, 
    LogOut, Award, User, Clock, FileSpreadsheet, Eye, Music, Image as ImageIcon, Sparkles, Loader,
    Mail, Bell, GraduationCap, LayoutDashboard, FileQuestion, Headset, FolderX, ClipboardX, ArrowUpRight, 
    Users, Settings, Calendar, BarChart3, Video, CheckCircle2, AlertCircle, ArrowLeft, Lock
} from 'lucide-react';

export default function TeacherDashboard({ user, onNavigate, onLogout, showToast }) {
    const [activeTab, setActiveTab] = useState('stats'); // 'stats' | 'stats-detail' | 'students' | 'materials' | 'quizzes' | 'sessions'
    
    // Notifications & Chat State
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    
    // Core data lists
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [sessionsList, setSessionsList] = useState([]);
    
    // Loading states
    const [loading, setLoading] = useState(false);

    // Form states - Sessions
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionFormData, setSessionFormData] = useState({
        judul: '',
        jenjang: user.jenjang || 'SD',
        waktu_mulai: '',
        waktu_selesai: '',
        link_meeting: '',
        deskripsi: ''
    });
    const [sessionLoading, setSessionLoading] = useState(false);

    // Form states - Materials
    const [newMaterial, setNewMaterial] = useState({ judul: '', deskripsi: '' });
    const [materialFile, setMaterialFile] = useState(null);

    // Form states - Quizzes
    const [newQuiz, setNewQuiz] = useState({ judul: '', durasi_menit: 45, tipe: 'UTBK' });
    
    // Form states - Questions
    const [newQuestion, setNewQuestion] = useState({
        tipe: 'pilihan_ganda',
        pertanyaan: '',
        options: [
            { teks_opsi: '', is_benar: true },
            { teks_opsi: '', is_benar: false },
            { teks_opsi: '', is_benar: false },
            { teks_opsi: '', is_benar: false }
        ]
    });
    const [questionMedia, setQuestionMedia] = useState(null);
    const [simulateFirebaseTimeout, setSimulateFirebaseTimeout] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    // Form states - Grading
    const [grades, setGrades] = useState({});

    useEffect(() => {
        fetchMaterials();
        fetchQuizzes();
        fetchStudents();
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const data = await api.get('/sessions');
            setSessionsList(data || []);
        } catch (err) {
            console.error('Failed to fetch sessions:', err);
        }
    };

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setSessionLoading(true);
        try {
            await api.post('/sessions', sessionFormData);
            showToast('Sesi belajar berhasil dijadwalkan!');
            setIsSessionModalOpen(false);
            setSessionFormData({
                judul: '',
                jenjang: user.jenjang || 'SD',
                waktu_mulai: '',
                waktu_selesai: '',
                link_meeting: '',
                deskripsi: ''
            });
            fetchSessions();
        } catch (err) {
            showToast('Gagal menjadwalkan sesi: ' + err.message, 'error');
        } finally {
            setSessionLoading(false);
        }
    };

    const handleUpdateSessionStatus = async (sessionId, status) => {
        try {
            await api.put(`/sessions/${sessionId}`, { status });
            showToast('Status sesi belajar berhasil diubah.');
            fetchSessions();
        } catch (err) {
            showToast('Gagal mengubah status sesi: ' + err.message, 'error');
        }
    };

    const handleDeleteSession = async (sessionId) => {
        if (!confirm('Hapus jadwal sesi belajar ini?')) return;
        try {
            await api.delete(`/sessions/${sessionId}`);
            showToast('Sesi belajar berhasil dihapus.');
            fetchSessions();
        } catch (err) {
            showToast('Gagal menghapus sesi: ' + err.message, 'error');
        }
    };

    const fetchStudents = async () => {
        try {
            const data = await api.get('/students');
            setStudents(data || []);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        }
    };

    const fetchMaterials = async () => {
        try {
            const data = await api.get('/materials');
            setMaterials(data.data || []);
        } catch (err) {
            showToast('Gagal memuat materi: ' + err.message, 'error');
        }
    };

    const fetchQuizzes = async () => {
        try {
            const data = await api.get('/quizzes');
            setQuizzes(data.data || []);
        } catch (err) {
            showToast('Gagal memuat kuis: ' + err.message, 'error');
        }
    };

    const fetchQuizDetails = async (quizId) => {
        setLoading(true);
        try {
            const data = await api.get(`/quizzes/${quizId}`);
            setSelectedQuiz(data);
            fetchSubmissions(quizId);
        } catch (err) {
            showToast('Gagal memuat kuis: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubmissions = async (quizId) => {
        try {
            const data = await api.get(`/quizzes/${quizId}/submissions`);
            setSubmissions(data || []);
        } catch (err) {
            showToast('Gagal memuat data pengerjaan: ' + err.message, 'error');
        }
    };

    // Material Actions
    const handleCreateMaterial = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('judul', newMaterial.judul);
            formData.append('deskripsi', newMaterial.deskripsi);
            if (materialFile) {
                formData.append('attachment', materialFile);
            }

            await api.post('/materials', formData);
            showToast('Modul materi berhasil diunggah!');
            setNewMaterial({ judul: '', deskripsi: '' });
            setMaterialFile(null);
            fetchMaterials();
        } catch (err) {
            showToast('Gagal mengunggah materi: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMaterial = async (id) => {
        if (!confirm('Hapus materi ini?')) return;
        try {
            await api.delete(`/materials/${id}`);
            showToast('Materi berhasil dihapus.');
            fetchMaterials();
        } catch (err) {
            showToast('Gagal menghapus materi: ' + err.message, 'error');
        }
    };

    // Quiz Actions
    const handleCreateQuiz = async (e) => {
        e.preventDefault();
        try {
            await api.post('/quizzes', newQuiz);
            showToast('Kuis berhasil dibuat! Silakan tambahkan pertanyaan.');
            setNewQuiz({ judul: '', durasi_menit: 45, tipe: 'UTBK' });
            fetchQuizzes();
        } catch (err) {
            showToast('Gagal membuat kuis: ' + err.message, 'error');
        }
    };

    // Question Actions
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (!selectedQuiz) return;
        setLoading(true);
        setUploadingMedia(true);

        try {
            let uploadedMediaData = null;
            if (questionMedia) {
                uploadedMediaData = await resilientMediaUpload(questionMedia, simulateFirebaseTimeout);
                setUploadResult(uploadedMediaData);
            }

            const payload = new FormData();
            payload.append('tipe', newQuestion.tipe);
            payload.append('pertanyaan', newQuestion.pertanyaan);

            if (newQuestion.tipe === 'pilihan_ganda') {
                newQuestion.options.forEach((opt, idx) => {
                    payload.append(`options[${idx}][teks_opsi]`, opt.teks_opsi);
                    payload.append(`options[${idx}][is_benar]`, opt.is_benar ? '1' : '0');
                });
            }

            if (uploadedMediaData) {
                payload.append('media_type', uploadedMediaData.media_type);
                payload.append('file_path', uploadedMediaData.file_path);
                payload.append('public_url', uploadedMediaData.public_url);
                payload.append('drive_id', uploadedMediaData.drive_id);
            }

            await api.post(`/quizzes/${selectedQuiz.id}/questions`, payload);
            showToast('Pertanyaan berhasil ditambahkan!');
            
            setNewQuestion({
                tipe: 'pilihan_ganda',
                pertanyaan: '',
                options: [
                    { teks_opsi: '', is_benar: true },
                    { teks_opsi: '', is_benar: false },
                    { teks_opsi: '', is_benar: false },
                    { teks_opsi: '', is_benar: false }
                ]
            });
            setQuestionMedia(null);
            setUploadResult(null);
            
            fetchQuizDetails(selectedQuiz.id);
        } catch (err) {
            showToast('Gagal menambah pertanyaan: ' + err.message, 'error');
        } finally {
            setLoading(false);
            setUploadingMedia(false);
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (!confirm('Hapus pertanyaan ini?')) return;
        try {
            await api.delete(`/questions/${questionId}`);
            showToast('Pertanyaan berhasil dihapus.');
            fetchQuizDetails(selectedQuiz.id);
        } catch (err) {
            showToast('Gagal menghapus pertanyaan: ' + err.message, 'error');
        }
    };

    // Grading Actions
    const handleGradeSubmission = async (submissionId) => {
        setLoading(true);
        try {
            const gradeData = grades[submissionId] || {};
            await api.put(`/submissions/${submissionId}/grade`, {
                skor_esai: gradeData.skor_esai || 0,
                catatan_guru: gradeData.catatan_guru || ''
            });
            showToast('Penilaian pengerjaan kuis berhasil disimpan.');
            fetchSubmissions(selectedQuiz.id);
        } catch (err) {
            showToast('Gagal menyimpan nilai: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Export Excel/CSV Summary
    const handleExportSubmissions = () => {
        if (!submissions || submissions.length === 0) {
            showToast('Belum ada data pengerjaan untuk diekspor.', 'error');
            return;
        }

        const headers = ['Nama Siswa', 'Email', 'Jenjang', 'Skor PG', 'Skor Esai', 'Total Skor', 'Status', 'Waktu Pengumpulan'];
        const rows = submissions.map(sub => [
            `"${sub.user?.name || '-'}"`,
            `"${sub.user?.email || '-'}"`,
            `"${sub.user?.jenjang || '-'}"`,
            sub.skor_pg || 0,
            sub.skor_esai || 0,
            (sub.skor_pg || 0) + (sub.skor_esai || 0),
            `"${sub.status || '-'}"`,
            `"${new Date(sub.created_at).toLocaleString('id-ID')}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Rekap_Nilai_Kuis_${selectedQuiz?.judul || 'Simulasi'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('File laporan nilai berhasil diunduh!');
    };

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col lg:flex-row bg-[#fafbfc]">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 bg-white lg:border-r border-slate-100 p-6 flex flex-col justify-between text-left h-full overflow-y-auto shrink-0 z-10">
                <div>
                    {/* Standardized Universal Logo */}
                    <div className="mb-10 cursor-pointer" onClick={() => onNavigate('beranda')}>
                        <Logo size="lg" subtitle={`Guru Panel (${user.jenjang || 'SD'})`} />
                    </div>

                    {/* Navigation Menu */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => { setActiveTab('stats'); setSelectedQuiz(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'stats' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Dashboard Ringkasan
                        </button>
                        <button
                            onClick={() => { setActiveTab('stats-detail'); setSelectedQuiz(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'stats-detail' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <BarChart3 size={18} /> Statistik Pengajaran
                        </button>
                        <button
                            onClick={() => { setActiveTab('sessions'); setSelectedQuiz(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'sessions' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <Calendar size={18} /> Jadwal Sesi Belajar
                        </button>
                        <button
                            onClick={() => { setActiveTab('students'); setSelectedQuiz(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'students' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <Users size={18} /> Daftar Murid ({user.jenjang || 'SD'})
                        </button>
                        <button
                            onClick={() => { setActiveTab('materials'); setSelectedQuiz(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'materials' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <BookOpen size={18} /> Kelola Modul Materi
                        </button>
                        <button
                            onClick={() => { setActiveTab('quizzes'); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'quizzes' ? 'bg-[#f0edff] text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <FileQuestion size={18} /> Modul Kuis & Soal
                        </button>
                    </div>
                </div>

                {/* User Profile & Logout */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f0edff] flex items-center justify-center text-primary font-bold">
                            {user.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <span className="text-sm font-bold text-slate-800 block truncate max-w-[100px]">{user.name}</span>
                            <span className="text-[10px] text-teal font-bold block uppercase tracking-wider">Guru {user.jenjang || 'SD'}</span>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="p-3 rounded-xl border border-rose-100 text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center cursor-pointer"
                        title="Keluar"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            {/* Dashboard Content Container */}
            <main className="flex-1 bg-[#fafbfc] p-6 sm:p-8 lg:p-10 pb-24 lg:pb-32 overflow-y-auto no-scrollbar text-left w-full relative">
                {/* Dashboard top header */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-extrabold text-navy tracking-tight">Dashboard Guru</h2>
                            <span className="px-3 py-1 bg-[#e6f4f1] text-[#0f5c50] text-xs font-bold rounded-full border border-[#a7f3d0]">
                                Jenjang Ajar: Guru {user.jenjang || 'SD'}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase block mt-1">
                            {new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 relative">
                        <button 
                            onClick={() => setIsChatOpen(true)}
                            className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                            title="Pusat Pesan"
                        >
                            <Mail size={18} />
                        </button>
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className="w-10 h-10 rounded-full bg-white border border-slate-200/80 text-slate-600 hover:text-primary flex items-center justify-center transition-colors cursor-pointer shadow-sm relative"
                                title="Notifikasi"
                            >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                            </button>

                            <NotificationDropdown 
                                isOpen={isNotifOpen} 
                                onClose={() => setIsNotifOpen(false)}
                                onOpenChat={() => setIsChatOpen(true)}
                            />
                        </div>
                    </div>
                </header>

                {/* TAB 1: Stats summary (Task #8: Balanced Equal-Height Layout & Active 'Lihat Statistik') */}
                {activeTab === 'stats' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        {/* Welcome Banner */}
                        <div className="bg-[#f0edff] rounded-[32px] p-8 lg:p-12 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                            <div className="text-left z-10">
                                <h3 className="text-3xl lg:text-4xl font-extrabold text-navy tracking-tight mb-3">
                                    Selamat Datang, {user.name}!
                                </h3>
                                <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-8">
                                    Siap mengelola aktivitas akademik hari ini? Tambah modul belajar mandiri, jadwalkan sesi tatap muka online, atau buat tantangan kuis baru bagi murid anda.
                                </p>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setActiveTab('materials')} className="px-6 py-3 bg-[#0f5c50] text-white font-bold rounded-full shadow-lg hover:bg-[#0a423a] transition-all cursor-pointer">
                                        Mulai Mengajar
                                    </button>
                                    <button 
                                        onClick={() => setActiveTab('stats-detail')}
                                        className="px-6 py-3 bg-white text-navy font-bold rounded-full border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                                    >
                                        Lihat Statistik
                                    </button>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-0 z-10 w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
                                <GraduationCap size={80} />
                            </div>
                        </div>

                        {/* Summary Widgets Grid - Equal Height & Standardized Alignment */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
                            <div className="bg-[#fff9e6] border border-[#ffecb3] rounded-[24px] p-7 flex flex-col justify-between h-48 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="w-11 h-11 rounded-2xl bg-[#ffecb3]/80 text-[#9c7100] flex items-center justify-center">
                                        <BookOpen size={22} />
                                    </div>
                                    <span className="px-2.5 py-1 bg-[#ffecb3] text-[#9c7100] text-[10px] font-extrabold rounded-full tracking-wider">MATERI</span>
                                </div>
                                <div>
                                    <span className="text-4xl lg:text-5xl font-extrabold text-[#9c7100] block mb-1">{materials.length}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Materi Terunggah</span>
                                </div>
                            </div>
                            
                            <div className="bg-[#e6f4f1] border border-[#a7f3d0] rounded-[24px] p-7 flex flex-col justify-between h-48 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="w-11 h-11 rounded-2xl bg-[#a7f3d0]/70 text-[#0f5c50] flex items-center justify-center">
                                        <CheckSquare size={22} />
                                    </div>
                                    <span className="px-2.5 py-1 bg-[#a7f3d0] text-[#0f5c50] text-[10px] font-extrabold rounded-full tracking-wider">SIMULASI</span>
                                </div>
                                <div>
                                    <span className="text-4xl lg:text-5xl font-extrabold text-[#0f5c50] block mb-1">{quizzes.length}</span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kuis Simulasi Aktif</span>
                                </div>
                            </div>

                            <div className="bg-[#fff0f3] border border-[#ffd6e0] rounded-[24px] p-7 flex flex-col justify-between h-48 shadow-sm">
                                <div className="flex justify-between items-center">
                                    <div className="w-11 h-11 rounded-2xl bg-[#ffd6e0]/80 text-rose-600 flex items-center justify-center">
                                        <FileQuestion size={22} />
                                    </div>
                                    <span className="px-2.5 py-1 bg-[#ffd6e0] text-rose-600 text-[10px] font-extrabold rounded-full tracking-wider">SOAL</span>
                                </div>
                                <div>
                                    <span className="text-4xl lg:text-5xl font-extrabold text-rose-700 block mb-1">
                                        {quizzes.reduce((acc, curr) => acc + (curr.questions_count || 0), 0)}
                                    </span>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Butir Pertanyaan</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50/50 rounded-[32px] p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-lg text-navy">Modul Ajar Terkini</h3>
                                    <button onClick={() => setActiveTab('materials')} className="text-xs font-bold text-teal hover:underline cursor-pointer">Lihat Semua</button>
                                </div>
                                {materials.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                        <FolderX size={48} className="text-slate-400 mb-4" />
                                        <p className="text-sm font-medium text-slate-500">Belum ada materi diunggah.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {materials.slice(0, 3).map(mat => (
                                            <div key={mat.id} className="flex justify-between items-center py-3 border-b border-slate-200">
                                                <span className="text-sm font-bold text-navy block truncate max-w-[200px]">{mat.judul}</span>
                                                <span className="text-[10px] text-slate-400 font-medium">{new Date(mat.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50/50 rounded-[32px] p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="font-bold text-lg text-navy">Daftar Kuis Baru</h3>
                                    <button onClick={() => setActiveTab('quizzes')} className="text-xs font-bold text-teal hover:underline cursor-pointer">Kelola Kuis</button>
                                </div>
                                {quizzes.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                                        <ClipboardX size={48} className="text-slate-400 mb-4" />
                                        <p className="text-sm font-medium text-slate-500">Belum ada kuis aktif.</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        {quizzes.slice(0, 3).map(quiz => (
                                            <div key={quiz.id} className="flex justify-between items-center py-3 border-b border-slate-200">
                                                <div>
                                                    <span className="text-sm font-bold text-navy block">{quiz.judul}</span>
                                                    <span className="text-[10px] text-slate-500 font-medium mt-1 block">{quiz.tipe || 'UTBK'} • {quiz.durasi_menit} Menit</span>
                                                </div>
                                                <button
                                                    onClick={() => { setActiveTab('quizzes'); fetchQuizDetails(quiz.id); }}
                                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 cursor-pointer shadow-sm"
                                                >
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Help Banner */}
                        <div className="bg-[#1b7668] rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between mt-4 relative overflow-hidden">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                    <Headset size={28} />
                                </div>
                                <div className="text-left text-white">
                                    <h3 className="text-xl font-bold mb-1">Butuh bantuan teknis?</h3>
                                    <p className="text-sm text-white/80">Tim support stugether siap membantu kendala anda 24/7.</p>
                                </div>
                            </div>
                            <button className="mt-6 md:mt-0 px-6 py-3 bg-orange text-navy font-bold rounded-full shadow-lg hover:bg-[#e69500] transition-all relative z-10 cursor-pointer">
                                Hubungi Admin
                            </button>
                            <div className="absolute top-1/2 right-10 w-48 h-48 bg-white/5 rounded-full blur-[40px] -translate-y-1/2 pointer-events-none"></div>
                        </div>
                    </div>
                )}

                {/* TAB: DAFTAR MURID (Berdasarkan Jenjang Guru) */}
                {activeTab === 'students' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-extrabold text-navy tracking-tight">Daftar Murid Bimbingan</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Menampilkan daftar murid khusus jenjang <span className="font-bold text-[#0f5c50]">{user.jenjang || 'SD'}</span> yang terdaftar dalam program belajar Anda.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
                                <Users className="text-teal" size={20} />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Murid {user.jenjang || 'SD'}</span>
                                    <span className="text-xl font-extrabold text-navy">{students.length} Siswa</span>
                                </div>
                            </div>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                            <div className="relative max-w-md w-full">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Cari murid berdasarkan nama atau email..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-[#f5f7fa] rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-teal border border-transparent transition-all"
                                />
                            </div>

                            {/* Students Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-slate-600">
                                    <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100 tracking-wider">
                                        <tr>
                                            <th className="px-4 py-3">Nama Siswa</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3 text-center">Jenjang</th>
                                            <th className="px-4 py-3 text-center">Kuis Dikerjakan</th>
                                            <th className="px-4 py-3 text-right">Terdaftar Sejak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.filter(s => 
                                            s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                            s.email.toLowerCase().includes(studentSearch.toLowerCase())
                                        ).length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-12 text-center text-slate-400">
                                                    Belum ada murid terdaftar pada jenjang {user.jenjang || 'SD'}.
                                                </td>
                                            </tr>
                                        ) : (
                                            students.filter(s => 
                                                s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
                                                s.email.toLowerCase().includes(studentSearch.toLowerCase())
                                            ).map((student, idx) => (
                                                <tr key={student.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-4 py-4 flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-[#e6f7f4] text-teal font-bold flex items-center justify-center text-xs shadow-sm">
                                                            {student.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-navy text-sm block">{student.name}</span>
                                                            <span className="text-[10px] text-slate-400">Siswa Aktif</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 font-medium text-slate-600">{student.email}</td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                                                            student.jenjang === 'SMP'
                                                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                                : 'bg-[#e6f4f1] text-[#0f5c50] border border-[#a7f3d0]'
                                                        }`}>
                                                            {student.jenjang || 'SD'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-center">
                                                        <span className="font-bold text-navy bg-slate-100 px-2.5 py-1 rounded-lg">
                                                            {student.submissions_count || 0} Kuis
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right text-slate-400 font-medium">
                                                        {new Date(student.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: Materials management */}
                {activeTab === 'materials' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-extrabold text-navy tracking-tight">Modul Belajar & Bahan Ajar</h2>
                            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">Unggah modul materi untuk siswa mengeksplorasi modul ajar. Pastikan materi informatif dan sesuai kurikulum.</p>
                        </div>

                        {/* Upload Form Box */}
                        <div className="bg-[#fafbfc] border border-slate-200/80 rounded-[32px] overflow-hidden shadow-sm">
                            <div className="bg-white/50 px-8 py-5 border-b border-slate-200/80 flex items-center gap-3">
                                <Upload size={20} className="text-[#1b7668]" />
                                <h3 className="font-bold text-[#1b7668]">Unggah Modul Baru</h3>
                            </div>
                            <form onSubmit={handleCreateMaterial} className="p-8 flex flex-col gap-6 bg-white">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Judul Materi</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Contoh: Modul UTBK Kemampuan Penalaran Kognitif"
                                        value={newMaterial.judul}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, judul: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm text-navy focus:outline-none focus:border-teal transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Deskripsi / Instruksi</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Tulis ringkasan modul atau instruksi khusus untuk murid..."
                                        value={newMaterial.deskripsi}
                                        onChange={(e) => setNewMaterial({ ...newMaterial, deskripsi: e.target.value })}
                                        className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl text-sm text-navy focus:outline-none focus:border-teal resize-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Lampiran File Pendukung (PDF/Doc maks 20MB)</label>
                                    <div className="relative border border-dashed border-slate-300 rounded-2xl bg-[#fafbfc] hover:bg-slate-50 transition-colors">
                                        <input
                                            type="file"
                                            onChange={(e) => setMaterialFile(e.target.files[0])}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="px-5 py-4 flex items-center gap-4">
                                            <div className="px-4 py-2 bg-[#e8ecef] text-navy font-semibold text-xs rounded-xl">Choose File</div>
                                            <span className="text-sm text-slate-500">
                                                {materialFile ? materialFile.name : 'No file chosen'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 px-8 py-4 bg-[#1b7668] text-white font-bold rounded-full shadow-lg hover:bg-[#135a4f] transition-colors self-start flex items-center gap-3 cursor-pointer"
                                >
                                    {loading ? <Loader className="animate-spin" size={18} /> : <Upload size={18} className="rotate-90" />}
                                    Simpan & Publikasikan Modul
                                </button>
                            </form>
                        </div>

                        {/* List */}
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-slate-600">Daftar Modul Guru Terbit</h3>
                                <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                    <span className="opacity-70">Sort by:</span> Newest
                                </div>
                            </div>
                            
                            {materials.length === 0 ? (
                                <div className="bg-white border border-slate-200/80 rounded-[32px] p-16 flex flex-col items-center justify-center shadow-sm">
                                    <FolderX size={64} className="text-slate-200 mb-6" />
                                    <p className="text-slate-400 font-medium text-center max-w-sm">Belum ada modul diunggah. Mulai tambahkan modul materi untuk siswa Anda.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {materials.map((mat) => (
                                        <div key={mat.id} className="p-6 bg-white border border-slate-200 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="text-left">
                                                <h4 className="font-bold text-lg text-navy">{mat.judul}</h4>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2 max-w-3xl">{mat.deskripsi || 'Tidak ada deskripsi.'}</p>
                                                {mat.attachments && mat.attachments.length > 0 && (
                                                    <span className="inline-flex items-center gap-2 text-[10px] font-bold text-teal mt-3 bg-teal/10 px-3 py-1 rounded-full">
                                                        ✓ Lampiran: {mat.attachments[0].storage_type} ({mat.attachments[0].mime_type})
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleDeleteMaterial(mat.id)}
                                                className="p-3 border border-rose-200 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer self-end sm:self-auto shrink-0"
                                                title="Hapus Modul"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 3: Quiz Creator */}
                {activeTab === 'quizzes' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        <div>
                            <h2 className="text-3xl font-extrabold text-navy tracking-tight">Pembuat Kuis & Kelola Soal</h2>
                            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">Kelola kuis ujian mandiri dan buat soal kuis adaptif pilihan ganda maupun esai secara efisien untuk mendukung pembelajaran yang personal.</p>
                        </div>

                        {!selectedQuiz ? (
                            <>
                                {/* Create Quiz Form */}
                                <div className="bg-[#f2fbf9] border border-[#e0f2f1] rounded-[32px] p-8 shadow-sm">
                                    <h3 className="font-bold text-[#006b61] mb-6 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-[#e0f2f1]">
                                            <Plus size={16} />
                                        </div>
                                        Buat Kuis Baru
                                    </h3>
                                    <form onSubmit={handleCreateQuiz} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                                        <div className="md:col-span-6">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Judul Kuis</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Contoh: Kuis UTBK Literasi Inggris"
                                                    value={newQuiz.judul}
                                                    onChange={(e) => setNewQuiz({ ...newQuiz, judul: e.target.value })}
                                                    className="w-full px-5 py-4 bg-[#e8f1f5] border-none rounded-2xl text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                                                />
                                                <Edit3 size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Durasi (Menit)</label>
                                            <div className="relative">
                                                <input
                                                    required
                                                    type="number"
                                                    min={5}
                                                    value={newQuiz.durasi_menit}
                                                    onChange={(e) => setNewQuiz({ ...newQuiz, durasi_menit: parseInt(e.target.value) })}
                                                    className="w-full px-5 py-4 bg-[#e8f1f5] border-none rounded-2xl text-sm text-navy focus:outline-none focus:ring-2 focus:ring-teal/20 transition-all"
                                                />
                                                <Clock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-3">
                                            <button
                                                type="submit"
                                                className="w-full py-4 bg-[#006b61] text-white font-bold rounded-2xl shadow-md hover:bg-[#00524a] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                            >
                                                <Plus size={18} /> Buat Kuis
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Quizzes list to configure questions */}
                                <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="font-bold text-[#845400] flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl bg-[#fff9e6] flex items-center justify-center border border-[#ffecb3]">
                                                <FileText size={16} />
                                            </div>
                                            Daftar Ujian Simulasi
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                            <span className="opacity-70">Filter:</span>
                                            <select className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none">
                                                <option>Terbaru</option>
                                            </select>
                                        </div>
                                    </div>

                                    {quizzes.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-16 opacity-50">
                                            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                                                <ImageIcon size={32} className="text-slate-300" />
                                            </div>
                                            <h4 className="text-xl font-bold text-slate-400 mb-2">Belum ada kuis.</h4>
                                            <p className="text-sm font-medium text-slate-400">Mulai dengan membuat kuis baru di atas untuk melihatnya di sini.</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {quizzes.map((quiz) => (
                                                <div key={quiz.id} className="p-5 bg-white border border-slate-100 rounded-2xl flex justify-between items-center gap-4 hover:border-slate-200 transition-colors shadow-sm">
                                                    <div className="text-left">
                                                        <h4 className="font-bold text-base text-navy">{quiz.judul}</h4>
                                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                                                            <span className="flex items-center gap-1"><CheckSquare size={14} /> {quiz.questions_count || 0} Soal</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                            <span className="flex items-center gap-1"><Clock size={14} /> {quiz.durasi_menit} Menit</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => fetchQuizDetails(quiz.id)}
                                                        className="px-6 py-2.5 bg-slate-50 hover:bg-teal hover:text-white text-navy font-bold rounded-xl transition-all cursor-pointer border border-slate-200 hover:border-teal"
                                                    >
                                                        Kelola Soal
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Bottom Stats Row - Clean non-overlapping flex layout */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                    <div className="bg-[#f0f4ff] border border-[#d6e4ff] rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Average Score</span>
                                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-teal shadow-sm">
                                                <ArrowUpRight size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-3xl font-extrabold text-navy block">82%</span>
                                            <span className="text-xs text-teal font-bold mt-1 inline-block">+4% dari bulan lalu</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#fff4f0] border border-[#ffe0d3] rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Students</span>
                                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#d4a017] shadow-sm">
                                                <Users size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-3xl font-extrabold text-navy block">{students.length}</span>
                                            <span className="text-xs text-[#d4a017] font-bold mt-1 inline-block">Jenjang {user.jenjang || 'SD'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-[#f3f0ff] border border-[#e0d6ff] rounded-3xl p-6 flex flex-col justify-between min-h-[140px] shadow-sm sm:col-span-2 lg:col-span-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Adaptive Questions</span>
                                            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                                                <Sparkles size={16} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-3xl font-extrabold text-navy block">
                                                {quizzes.reduce((acc, curr) => acc + (curr.questions_count || 0), 0)}
                                            </span>
                                            <span className="text-xs text-indigo-500 font-bold mt-1 inline-block">Siap didistribusikan</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Configure Questions for Selected Quiz */
                            <div className="flex flex-col gap-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div>
                                        <button 
                                            onClick={() => setSelectedQuiz(null)}
                                            className="text-xs text-cyan-500 hover:text-cyan-600 font-bold mb-1 block cursor-pointer"
                                        >
                                            ← Kembali ke daftar kuis
                                        </button>
                                        <h3 className="text-base font-black text-slate-800">{selectedQuiz.judul}</h3>
                                    </div>
                                    <button
                                        onClick={handleExportCSV}
                                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold rounded-2xl flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <FileSpreadsheet size={14} /> Ekspor Hasil Nilai (CSV)
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                    {/* Add Question Form (Left) */}
                                    <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm flex flex-col gap-5">
                                        <h4 className="font-black text-xs sm:text-sm text-slate-700">Tambah Pertanyaan</h4>
                                        <form onSubmit={handleAddQuestion} className="flex flex-col gap-4">
                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 block mb-1">Tipe Soal</label>
                                                <div className="grid grid-cols-2 gap-2 bg-[#fafbfd] p-1.5 rounded-2xl border border-slate-200/80">
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewQuestion({ ...newQuestion, tipe: 'pilihan_ganda' })}
                                                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                                            newQuestion.tipe === 'pilihan_ganda' 
                                                                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                                                                : 'text-slate-450 hover:text-slate-600'
                                                        }`}
                                                    >
                                                        Pilihan Ganda
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setNewQuestion({ ...newQuestion, tipe: 'esai' })}
                                                        className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                                            newQuestion.tipe === 'esai' 
                                                                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-white' 
                                                                : 'text-slate-450 hover:text-slate-600'
                                                        }`}
                                                    >
                                                        Esai
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-bold text-slate-400 block mb-1">Butir Pertanyaan</label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Tulis teks soal/pertanyaan..."
                                                    value={newQuestion.pertanyaan}
                                                    onChange={(e) => setNewQuestion({ ...newQuestion, pertanyaan: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#fafbfd] border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-550 resize-none font-sans"
                                                />
                                            </div>

                                            {newQuestion.tipe === 'pilihan_ganda' && (
                                                <div className="flex flex-col gap-3">
                                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Isian Opsi & Tandai yang Benar</label>
                                                    {newQuestion.options.map((opt, idx) => (
                                                        <div key={idx} className="flex gap-2 items-center">
                                                            <input
                                                                type="radio"
                                                                name="correct_answer"
                                                                checked={opt.is_benar}
                                                                onChange={() => {
                                                                    const updatedOptions = newQuestion.options.map((o, oIdx) => ({
                                                                        ...o,
                                                                        is_benar: oIdx === idx
                                                                    }));
                                                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                                                }}
                                                                className="cursor-pointer text-cyan-600 focus:ring-0"
                                                            />
                                                            <input
                                                                required
                                                                type="text"
                                                                placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                                                                value={opt.teks_opsi}
                                                                onChange={(e) => {
                                                                    const updatedOptions = [...newQuestion.options];
                                                                    updatedOptions[idx].teks_opsi = e.target.value;
                                                                    setNewQuestion({ ...newQuestion, options: updatedOptions });
                                                                }}
                                                                className="flex-1 px-3 py-2 bg-[#fafbfd] border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-550"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="bg-[#fafbfd] border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
                                                <label className="text-[9px] font-bold text-slate-400 block mb-1">Lampiran Media (Resilien)</label>
                                                <input
                                                    type="file"
                                                    accept="image/*,audio/mp3"
                                                    onChange={(e) => setQuestionMedia(e.target.files[0])}
                                                    className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border file:border-slate-200 file:text-[10px] file:font-semibold file:bg-white file:text-slate-700 file:cursor-pointer"
                                                />
                                                {questionMedia && (
                                                    <div className="flex flex-col gap-2 mt-1">
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                id="simulate-timeout"
                                                                checked={simulateFirebaseTimeout}
                                                                onChange={(e) => setSimulateFirebaseTimeout(e.target.checked)}
                                                                className="rounded border-slate-200 bg-white text-cyan-600 focus:ring-0 cursor-pointer"
                                                            />
                                                            <label htmlFor="simulate-timeout" className="text-[10px] text-slate-500 font-bold cursor-pointer">
                                                                Simulasikan Firebase Timeout (1.5 detik)
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}

                                                {uploadingMedia && (
                                                    <div className="p-3 bg-slate-50 text-xs text-slate-500 rounded-xl flex items-center gap-2 border border-slate-200">
                                                        <Loader className="animate-spin text-cyan-500" size={14} />
                                                        <span>Menghubungkan ke Storage Cloud...</span>
                                                    </div>
                                                )}

                                                {uploadResult && (
                                                    <div className={`p-3 text-xs rounded-xl border flex flex-col gap-1 ${
                                                        uploadResult.isFallback 
                                                            ? 'bg-rose-50 border-rose-200 text-rose-700' 
                                                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                                    }`}>
                                                        <span className="font-extrabold">
                                                            {uploadResult.isFallback ? '⚠️ Fallback Base64' : '✓ Upload Sukses'}
                                                        </span>
                                                        <span className="text-[9px] opacity-80 leading-normal">
                                                            {uploadResult.isFallback 
                                                                ? 'Jaringan timeout! File otomatis dikompresi dan disimpan dalam format Base64 di database.'
                                                                : 'Tersimpan aman di link Firebase Storage.'
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-bold rounded-2xl text-xs shadow-md shadow-cyan-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                {loading ? <Loader className="animate-spin" size={14} /> : <Plus size={14} />}
                                                Simpan Pertanyaan
                                            </button>
                                        </form>
                                    </div>

                                    {/* Questions List & Submissions Evaluator (Right) */}
                                    <div className="lg:col-span-6 flex flex-col gap-4">
                                        <h4 className="font-black text-xs sm:text-sm text-slate-700">Daftar Soal Aktif ({selectedQuiz.questions?.length || 0})</h4>
                                        {(!selectedQuiz.questions || selectedQuiz.questions.length === 0) ? (
                                            <p className="text-xs text-slate-400 py-12 text-center bg-white border border-slate-200/80 rounded-3xl">Kuis belum memiliki soal.</p>
                                        ) : (
                                            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                                                {selectedQuiz.questions.map((q, idx) => (
                                                    <div key={q.id} className="p-4 bg-white border border-slate-200/80 rounded-2xl flex flex-col gap-3 text-left shadow-sm">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <span className="text-[10px] font-bold text-cyan-600 font-mono bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-150">Soal {idx + 1}</span>
                                                            <button
                                                                onClick={() => handleDeleteQuestion(q.id)}
                                                                className="p-1.5 border border-slate-200 hover:bg-slate-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        </div>

                                                        <p className="text-slate-700 text-xs font-bold leading-relaxed">{q.pertanyaan}</p>

                                                        {q.attachments && q.attachments.map(att => (
                                                            <div key={att.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-1 flex items-center gap-3">
                                                                {att.tipe_media === 'gambar' ? (
                                                                    <>
                                                                        <ImageIcon size={14} className="text-cyan-500" />
                                                                        <span className="text-[9px] text-slate-500 font-bold">Gambar: {att.storage_type}</span>
                                                                        <a href={att.url} target="_blank" rel="noreferrer" className="text-[9px] text-cyan-600 font-bold underline ml-auto">Buka</a>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Music size={14} className="text-amber-500" />
                                                                        <span className="text-[9px] text-slate-500 font-bold">Audio Track: {att.storage_type}</span>
                                                                        <a href={att.url} target="_blank" rel="noreferrer" className="text-[9px] text-cyan-600 font-bold underline ml-auto">Buka</a>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Submission Evaluator List (realtime) */}
                                        <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-sm mt-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h4 className="font-black text-xs sm:text-sm text-slate-700">Hasil Koreksi Murid</h4>
                                            </div>

                                            {submissions.length === 0 ? (
                                                <p className="text-xs text-slate-400 py-6 text-center">Belum ada murid mengumpulkan kuis ini.</p>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    {submissions.map((sub) => (
                                                        <div key={sub.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-3">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-700">{sub.siswa?.name || 'Siswa'}</span>
                                                                    <span className="text-[9px] text-slate-400 block">Tanggal: {new Date(sub.submitted_at || sub.created_at).toLocaleString('id-ID')}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-black text-cyan-600 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-100">PG: {sub.skor_pg ?? 0}</span>
                                                                </div>
                                                            </div>

                                                            {sub.answers && sub.answers.some(a => a.jawaban_teks) && (
                                                                <div className="border-t border-slate-200 pt-3 flex flex-col gap-3">
                                                                    {sub.answers.filter(a => a.jawaban_teks).map(ans => {
                                                                        const relatedQ = selectedQuiz.questions?.find(q => q.id === ans.question_id);
                                                                        return (
                                                                            <div key={ans.id} className="p-3 bg-white border border-slate-200 rounded-xl text-left flex flex-col gap-2 shadow-sm">
                                                                                <span className="text-[9px] font-bold text-slate-400">Soal Esai: {relatedQ?.pertanyaan}</span>
                                                                                <p className="text-xs text-slate-600 italic font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-150">"{ans.jawaban_teks}"</p>
                                                                                
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 items-end">
                                                                                    <div>
                                                                                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Skor Esai (0-100)</label>
                                                                                        <input
                                                                                            type="number"
                                                                                            min={0}
                                                                                            max={100}
                                                                                            placeholder={ans.nilai_esai ?? 'Beri Nilai...'}
                                                                                            value={grades[ans.id]?.nilai_esai ?? ans.nilai_esai ?? ''}
                                                                                            onChange={(e) => setGrades({
                                                                                                ...grades,
                                                                                                [ans.id]: {
                                                                                                    ...grades[ans.id],
                                                                                                    nilai_esai: e.target.value,
                                                                                                    feedback: grades[ans.id]?.feedback || ans.feedback || ''
                                                                                                }
                                                                                            })}
                                                                                            className="w-full px-3 py-1.5 bg-[#fafbfd] border border-slate-200 rounded-xl text-xs text-slate-700"
                                                                                        />
                                                                                    </div>
                                                                                    <div>
                                                                                        <label className="text-[9px] text-slate-400 font-bold block mb-1">Feedback/Catatan</label>
                                                                                        <input
                                                                                            type="text"
                                                                                            placeholder={ans.feedback ?? 'Beri catatan...'}
                                                                                            value={grades[ans.id]?.feedback ?? ans.feedback ?? ''}
                                                                                            onChange={(e) => setGrades({
                                                                                                ...grades,
                                                                                                [ans.id]: {
                                                                                                    ...grades[ans.id],
                                                                                                    nilai_esai: grades[ans.id]?.nilai_esai || ans.nilai_esai || '',
                                                                                                    feedback: e.target.value
                                                                                                }
                                                                                            })}
                                                                                            className="w-full px-3 py-1.5 bg-[#fafbfd] border border-slate-200 rounded-xl text-xs text-slate-700"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                    
                                                                    <button
                                                                        onClick={() => handleGradeSubmission(sub.id)}
                                                                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start shadow-sm"
                                                                    >
                                                                        <Save size={12} /> Simpan Penilaian Esai
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB: STATISTIK PENGAJARAN (Detailed) */}
                {activeTab === 'stats-detail' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <button
                                    onClick={() => setActiveTab('stats')}
                                    className="text-xs font-bold text-teal hover:underline flex items-center gap-1 mb-2 cursor-pointer"
                                >
                                    <ArrowLeft size={14} /> Kembali ke Ringkasan
                                </button>
                                <h2 className="text-3xl font-extrabold text-navy tracking-tight">Statistik & Analisis Pengajaran</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Pantau performa belajar, partisipasi kuis, dan keterlibatan murid jenjang <span className="font-bold text-[#0f5c50]">{user.jenjang || 'SD'}</span>.
                                </p>
                            </div>
                            <div className="px-4 py-2 bg-[#f0edff] rounded-2xl border border-primary/20 text-primary text-xs font-bold">
                                Update Real-time
                            </div>
                        </div>

                        {/* Top Insight Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Murid Bimbingan</span>
                                <div className="my-3">
                                    <span className="text-3xl font-extrabold text-navy">{students.length}</span>
                                    <span className="text-xs text-slate-500 block mt-0.5">Siswa ({user.jenjang || 'SD'})</span>
                                </div>
                                <span className="text-[11px] font-bold text-emerald-600">✓ 100% Terverifikasi Aktif</span>
                            </div>

                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kuis Simulasi Siap</span>
                                <div className="my-3">
                                    <span className="text-3xl font-extrabold text-teal">{quizzes.length}</span>
                                    <span className="text-xs text-slate-500 block mt-0.5">Paket Soal Terbit</span>
                                </div>
                                <span className="text-[11px] font-bold text-slate-500">
                                    {quizzes.reduce((acc, curr) => acc + (curr.questions_count || 0), 0)} butir soal total
                                </span>
                            </div>

                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modul Ajar Terunggah</span>
                                <div className="my-3">
                                    <span className="text-3xl font-extrabold text-amber-600">{materials.length}</span>
                                    <span className="text-xs text-slate-500 block mt-0.5">Dokumen & Materi</span>
                                </div>
                                <span className="text-[11px] font-bold text-amber-600">Materi siap unduh</span>
                            </div>

                            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sesi Tatap Muka Online</span>
                                <div className="my-3">
                                    <span className="text-3xl font-extrabold text-primary">{sessionsList.length}</span>
                                    <span className="text-xs text-slate-500 block mt-0.5">Jadwal Sesi</span>
                                </div>
                                <span className="text-[11px] font-bold text-primary">
                                    {sessionsList.filter(s => s.status === 'scheduled' || s.status === 'ongoing').length} sesi aktif
                                </span>
                            </div>
                        </div>

                        {/* Quizzes Performance Breakdown */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
                            <h3 className="font-extrabold text-lg text-navy mb-6">Ringkasan Paket Kuis & Kelengkapan Soal</h3>
                            {quizzes.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-8">Belum ada paket kuis yang dibuat.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {quizzes.map(quiz => {
                                        const count = quiz.questions_count || 0;
                                        const percent = Math.min(100, Math.round((count / 10) * 100));
                                        return (
                                            <div key={quiz.id} className="p-5 bg-slate-50/70 border border-slate-150 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <h4 className="font-bold text-navy text-sm">{quiz.judul}</h4>
                                                        <span className="px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-bold rounded-full">
                                                            {quiz.tipe || 'UTBK'}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-medium">Durasi: {quiz.durasi_menit} Menit</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                                                        <div className="bg-teal h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 self-end sm:self-center">
                                                    <span className="text-xs font-extrabold text-navy">{count} Soal Aktif</span>
                                                    <button
                                                        onClick={() => { setActiveTab('quizzes'); fetchQuizDetails(quiz.id); }}
                                                        className="px-4 py-2 bg-white border border-slate-200 hover:border-teal text-teal text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                                                    >
                                                        Buka Detail
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB: JADWAL SESI BELAJAR (Task #9: Sesi Belajar Terintegrasi Guru & Murid) */}
                {activeTab === 'sessions' && (
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-3xl font-extrabold text-navy tracking-tight">Jadwal Sesi Belajar Online</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    Atur jadwal tatap muka virtual (Zoom/Google Meet) untuk murid jenjang <span className="font-bold text-[#0f5c50]">{user.jenjang || 'SD'}</span>.
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSessionFormData({
                                        judul: '',
                                        jenjang: user.jenjang || 'SD',
                                        waktu_mulai: '',
                                        waktu_selesai: '',
                                        link_meeting: '',
                                        deskripsi: ''
                                    });
                                    setIsSessionModalOpen(true);
                                }}
                                className="px-6 py-3.5 bg-[#0f5c50] text-white font-bold rounded-full shadow-lg hover:bg-[#0a423a] transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <Plus size={18} /> Jadwalkan Sesi Baru
                            </button>
                        </div>

                        {/* Sessions List */}
                        {sessionsList.length === 0 ? (
                            <div className="bg-white border border-slate-200/80 rounded-[32px] p-16 flex flex-col items-center justify-center text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-[#f0edff] text-primary flex items-center justify-center mb-4">
                                    <Calendar size={32} />
                                </div>
                                <h4 className="font-extrabold text-navy text-lg mb-1">Belum Ada Sesi Belajar</h4>
                                <p className="text-sm text-slate-400 max-w-md mb-6">
                                    Klik tombol "Jadwalkan Sesi Baru" untuk membuat sesi kelas tatap muka online pertama bagi siswa Anda.
                                </p>
                                <button
                                    onClick={() => setIsSessionModalOpen(true)}
                                    className="px-6 py-3 bg-[#0f5c50] text-white text-xs font-bold rounded-full hover:bg-[#0a423a] transition-colors cursor-pointer"
                                >
                                    Buat Jadwal Sesi
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {sessionsList.map(session => (
                                    <div key={session.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                                        <div>
                                            <div className="flex justify-between items-start gap-2 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                                    session.status === 'ongoing' 
                                                        ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse' 
                                                        : session.status === 'completed'
                                                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {session.status === 'ongoing' ? '🔴 Sedang Berlangsung' : session.status === 'completed' ? '✓ Selesai' : '📅 Terjadwal'}
                                                </span>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    session.jenjang === 'SMP'
                                                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                        : 'bg-[#e6f4f1] text-[#0f5c50] border border-[#a7f3d0]'
                                                }`}>
                                                    Jenjang {session.jenjang || 'SD'}
                                                </span>
                                            </div>

                                            <h4 className="font-extrabold text-navy text-lg mb-2">{session.judul}</h4>
                                            <p className="text-xs text-slate-500 mb-4 line-clamp-2">{session.deskripsi || 'Sesi pembelajaran online interaktif bersama mentor.'}</p>

                                            <div className="flex flex-col gap-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 font-medium mb-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-teal" />
                                                    <span>
                                                        {new Date(session.waktu_mulai).toLocaleString('id-ID', {
                                                            weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                        })}
                                                        {session.waktu_selesai && ` - ${new Date(session.waktu_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                                            {session.status === 'completed' ? (
                                                <div className="w-full py-2.5 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl flex items-center justify-center gap-2 select-none">
                                                    <Lock size={15} /> Link Meeting Ditutup (Sesi Telah Selesai)
                                                </div>
                                            ) : session.link_meeting ? (
                                                <a
                                                    href={session.link_meeting}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-full py-3 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                                                >
                                                    <Video size={16} /> Buka Link Meeting
                                                </a>
                                            ) : (
                                                <div className="w-full py-2.5 bg-slate-50 text-slate-400 text-xs font-medium rounded-xl flex items-center justify-center gap-2 select-none border border-slate-100">
                                                    Link meeting belum ditambahkan
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5">
                                                    {session.status !== 'ongoing' && session.status !== 'completed' && (
                                                        <button
                                                            onClick={() => handleUpdateSessionStatus(session.id, 'ongoing')}
                                                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            Mulai Sekarang
                                                        </button>
                                                    )}
                                                    {session.status === 'ongoing' && (
                                                        <button
                                                            onClick={() => handleUpdateSessionStatus(session.id, 'completed')}
                                                            className="px-3 py-1.5 bg-[#0f5c50] hover:bg-[#0c4a40] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
                                                        >
                                                            Tandai Selesai
                                                        </button>
                                                    )}
                                                    {session.status === 'completed' && (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-[11px] font-bold select-none">
                                                            <CheckCircle2 size={13} className="text-emerald-600" /> Sesi Selesai (Terkunci)
                                                        </span>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleDeleteSession(session.id)}
                                                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                    title="Hapus Sesi"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* MODAL: JADWALKAN SESI BELAJAR BARU */}
            <Modal
                isOpen={isSessionModalOpen}
                onClose={() => setIsSessionModalOpen(false)}
                title="Jadwalkan Sesi Belajar Online"
                size="md"
            >
                <form onSubmit={handleCreateSession} className="flex flex-col gap-4 text-left">
                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Judul / Topik Sesi</label>
                        <input
                            required
                            type="text"
                            placeholder="Contoh: Sesi Pendalaman Matematika Pecahan & Aljabar"
                            value={sessionFormData.judul}
                            onChange={(e) => setSessionFormData({ ...sessionFormData, judul: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Jenjang Target</label>
                            <select
                                value={sessionFormData.jenjang}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, jenjang: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal"
                            >
                                <option value="SD">SD (Sekolah Dasar)</option>
                                <option value="SMP">SMP (Sekolah Menengah)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Link Meeting (Zoom / Meet)</label>
                            <input
                                required
                                type="url"
                                placeholder="https://meet.google.com/xyz..."
                                value={sessionFormData.link_meeting}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, link_meeting: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Waktu Mulai</label>
                            <input
                                required
                                type="datetime-local"
                                value={sessionFormData.waktu_mulai}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, waktu_mulai: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Waktu Selesai (Opsional)</label>
                            <input
                                type="datetime-local"
                                value={sessionFormData.waktu_selesai}
                                onChange={(e) => setSessionFormData({ ...sessionFormData, waktu_selesai: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi / Agenda Pembelajaran</label>
                        <textarea
                            rows={3}
                            placeholder="Tuliskan agenda atau persiapan materi yang perlu dibawa siswa..."
                            value={sessionFormData.deskripsi}
                            onChange={(e) => setSessionFormData({ ...sessionFormData, deskripsi: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy focus:outline-none focus:border-teal resize-none"
                        />
                    </div>

                    <div className="pt-3 flex justify-end gap-3 border-t border-slate-100 mt-2">
                        <button
                            type="button"
                            onClick={() => setIsSessionModalOpen(false)}
                            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={sessionLoading}
                            className="px-6 py-2.5 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {sessionLoading ? <Loader className="animate-spin" size={14} /> : <Calendar size={14} />}
                            Simpan & Publikasikan Sesi
                        </button>
                    </div>
                </form>
            </Modal>

            {/* CHAT MESSAGING DRAWER */}
            <ChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                currentUser={user || { id: 0, role: 'guru' }}
            />
        </div>
    );
}
