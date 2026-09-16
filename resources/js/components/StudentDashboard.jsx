import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { 
    BookOpen, CheckSquare, Award, Clock, ArrowLeft, ArrowRight, Play, CheckCircle2, AlertCircle,
    User, LogOut, ChevronRight, Download, Eye, Music, Image as ImageIcon, ZoomIn, Info, Loader, Sparkles,
    Mail, Bell, Shield, Book, LayoutDashboard, Flame, Star, PlayCircle, Trophy, Search, SlidersHorizontal, Bookmark, LogIn,
    GraduationCap, TrendingUp, FileQuestion
} from 'lucide-react';

export default function StudentDashboard({ user = {}, onNavigate, onLogout, showToast }) {
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'materials' | 'quizzes' | 'profile'
    const [quizSubTab, setQuizSubTab] = useState('aktif'); // 'aktif' | 'riwayat'
    
    // Core data lists
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [history, setHistory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Reading materials progress states
    const [completedMaterials, setCompletedMaterials] = useState(() => {
        try {
            const userId = user?.id || 'guest';
            const stored = localStorage.getItem(`sb_completed_materials_${userId}`);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    const handleToggleCompleteMaterial = (materialId) => {
        const userId = user?.id || 'guest';
        let updated;
        if (completedMaterials.includes(materialId)) {
            updated = completedMaterials.filter(id => id !== materialId);
            showToast('Modul ditandai belum selesai dibaca.', 'info');
        } else {
            updated = [...completedMaterials, materialId];
            showToast('Selamat! Anda telah menyelesaikan membaca modul ini.');
        }
        setCompletedMaterials(updated);
        localStorage.setItem(`sb_completed_materials_${userId}`, JSON.stringify(updated));
    };

    const readingProgress = materials.length > 0 
        ? Math.round((completedMaterials.length / materials.length) * 100) 
        : 0;
    
    // Preview states
    const [previewMaterial, setPreviewMaterial] = useState(null);
    const [zoomImage, setZoomImage] = useState(null);

    // Safe framed reader URL state
    const [iframeUrl, setIframeUrl] = useState('');
    const [loadingIframe, setLoadingIframe] = useState(false);

    useEffect(() => {
        if (!previewMaterial || !previewMaterial.attachments || previewMaterial.attachments.length === 0) {
            setIframeUrl('');
            setLoadingIframe(false);
            return;
        }
        
        const rawUrl = previewMaterial.attachments[0].url;
        if (!rawUrl) {
            setIframeUrl('');
            setLoadingIframe(false);
            return;
        }

        setLoadingIframe(true);
        let activeBlobUrl = '';

        if (rawUrl.startsWith('data:')) {
            try {
                const parts = rawUrl.split(',');
                const mime = parts[0].match(/:(.*?);/)[1];
                const bstr = atob(parts[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                const blob = new Blob([u8arr], { type: mime });
                activeBlobUrl = URL.createObjectURL(blob);
                setIframeUrl(activeBlobUrl);
            } catch (e) {
                console.error('Failed to parse base64 to blob:', e);
                setIframeUrl(rawUrl);
            } finally {
                setLoadingIframe(false);
            }
        } else {
            // Serve standard web paths directly via iframe (no CORS check required)
            setIframeUrl(rawUrl);
            setLoadingIframe(false);
        }

        return () => {
            if (activeBlobUrl) {
                URL.revokeObjectURL(activeBlobUrl);
            }
        };
    }, [previewMaterial]);

    // Quiz Player states
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
    const [submittingQuiz, setSubmittingQuiz] = useState(false);

    // Exam Celebration Screen state
    const [celebrationResult, setCelebrationResult] = useState(null);

    // Audio player state
    const [audioPlaying, setAudioPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        fetchMaterials();
        fetchQuizzes();
        fetchHistory();
    }, []);

    const fetchMaterials = async () => {
        try {
            const data = await api.get('/materials');
            setMaterials(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
        } catch (err) {
            showToast('Gagal memuat materi: ' + err.message, 'error');
        }
    };

    const fetchQuizzes = async () => {
        try {
            const data = await api.get('/quizzes');
            setQuizzes(Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
        } catch (err) {
            showToast('Gagal memuat kuis: ' + err.message, 'error');
        }
    };

    const fetchHistory = async () => {
        try {
            const data = await api.get('/history');
            setHistory(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
        } catch (err) {
            showToast('Gagal memuat riwayat: ' + err.message, 'error');
        }
    };

    const handleStartQuiz = async (quizId) => {
        try {
            const quizDetails = await api.get(`/quizzes/${quizId}`);
            if (!quizDetails.questions || quizDetails.questions.length === 0) {
                showToast('Kuis ini belum memiliki soal.', 'error');
                return;
            }
            setActiveQuiz(quizDetails);
            setActiveQuestionIdx(0);
            
            const initialAnswers = quizDetails.questions.map(q => ({
                question_id: q.id,
                selected_option_id: null,
                jawaban_teks: ''
            }));
            setQuizAnswers(initialAnswers);
            setCelebrationResult(null);
        } catch (err) {
            showToast('Gagal memuat soal kuis: ' + err.message, 'error');
        }
    };

    const handleSelectOption = (questionId, optionId) => {
        const updated = quizAnswers.map(ans => 
            ans.question_id === questionId 
                ? { ...ans, selected_option_id: optionId }
                : ans
        );
        setQuizAnswers(updated);
    };

    const handleEssayChange = (questionId, text) => {
        const updated = quizAnswers.map(ans => 
            ans.question_id === questionId 
                ? { ...ans, jawaban_teks: text }
                : ans
        );
        setQuizAnswers(updated);
    };

    const handleSubmitQuiz = async () => {
        if (!activeQuiz) return;
        setSubmittingQuiz(true);
        try {
            const response = await api.post(`/quizzes/${activeQuiz.id}/submit`, {
                answers: quizAnswers
            });
            showToast('Kuis berhasil dikumpulkan!');
            setCelebrationResult({
                score: response.skor_pg,
                answers: response.answers,
                quizTitle: activeQuiz.judul
            });
            setActiveQuiz(null);
            fetchHistory();
        } catch (err) {
            showToast('Gagal mengumpulkan kuis: ' + err.message, 'error');
        } finally {
            setSubmittingQuiz(false);
        }
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (audioPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setAudioPlaying(!audioPlaying);
        }
    };

    // Calculate progression stats
    const averageScore = Array.isArray(history) && history.length > 0 
        ? Math.round(history.reduce((acc, curr) => acc + (curr?.skor_pg ?? 0), 0) / history.length) 
        : 0;

    const calculateStreak = () => {
        if (!Array.isArray(history) || history.length === 0) return 0;
        const dates = new Set(history.filter(h => h && h.created_at).map(h => new Date(h.created_at).toDateString()));
        return dates.size || 1; 
    };
    const streakDays = calculateStreak();

    // Custom SVG Progression Chart
    const renderHistoryChart = () => {
        if (!Array.isArray(history) || history.length === 0) return null;
        
        const chartData = [...history]
            .reverse()
            .slice(-6)
            .map((sub, idx) => ({
                label: sub?.quiz?.judul?.substring(0, 8) || `Kuis ${idx+1}`,
                score: sub?.skor_pg ?? 0
            }));
            
        if (chartData.length < 2) {
            return (
                <div className="text-xs text-slate-400 py-6 text-center">
                    Butuh minimal 2 kuis selesai untuk menggambarkan grafik progress.
                </div>
            );
        }

        const width = 500;
        const height = 150;
        const padding = 30;

        const points = chartData.map((d, i) => {
            const x = padding + (i * (width - padding * 2)) / (chartData.length - 1);
            const y = height - padding - (d.score * (height - padding * 2)) / 100;
            return { x, y, score: d.score, label: d.label };
        });

        const pathD = points.reduce((acc, p, i) => 
            i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`, ''
        );

        const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

        return (
            <div className="w-full bg-white p-6 rounded-3xl border border-cyan-100/50 mt-4 shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-4">Grafik Kemajuan Nilai Simulasi</span>
                <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[350px]">
                    <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                        </linearGradient>
                    </defs>
                    
                    <line x1={padding} y1={padding} x2={width-padding} y2={padding} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
                    <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="#f1f5f9" strokeWidth={1} strokeDasharray="3 3" />
                    <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="#e2e8f0" strokeWidth={1} />
                    
                    <text x={padding - 8} y={padding + 3} fill="#94a3b8" fontSize={8} textAnchor="end">100</text>
                    <text x={padding - 8} y={height/2 + 3} fill="#94a3b8" fontSize={8} textAnchor="end">50</text>
                    <text x={padding - 8} y={height - padding + 3} fill="#94a3b8" fontSize={8} textAnchor="end">0</text>

                    <path d={areaD} fill="url(#chartGrad)" />
                    <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((p, idx) => (
                        <g key={idx}>
                            <circle cx={p.x} cy={p.y} r={5} fill="white" stroke="#06b6d4" strokeWidth={2.5} />
                            <circle cx={p.x} cy={p.y} r={1.5} fill="#06b6d4" />
                            <text x={p.x} y={p.y - 10} fill="#0891b2" fontSize={8} fontWeight="bold" textAnchor="middle">{p.score}</text>
                            <text x={p.x} y={height - padding + 14} fill="#64748b" fontSize={7} textAnchor="middle">{p.label}</text>
                        </g>
                    ))}
                </svg>
            </div>
        );
    };

    return (
        <div className="w-full h-screen overflow-hidden flex flex-col lg:flex-row bg-[#fafbfd]">
            
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 bg-white lg:border-r border-slate-100 p-6 flex flex-col justify-between text-left h-full overflow-y-auto no-scrollbar shrink-0 z-10">
                <div>
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => onNavigate('beranda')}>
                        <div className="w-10 h-10 rounded-[14px] bg-teal flex items-center justify-center">
                            <span className="font-extrabold text-white text-xl">S</span>
                        </div>
                        <div className="text-left">
                            <span className="font-extrabold text-navy text-lg block leading-none">stugether.</span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-1">SISWA ({user.jenjang || 'SD'})</span>
                        </div>
                    </div>

                    {/* Navigation list */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => { setActiveTab('overview'); setActiveQuiz(null); setCelebrationResult(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'overview' && !activeQuiz && !celebrationResult 
                                    ? 'bg-[#f0edff] text-primary' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <LayoutDashboard size={18} /> Ringkasan
                        </button>
                        <button
                            onClick={() => { setActiveTab('materials'); setActiveQuiz(null); setCelebrationResult(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'materials' 
                                    ? 'bg-[#f0edff] text-primary' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <BookOpen size={18} /> Materi Saya
                        </button>
                        <button
                            onClick={() => { setActiveTab('quizzes'); setActiveQuiz(null); setCelebrationResult(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                (activeTab === 'quizzes' || activeQuiz || celebrationResult)
                                    ? 'bg-[#f0edff] text-primary' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <FileQuestion size={18} /> Pusat Kuis
                        </button>
                        <button
                            onClick={() => { setActiveTab('profile'); setActiveQuiz(null); setCelebrationResult(null); }}
                            className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                                activeTab === 'profile' 
                                    ? 'bg-[#f0edff] text-primary' 
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                            }`}
                        >
                            <User size={18} /> Profil
                        </button>
                    </div>
                </div>

                <div className="mt-8">

                    <button
                        onClick={onLogout}
                        className="w-full py-3 px-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <LogIn size={18} className="rotate-180" /> Keluar Akun
                    </button>
                </div>
            </aside>

            {/* Dashboard Content Container */}
            <main className="flex-1 bg-[#fafbfd] p-6 sm:p-8 lg:p-10 pb-24 lg:pb-32 overflow-y-auto no-scrollbar text-left max-w-5xl mx-auto w-full">
                
                {/* Dashboard top header */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-extrabold text-navy tracking-tight">
                            {activeTab === 'overview' && 'Ringkasan'}
                            {activeTab === 'materials' && 'Eksplorasi Materi'}
                            {activeTab === 'quizzes' && 'Pusat Kuis & Ujian'}
                            {activeTab === 'profile' && 'Profil Belajar'}
                        </h2>
                        {activeTab === 'overview' ? (
                            <span className="text-sm font-semibold text-slate-500 mt-2 block">
                                {new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                            </span>
                        ) : activeTab === 'quizzes' ? (
                            <span className="text-sm font-semibold text-slate-500 mt-2 block">
                                Asah kemampuanmu dengan simulasi interaktif jenjang {user.jenjang || 'SD'}.
                            </span>
                        ) : activeTab === 'materials' ? (
                            <span className="text-sm font-semibold text-slate-500 mt-2 block">
                                Temukan materi pembelajaran jenjang {user.jenjang || 'SD'}.
                            </span>
                        ) : null}
                    </div>

                    {/* Header quick actions */}
                    <div className="flex items-center gap-6">
                        <button className="text-slate-600 hover:text-primary transition-colors cursor-pointer relative">
                            <Bell size={24} />
                            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#fafbfc]"></span>
                        </button>
                        <button className="text-slate-600 hover:text-primary transition-colors cursor-pointer">
                            <Mail size={24} />
                        </button>
                        
                        <div className="w-px h-10 bg-slate-200"></div>
                        
                        {/* User Profile Avatar */}
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <span className="text-sm font-bold text-navy block max-w-[120px] truncate group-hover:text-primary transition-colors">{user?.name || 'Siswa'}</span>
                                <span className="text-[10px] font-bold text-[#0f5c50] block leading-none">Siswa {user?.jenjang || 'SD'}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#f0edff] flex items-center justify-center text-primary font-bold overflow-hidden border border-slate-200">
                                {(user?.name || 'Siswa').substring(0,2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ACTIVE QUIZ exam player (clean light theme) */}
                {activeQuiz && (
                    <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-sm relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                            <div>
                                <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-600 rounded-full font-bold uppercase tracking-wider block mb-1 w-fit">
                                    Mode Ujian Aktif
                                </span>
                                <h3 className="font-black text-base text-slate-800">{activeQuiz.judul}</h3>
                            </div>
                            <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 border border-slate-200/60 rounded-xl">
                                <Clock size={12} className="text-cyan-500" /> {activeQuiz.durasi_menit} Menit
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-150 rounded-full h-1.5 mb-6 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-1.5 transition-all duration-300"
                                style={{ width: `${((activeQuestionIdx + 1) / activeQuiz.questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Current Question */}
                        {(() => {
                            const question = activeQuiz.questions[activeQuestionIdx];
                            const currentAns = quizAnswers.find(a => a.question_id === question.id);
                            
                            return (
                                <div className="flex flex-col gap-6 text-left">
                                    <div className="flex items-start gap-4">
                                        <span className="text-xs font-bold text-white bg-cyan-500 px-2.5 py-1 rounded-xl font-mono">
                                            {activeQuestionIdx + 1}
                                        </span>
                                        <p className="text-slate-700 font-bold text-sm leading-relaxed pt-0.5">
                                            {question.pertanyaan}
                                        </p>
                                    </div>

                                    {/* Question attachments (Audio / Image) */}
                                    {question.attachments && question.attachments.map(att => {
                                        if (att.tipe_media === 'gambar') {
                                            return (
                                                <div key={att.id} className="relative group max-w-sm rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 self-start">
                                                    <img src={att.url} alt="Attachment" className="w-full max-h-48 object-cover" />
                                                    <button 
                                                        onClick={() => setZoomImage(att.url)}
                                                        className="absolute bottom-3 right-3 p-2 bg-slate-900/80 rounded-xl text-white flex items-center gap-1.5 text-[9px] font-bold cursor-pointer"
                                                    >
                                                        <ZoomIn size={12} /> Perbesar Gambar
                                                    </button>
                                                </div>
                                            );
                                        }

                                        if (att.tipe_media === 'audio') {
                                            return (
                                                <div key={att.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 max-w-sm self-start">
                                                    <audio ref={audioRef} src={att.url} onEnded={() => setAudioPlaying(false)} className="hidden" />
                                                    <button
                                                        onClick={toggleAudio}
                                                        className="w-10 h-10 rounded-full bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                                                    >
                                                        {audioPlaying ? <span>⏸</span> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                                    </button>
                                                    <div className="text-left">
                                                        <span className="text-[9px] text-slate-400 font-bold block">Audio Listening Track</span>
                                                        <span className="text-xs text-slate-700 font-semibold block">Track_Listening_01.mp3</span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* MCQ Choices */}
                                    {question.tipe === 'pilihan_ganda' && question.options && (
                                        <div className="flex flex-col gap-3">
                                            {question.options.map(opt => {
                                                const isSelected = currentAns?.selected_option_id === opt.id;
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => handleSelectOption(question.id, opt.id)}
                                                        className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                                            isSelected 
                                                                ? 'bg-cyan-50 border-cyan-400 text-cyan-700 font-bold' 
                                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'
                                                        }`}
                                                    >
                                                        {opt.teks_opsi}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Essay field */}
                                    {question.tipe === 'esai' && (
                                        <div>
                                            <label className="text-[9px] uppercase font-bold text-slate-400 block mb-2 tracking-widest">Tulis Jawaban Analisis Anda</label>
                                            <textarea
                                                rows={5}
                                                placeholder="Tuliskan jawaban esai lengkap di sini..."
                                                value={currentAns?.jawaban_teks || ''}
                                                onChange={(e) => handleEssayChange(question.id, e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 focus:outline-none focus:border-cyan-500 resize-none font-mono"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Player Footer Navigation */}
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
                            <button
                                disabled={activeQuestionIdx === 0}
                                onClick={() => setActiveQuestionIdx(activeQuestionIdx - 1)}
                                className="px-4 py-2 border border-slate-200 disabled:opacity-30 rounded-xl text-xs text-slate-500 flex items-center gap-1.5 transition-all hover:bg-slate-50 cursor-pointer"
                            >
                                <ArrowLeft size={14} /> Sebelumnya
                            </button>

                            {activeQuestionIdx < activeQuiz.questions.length - 1 ? (
                                <button
                                    onClick={() => setActiveQuestionIdx(activeQuestionIdx + 1)}
                                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                                >
                                    Berikutnya <ArrowRight size={14} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={submittingQuiz}
                                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {submittingQuiz ? <Loader className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                                    Kumpulkan Kuis
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* CELEBRATION SCORE PANEL */}
                {celebrationResult && (
                    <div className="bg-white border border-slate-200/80 rounded-[32px] p-8 sm:p-12 text-center relative overflow-hidden shadow-md flex flex-col items-center max-w-xl mx-auto">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-cyan-500 to-teal-400" />
                        
                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-600">
                            <Sparkles size={32} />
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Simulasi Kuis Selesai!</h2>
                        <p className="text-xs text-slate-400 mb-6">Ulasan hasil pengerjaan kuis Anda telah dievaluasi oleh sistem.</p>

                        <div className="bg-[#fafbfd] border border-cyan-100/50 p-6 rounded-2xl w-full mb-6">
                            <span className="text-[10px] text-slate-450 uppercase tracking-widest font-bold block mb-1">Skor Akhir Pilihan Ganda</span>
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-400 font-mono block">
                                {celebrationResult.score ?? 0}
                            </span>
                        </div>

                        <div className="w-full text-left bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 leading-relaxed mb-6">
                            <h4 className="font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                <Info size={14} className="text-cyan-500" /> Analisis Pengerjaan
                            </h4>
                            {celebrationResult.score >= 80 ? (
                                <p>Kerja luar biasa! Anda sangat menguasai materi subjek ini. Pertahankan literasi pemahaman ini untuk kelulusan ujian nanti.</p>
                            ) : celebrationResult.score >= 50 ? (
                                <p>Kerja bagus! Hasil pengerjaan cukup memuaskan. Anda disarankan melakukan ulasan kunci pembahasan di log riwayat untuk bagian yang salah.</p>
                            ) : (
                                <p>Belajar kembali! Silakan baca materi modul ajar pendidik di dashboard eksplorasi sebelum mencoba simulasi kuis ini lagi.</p>
                            )}
                        </div>

                        <button
                            onClick={() => { setCelebrationResult(null); setActiveTab('history'); }}
                            className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-teal-400 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer w-full shadow-md"
                        >
                            Tinjau Riwayat & Pembahasan Soal
                        </button>
                    </div>
                )}

                {/* TAB 1: Ringkasan (Overview) */}
                {activeTab === 'overview' && !activeQuiz && !celebrationResult && (
                    <div className="flex flex-col gap-10 max-w-5xl mx-auto">
                        
                        {/* Welcome Banner */}
                        <div className="bg-[#1b7668] rounded-[32px] p-8 lg:p-12 flex flex-col sm:flex-row justify-between items-center relative overflow-hidden shadow-lg shadow-teal/10">
                            <div className="text-left z-10 text-white max-w-2xl">
                                <h3 className="text-xl lg:text-2xl font-bold mb-4 flex items-center gap-2">
                                    Halo, {user?.name || 'Siswa'}! 👋
                                </h3>
                                <p className="text-sm font-light text-white/90 leading-relaxed italic">
                                    "Pendidikan adalah senjata paling mematikan di dunia, karena dengan itu kamu bisa mengubah dunia. Mari mulai langkah kecilmu hari ini dengan niat yang tulus."
                                </p>
                            </div>
                            <div className="mt-6 sm:mt-0 z-10 opacity-20 relative mr-12">
                                <GraduationCap size={160} className="text-white" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 pointer-events-none" />
                        </div>

                        {/* Summary Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Progres Belajar */}
                            <div className="bg-[#f0fbf9] border border-[#d1f4ee] rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-full bg-[#1b7668] flex items-center justify-center text-white shrink-0">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Progres Belajar</span>
                                    <span className="text-3xl font-extrabold text-[#1b7668] block">{readingProgress}%</span>
                                </div>
                            </div>
                            
                            {/* Poin Ilmu */}
                            <div className="bg-[#fffbf0] border border-[#ffeec2] rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-full bg-[#f5a623] flex items-center justify-center text-white shrink-0">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Poin Ilmu</span>
                                    <span className="text-3xl font-extrabold text-[#b87c1a] block">
                                        {history.reduce((acc, curr) => acc + (curr.skor_pg ?? 0), 0) + 1250}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Suntikan Belajar */}
                            <div className="bg-[#f6f4ff] border border-[#e4dcfc] rounded-3xl p-6 flex items-center gap-5 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-full bg-[#6d28d9] flex items-center justify-center text-white shrink-0">
                                    <Flame size={24} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Suntikan Belajar</span>
                                    <span className="text-3xl font-extrabold text-[#6d28d9] block">{streakDays} Hari</span>
                                </div>
                            </div>
                        </div>

                        {/* Two Columns: Lanjutkan Belajar & Kuis Mendatang */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            
                            {/* Lanjutkan Belajar */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-slate-800 text-lg">Lanjutkan Belajar</h3>
                                    <button onClick={() => setActiveTab('materials')} className="text-sm font-semibold text-[#1b7668] hover:underline cursor-pointer">Lihat Semua</button>
                                </div>
                                
                                {materials.length > 0 ? (
                                    <div className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                                        <div className="h-64 bg-slate-100 relative w-full overflow-hidden">
                                            {/* We use a placeholder matching the graphic design theme */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center p-8">
                                                <div className="text-center">
                                                    <h2 className="text-4xl font-black text-white tracking-tight mb-2">VISUAL HIERARCHY</h2>
                                                    <h2 className="text-4xl font-black text-white tracking-tight">PRINCIPLES</h2>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-4 left-6 bg-[#1b7668] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                                                DESAIN GRAFIS
                                            </div>
                                        </div>
                                        <div className="p-6 flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-navy text-lg">{materials[0]?.judul || 'Prinsip Hierarki Visual'}</h4>
                                                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 font-medium">
                                                    <PlayCircle size={16} className="text-slate-400" /> Modul {completedMaterials.length} dari {materials.length}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => setPreviewMaterial(materials[0])}
                                                className="px-6 py-3 bg-[#0f5c50] text-white font-bold rounded-xl hover:bg-[#0a423a] transition-colors cursor-pointer flex items-center gap-2"
                                            >
                                                Mulai Belajar <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white border border-slate-200/80 rounded-[32px] p-12 text-center text-slate-400 shadow-sm">
                                        Tidak ada materi yang tersedia.
                                    </div>
                                )}
                            </div>

                            {/* Kuis Mendatang */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                                <h3 className="font-semibold text-slate-800 text-lg">Kuis Mendatang</h3>
                                
                                <div className="flex flex-col gap-4">
                                    <div className="bg-white border border-[#d4a017]/30 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('quizzes')}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#fff9e6] flex items-center justify-center text-[#d4a017]">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-navy text-sm">Uji Teori Warna</h4>
                                                <p className="text-xs text-slate-500 mt-1">Besok, 09:00 WIB</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </div>

                                    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('quizzes')}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#f0fbf9] flex items-center justify-center text-[#1b7668]">
                                                <Sparkles size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-navy text-sm">Psikologi Tipografi</h4>
                                                <p className="text-xs text-slate-500 mt-1">15 Juli, 14:00 WIB</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </div>

                                    <div className="bg-[#f0edff] rounded-3xl p-6 flex flex-col items-center text-center mt-2 relative overflow-hidden">
                                        <Trophy size={32} className="text-[#d4a017] mb-3" />
                                        <p className="text-sm text-navy mb-4 font-medium px-2">
                                            Tinggal 2 kuis lagi untuk naik level ke <span className="font-extrabold">Desainer Senior!</span>
                                        </p>
                                        <div className="w-full bg-white/60 h-2 rounded-full overflow-hidden">
                                            <div className="bg-[#b87c1a] h-full w-[80%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                        {/* TAB 2: Eksplorasi Materi (Materials) */}
                        {activeTab === 'materials' && (
                            <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
                                {/* Search & Filters */}
                                {materials.length > 0 && (
                                    <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
                                        <div className="relative flex-1 w-full">
                                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Cari materi atau mentor..." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {materials.length === 0 ? (
                                    <div className="bg-white border border-slate-200/80 rounded-[32px] p-16 text-center shadow-sm">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                            <BookOpen size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-navy mb-2">Belum Ada Materi</h3>
                                        <p className="text-sm text-slate-500">Guru belum mengunggah materi pelajaran apa pun ke sistem.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {materials.filter(m => m.judul.toLowerCase().includes(searchQuery.toLowerCase()) || (m.guru?.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((mat, idx) => {
                                            const progress = completedMaterials.includes(mat.id) ? 100 : (idx % 3 === 0 ? 65 : (idx % 3 === 1 ? 12 : 0)); // Mock progress for UI
                                            
                                            return (
                                                <div key={mat.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200/80 group flex flex-col">
                                                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                                                        {/* Placeholder Image background depending on index to match Gamification feel */}
                                                        <div className={`absolute inset-0 flex items-center justify-center p-6 ${
                                                            idx % 3 === 0 ? 'bg-gradient-to-br from-cyan-800 to-slate-900' :
                                                            idx % 3 === 1 ? 'bg-gradient-to-br from-indigo-900 to-slate-900' :
                                                            'bg-gradient-to-br from-slate-200 to-slate-300'
                                                        }`}>
                                                            <BookOpen size={48} className={idx % 3 === 2 ? 'text-slate-400' : 'text-white/20'} />
                                                        </div>
                                                        
                                                        <div className="absolute top-4 left-4">
                                                            {idx === 0 && <span className="bg-[#f5a623] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">POPULER</span>}
                                                            {idx === 2 && <span className="bg-[#6d28d9] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md">NEW</span>}
                                                        </div>
                                                        <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-600 hover:text-navy transition-colors shadow-sm cursor-pointer">
                                                            <Bookmark size={14} />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="p-6 flex flex-col flex-1">
                                                        <h3 className="font-bold text-navy text-lg leading-snug mb-2 line-clamp-2">{mat.judul}</h3>
                                                        <div className="flex items-center gap-2 text-slate-500 mb-6">
                                                            <User size={14} />
                                                            <span className="text-xs">Mentor: <span className="font-semibold text-slate-700">{mat.guru?.name || 'Tutor Senior'}</span></span>
                                                        </div>
                                                        
                                                        <div className="mt-auto">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                                                                <span className="text-[10px] font-bold text-navy">{progress}%</span>
                                                            </div>
                                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-5">
                                                                <div className="bg-[#0f5c50] h-full rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                                                            </div>
                                                            
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => setPreviewMaterial(mat)}
                                                                    className={`flex-1 py-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm ${
                                                                        progress > 0 
                                                                            ? 'bg-[#0f5c50] hover:bg-[#0a423a] text-white' 
                                                                            : 'bg-[#f0edff] hover:bg-[#e4dcff] text-primary'
                                                                    }`}
                                                                >
                                                                    {progress > 0 ? 'Lanjutkan' : 'Mulai Belajar'} <PlayCircle size={16} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: Quizzes & History */}
                        {activeTab === 'quizzes' && (
                            <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto w-full">
                                {/* Left Content: Tabs & List */}
                                <div className="flex-1 flex flex-col gap-6">
                                    {/* Sub-tabs */}
                                    <div className="flex gap-8 border-b border-slate-200">
                                        <button 
                                            onClick={() => setQuizSubTab('aktif')}
                                            className={`pb-4 text-sm font-bold transition-all relative ${quizSubTab === 'aktif' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Kuis Aktif
                                            {quizSubTab === 'aktif' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                                        </button>
                                        <button 
                                            onClick={() => setQuizSubTab('riwayat')}
                                            className={`pb-4 text-sm font-bold transition-all relative ${quizSubTab === 'riwayat' ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Riwayat Kuis
                                            {quizSubTab === 'riwayat' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                                        </button>
                                    </div>

                                    {/* Search & Filter */}
                                    <div className="flex gap-4 items-center">
                                        <div className="relative flex-1">
                                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type="text" 
                                                placeholder="Cari mata pelajaran atau judul kuis..." 
                                                className="w-full pl-12 pr-4 py-3.5 bg-[#f5f7fa] border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                            />
                                        </div>
                                        <button className="w-12 h-12 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors">
                                            <SlidersHorizontal size={18} />
                                        </button>
                                    </div>

                                    {/* Kuis Aktif Tab */}
                                    {quizSubTab === 'aktif' && (
                                        <div className="flex flex-col gap-4 mt-2">
                                            {quizzes.length === 0 ? (
                                                <div className="bg-white border border-slate-200/80 rounded-[32px] p-12 text-center shadow-sm">
                                                    Tidak ada kuis simulasi aktif saat ini.
                                                </div>
                                            ) : (
                                                quizzes.map((quiz, idx) => (
                                                    <div key={quiz.id} className="p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left shadow-sm hover:shadow-md transition-shadow">
                                                        <div className="flex items-center gap-5">
                                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                                                                idx % 3 === 0 ? 'bg-[#e6f4f1] text-[#1b7668]' : 
                                                                idx % 3 === 1 ? 'bg-[#f0edff] text-primary' : 
                                                                'bg-[#fff9e6] text-[#d4a017]'
                                                            }`}>
                                                                <LayoutDashboard size={24} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    {idx === 0 && <span className="bg-[#f5a623] text-white px-2 py-0.5 rounded text-[8px] font-bold">HOT</span>}
                                                                    <span className={`text-[10px] font-bold ${
                                                                        idx % 3 === 0 ? 'text-[#1b7668]' : 
                                                                        idx % 3 === 1 ? 'text-primary' : 
                                                                        'text-[#b87c1a]'
                                                                    }`}>{quiz.tipe || 'Mata Pelajaran'}</span>
                                                                </div>
                                                                <h3 className="font-bold text-navy text-base">{quiz.judul}</h3>
                                                                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 font-medium">
                                                                    <span className="flex items-center gap-1"><Clock size={14} /> {quiz.durasi_menit} mnt</span>
                                                                    <span className="flex items-center gap-1"><CheckSquare size={14} /> {quiz.questions_count || 0} Soal</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleStartQuiz(quiz.id)}
                                                            className="w-full sm:w-auto px-6 py-3 bg-[#0f5c50] hover:bg-[#0a423a] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                                        >
                                                            Mulai Kuis <Play size={14} fill="currentColor" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}

                                    {/* Riwayat Kuis Tab */}
                                    {quizSubTab === 'riwayat' && (
                                        <div className="flex flex-col gap-4 mt-2">
                                            {history.length === 0 ? (
                                                <div className="bg-white border border-slate-200/80 rounded-[32px] p-12 text-center shadow-sm">
                                                    Belum ada riwayat pengerjaan kuis.
                                                </div>
                                            ) : (
                                                history.map((sub) => (
                                                    <div key={sub.id} className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col gap-4 text-left shadow-sm">
                                                        <div className="flex justify-between items-start sm:items-center gap-4">
                                                            <div>
                                                                <h4 className="font-bold text-sm text-navy">{sub.quiz?.judul || 'Kuis'}</h4>
                                                                <span className="text-[10px] text-slate-500 block font-medium mt-1">{new Date(sub.submitted_at || sub.created_at).toLocaleString('id-ID')}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs font-black text-primary bg-[#f0edff] px-3 py-1.5 rounded-lg border border-[#e4dcff]">Skor: {sub.skor_pg ?? 0}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Right Sidebar: Leaderboard & Motivation */}
                                <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
                                    
                                    {/* Leaderboard Panel */}
                                    <div className="bg-[#f5f7fa] rounded-[32px] p-6 border border-slate-200/60 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-center mb-6 relative z-10">
                                            <h3 className="font-bold text-navy text-lg">Papan Peringkat</h3>
                                            <Trophy size={18} className="text-[#d4a017]" />
                                        </div>
                                        
                                        {/* Current User Rank Card */}
                                        <div className="bg-[#0f5c50] rounded-2xl p-4 flex items-center justify-between mb-6 relative z-10 shadow-md text-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">14</div>
                                                <div>
                                                    <span className="text-sm font-bold block">Kamu (Rizky A.)</span>
                                                    <span className="text-[10px] text-teal-100">2,840 Poin</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-emerald-300 text-xs font-bold">
                                                <TrendingUp size={14} /> +2
                                            </div>
                                        </div>

                                        {/* Top 3 Users (Mock) */}
                                        <div className="flex flex-col gap-4 relative z-10">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 flex justify-center text-[#d4a017]"><Trophy size={16} /></div>
                                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/150?img=5" alt="Avatar" /></div>
                                                <div>
                                                    <span className="text-xs font-bold text-navy block">Alya Putri</span>
                                                    <span className="text-[10px] text-slate-500">4,200 Poin</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 flex justify-center text-slate-400"><Award size={16} /></div>
                                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/150?img=11" alt="Avatar" /></div>
                                                <div>
                                                    <span className="text-xs font-bold text-navy block">Budi Santoso</span>
                                                    <span className="text-[10px] text-slate-500">3,950 Poin</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 flex justify-center text-[#cd7f32]"><Award size={16} /></div>
                                                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden"><img src="https://i.pravatar.cc/150?img=9" alt="Avatar" /></div>
                                                <div>
                                                    <span className="text-xs font-bold text-navy block">Citra Dewi</span>
                                                    <span className="text-[10px] text-slate-500">3,720 Poin</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-6 text-sm font-bold text-[#0f5c50] hover:underline relative z-10 cursor-pointer">
                                            Lihat Selengkapnya
                                        </button>
                                    </div>

                                    {/* Motivation Box */}
                                    <div className="bg-[#f5a623] rounded-[32px] p-8 text-left relative overflow-hidden shadow-md">
                                        <div className="relative z-10 text-white">
                                            <h3 className="font-bold text-lg mb-2">Terus Berusaha!</h3>
                                            <p className="text-xs font-medium text-white/90 leading-relaxed">
                                                Selesaikan 2 kuis lagi minggu ini untuk meraih medali 'Weekly Achiever'.
                                            </p>
                                        </div>
                                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* TAB 4: Profil */}
                        {activeTab === 'profile' && (
                            <div className="flex flex-col gap-6 max-w-2xl mx-auto text-center py-12">
                                <div className="w-32 h-32 bg-[#f0edff] rounded-full mx-auto flex items-center justify-center text-primary border-4 border-white shadow-lg">
                                    <User size={64} />
                                </div>
                                <h2 className="text-2xl font-bold text-navy">{user?.name || 'Siswa'}</h2>
                                <p className="text-slate-500">{user?.email || '-'}</p>
                                <div className="bg-white border border-slate-200 rounded-3xl p-8 mt-6 text-left shadow-sm">
                                    <h3 className="font-bold text-lg mb-4">Statistik Akun</h3>
                                    <ul className="space-y-3 text-sm text-slate-600">
                                        <li className="flex justify-between border-b pb-2"><span>Materi Selesai</span> <span className="font-bold">{completedMaterials.length}</span></li>
                                        <li className="flex justify-between border-b pb-2"><span>Kuis Dikerjakan</span> <span className="font-bold">{history.length}</span></li>
                                        <li className="flex justify-between border-b pb-2"><span>Rata-rata Nilai</span> <span className="font-bold">{averageScore}</span></li>
                                    </ul>
                                </div>
                            </div>
                        )}
                {previewMaterial && (
                    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white border border-slate-200 rounded-[32px] w-full max-w-4xl overflow-hidden shadow-xl text-left flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-600 rounded-full font-bold uppercase tracking-wider block mb-1 w-fit">
                                        Framed Reader Modul
                                    </span>
                                    <h4 className="font-black text-sm sm:text-base text-slate-800">{previewMaterial.judul}</h4>
                                </div>
                                
                                {/* Header Actions */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleCompleteMaterial(previewMaterial.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                                            completedMaterials.includes(previewMaterial.id)
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                                        }`}
                                    >
                                        <CheckCircle2 size={13} className={completedMaterials.includes(previewMaterial.id) ? 'text-emerald-500' : 'text-slate-400'} />
                                        {completedMaterials.includes(previewMaterial.id) ? 'Selesai Dibaca' : 'Tandai Selesai'}
                                    </button>
                                    
                                    <button 
                                        onClick={() => setPreviewMaterial(null)}
                                        className="p-2 border border-slate-200 text-slate-400 hover:text-slate-650 rounded-xl transition-colors cursor-pointer"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content Scrollable Area */}
                            <div className="p-6 overflow-y-auto flex flex-col gap-6">
                                {/* Description text block */}
                                <div className="bg-[#fafbfd] p-4 border border-slate-150 rounded-2xl text-xs text-slate-600 leading-relaxed">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Keterangan / Instruksi Guru:</span>
                                    <p className="whitespace-pre-wrap font-sans">{previewMaterial.deskripsi || 'Tidak ada deskripsi tertulis pada modul ini.'}</p>
                                </div>

                                {/* Frame Document container */}
                                {previewMaterial.attachments && previewMaterial.attachments.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest block">
                                                Framed Document Reader
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-mono">
                                                {previewMaterial.attachments[0].storage_type} • {previewMaterial.attachments[0].mime_type}
                                            </span>
                                        </div>
                                        <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-inner relative min-h-[480px] flex items-center justify-center">
                                            {loadingIframe ? (
                                                <div className="flex flex-col items-center gap-3 py-16">
                                                    <Loader className="animate-spin text-cyan-500" size={24} />
                                                    <span className="text-xs text-slate-400 font-bold">Menyiapkan dokumen di frame aman...</span>
                                                </div>
                                            ) : iframeUrl ? (
                                                <iframe
                                                    src={iframeUrl}
                                                    title={previewMaterial.judul}
                                                    className="w-full h-[480px] border-0"
                                                />
                                            ) : (
                                                <div className="text-xs text-slate-400 py-16">
                                                    Gagal memuat URL lampiran dokumen.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-xs text-slate-400 italic bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                        Modul ini tidak memiliki file lampiran dokumen.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL: Zoom image */}
                {zoomImage && (
                    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
                        <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center gap-4">
                            <img src={zoomImage} alt="Attachment Zoomed" className="max-w-full max-h-[75vh] object-contain rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" />
                            <button 
                                onClick={() => setZoomImage(null)}
                                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl transition-colors cursor-pointer"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
