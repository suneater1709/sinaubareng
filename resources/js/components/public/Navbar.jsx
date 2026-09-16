import React from 'react';

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
                <div 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onNavigate('beranda')}
                >
                    <span className="font-extrabold text-on-surface text-2xl tracking-tight font-sans">stugether</span>
                </div>

                {/* Center Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(link => (
                        <button
                            key={link.id}
                            onClick={() => onNavigate(link.id)}
                            className={`text-sm font-semibold transition-colors cursor-pointer ${
                                currentRoute === link.id
                                    ? 'text-teal border-b-2 border-teal pb-1'
                                    : 'text-on-surface-variant hover:text-navy'
                            }`}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => onNavigate('auth')}
                        className="text-sm font-semibold text-on-surface hover:text-teal transition-colors cursor-pointer hidden sm:block"
                    >
                        Masuk
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.setItem('authMode', 'register');
                            onNavigate('auth');
                        }}
                        className="px-5 py-2.5 bg-primary text-on-primary text-sm font-semibold rounded-full hover:bg-primary-container transition-all cursor-pointer shadow-sm"
                    >
                        Daftar Sekarang
                    </button>
                </div>
            </div>
        </nav>
    );
}
