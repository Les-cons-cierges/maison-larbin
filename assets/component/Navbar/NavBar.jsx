import {useEffect} from 'react';
import logo from '../../img/logo2.png';
import './Navbar.css';
import '../../styles/app.css';

const NavBar = () => {
    useEffect(() => {
        const hamburgers = document.querySelectorAll(".hamburger");

        hamburgers.forEach((hamburger) => {
            hamburger.addEventListener("click", function () {
                this.classList.toggle("is-active");
            });
        });// Nettoyage des événements quand le composant est démonté
        return () => {
            hamburgers.forEach((hamburger) => {
                hamburger.replaceWith(hamburger.cloneNode(true));
            });
        };
    }, []); // [] = s'exécute une seule fois après le premier rendu

    return (
        <nav>
            <div className="navbar">
                <div>
                    <img src={logo} alt="logo"/>
                </div>
                <div>
                    <ul>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">À propos</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <ul>
                        <li><a href="">Se connexion</a></li>
                        <li><a href="">S'inscription</a></li>
                    </ul>
                    <div className="hamburger hamburger--3dx">
                        <div className="hamburger-box">
                            <div className="hamburger-inner"></div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
