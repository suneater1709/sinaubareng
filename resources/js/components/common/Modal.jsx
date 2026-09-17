import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    maxWidth = 'max-w-lg',
    showCloseButton = true,
    closeOnClickOutside = true,
    closeOnEsc = true,
    className = '',
    headerClassName = '',
    bodyClassName = ''
}) {
    useEffect(() => {
        if (!isOpen) return;

        // Lock background body scroll
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (closeOnEsc && e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = originalStyle === 'hidden' ? '' : originalStyle;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left overflow-y-auto"
            onClick={closeOnClickOutside ? (e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            } : undefined}
            role="dialog"
            aria-modal="true"
        >
            {/* Modal Card */}
            <div 
                className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden flex flex-col max-h-[90vh] my-auto transition-all transform animate-scale-up ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={`p-6 sm:p-7 border-b border-slate-100 flex items-start justify-between bg-white shrink-0 relative ${headerClassName}`}>
                        <div className="flex items-center gap-3.5 pr-8">
                            {icon && (
                                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#0f5c50] flex items-center justify-center shrink-0 shadow-sm border border-teal-100/50">
                                    {icon}
                                </div>
                            )}
                            <div>
                                {title && (
                                    <h3 className="text-xl font-extrabold text-navy tracking-tight leading-snug">
                                        {title}
                                    </h3>
                                )}
                                {subtitle && (
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>

                        {showCloseButton && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                                aria-label="Tutup"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Scrollable Body Container */}
                <div className={`p-6 sm:p-7 overflow-y-auto no-scrollbar flex-1 text-slate-700 ${bodyClassName}`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
