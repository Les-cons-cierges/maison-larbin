import HeroSection from "../../ui/Hero";
import FeaturesSection from "../About";
import PricingCard from "../../ui/Card";

const Home = ({ title, username, cityCount }) => (// ou props
    <div>
        <HeroSection/>
        <FeaturesSection/>
        <PricingCard />
        {/* et props.title ... */}
        {/*<h2>{title}</h2>*/}
        <p>Bienvenue {username}</p>{}
        <p>Nombre de villes chargees: {cityCount}</p>{}
    </div>
);
export default Home;
