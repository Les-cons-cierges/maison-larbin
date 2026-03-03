import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/app.css";
import App from "./component/App";
import Home from "./component/pages/Home";
import NotFound from "./component/pages/NotFound";
import NavBar from "./component/ui/Navbar";
import Footer from "./component/ui/Footer/Footer";

const appContainer = document.getElementById("app");
if (appContainer) {
    createRoot(appContainer).render(<App />);
}


const navbarContainer = document.getElementById("navbar");
if (navbarContainer) {
    let navbarUser = null;
    const rawUser = navbarContainer.dataset.user;

    if (rawUser) {
        try {
            navbarUser = JSON.parse(rawUser);
        } catch (error) {
            console.error("JSON utilisateur invalide pour NavBar:", error);
        }
    }

    createRoot(navbarContainer).render(<NavBar user={navbarUser} />);
}


const homeContainer = document.getElementById("home");
if (homeContainer) {
    let homeProps = {};
    // recupération des données php json en dataset
    const rawProps = homeContainer.dataset.props;

    if (rawProps) {
        try {
            homeProps = JSON.parse(rawProps);
        } catch (error) {
            console.error("Props JSON invalide pour Home:", error);
        }
    }
    // passage de données en props pures
    createRoot(homeContainer).render(<Home {...homeProps} />);
}

const error404Container = document.getElementById("error404");
if (error404Container) {
    createRoot(error404Container).render(< NotFound/>);
}

const footerContainer = document.getElementById("footer");
if (footerContainer) {
    createRoot(footerContainer).render(<Footer />);
}
