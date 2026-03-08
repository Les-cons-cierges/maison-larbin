import { useState, useEffect } from "react";

const heroImg = "/image_homepage.jpg";


const stats = [
    { label: "Entreprises", value: "PME & ETI" },
    { label: "Secteur", value: "Tertiaire" },
    { label: "Support", value: "24/7" },
];

export default function HeroSection() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <section className="min-h-screen bg-white flex items-center px-8 md:px-16 py-20">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* LEFT — Content */}
                <div
                    className="flex flex-col gap-8 transition-all duration-700 ease-out"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(24px)",
                    }}
                >
                    {/* Heading */}
                    <h1
                        className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-bleu"
                    >
                        La conciergerie
                        <br />
                        <span className="italic font-black">de vos envies</span>
                    </h1>

                    {/* Description */}
                    <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                        Maison Larbin centralise services du quotidien, organisation
                        professionnelle et assistance premium pour libérer du temps à vos
                        collaborateurs et dirigeants.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <a href="/register" className="bg-bleu text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors duration-200 shadow-sm">
                            Essayer
                        </a>
                        <a href="#cards" className="border border-gray-300 text-black text-sm font-semibold px-7 py-3.5 rounded-full hover:border-bleu transition-colors duration-200">
                            Voir les tarifs
                        </a>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-200" />

                    {/* Stats */}
                    <div className="flex gap-10">
                        {stats.map((s) => (
                            <div key={s.label} className="flex flex-col gap-0.5">
                                <span className="text-xs text-gray-400 tracking-wide">{s.label}</span>
                                <span className="text-base font-bold text-black">{s.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Image placeholder */}
                <div
                    className="transition-all duration-700 ease-out delay-200"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(24px)",
                    }}
                >
                    <div className="w-full aspect-4/5 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-300 text-sm">
                        {/* Replace with <img src="..." alt="..." className="w-full h-full object-cover rounded-3xl" /> */}
                        <img className="container rounded-3xl" src={heroImg} alt="Maison Larbin"/>
                    </div>
                </div>

            </div>
        </section>
    );
}
