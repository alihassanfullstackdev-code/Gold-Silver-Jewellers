interface TopHeaderProps {
    onLogout: () => void;
}

export const TopHeader = ({ onLogout }: TopHeaderProps) => {
    return (
        <header className="p-8 flex justify-between items-center border-b border-white/5 bg-slate-900/20">
            <div>
                <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
                <p className="text-slate-400 text-sm">Welcome back, Admin.</p>
            </div>
            <button
                onClick={onLogout}
                className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-medium"
            >
                Logout
            </button>
        </header>
    );
};