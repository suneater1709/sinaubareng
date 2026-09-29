import React from 'react';
import Logo from '../Logo';
import { TransitionLink, ROUTE_COLORS } from '../../transition';

export default function Footer({ onNavigate }) {
    return (
        <footer className="w-full bg-[#E8E6FC] pt-16 pb-8 text-on-surface">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                {/* Column 1: Brand */}
                <div className="flex flex-col gap-4">
                    <TransitionLink 
                        to="beranda"
                        targetColor={ROUTE_COLORS.beranda}
                        className="cursor-pointer inline-block"
                    >
                        <Logo size="md" textColor="text-navy" />
                    </TransitionLink>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                        Bimbingan belajar profesional & syar'i untuk masa depan cerah anak Anda.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-primary hover:bg-primary hover:text-white transition-colors">
                            <span className="text-xs font-bold">in</span>
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs text-primary hover:bg-primary hover:text-white transition-colors">
                            <span className="text-xs font-bold">ig</span>
                        </a>
                    </div>
                </div>

                {/* Column 2: Program */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Program</h4>
                    <TransitionLink to="jalur-belajar" targetColor={ROUTE_COLORS['jalur-belajar']} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Program SD</TransitionLink>
                    <TransitionLink to="jalur-belajar" targetColor={ROUTE_COLORS['jalur-belajar']} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Program SMP</TransitionLink>
                    <TransitionLink to="jalur-belajar" targetColor={ROUTE_COLORS['jalur-belajar']} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">General English</TransitionLink>
                    <TransitionLink to="jalur-belajar" targetColor={ROUTE_COLORS['jalur-belajar']} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Speaking Class</TransitionLink>
                </div>

                {/* Column 3: Tentang Kami */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Tentang Kami</h4>
                    <TransitionLink to="beranda" targetColor={ROUTE_COLORS.beranda} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Profil</TransitionLink>
                    <TransitionLink to="beranda" targetColor={ROUTE_COLORS.beranda} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Metode Belajar</TransitionLink>
                    <TransitionLink to="beranda" targetColor={ROUTE_COLORS.beranda} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Pengajar</TransitionLink>
                    <TransitionLink to="beranda" targetColor={ROUTE_COLORS.beranda} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Karir</TransitionLink>
                </div>

                {/* Column 4: Bantuan */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-bold text-sm text-navy uppercase tracking-widest">Bantuan</h4>
                    <TransitionLink to="kontak" targetColor={ROUTE_COLORS.kontak} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Kebijakan Privasi</TransitionLink>
                    <TransitionLink to="kontak" targetColor={ROUTE_COLORS.kontak} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Syarat & Ketentuan</TransitionLink>
                    <TransitionLink to="kontak" targetColor={ROUTE_COLORS.kontak} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Bantuan</TransitionLink>
                    <TransitionLink to="kontak" targetColor={ROUTE_COLORS.kontak} className="text-left text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer">FAQ</TransitionLink>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-surface-variant text-xs text-on-surface-variant">
                <p>&copy; 2026 Sinaubareng. Bimbingan Belajar Profesional & Syar'i.</p>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <span>🌐</span>
                    <span>Indonesia</span>
                </div>
            </div>
        </footer>
    );
}
