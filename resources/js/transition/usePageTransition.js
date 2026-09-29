import { useContext } from 'react';
import { PageTransitionContext } from './PageTransitionContext';

export function usePageTransition() {
    const context = useContext(PageTransitionContext);
    if (!context) {
        throw new Error('usePageTransition harus digunakan di dalam <PageTransitionProvider>');
    }
    return context;
}
