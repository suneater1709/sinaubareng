import React from 'react';

export default function Footer({ onNavigate }) {
    return (
        <footer className="w-full bg-[#E8E6FC] pt-16 pb-8 text-on-surface">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Column 1: Brand */}
                <div className="flex flex-col gap-4">
                    <span className="font-extrabold text-2xl tracking-tight">stugether</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        Bimbingan belajar profesional & syar'i untuk masa depan cerah anak Anda.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                            {/* Icon Placeholder */}
                            <span className="text-xs font-bold">in</span>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary hover:bg-primary hover:text-white transition-colors">
                            <span className="text-xs font-bold">ig</span>
                        </a>
                    </div>
                </div>

                {/* Column 2: Program */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Program</h4>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Program SD</button>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Program SMP</button>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">General English</button>
                    <button onClick={() => onNavigate('jalur-belajar')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Speaking Class</button>
                </div>

                {/* Column 3: Tentang Kami */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Tentang Kami</h4>
                    <button onClick={() => onNavigate('beranda')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Profil</button>
                    <button onClick={() => onNavigate('beranda')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Metode Belajar</button>
                    <button onClick={() => onNavigate('beranda')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Pengajar</button>
                    <button onClick={() => onNavigate('beranda')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Karir</button>
                </div>

                {/* Column 4: Bantuan */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Bantuan</h4>
                    <button onClick={() => onNavigate('kontak')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Kebijakan Privasi</button>
                    <button onClick={() => onNavigate('kontak')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Syarat & Ketentuan</button>
                    <button onClick={() => onNavigate('kontak')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">Bantuan</button>
                    <button onClick={() => onNavigate('kontak')} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors">FAQ</button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-surface-variant text-xs text-on-surface-variant">
                <p>&copy; 2026 stugether. Bimbingan Belajar Profesional & Syar'i.</p>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span>🌐</span>
                    <span>Indonesia</span>
                </div>
            </div>
        </footer>
    );
}
