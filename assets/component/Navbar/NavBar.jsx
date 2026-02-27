import { useState, useEffect } from 'react';
import logo from '../../img/logo2.png';
import './Navbar.css';
import '../../styles/app.css';

const NavBar = () => {
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
        <nav className="shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
            <div className="flex justify-between items-center px-12 py-2 p-8">

                {/* Logo */}
                <div>
                    <img src={logo} alt="logo" className="w-28" />
                </div>

                {/* Menu principal — caché sur mobile */}
                <div className="hidden md:flex">
                    <ul className="flex gap-6 list-none">
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Services</a></li>
                        <li><a href="#" className="hover:opacity-75 transition-opacity">À propos</a></li>
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Contact</a></li>
                    </ul>
                </div>

                {/* Auth + hamburger */}
                <div className="flex items-center gap-4">
                    {/* Liens auth — cachés sur mobile */}
                    <ul className="hidden md:flex gap-4 list-none items-center">
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Se connecter</a></li>
                        <li>
                            <a href="#" className="bg-black text-white rounded-lg px-4 p-2 hover:opacity-80 transition-opacity">
                                S'inscrire
                            </a>
                        </li>
                    </ul>

                    {/* Hamburger librairie — visible sur mobile uniquement */}
                    <div className="max-lg:hidden" onClick={() => setIsOpen(!isOpen)}>
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
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Services</a></li>
                        <li><a href="#" className="hover:opacity-75 transition-opacity">À propos</a></li>
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Contact</a></li>
                    </ul>
                    <ul className="flex flex-col gap-3 list-none">
                        <li><a href="#" className="hover:opacity-75 transition-opacity">Se connecter</a></li>
                        <li>
                            <a href="#" className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:opacity-80 transition-opacity">S'inscrire</a>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default NavBar;
