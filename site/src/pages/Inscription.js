import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RetourAccueil from "../components/RetourAccueil";
import "../styles/Credits.css";

const Inscription = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        passwordConfirm: ''
    });
    const [erreur, setErreur] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (credentials.password !== credentials.passwordConfirm) {
            setErreur("Les mots de passe ne correspondent pas");
            return;
        }
        const res = await fetch(process.env.REACT_APP_API_ROOT + '/inscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });
        if (res.status === 201) {
            return navigate("/connexion");
        } else {
            const data = await res.json();
            setErreur(data.message);
        }
    }

    const { username, password, passwordConfirm } = credentials;
    return (
        <div className="Credits">
            <div className="Credits-container">
                <h1 className="Credits-titre">Inscription</h1>
                <form className="Credits-inputs" onSubmit={handleSubmit}>
                    <label className="Credits-label">Nom d'utilisateur</label>
                    <input className="Credits-text-input" type="text" name="username" value={username} onChange={handleChange} />
                    <label className="Credits-label">Mot de passe</label>
                    <input className="Credits-text-input" type="password" name="password" value={password} onChange={handleChange} />
                    <label className="Credits-label">Confirmation du mot de passe</label>
                    <input className="Credits-text-input" type="password" name="passwordConfirm" value={passwordConfirm} onChange={handleChange} />
                    <p className="erreur" style={{ display: erreur ? "" : "none" }}>{erreur}</p>
                    <input className="Credits-submit-button" type="submit" value="S'inscrire" />
                    <Link className="Credits-autre" to="/connexion">Déjà inscrit ?</Link>
                </form>
            </div>
            <RetourAccueil />
        </div>
    );

}

export default Inscription;