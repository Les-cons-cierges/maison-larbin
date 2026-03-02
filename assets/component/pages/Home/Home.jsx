import HeroSection from "../../ui/Hero";
import FeaturesSection from "../About";
import PricingCard from "../Card";

const Home = ({title, username, cityCount}) => {

    return (// ou props
        <div>
            <HeroSection/>
            <FeaturesSection/>
            <div className="flex justify-center gap-3 m-5" itemProp={name}>
                <PricingCard/>
                <PricingCard/>
                <PricingCard/>
            </div>
            {/* et props.title ... */}
            {/*<h2>{title}</h2>*/}
            {/*<p>Bienvenue {username}</p>*/}
            {/* <p>Nombre de villes chargees: {cityCount}</p>*/}
        </div>
    );
}
export default Home;
