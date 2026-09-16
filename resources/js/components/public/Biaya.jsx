import React from 'react';
import { Check, Info, Shield, BookOpen, BrainCircuit, MessageCircle } from 'lucide-react';

export default function Biaya({ onNavigate }) {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-6 text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange text-white font-bold text-xs w-fit rounded-full">
                        Investasi Masa Depan
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-extrabold text-navy leading-tight tracking-tight">
                        Pendidikan Syar'i & Profesional Tanpa <span className="text-navy">Biaya Tersembunyi.</span>
                    </h1>
                    <p className="text-on-surface-variant text-base lg:text-lg max-w-lg leading-relaxed">
                        Membangun karakter dan kecerdasan anak melalui kurikulum terintegrasi dengan transparansi biaya penuh untuk orang tua.
                    </p>
                </div>

                {/* Right Image/Visual */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="w-full h-[350px] rounded-3xl overflow-hidden shadow-2xl relative">
                        <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop" alt="Belajar" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>

            {/* Pricing Packages */}
            <section className="w-full bg-surface-container-low py-20 text-center">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-navy mb-4">Pilihan Paket Investasi Belajar</h2>
                    <p className="text-on-surface-variant max-w-2xl mx-auto mb-16 text-sm">
                        Tersedia paket khusus untuk Matematika dan Bahasa Inggris yang disesuaikan dengan kebutuhan kurikulum nasional dan internasional.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                        {/* SD Package */}
                        <div className="bg-white border border-outline-variant/30 rounded-3xl p-10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-navy">Jenjang SD</h3>
                                    <BookOpen className="text-navy" size={24} />
                                </div>
                                <p className="text-xs text-on-surface-variant mb-8">Grades 1 - 6</p>
                                
                                <p className="text-xs text-on-surface-variant mb-1">Mulai dari</p>
                                <div className="flex items-end gap-1 mb-8">
                                    <span className="text-4xl font-extrabold text-teal">Rp 350rb</span>
                                    <span className="text-sm text-on-surface-variant mb-1">/bln</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-teal shrink-0" />
                                        <span>Integrated Islamic Curriculum</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-teal shrink-0" />
                                        <span>Lumina Analytics Dashboard</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-teal shrink-0" />
                                        <span>Character Building Focus</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-teal shrink-0" />
                                        <span>Math & English Base Package</span>
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => { localStorage.setItem('selectedPackage', 'Paket SD'); onNavigate('auth'); }} className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all">
                                Pilih Paket SD
                            </button>
                        </div>

                        {/* SMP Package */}
                        <div className="bg-white border-2 border-orange rounded-3xl p-10 shadow-lg relative flex flex-col justify-between">
                            <div className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1.5 bg-orange text-white text-xs font-bold rounded-full">
                                Paling Populer
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-bold text-orange">Jenjang SMP</h3>
                                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange/10 text-orange">
                                        ★
                                    </div>
                                </div>
                                <p className="text-xs text-on-surface-variant mb-8">Grades 7 - 9</p>
                                
                                <p className="text-xs text-on-surface-variant mb-1">Mulai dari</p>
                                <div className="flex items-end gap-1 mb-8">
                                    <span className="text-4xl font-extrabold text-orange">Rp 450rb</span>
                                    <span className="text-sm text-on-surface-variant mb-1">/bln</span>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-orange shrink-0" />
                                        <span>Advanced Integrated Curriculum</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-orange shrink-0" />
                                        <span>Lumina Analytics Pro</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-orange shrink-0" />
                                        <span>Leadership & Character Building</span>
                                    </li>
                                    <li className="flex gap-3 text-sm text-navy">
                                        <Check size={18} className="text-orange shrink-0" />
                                        <span>Global English & Tech Proficiency</span>
                                    </li>
                                </ul>
                            </div>
                            <button onClick={() => { localStorage.setItem('selectedPackage', 'Paket SMP'); onNavigate('auth'); }} className="w-full py-4 bg-[#845400] text-white font-bold rounded-xl hover:bg-[#6d4400] transition-all">
                                Pilih Paket SMP
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Benefits */}
            <section className="w-full max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {/* Feature 1 */}
                    <div className="bg-primary text-white p-8 rounded-3xl shadow-lg">
                        <div className="mb-6 opacity-80">
                            <BrainCircuit size={24} />
                        </div>
                        <h4 className="font-bold mb-2">Lumina Analytics</h4>
                        <p className="text-xs text-white/80 leading-relaxed">
                            Pantau perkembangan akademik dan akhlak anak secara real-time melalui dashboard terpadu.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-surface-container-low p-8 rounded-3xl border border-surface-variant">
                        <div className="mb-6 text-navy opacity-80">
                            <Shield size={24} />
                        </div>
                        <h4 className="font-bold text-navy mb-2">No Hidden Fees</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                            Biaya transparan sejak awal. Tanpa biaya pendaftaran tambahan yang mengejutkan.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-orange/10 p-8 rounded-3xl border border-orange/20">
                        <div className="mb-6 text-orange opacity-80">
                            <BookOpen size={24} />
                        </div>
                        <h4 className="font-bold text-navy mb-2">Integrated Curriculum</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                            Kurikulum yang memadukan keunggulan akademik dengan nilai-nilai syar'i.
                        </p>
                    </div>

                    {/* Feature 4 (Spans 3 cols or centered) */}
                    <div className="md:col-span-3 bg-white p-8 rounded-3xl border border-outline-variant/30 flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center text-teal shrink-0">
                            <BrainCircuit size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-navy mb-1">Character Building Focus</h4>
                            <p className="text-sm text-on-surface-variant">
                                Kami tidak hanya mencetak siswa pintar, tapi juga generasi beradab dan berintegritas tinggi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Help Banner */}
            <section className="w-full max-w-7xl mx-auto px-6 py-12 mb-12">
                <div className="bg-navy rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Butuh bantuan memilih paket yang tepat?</h3>
                        <p className="text-white/70 text-sm">Tim kami siap memberikan konsultasi gratis untuk menentukan jalur belajar terbaik bagi putra-putri Anda.</p>
                    </div>
                    <button onClick={() => onNavigate('kontak')} className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors flex items-center gap-2 shrink-0">
                        <MessageCircle size={18} /> Hubungi Admin
                    </button>
                </div>
            </section>
        </div>
    );
}
