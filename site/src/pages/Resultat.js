import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import RetourAccueil from "../components/RetourAccueil";
import "../styles/Resultat.css";
const { round } = require("../functions");

const Resultat = () => {
    const params = useParams();
    const { id } = params;
    const [total, setTotal] = useState(null);
    const [comparaisons, setComparaisons] = useState(null);
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        const fetchResultats = async () => {
            const res = await fetch(process.env.REACT_APP_API_ROOT + `/resultat/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": cookies.token
                }
            });
            if (res.status === 200) {
                const { total, comparaisons } = await res.json();
                setTotal(total);
                setComparaisons(comparaisons);
            } else {
                console.log(res);
            }
        }
        fetchResultats();
    }, [])

    if (total === null || comparaisons === null) return null;

    return (
        <div className="Resultat">
            <div className="Resultat-container">
                <div className="Resultat-container-total">
                    <h2>Votre empreinte carbone est de {round(total, 3)} kg de CO2</h2>
                </div>
                <div className="Resultat-container-comparaisons">
                    <h2>Comparaison avec d'autres objets</h2>
                    <div className="Resultat-container-comparaisons-liste">
                        {Object.entries(comparaisons).map(([comparaison, valeur]) => (
                            <div className="Resultat-container-comparaisons-liste-objet">
                                <h3>{round(valeur, 3)}</h3>
                                <p>{comparaison.replace("[S]", valeur >= 2 ? "s" : "")}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <RetourAccueil />
        </div>
    );
}

export default Resultat;