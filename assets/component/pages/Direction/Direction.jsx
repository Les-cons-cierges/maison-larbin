import { useState, useEffect } from "react";

const Direction = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section
            className="mt-[55px] min-h-[340px] bg-gray-950 flex items-center px-8 md:px-16 py-16 relative overflow-hidden"
        >
            {/* Fond radial rouge subtil */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: "radial-gradient(ellipse at 60% 50%, rgba(185,28,28,0.18) 0%, transparent 70%)" }}
            />

            <div
                className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 transition-all duration-700 ease-out"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(24px)",
                }}
            >
                {/* Icône pulsante */}
                <div className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-full bg-bordeau-direction shadow-lg relative">
                    <span className="absolute inline-flex w-full h-full rounded-full bg-bordeau-direction opacity-40 animate-ping" />
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.9 1.368l.878 2.635a2 2 0 01-.45 2.05l-.927.927a16.014 16.014 0 006.32 6.32l.927-.927a2 2 0 012.05-.45l2.635.878A2 2 0 0121 17.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z" />
                    </svg>
                </div>

                {/* Contenu texte */}
                <div className="flex flex-col gap-4 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-bordeau-direction animate-pulse" />
                        <span className="text-red-400 text-xs font-semibold uppercase tracking-widest">
                            Assistance 24h/24 — 7j/7
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white leading-tight tracking-tight">
                        Appel d'urgence
                        <br />
                        <span className="text-red-500 italic">Maison Larbin</span>
                    </h1>

                    <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                        En cas de situation critique, votre équipe dédiée est disponible immédiatement.
                        Un conseiller prend votre appel en moins de 60 secondes.
                    </p>

                    {/* Badges */}
                    <div className="flex gap-3 flex-wrap mt-1">
                        {["Réponse < 60s", "Priorité dirigeants", "Confidentiel"].map((badge) => (
                            <span key={badge} className="text-xs font-medium text-gray-300 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bouton d'appel */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <a
                        href="tel:+33788223144"
                        className="flex items-center gap-3 bg-bordeau-direction hover:bg-bordeau-direction active:scale-95 transition-all duration-200 text-white font-bold text-xl px-8 py-5 rounded-2xl shadow-xl shadow-red-900/40"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a2 2 0 011.9 1.368l.878 2.635a2 2 0 01-.45 2.05l-.927.927a16.014 16.014 0 006.32 6.32l.927-.927a2 2 0 012.05-.45l2.635.878A2 2 0 0121 17.72V20a2 2 0 01-2 2h-1C9.163 22 2 14.837 2 6V5z" />
                        </svg>
                        07 88 22 31 44
                    </a>
                    <span className="text-gray-500 text-xs">Appel direct — gratuit</span>
                </div>
            </div>
        </section>
    );
};

export default Direction;

