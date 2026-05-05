interface StatsCardProps {
    title: string;
    value: string;
    detail: string;
}

export const StatsCard = ({ title, value, detail }: StatsCardProps) => {
    return (
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-1">{title}</p>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            <p className="text-emerald-400 text-xs font-medium">{detail}</p>
        </div>
    );
};