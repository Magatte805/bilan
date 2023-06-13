import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../styles/App.css";

const App = () => {
    const [utilisateur, setutilisateur] = useState(null);
    const [cookies,,removeCookie] = useCookies(['token']);

    useEffect(() => {
        const fetchutilisateur = async () => {
            const res = await fetch(process.env.REACT_APP_API_ROOT + '/utilisateur', {
                method: 'GET',
                headers: {
                    Authorization: cookies.token
                },
                credentials: 'include'
            });
            if (res.status === 200) {
                const utilisateur = await res.json();
                setutilisateur(utilisateur);
            }
        }
        fetchutilisateur();
    }, []);

    const handleDeconnexion = async () => {
        removeCookie('token');
        setutilisateur(null);
    }

    return (
        <div className="App">
            <div className="App-container">
                <h1>DMI FootPrint Carbon</h1>
                <div className="App-description">
                    <p>Bienvenue au Test du bilan carbone du DMI de l'université Toulouse Jean Jaures.</p>
                    <p>Ce simulateur a été réalisé pour aider le DMI à évaluer l'empreinte carbone au sein du département.</p>
                    <p>Le calcul vous permet de vous situer par rapport aux objectifs climatiques et surtout de passer à l'action en vous impliquant personnellement.</p>
                    <p>Les émissions de carbones sont classées par catégories : Transport , Alimentaton et Numérique.</p>
                </div>
                <div className="App-options">
                    {
                        utilisateur ?
                            <>
                                <Link className="App-option" to="/questionnaire">Faire le questionnaire</Link>
                                <Link className="App-option" to="/profil">Voir mon profil</Link>
                                <p className="App-option" onClick={handleDeconnexion}>Se déconnecter</p>
                            </>
                            :
                            <>
                                <Link className="App-option" to="/connexion">Connexion</Link>
                                <Link className="App-option" to="/inscription">Inscription</Link>
                            </>
                    }
                </div>
            </div>
        </div>
    );
}

export default App;