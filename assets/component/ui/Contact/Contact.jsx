import { useState, useEffect, useRef } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
);

const IconPhone = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

const IconMapPin = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/>
        <circle cx="12" cy="10" r="3"/>
    </svg>
);

const IconSend = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m22 2-7 20-4-9-9-4Z"/>
        <path d="M22 2 11 13"/>
    </svg>
);

const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

// ─── Info Item ────────────────────────────────────────────────────────────────

function InfoItem({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 mt-0.5">
                <Icon />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className="text-xs text-white/50 tracking-wide uppercase">{label}</span>
                <span className="text-sm font-semibold text-white">{value}</span>
            </div>
        </div>
    );
}

// ─── Contact Section ──────────────────────────────────────────────────────────

export default function ContactSection() {
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

    const sectionRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        const obs1 = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        const obs2 = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setFormVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) obs1.observe(sectionRef.current);
        if (formRef.current) obs2.observe(formRef.current);
        return () => { obs1.disconnect(); obs2.disconnect(); };
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simule un envoi — remplacer par un vrai fetch vers l'API Symfony
        await new Promise((r) => setTimeout(r, 1200));
        setLoading(false);
        setSent(true);
    };

    return (
        <section id="contact" className="bg-white py-24 px-8 md:px-16">
            <div className="max-w-6xl mx-auto flex flex-col gap-16">

                {/* ── Header ── */}
                <div
                    ref={sectionRef}
                    className="text-center flex flex-col gap-4"
                    style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(16px)",
                        transition: "opacity 0.6s ease, transform 0.6s ease",
                    }}
                >
                    <p className="text-xs font-semibold tracking-widest uppercase text-bleu">
                        Nous contacter
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-black">
                        Une question ? Un projet ?
                    </h2>
                    <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
                        Notre équipe est à votre disposition pour répondre à toutes vos
                        demandes dans les meilleurs délais.
                    </p>
                </div>

                {/* ── Body ── */}
                <div
                    ref={formRef}
                    className="grid grid-cols-1 md:grid-cols-5 gap-8"
                    style={{
                        opacity: formVisible ? 1 : 0,
                        transform: formVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
                    }}
                >
                    {/* ── Left — Infos ── */}
                    <div className="md:col-span-2 bg-bleu rounded-3xl p-8 flex flex-col justify-between gap-10">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold text-white">Maison Larbin</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Conciergerie d'entreprise premium — à votre service au quotidien.
                                </p>
                            </div>
                            <div className="flex flex-col gap-6">
                                <InfoItem icon={IconMail}   label="Email"    value="contact@maisonlarbin.fr" />
                                <InfoItem icon={IconPhone}  label="Téléphone" value="+33 2 35 65 65 65" />
                                <InfoItem icon={IconMapPin} label="Adresse"  value="Rouen, Normandie" />
                            </div>
                        </div>

                        {/* Decorative circles */}
                        <div className="relative h-24 overflow-hidden rounded-2xl opacity-10 pointer-events-none">
                            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border-2 border-white"/>
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-2 border-white"/>
                        </div>
                    </div>

                    {/* ── Right — Form ── */}
                    <div className="md:col-span-3 bg-gray-50 rounded-3xl p-8 flex flex-col justify-center">
                        {sent ? (
                            <div className="flex flex-col items-center gap-4 py-10 text-center">
                                <div className="w-14 h-14 bg-bleu rounded-full flex items-center justify-center text-white">
                                    <IconCheck />
                                </div>
                                <h3 className="text-xl font-bold text-black">Message envoyé !</h3>
                                <p className="text-sm text-gray-400 max-w-xs">
                                    Merci pour votre message. Nous vous répondrons dans les
                                    meilleurs délais.
                                </p>
                                <button
                                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                                    className="mt-2 text-sm font-semibold text-bleu underline underline-offset-4 hover:opacity-70 transition-opacity"
                                >
                                    Envoyer un autre message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                {/* Name + Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 tracking-wide">
                                            Nom complet <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Jean Dupont"
                                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bleu/30 focus:border-bleu transition"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 tracking-wide">
                                            Email <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="jean@entreprise.fr"
                                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bleu/30 focus:border-bleu transition"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-500 tracking-wide">
                                        Sujet <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        required
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="Demande d'information sur les offres"
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bleu/30 focus:border-bleu transition"
                                    />
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-gray-500 tracking-wide">
                                        Message <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Décrivez votre besoin..."
                                        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-bleu/30 focus:border-bleu transition resize-none"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="self-end flex items-center gap-2.5 bg-bleu text-white text-sm font-semibold px-7 py-3.5 rounded-full hover:bg-gray-900 transition-colors duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                            Envoi en cours…
                                        </>
                                    ) : (
                                        <>
                                            <IconSend />
                                            Envoyer le message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

