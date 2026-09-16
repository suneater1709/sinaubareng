import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout({ children, currentRoute, onNavigate }) {
    return (
        <div className="min-h-screen bg-surface flex flex-col font-sans">
            <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />
            <main className="flex-1 w-full">
                {children}
            </main>
            <Footer onNavigate={onNavigate} />
        </div>
    );
}
