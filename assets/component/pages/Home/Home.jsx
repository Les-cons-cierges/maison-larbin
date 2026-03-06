import { useEffect } from "react";
import HeroSection from "../../ui/Hero";
import FeaturesSection from "../../ui/About";
import PricingCard from "../../ui/Card";
import ContactSection from "../../ui/Contact";

const Home = ({title, username, cityCount}) => {

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Petit délai pour laisser React finir le rendu
            setTimeout(() => {
                const el = document.querySelector(hash);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }, []);

    return (// ou props
        <div>
            <HeroSection/>
            <div id="cards" className="min-lg: flex justify-center gap-10 m-50 flex-wrap" itemProp={name}>
                <PricingCard employeesLabel="1 à 50 employés" />
                <PricingCard employeesLabel="50 à 250 employés" className="border-2 border-black!"/>
                <PricingCard employeesLabel="+250 employés"/>
            </div>
            <FeaturesSection/>
            {/* et props.title ... */}
            {/*<h2>{title}</h2>*/}
            {/*<p>Bienvenue {username}</p>*/}
            {/* <p>Nombre de villes chargees: {cityCount}</p>*/}
            <ContactSection/>
        </div>
    );
}
export default Home;
