import React from "react";
import { createRoot } from "react-dom/client";
import App from "./component/App";
import Home from "./component/Home";
import NotFound from "./component/NotFound/NotFound";
import NavBar from "./component/Navbar/NavBar";

const appContainer = document.getElementById("app");
if (appContainer) {
    createRoot(appContainer).render(<App />);
}


const navbarContainer = document.getElementById("navbar");
if (navbarContainer) {
    createRoot(navbarContainer).render(<NavBar/>);
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
