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
    colorClass = "border-slate-50 text-slate-500",
    className = "",
}: StatsCardProps) {
    // Extract color for the icon, assuming standard tailwind classes or passed in specific logic
    // But simply applying the passed colorClass to the wrapper or specific elements is easier.

    return (
        <div className={`glass p-6 rounded-3xl premium-shadow bg-white ${colorClass} ${className}`}>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <div className="text-3xl font-black text-slate-900 mt-1">
                {value} {unit && <span className="text-xs font-normal text-slate-400">{unit}</span>}
            </div>
            {subtitle && (
                <div className={`text-xs font-bold mt-2 flex items-center gap-1`}>
                    {icon && <i className={`${icon} mr-1`}></i>}
                    {subtitle}
                </div>
            )}
        </div>
    );
}
