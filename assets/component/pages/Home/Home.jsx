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
            <div id="cards" className="max-lg: m-10 mb-40 flex justify-center gap-10 flex-wrap" itemProp={name}>
                <PricingCard name="PME" monthlyPrice="1200" employeesLabel="1 à 50 employés" />
                <PricingCard name="ETI" monthlyPrice="3500" subtitle="Idéal pour les moyennes et grandes structures" employeesLabel="50 à 250 employés" className="border-2 border-black!"/>
                <PricingCard name="GE" monthlyPrice="8000" subtitle="Idéal pour les grandes structures" employeesLabel="+250 employés"/>
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
