import { useState, useEffect, useRef } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconClock = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z"/>
        <polyline points="12 7 12 12 9 15"/>
        <path d="M7.5 4.5 6 3"/>
    </svg>
);

const IconBolt = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
);

const IconTrend = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
    </svg>
);

const IconPin = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
    </svg>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className="bg-white rounded-2xl p-7 flex flex-col gap-5 shadow-sm"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
            }}
        >
            {/* Icon badge */}
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-black">
                <Icon />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-black">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

// ─── Features Section ─────────────────────────────────────────────────────────

const features = [
    {
        icon: IconClock,
        title: "Gain de temps",
        description: "Libérez du temps pour vos collaborateurs et dirigeants sur les tâches logistiques",
    },
    {
        icon: IconBolt,
        title: "Efficacité",
        description: "Optimisez l'organisation interne de votre entreprise",
    },
    {
        icon: IconTrend,
        title: "Attractivité",
        description: "Différenciez-vous avec un avantage social moderne et innovant",
    },
    {
        icon: IconPin,
        title: "Local",
        description: "Soutenez l'économie locale via nos partenaires de proximité",
    },
];

export default function FeaturesSection() {
    const [headerVisible, setHeaderVisible] = useState(false);
    const headerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
            { threshold: 0.2 }
        );
        if (headerRef.current) observer.observe(headerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-bleu py-24 px-8 md:px-16">
            <div className="max-w-4xl mx-auto flex flex-col gap-14">

                {/* Header */}
                <div
                    ref={headerRef}
                    className="text-center flex flex-col gap-4"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(16px)",
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                    }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Pourquoi choisir maison larbin ?
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
                        Une solution complète pour améliorer la qualité de vie au travail
                        et l'efficacité de votre organisation
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">
                    {features.map((f, i) => (
                        <FeatureCard
                            key={f.title}
                            icon={f.icon}
                            title={f.title}
                            description={f.description}
                            delay={i * 100}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}
