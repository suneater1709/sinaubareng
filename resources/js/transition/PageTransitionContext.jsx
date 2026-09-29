import React, { createContext, useState, useRef, useCallback, useEffect } from 'react';

export const PageTransitionContext = createContext(null);

// Warna tema resmi Sinaubareng
export const ROUTE_COLORS = {
    beranda: '#00544b',         // Primary Teal
    'jalur-belajar': '#442ebd',    // Tertiary Violet / Purple
    karya: '#0D102F',           // Navy
    biaya: '#F2A227',           // Vibrant Orange / Secondary
    kontak: '#116e63',          // Teal Container
    auth: '#0D102F',            // Navy
    register: '#00544b',        // Primary Teal
    dashboard: '#00544b',       // Primary Teal
    default: '#00544b'
};

export function PageTransitionProvider({ children, currentRoute, onNavigate }) {
    const [isBusy, setIsBusy] = useState(false);

    // Refs untuk DOM overlay, status tracking, dan animasi aktif
    const isBusyRef = useRef(false);
    const overlayRef = useRef(null);
    const pageContainerRef = useRef(null);
    const activeAnimationsRef = useRef(new Set());
    const isMountedRef = useRef(true);

    // Bersihkan animasi saat unmount untuk mencegah memory leak
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            activeAnimationsRef.current.forEach(anim => {
                try { anim.cancel(); } catch (_) {}
            });
            activeAnimationsRef.current.clear();
        };
    }, []);

    // Helper Web Animations API dengan Promise tracking
    const runAnimation = useCallback((element, keyframes, options) => {
        if (!element) return Promise.resolve();
        const anim = element.animate(keyframes, options);
        activeAnimationsRef.current.add(anim);

        return anim.finished
            .then(() => {
                activeAnimationsRef.current.delete(anim);
            })
            .catch((err) => {
                activeAnimationsRef.current.delete(anim);
                if (err.name !== 'AbortError') {
                    // Abaikan abort error normal
                }
            });
    }, []);

    // Fokuskan halaman baru ke <h1> atau <main> untuk aksesibilitas
    const focusNewPage = useCallback(() => {
        requestAnimationFrame(() => {
            const headingOrMain = document.querySelector('main h1, h1, main, [data-page-title]');
            if (headingOrMain) {
                if (!headingOrMain.hasAttribute('tabindex')) {
                    headingOrMain.setAttribute('tabindex', '-1');
                }
                headingOrMain.focus({ preventScroll: true });
            }
        });
    }, []);

    // Fungsi utama perpindahan halaman (Bubble Pop Effect)
    const transitionTo = useCallback(async (targetRoute, origin = {}) => {
        if (isBusyRef.current || targetRoute === currentRoute) return;

        // Hormati preferensi reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            onNavigate(targetRoute);
            focusNewPage();
            return;
        }

        // Kunci navigasi agar klik ganda tidak menumpuk
        isBusyRef.current = true;
        setIsBusy(true);

        const x = typeof origin.x === 'number' ? origin.x : window.innerWidth / 2;
        const y = typeof origin.y === 'number' ? origin.y : window.innerHeight / 2;
        const targetColor = origin.color || ROUTE_COLORS[targetRoute] || ROUTE_COLORS.default;

        try {
            // ================= GAYA BUBBLE POP =================
            const maxRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
            );

            const overlay = overlayRef.current;
            if (overlay) {
                overlay.style.backgroundColor = targetColor;
                overlay.style.opacity = '1';

                // 1. Lingkaran membesar dari titik klik menutup layar (±550ms, cubic-bezier(.7,0,.3,1))
                await runAnimation(
                    overlay,
                    [
                        { clipPath: `circle(0px at ${x}px ${y}px)` },
                        { clipPath: `circle(${maxRadius + 30}px at ${x}px ${y}px)` }
                    ],
                    {
                        duration: 550,
                        easing: 'cubic-bezier(0.7, 0, 0.3, 1)',
                        fill: 'forwards'
                    }
                );

                // 2. Ganti route saat layar tertutup
                onNavigate(targetRoute);
                window.scrollTo({ top: 0, behavior: 'instant' });

                // 3. Lingkaran menyusut kembali ke titik klik yang sama
                await runAnimation(
                    overlay,
                    [
                        { clipPath: `circle(${maxRadius + 30}px at ${x}px ${y}px)` },
                        { clipPath: `circle(0px at ${x}px ${y}px)` }
                    ],
                    {
                        duration: 500,
                        easing: 'cubic-bezier(0.7, 0, 0.3, 1)',
                        fill: 'forwards'
                    }
                );

                overlay.style.opacity = '0';
            } else {
                onNavigate(targetRoute);
            }

            focusNewPage();
        } catch (err) {
            console.error('Page transition error:', err);
            onNavigate(targetRoute);
        } finally {
            if (isMountedRef.current) {
                isBusyRef.current = false;
                setIsBusy(false);
            }
        }
    }, [currentRoute, onNavigate, runAnimation, focusNewPage]);

    return (
        <PageTransitionContext.Provider
            value={{
                transitionMode: 'bubble',
                isBusy,
                transitionTo,
                overlayRef,
                pageContainerRef
            }}
        >
            {children}
        </PageTransitionContext.Provider>
    );
}
