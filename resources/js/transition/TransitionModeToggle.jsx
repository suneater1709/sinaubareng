import React from 'react';
import { usePageTransition } from './usePageTransition';
import { Sparkles, Layers } from 'lucide-react';

export default function TransitionModeToggle({ className = '' }) {
    const { transitionMode, setTransitionMode, isBusy } = usePageTransition();

    return (
        <div className={`inline-flex items-center gap-1 p-1 bg-surface-container/90 backdrop-blur-md rounded-full border border-surface-container-high shadow-xs ${className}`}>
            <button
                type="button"
                disabled={isBusy}
                onClick={() => setTransitionMode('bubble')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transitionMode === 'bubble'
                        ? 'bg-primary text-on-primary shadow-xs scale-105'
                        : 'text-on-surface-variant hover:text-navy'
                }`}
                title="Gaya Bubble: Lingkaran meletup dari titik klik"
            >
                <Sparkles className="w-3 h-3" />
                <span>Bubble</span>
            </button>

            <button
                type="button"
                disabled={isBusy}
                onClick={() => setTransitionMode('card')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    transitionMode === 'card'
                        ? 'bg-tertiary text-on-tertiary shadow-xs scale-105'
                        : 'text-on-surface-variant hover:text-navy'
                }`}
                title="Gaya Card: Halaman baru melompat & membal dari titik klik"
            >
                <Layers className="w-3 h-3" />
                <span>Card</span>
            </button>
        </div>
    );
}
