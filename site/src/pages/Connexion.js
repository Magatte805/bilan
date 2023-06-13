import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import "../styles/Credits.css";
import RetourAccueil from "../components/RetourAccueil";

const Connexion = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [erreur, setErreur] = useState('');
    const [, setCookie] = useCookies(['token']);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await fetch(process.env.REACT_APP_API_ROOT + '/connexion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        const data = await res.json();
        if (res.status === 200) {
            setCookie('token', data.token);
            return navigate("/");
        } else {
            setErreur(data.message);
        }
    }

    const { username, password } = credentials;
    return (
        <div className="Credits">
            <div className="Credits-container">
                <h1 className="Credits-titre">Connexion</h1>
                <form className="Credits-inputs" onSubmit={handleSubmit}>
                    <label className="Credits-label">Nom d'utilisateur</label>
                    <input className="Credits-text-input" type="text" name="username" value={username} onChange={handleChange} />
                    <label className="Credits-label">Mot de passe</label>
                    <input className="Credits-text-input" type="password" name="password" value={password} onChange={handleChange} />
                    <p className="erreur" style={{ display: erreur ? "" : "none" }}>{erreur}</p>
                    <input className="Credits-submit-button" type="submit" value="Se connecter" />
                    <Link className="Credits-autre" to="/inscription">Pas encore inscrit ?</Link>
                </form>
            </div>
            <RetourAccueil />
        </div>
    );
}

export default Connexion;