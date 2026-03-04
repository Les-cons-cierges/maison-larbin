import ASCIIText from "../../ui/ASCIIText";

const erreur404 = () => {
    return (
        <div className="h-screen">
            <div className="max-lg:hidden">
                <ASCIIText text="404" textColor="#fdf9f3"/>
            </div>
            <div className="lg:hidden">
                <ASCIIText text="404" textColor="#fdf9f3"/>
            </div>
        </div>
    )
}

export default erreur404;
