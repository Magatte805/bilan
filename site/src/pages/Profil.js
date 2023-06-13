import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import RetourAccueil from "../components/RetourAccueil";
import { round } from "../functions";
import "../styles/Profil.css";

const Profil = () => {
    const [username, setUsername] = useState(null);
    const [resultats, setResultats] = useState(null);
    const [cookies] = useCookies(['token']);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(process.env.REACT_APP_API_ROOT + "/profil", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": cookies.token
                }
            });
            if (res.status === 200) {
                const { username, resultats } = await res.json();
                setUsername(username);
                setResultats(resultats);
            } else {
                console.log(res);
            }
        }
        fetchUser();
    }, [])

    return (
        <div className="Profil">
            <div className="Profil-container">
                <h1>Profil</h1>
                <h2>Bonjour {username}</h2>
                <h3>Vos résultats (identifiant: résultat)</h3>
                <ul className="Profil-resultats">
                    {resultats && Object.entries(resultats).map(([id, total]) => (
                        <li key={id}>
                            <a href={`/resultat/${id}`}>{id}: {round(total, 4)} kg de CO2</a>
                        </li>
                    ))}
                </ul>
            </div>
            <RetourAccueil />
        </div>
    );
}

export default Profil;