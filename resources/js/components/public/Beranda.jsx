import React from 'react';
import { ArrowRight, CheckCircle, Search, Shield, Book, LayoutDashboard, Share2 } from 'lucide-react';

export default function Beranda({ onNavigate }) {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#dcfce7] rounded-full text-teal font-bold text-sm w-fit border border-[#bbf7d0]">
                        <span className="text-teal font-black text-lg">✿</span> Belajar Profesional & Syar'i
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight">
                        Cerdaskan Si Kecil dengan <span className="text-teal">Adab</span> & Prestasi
                    </h1>
                    <p className="text-on-surface-variant text-base lg:text-lg max-w-lg leading-relaxed">
                        Fokus pada penguasaan Matematika & Bahasa Inggris untuk SD-SMP dengan lingkungan belajar yang islami, suportif, dan menyenangkan.
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                        <button
                            onClick={() => onNavigate('auth')}
                            className="px-8 py-4 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center gap-2"
                        >
                            Mulai Belajar Sekarang <ArrowRight size={18} />
                        </button>
                        <button
                            onClick={() => onNavigate('kontak')}
                            className="px-8 py-4 bg-surface-container-low text-primary font-bold rounded-xl hover:bg-surface-container transition-all"
                        >
                            Konsultasi Gratis
                        </button>
                    </div>
                </div>

                {/* Right Image/Visual */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="w-full max-w-md bg-white border border-outline-variant/30 rounded-3xl p-4 shadow-xl relative z-10">
                        {/* Placeholder for the child learning image */}
                        <div className="w-full h-[300px] bg-surface-container rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
                            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" alt="Belajar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -left-8 top-12 bg-white rounded-2xl p-4 shadow-lg border border-outline-variant/20 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center">
                                <span className="text-teal font-bold text-xl">☺</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-navy text-sm">500+</h4>
                                <p className="text-xs text-on-surface-variant">Siswa Aktif</p>
                            </div>
                        </div>
                    </div>
                    {/* Background blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
                </div>
            </section>

            {/* Quick Access / Stats Bento */}
            <section className="w-full max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Akses Jalur Belajar */}
                    <div className="md:col-span-8 bg-orange/10 rounded-3xl p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-orange font-bold text-sm mb-4">
                            <Book size={18} /> Akses Jalur Belajar
                        </div>
                        <div className="bg-white p-2 rounded-2xl flex items-center shadow-sm max-w-md">
                            <input type="text" placeholder="Cari materi atau topik..." className="flex-1 px-4 outline-none text-sm" />
                            <button className="bg-navy text-white px-6 py-2 rounded-xl text-sm font-bold">Cari Sekarang</button>
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-orange">
                            <span className="bg-white px-3 py-1 rounded-full border border-orange/20 cursor-pointer">Matematika</span>
                            <span className="bg-white px-3 py-1 rounded-full border border-orange/20 cursor-pointer">English</span>
                        </div>
                    </div>

                    {/* Kurikulum AI */}
                    <div className="md:col-span-4 bg-[#f1f5f9] rounded-3xl p-8 flex flex-col justify-between">
                        <div>
                            <div className="w-10 h-10 bg-teal/10 text-teal rounded-xl flex items-center justify-center mb-4">
                                <Share2 size={20} />
                            </div>
                            <h3 className="font-bold text-navy text-lg mb-2">Kurikulum AI</h3>
                            <p className="text-xs text-on-surface-variant">Personalisasi materi otomatis sesuai kemampuan anak.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mengapa Memilih Stugether */}
            <section className="w-full bg-surface-container-low py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-extrabold text-navy mb-4">Mengapa Memilih Stugether?</h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto mb-16 text-sm">
                        Kami mengintegrasikan metode pengajaran modern dengan nilai-nilai Islami untuk hasil yang optimal.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm text-left">
                            <div className="w-12 h-12 bg-teal/10 text-teal rounded-2xl flex items-center justify-center mb-6">
                                <LayoutDashboard size={24} />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-3">Kurikulum Adaptif</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Materi yang disesuaikan dengan kecepatan belajar unik setiap anak, memastikan pemahaman mendalam tanpa ada tekanan.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm text-left">
                            <div className="w-12 h-12 bg-orange/10 text-orange rounded-2xl flex items-center justify-center mb-6">
                                <Book size={24} />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-3">Laporan Berkala</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Pantau perkembangan akademik dan adab anak secara transparan dan detail langsung dari akun orang tua.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm text-left">
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="font-bold text-navy text-xl mb-3">Lingkungan Islami</h3>
                            <p className="text-sm text-on-surface-variant leading-relaxed">
                                Pembelajaran dimulai dan diakhiri dengan doa, serta integrasi adab Islami dalam setiap interaksi pengajar dan siswa.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Unggulan */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-extrabold text-navy mb-2">Program Unggulan Kami</h2>
                        <p className="text-on-surface-variant text-sm">Fokus pada fondasi kuat untuk masa depan gemilang.</p>
                    </div>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-teal font-bold text-sm mt-4 md:mt-0 flex items-center gap-1 hover:underline">
                        Lihat Semua Program <ArrowRight size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Program 1 */}
                    <div className="relative group overflow-hidden rounded-3xl h-[400px]">
                        <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" alt="Mathematics" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-3 inline-block">Best Seller</span>
                            <h3 className="text-2xl font-bold text-white mb-2">Mastering Mathematics</h3>
                            <p className="text-white/80 text-sm mb-6 max-w-sm">Membangun logika matematika dengan metode visual dan interaktif untuk jenjang SD & SMP.</p>
                            <button className="px-6 py-3 bg-white text-navy font-bold text-sm rounded-xl hover:bg-surface-container transition-colors">Pelajari Selengkapnya</button>
                        </div>
                    </div>

                    {/* Program 2 */}
                    <div className="relative group overflow-hidden rounded-3xl h-[400px]">
                        <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop" alt="English" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-orange/90 via-orange/40 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-2xl font-bold text-white mb-2">English Fluency Path</h3>
                            <p className="text-white/80 text-sm mb-6 max-w-sm">Program dari dasar hingga mahir (General English & Speaking) dengan standar internasional untuk siswa.</p>
                            <button className="px-6 py-3 bg-white text-orange font-bold text-sm rounded-xl hover:bg-surface-container transition-colors">Pelajari Selengkapnya</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="w-full bg-navy py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-white text-center mb-2">Kata Orang Tua Stugether</h2>
                    <p className="text-on-surface-variant text-center mb-16 text-sm text-white/60">Kepercayaan Anda adalah amanah bagi kami.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col gap-6">
                            {/* Testi 1 */}
                            <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-3xl">
                                <div className="text-orange mb-3">★★★★★</div>
                                <p className="text-white/90 italic mb-4 text-sm leading-relaxed">
                                    "Anak saya jadi lebih percaya diri di sekolah. Tutor-tutornya sabar dan materinya gampang ngerti. Tapi yang paling saya suka adalah selalu ada doa setiap mulai belajar dan nilai religius yang dibawa."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20"></div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Ibu Sarah</h4>
                                        <p className="text-white/50 text-xs">Orang Tua Siswa Kelas 5 SD</p>
                                    </div>
                                </div>
                            </div>
                            {/* Testi 2 */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/5 p-6 rounded-3xl">
                                <div className="text-orange mb-3">★★★★★</div>
                                <p className="text-white/90 italic mb-4 text-sm leading-relaxed">
                                    "Sangat membantu saya memantau aktivitas belajar dari rumah. Saya bisa memantau perkembangan anak saya bahkan saat sibuk bekerja."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20"></div>
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Bapak Ahmad</h4>
                                        <p className="text-white/50 text-xs">Orang Tua Siswa Kelas 2 SMP</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block w-full h-full rounded-3xl overflow-hidden relative">
                             <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop" alt="Belajar bersama" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-navy/20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="bg-primary rounded-[40px] p-12 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal rounded-full blur-[100px] opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal rounded-full blur-[100px] opacity-50"></div>
                    
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 relative z-10">Mulai Perjalanan Belajar Si Kecil Hari Ini</h2>
                    <p className="text-white/80 max-w-2xl mx-auto mb-10 text-sm relative z-10">
                        Bergabunglah dengan ribuan orang tua lainnya yang telah mempercayakan pendidikan anak mereka kepada stugether.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <button onClick={() => {
                            localStorage.setItem('authMode', 'register');
                            onNavigate('auth');
                        }} className="w-full sm:w-auto px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-surface-container transition-all cursor-pointer">
                            Daftar Sekarang
                        </button>
                        <button onClick={() => onNavigate('kontak')} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                            Hubungi Admin
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
