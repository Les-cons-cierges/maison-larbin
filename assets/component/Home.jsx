import NavBar from "./Navbar/NavBar";

const Home = ({ title, username, cityCount }) => (// ou props
    <>
        <h2>{title}</h2>{/* et props.title ... */}
        <p>Bienvenue {username}</p>
        <p>Nombre de villes chargees: {cityCount}</p>
    </>
);
export default Home;
