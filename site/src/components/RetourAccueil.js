import { Link } from "react-router-dom";
import "../styles/RetourAccueil.css";

const RetourAccueil = () => {
    return (
        <div className="RetourAccueil">
            <Link className="RetourAccueil-link" to="/">Retour à l'accueil</Link>
        </div>
    );
}

export default RetourAccueil;