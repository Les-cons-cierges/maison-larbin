import {useEffect, useRef, useState} from 'react';
import '../../../styles/app.css';

const logo = '/logo2.png';

const NavBar = ({user}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const isEmploye = Array.isArray(user?.roles) && user.roles.includes('ROLE_EMPLOYE');
    const isCadre = Array.isArray(user?.roles) && user.roles.includes('ROLE_CADRE');
    const isDirection = Array.isArray(user?.roles) && user.roles.includes('ROLE_DIRECTION');
    const isAdminEntreprise = Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN');
    const isMaisonLarbinAdmin = Array.isArray(user?.roles) && user.roles.includes('ROLE_ADMIN_STAFF');

    useEffect(() => {
        const hamburgers = document.querySelectorAll(".hamburger");
        hamburgers.forEach((hamburger) => {
            hamburger.addEventListener("click", function () {
                this.classList.toggle("is-active");
            });
        });
        return () => {
            hamburgers.forEach((hamburger) => {
                hamburger.replaceWith(hamburger.cloneNode(true));
            });
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    return (
        <nav
            className="shadow-[0_2px_10px_rgba(0,0,0,0.15)] fixed w-[100%] z-10000 bg-white top-0 right-0 left-0">
            <div className="flex justify-between items-center px-12 py-2">

                {/* Logo */}
                <div>
                    <a href="/">
                        <img src={logo} alt="logo" className="w-28"/>
                    </a>
                </div>

                {/* Menu principal — caché sur mobile */}
                <div className=" max-lg:hidden">
                    <ul className="flex gap-6 list-none">
                        <li><a href="/" className="hover:opacity-75 transition-opacity text-bleu">Accueil</a></li>
                        <li><a href="/#cards" className="hover:opacity-75 transition-opacity text-bleu">Services</a>
                        </li>
                        <li><a href="/#about" className="hover:opacity-75 transition-opacity text-bleu">À propos</a>
                        </li>
                        <li><a href="/#contact" className="hover:opacity-75 transition-opacity text-bleu">Contact</a>
                        </li>
                    </ul>
                </div>

                {/* Auth + hamburger */}
                <div className="flex items-center gap-4">
                    {/* Liens auth — cachés sur mobile */}
                    <ul className="max-lg:hidden flex gap-4 list-none items-center">
                        {user ? (
                            <li className="relative" ref={userMenuRef}>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 text-bleu hover:opacity-75 transition-opacity"
                                    aria-haspopup="menu"
                                    aria-expanded={isUserMenuOpen}
                                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                >
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.fullName}
                                        className="w-8 h-8 rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "/uploads/avatars/default-avatar.png";
                                        }}
                                    />
                                    <span>{user.fullName}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg p-2 z-50">

                                        <a href="/profil"
                                           className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                            Mon profil
                                        </a>

                                        {isEmploye && (
                                            <a href="/maps"
                                               className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                Autour de moi
                                            </a>
                                        )}

                                        {isCadre && (
                                            <>
                                                <a href="/requete/nouvelle"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Nouvelle demande
                                                </a>
                                                <a href="/maps"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Autour de moi
                                                </a>
                                            </>
                                        )}

                                        {isDirection && (
                                            <>
                                                <a href="/requete/nouvelle"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Nouvelle demande
                                                </a>
                                                <a href="/maps"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Autour de moi
                                                </a>
                                            </>
                                        )}

                                        {isAdminEntreprise && (
                                            <>
                                                <a href="/requete/nouvelle"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Nouvelle demande
                                                </a>
                                                <a href="/maps"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Autour de moi
                                                </a>
                                                <a href="/adminClient"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Dashborad Entreprise
                                                </a>
                                            </>
                                        )}

                                        {isMaisonLarbinAdmin && (
                                            <>
                                                <a href="/requete/nouvelle"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Nouvelle demande
                                                </a>
                                                <a href="/maps"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Autour de moi
                                                </a>
                                                <a href="/maison-larbin/admin"
                                                   className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700">
                                                    Dashborad SuperAdmin
                                                </a>
                                            </>
                                        )}

                                        <form method="post" action="/logout">
                                            <button
                                                type="submit"
                                                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-red-600"
                                            >
                                                Se déconnecter
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </li>
                        ) : (
                            <>
                                <li><a href="/login" className="hover:opacity-75 transition-opacity text-bleu">Se
                                    connecter</a></li>
                                <li>
                                    <a href="/register"
                                       className="bg-bleu text-white rounded-lg px-4 p-2 hover:opacity-80 transition-opacity">
                                        S'inscrire
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Hamburger librairie — visible sur mobile uniquement */}
                    <div className="min-lg:hidden" onClick={() => {
                        setIsOpen(!isOpen);
                        setIsUserMenuOpen(false);
                    }}>
                        <div className="hamburger hamburger--3dx">
                            <div className="hamburger-box">
                                <div className="hamburger-inner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu mobile déroulant */}
            {isOpen && (
                <div className="px-12 pb-4 flex flex-col gap-4">
                    <ul className="flex flex-col gap-5 list-none mt-5">
                        <li><a href="/" className="hover:opacity-75 transition-opacity">Accueil</a></li>
                        <li><a href="/#cards" className="hover:opacity-75 transition-opacity">Services</a></li>
                        <li><a href="/#about" className="hover:opacity-75 transition-opacity">À propos</a></li>
                        <li><a href="/#contact" className="hover:opacity-75 transition-opacity">Contact</a></li>
                    </ul>
                    <ul className="flex flex-col gap-5 list-none">
                        {user ? (
                            <>
                                <li>
                                    <a href="/profil"
                                       className="flex items-center gap-2 hover:opacity-75 transition-opacity">
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.fullName}
                                            className="w-8 h-8 rounded-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "/uploads/avatars/default-avatar.png";
                                            }}
                                        />
                                        <span>{user.fullName}</span>
                                    </a>
                                </li>
                                <hr/>

                                {isEmploye && (
                                    <li><a href="/maps" className="hover:opacity-75 transition-opacity px-4 py-2">Maps</a></li>
                                )}

                                {isCadre && (
                                    <>
                                        <li><a href="/maps"
                                               className="hover:opacity-75 transition-opacity px-4 py-2">Autour de moi</a></li>
                                        <li>
                                            <a href="/requete/nouvelle"
                                               className="hover:opacity-75 transition-opacity px-4 py-2">
                                                Nouvelle demande
                                            </a>
                                        </li>
                                    </>
                                )}

                                {isDirection && (
                                    <>
                                        <li><a href="/maps"
                                               className="hover:opacity-75 transition-opacity px-4 py-2">Autour de moi</a></li>
                                        <li>
                                            <a href="/requete/nouvelle"
                                               className="hover:opacity-75 transition-opacity px-4 py-2">
                                                Nouvelle demande
                                            </a>
                                        </li>
                                    </>
                                )}

                                <li>
                                    <a
                                        href="/profil"
                                        className="hover:opacity-75 transition-opacity px-4 py-2"
                                    >
                                        Voir mon profil
                                    </a>
                                </li>
                                <li>
                                    <form method="post" action="/logout">
                                        <button
                                            type="submit"
                                            className="inline-block w-full text-left bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity"
                                        >
                                            Se déconnecter
                                        </button>
                                    </form>
                                </li>
                            </>
                        ) : (
                            <>
                                <li><a href="/login" className="hover:opacity-75 transition-opacity">Se connecter</a>
                                </li>
                                <li>
                                    <a href="/register"
                                       className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity">
                                        S'inscrire
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>

                </div>
            )}
        </nav>
    );
}

export default NavBar;
