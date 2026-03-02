const logo = "/logo2.png";

const Footer = () => {
    return (
        <footer className="bg-black text-white">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col px-6 py-10 md:px-10 md:py-12">
                {/* Haut */}
                <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
                    {/* Colonne 1 */}
                    <div className="md:w-[32%]">
                        <a href="/public" className="inline-block">
                            <img src={logo} alt="Maison Larbin" className="w-40 md:w-44" />
                        </a>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-100 md:text-lg">
                            Conciergerie d'entreprise pour améliorer la qualité de vie au travail.
                        </p>
                    </div>

                    {/* Colonne 2 */}
                    <div className="md:w-[18%] md:pt-8">
                        <ul className="space-y-2 text-lg leading-snug md:text-l">
                            <li><a href="/public" className="hover:opacity-80">Accueil</a></li>
                            <li><a href="/les-palliers" className="hover:opacity-80">Les palliers</a></li>
                            <li><a href="/services" className="hover:opacity-80">Nos services</a></li>
                            <li><a href="/abonnements" className="hover:opacity-80">Abonnements</a></li>
                        </ul>
                    </div>

                    {/* Colonne 3 */}
                    <div className="md:w-[22%] md:pt-8">
                        <h3 className="mb-2 text-l font-semibold md:text-xl">Contact</h3>
                        <ul className="space-y-2 text-lg leading-snug md:text-l">
                            <li>Maison Larbin</li>
                            <li>3 rue michel blanc,</li>
                            <li>76100 Rouen</li>
                            <li>02 35 65 65 65</li>
                        </ul>
                    </div>

                    {/* Colonne 4 */}
                    <div className="md:w-[22%] md:pt-8">
                        <h3 className="mb-2 text-xl font-semibold md:text-xl">Légal</h3>
                        <ul className="space-y-2 text-lg leading-snug md:text-l">
                            <li><a href="/mentions-legales" className="hover:opacity-80">Mentions légales</a></li>
                            <li><a href="/cgu" className="hover:opacity-80">CGU</a></li>
                            <li><a href="/confidentialite" className="hover:opacity-80">Politique de confidentialité</a></li>
                            <li><a href="/cookies" className="hover:opacity-80">Cookies</a></li>
                        </ul>
                    </div>
                </div>

                {/* Ligne */}
                <div className="my-8 h-px w-full bg-zinc-600" />

                {/* Bas */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <p className="text-sm text-zinc-100 md:text-base">
                        © 2026 Maison Larbin. Tous droits réservés.
                    </p>

                    <div className="flex items-center gap-5 text-zinc-400">
                        <a href="#" aria-label="LinkedIn" className="hover:text-white">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                                <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2C21 8.7 21 11.2 21 14.1V21h-4v-6c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V21H9V9h1Z" />
                            </svg>
                        </a>

                        <a href="#" aria-label="X (Twitter)" className="hover:text-white">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-current" aria-hidden="true">
                                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.4L6.4 22H3.3l7.3-8.4L1 2h6.3l4.3 5.8L18.9 2Zm-1.1 18h1.7L6.4 3.9H4.6L17.8 20Z" />
                            </svg>
                        </a>

                        <a href="mailto:contact@maisonlarbin.fr" aria-label="Email" className="hover:text-white">
                            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" aria-hidden="true">
                                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2" />
                                <path d="m4 7 8 6 8-6" strokeWidth="2" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
