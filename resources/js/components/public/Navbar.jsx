import React from 'react';
import Logo from '../Logo';
import { TransitionLink, ROUTE_COLORS } from '../../transition';

export default function Navbar({ currentRoute, onNavigate }) {
    const navLinks = [
        { id: 'beranda', label: 'Beranda' },
        { id: 'jalur-belajar', label: 'Jalur Belajar' },
        { id: 'biaya', label: 'Biaya' },
        { id: 'kontak', label: 'Kontak Kami' },
    ];

    return (
        <nav className="w-full bg-surface border-b border-surface-variant sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <TransitionLink 
                    to="beranda"
                    targetColor={ROUTE_COLORS.beranda}
                    className="cursor-pointer"
                >
                    <Logo size="md" />
                </TransitionLink>

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <TransitionLink
                            key={link.id}
                            to={link.id}
                            currentRoute={currentRoute}
                            targetColor={ROUTE_COLORS[link.id]}
                            className={`text-sm font-semibold transition-colors cursor-pointer ${
                                currentRoute === link.id
                                    ? 'text-teal border-b-2 border-teal pb-1'
                                    : 'text-on-surface-variant hover:text-navy'
                            }`}
                        >
                            {link.label}
                        </TransitionLink>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <TransitionLink 
                        to="auth"
                        targetColor={ROUTE_COLORS.auth}
                        className="text-sm font-semibold text-on-surface hover:text-teal transition-colors cursor-pointer hidden sm:block"
                    >
                        Masuk
                    </TransitionLink>
                    <TransitionLink 
                        to="auth"
                        targetColor={ROUTE_COLORS.register}
                        onClick={() => {
                            localStorage.setItem('authMode', 'register');
                        }}
                        className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-full hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                    >
                        Daftar Sekarang
                    </TransitionLink>
                </div>
            </div>
        </nav>
    );
}
