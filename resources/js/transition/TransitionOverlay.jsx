import React from 'react';
import { usePageTransition } from './usePageTransition';

export default function TransitionOverlay() {
    const { overlayRef } = usePageTransition();

    return (
        <div
            ref={overlayRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-[9999] opacity-0 will-change-[clip-path,opacity]"
            style={{
                clipPath: 'circle(0px at 50% 50%)',
                paddingTop: 'env(safe-area-inset-top)',
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}
        />
    );
}
