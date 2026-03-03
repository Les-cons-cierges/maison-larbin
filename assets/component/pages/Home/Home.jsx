import HeroSection from "../../ui/Hero";
import FeaturesSection from "../../ui/About";
import PricingCard from "../../ui/Card";
import ClickSpark from "../../ui/ClickSpark/ClickSpark";

const Home = ({title, username, cityCount}) => {

    return (// ou props
        <div>
            <HeroSection/>
            <div id="cards" className="flex justify-center gap-10 m-5" itemProp={name}>
                <PricingCard/>
                <PricingCard/>
                <PricingCard/>
            </div>
            <FeaturesSection/>
            {/* et props.title ... */}
            {/*<h2>{title}</h2>*/}
            {/*<p>Bienvenue {username}</p>*/}
            {/* <p>Nombre de villes chargees: {cityCount}</p>*/}
        </div>
    );
}
export default Home;
