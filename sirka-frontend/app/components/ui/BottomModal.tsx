import React, { ReactNode } from "react";

interface BottomModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    maxWidthClass?: string;
}

export default function BottomModal({
    isOpen,
    onClose,
    title,
    children,
    maxWidthClass = "max-w-lg",
}: BottomModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div
                className="absolute inset-0 z-0"
                onClick={onClose}
            ></div>
            <div className={`bg-white w-full ${maxWidthClass} rounded-t-[32px] sm:rounded-[32px] p-8 space-y-6 max-h-[90vh] overflow-y-auto premium-shadow relative z-10 animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300`}>
                <div className="flex items-center justify-between">
                    {title && <h2 className="text-2xl font-bold text-slate-900">{title}</h2>}
                    <button onClick={onClose} className="text-slate-400 text-2xl hover:text-slate-600 transition-colors">
                        <i className="lni lni-close"></i>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
