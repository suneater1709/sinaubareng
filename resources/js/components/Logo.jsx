import React from 'react';

export default function Logo({ size = 'md', className = '', showText = true, textColor = 'text-navy', subtitle = null }) {
    const sizeMap = {
        sm: { icon: 'w-7 h-7', text: 'text-lg', sSize: 'text-sm' },
        md: { icon: 'w-8 h-8', text: 'text-2xl', sSize: 'text-base' },
        lg: { icon: 'w-10 h-10', text: 'text-2xl', sSize: 'text-lg' }
    };

    const currentSize = sizeMap[size] || sizeMap.md;

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            {/* Vector Brand Icon that never breaks */}
            <div className={`${currentSize.icon} rounded-xl bg-gradient-to-br from-[#0f5c50] to-[#00c49a] flex items-center justify-center shadow-sm shrink-0 relative overflow-hidden`}>
                <span className={`font-black text-white ${currentSize.sSize} font-sans leading-none tracking-tighter`}>S</span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#f5a623]"></span>
            </div>

            {showText && (
                <div className="text-left">
                    <span className={`font-extrabold ${textColor} ${currentSize.text} tracking-tight font-sans leading-none block`}>
                        stugether
                    </span>
                    {subtitle && (
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block mt-0.5 uppercase">
                            {subtitle}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
