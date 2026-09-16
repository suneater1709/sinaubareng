import React, { useState } from 'react';

export default function Logo({ size = 'md', className = '', showText = true, textColor = 'text-navy', subtitle = null }) {
    const sizeMap = {
        sm: { img: 'w-8 h-8', text: 'text-lg', fallbackText: 'text-sm' },
        md: { img: 'w-9 h-9', text: 'text-2xl', fallbackText: 'text-base' },
        lg: { img: 'w-11 h-11', text: 'text-2xl', fallbackText: 'text-lg' },
        xl: { img: 'w-14 h-14', text: 'text-3xl', fallbackText: 'text-xl' }
    };

    const currentSize = sizeMap[size] || sizeMap.md;
    const [imgError, setImgError] = useState(false);

    return (
        <div className={`flex items-center gap-2.5 select-none ${className}`}>
            {/* Official stugether.png Logo */}
            <div className={`${currentSize.img} rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center shrink-0 border border-slate-100 p-0.5`}>
                {!imgError ? (
                    <img 
                        src="/stugether.png" 
                        alt="stugether" 
                        className="w-full h-full object-contain"
                        onError={() => setImgError(true)} 
                    />
                ) : (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#0f5c50] to-[#00c49a] flex items-center justify-center text-white font-black">
                        <span className={currentSize.fallbackText}>S</span>
                    </div>
                )}
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
