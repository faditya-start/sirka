import React from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    unit?: string;
    subtitle?: React.ReactNode;
    icon?: string;
    colorClass?: string; // e.g., "border-emerald-50 text-emerald-500"
    className?: string;
}

export default function StatsCard({
    title,
    value,
    unit,
    subtitle,
    icon,
    colorClass = "border-slate-50",
    className = "",
}: StatsCardProps) {
    return (
        <div className={`glass p-6 rounded-3xl premium-shadow bg-white border-2 ${colorClass} ${className} relative overflow-hidden transition-all hover:scale-[1.02] duration-300`}>
            <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{title}</p>
                {icon && (
                    <div className={`p-2 rounded-xl bg-opacity-10 ${colorClass.replace('border-', 'bg-').replace('-50', '-500')} ${colorClass.replace('border-', 'text-').replace('-50', '-600')}`}>
                        <i className={`${icon} text-xl`}></i>
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {value}
                </span>
                {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
            </div>

            {subtitle && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-xs font-bold flex items-center gap-1.5 opacity-90">
                        {subtitle}
                    </div>
                </div>
            )}
        </div>
    );
}
