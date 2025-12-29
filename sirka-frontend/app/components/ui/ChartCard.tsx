import React, { ReactNode } from "react";

interface ChartCardProps {
    title: string;
    icon?: string;
    iconColorClass?: string;
    children: ReactNode;
    className?: string;
}

export default function ChartCard({
    title,
    icon,
    iconColorClass = "text-emerald-500",
    children,
    className = "",
}: ChartCardProps) {
    return (
        <div className={`glass p-6 rounded-3xl premium-shadow bg-white ${className}`}>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                {icon && <i className={`${icon} ${iconColorClass}`}></i>} {title}
            </h3>
            <div className="h-64">
                {children}
            </div>
        </div>
    );
}
