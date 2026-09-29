import React, { useRef, useLayoutEffect } from 'react';

export default function PopIn({
    children,
    index = 0,
    delayStep = 80,
    className = '',
    as: Component = 'div',
    ...props
}) {
    const elRef = useRef(null);

    useLayoutEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const delay = index * delayStep;

        const anim = el.animate(
            [
                { opacity: 0, transform: 'scale(0.5) translateY(16px)' },
                { opacity: 1, transform: 'scale(1) translateY(0px)' }
            ],
            {
                duration: 520,
                delay: delay,
                easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Bouncy spring pop
                fill: 'backwards'
            }
        );

        return () => {
            try {
                anim.cancel();
            } catch (_) {}
        };
    }, [index, delayStep]);

    return (
        <Component
            ref={elRef}
            data-pop-index={index}
            className={`will-change-[transform,opacity] ${className}`}
            {...props}
        >
            {children}
        </Component>
    );
}
