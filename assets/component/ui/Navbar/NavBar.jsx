import {useEffect, useState} from 'react';
const logo = '/logo2.png';
import '../../../styles/app.css';

const NavBar = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <nav className="shadow-[0_2px_10px_rgba(0,0,0,0.15)] relative z-10">
            <div className="flex justify-between items-center px-12 py-2 p-8">

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
                        <li><a href="/maps" className="hover:opacity-75 transition-opacity text-bleu">Maps</a></li>
                        <li><a href="/services" className="hover:opacity-75 transition-opacity text-bleu">Services</a></li>
                        <li><a href="/propos" className="hover:opacity-75 transition-opacity text-bleu">À propos</a></li>
                        <li><a href="/contact" className="hover:opacity-75 transition-opacity text-bleu">Contact</a></li>
                    </ul>
                </div>

                {/* Auth + hamburger */}
                <div className="flex items-center gap-4">
                    {/* Liens auth — cachés sur mobile */}
                    <ul className="max-lg:hidden flex gap-4 list-none items-center">
                        {user ? (
                            <li>
                                <a href="/profile" className="flex items-center gap-2 text-bleu hover:opacity-75 transition-opacity">
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
                        ) : (
                            <>
                                <li><a href="/login" className="hover:opacity-75 transition-opacity text-bleu">Se connecter</a></li>
                                <li>
                                    <a href="/register" className="bg-bleu text-white rounded-lg px-4 p-2 hover:opacity-80 transition-opacity">
                                        S'inscrire
                                    </a>
                                </li>
                            </>
                        )}
                    </ul>

                    {/* Hamburger librairie — visible sur mobile uniquement */}
                    <div className="min-lg:hidden" onClick={() => setIsOpen(!isOpen)}>
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
                    <ul className="flex flex-col gap-3 list-none">
                        <li><a href="/" className="hover:opacity-75 transition-opacity">Accueil</a></li>
                        <li><a href="/maps" className="hover:opacity-75 transition-opacity">Maps</a></li>
                        <li><a href="/services" className="hover:opacity-75 transition-opacity">Services</a></li>
                        <li><a href="/propos" className="hover:opacity-75 transition-opacity">À propos</a></li>
                        <li><a href="/contact" className="hover:opacity-75 transition-opacity">Contact</a></li>
                    </ul>
                    <ul className="flex flex-col gap-3 list-none">
                        {user ? (
                            <li>
                                <a href="/profile" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
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
                        ) : (
                            <>
                                <li><a href="/login" className="hover:opacity-75 transition-opacity">Se connecter</a></li>
                                <li>
                                    <a href="/register" className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity">
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
