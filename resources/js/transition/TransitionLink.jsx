import React, { useRef } from 'react';
import { usePageTransition } from './usePageTransition';

export default function TransitionLink({
    to,
    targetColor,
    children,
    className = '',
    activeClassName = '',
    currentRoute,
    onClick,
    ...props
}) {
    const { transitionTo, isBusy } = usePageTransition();
    const linkRef = useRef(null);

    const isActive = currentRoute === to;

    const handleClick = (e) => {
        // Jangan interupsi jika pengguna membuka di tab baru (Ctrl/Cmd, Shift, Alt, Klik Tengah)
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) {
            return;
        }

        e.preventDefault();
        if (isBusy) return;

        if (onClick) {
            onClick(e);
        }

        let originCoords = { x: 0, y: 0, color: targetColor };

        // Jika klik mouse asli (clientX/Y != 0)
        if (e.clientX !== 0 || e.clientY !== 0) {
            originCoords.x = e.clientX;
            originCoords.y = e.clientY;
        } else if (linkRef.current) {
            // Jika navigasi keyboard (Enter/Space), pakai titik tengah elemen
            const rect = linkRef.current.getBoundingClientRect();
            originCoords.x = rect.left + rect.width / 2;
            originCoords.y = rect.top + rect.height / 2;
        }

        transitionTo(to, originCoords);
    };

    return (
        <a
            ref={linkRef}
            href={`#/${to}`}
            onClick={handleClick}
            aria-current={isActive ? 'page' : undefined}
            className={`transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className} ${
                isActive ? activeClassName : ''
            }`}
            {...props}
        >
            {children}
        </a>
    );
}
