import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
    const modalRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        // Lock background body scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Auto focus first interactive input / button or modal container
        const focusTimer = setTimeout(() => {
            if (modalRef.current) {
                const focusable = modalRef.current.querySelector(
                    'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([aria-label="Tutup"]), [href], [tabindex]:not([tabindex="-1"])'
                );
                if (focusable) {
                    focusable.focus();
                } else {
                    modalRef.current.focus();
                }
            }
        }, 50);

        const handleKeyDown = (e) => {
            if (closeOnEsc && e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(focusTimer);
            document.body.style.overflow = originalOverflow;
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEsc, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-left overflow-y-auto"
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
                ref={modalRef}
                tabIndex={-1}
                className={`relative w-full ${maxWidth} bg-white rounded-3xl shadow-2xl border border-slate-100/80 overflow-hidden flex flex-col max-h-[90vh] m-auto transition-all transform animate-scale-up outline-none ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={`p-5 sm:p-7 border-b border-slate-100 flex items-start justify-between bg-white shrink-0 relative ${headerClassName}`}>
                        <div className="flex items-center gap-3.5 pr-8">
                            {icon && (
                                <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#0f5c50] flex items-center justify-center shrink-0 shadow-sm border border-teal-100/50">
                                    {icon}
                                </div>
                            )}
                            <div>
                                {title && (
                                    <h3 className="text-lg sm:text-xl font-extrabold text-navy tracking-tight leading-snug">
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
                                className="absolute top-5 sm:top-6 right-5 sm:right-6 p-2 rounded-full text-slate-400 hover:text-navy hover:bg-slate-100 transition-colors cursor-pointer"
                                aria-label="Tutup"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Scrollable Body Container */}
                <div className={`p-5 sm:p-7 overflow-y-auto no-scrollbar flex-1 text-slate-700 ${bodyClassName}`}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
