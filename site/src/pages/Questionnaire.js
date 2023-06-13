import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import RetourAccueil from "../components/RetourAccueil";
import "../styles/Questionnaire.css";

const Questionnaire = () => {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [responses, setResponses] = useState({});
    const [categorie, setCategorie] = useState("");
    const [page, setPage] = useState(0);
    const [cookies] = useCookies(['token']);
    const navigate = useNavigate();
    const question = questionnaire?.[categorie]?.[page];

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(process.env.REACT_APP_API_ROOT + '/utilisateur', {
                method: 'GET',
                headers: {
                    Authorization: cookies.token
                },
                credentials: 'include'
            });
            if (res.status === 200) {
                const fetchQuestionnaire = async () => {
                    const res = await fetch(process.env.REACT_APP_API_ROOT + '/questionnaire', {
                        method: 'GET',
                        headers: {
                            Authorization: cookies.token
                        },
                        credentials: 'include'
                    });
                    if (res.status === 200) {
                        const questionnaire = await res.json();
                        setQuestionnaire(questionnaire);
                    } else {
                        alert("Erreur lors de la récupération du questionnaire");
                        navigate("/");
                    }
                }
                fetchQuestionnaire();
            } else {
                navigate("/connexion");
            }
        }
        fetchUser();
    }, []);

    const handleRecommencer = () => {
        setResponses({});
        setCategorie("");
    }

    const handleCategorieChange = (e) => {
        setCategorie(e.target.innerText);
        setPage(0);
    }

    const handleChoixSimple = (e) => {
        setResponses({ ...responses, [question.name]: e.target.value });
    }

    const handleChoixMultiple = (e) => {
        if (responses[question.name] === undefined) {
            setResponses({ ...responses, [question.name]: [e.target.value] });
        } else {
            if (responses[question.name].includes(e.target.value)) {
                setResponses({ ...responses, [question.name]: responses[question.name].filter((value) => value !== e.target.value) });
            } else {
                setResponses({ ...responses, [question.name]: [...responses[question.name], e.target.value] });
            }
        }
    }

    const handlePagePrecedente = () => {
        if (page > 0) setPage(page - 1);
        else {
            const categoryIndex = Object.keys(questionnaire).indexOf(categorie);
            if (categoryIndex > 0) {
                setCategorie(Object.keys(questionnaire)[categoryIndex - 1]);
                setPage(questionnaire[categorie].length - 1);
            }
        }
    }

    const handlePageSuivante = () => {
        if (page < questionnaire[categorie].length - 1) setPage(page + 1);
        else {
            const categoryIndex = Object.keys(questionnaire).indexOf(categorie);
            if (categoryIndex < Object.keys(questionnaire).length - 1) {
                setCategorie(Object.keys(questionnaire)[categoryIndex + 1]);
                setPage(0);
            } else {
                handleResultat();
            }
        }
    }

    const handleResultat = async () => {
        const res = await fetch(process.env.REACT_APP_API_ROOT + '/resultat', {
            method: 'POST',
            headers: {
                Authorization: cookies.token,
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(responses)
        });
        const data = await res.json();
        if (res.status === 201) {
            navigate("/resultat/" + data.id);
        } else {
            alert("Erreur lors de l'envoi des réponses : " + data.message);
        }
    }

    if (questionnaire === null) {
        return (
            <div className="Questionnaire">
                <div className="Questionnaire-container">
                    <p>Chargement...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="Questionnaire">
            <div className="Questionnaire-container">
                <h1 className="Questionnaire-titre">Questionnaire</h1>
                <div className="Questionnaire-questionnaire">
                    <div className="Questionnaire-categories">
                        <button className="Questionnaire-categorie" onClick={handleRecommencer}>Recommencer</button>
                        {
                            Object.keys(questionnaire).map((categorie) => {
                                return (
                                    <button className="Questionnaire-categorie" onClick={handleCategorieChange}>{categorie}</button>
                                )
                            })
                        }
                    </div>
                    <div className="Questionnaire-actuel">
                        {
                            categorie === "" ? (
                                <p className="Questionnaire-actuel-texte">Choisissez une catégorie pour commencer</p>
                            ) : (
                                <div className="Questionnaire-actuel-categorie">
                                    <h2 className="Questionnaire-actuel-titre">{categorie}</h2>
                                    {
                                        (() => {
                                            switch (question.type) {
                                                case "entier":
                                                    return Array.isArray(question.choix) ? (
                                                        // si c'est un tableau, c'est un select avec comme option les valeurs du tableau
                                                        <div className="Questionnaire-actuel-question">
                                                            <p className="Questionnaire-actuel-question-texte">{question.texte}</p>
                                                            <select className="Questionnaire-actuel-question-select" name={question.name} value={responses[question.name]} onChange={(e) => setResponses({ ...responses, [question.name]: e.target.value })}>
                                                                {
                                                                    question.choix.map((choix) => {
                                                                        return (
                                                                            <option className="Questionnaire-actuel-question-select-option" value={choix}>{choix}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        // sinon c'est un input type number
                                                        <div className="Questionnaire-actuel-question">
                                                            <p className="Questionnaire-actuel-question-texte">{question.texte}</p>
                                                            <input className="Questionnaire-actuel-question-input" type="number" name={question.name} value={responses[question.name]} onChange={(e) => setResponses({ ...responses, [question.name]: e.target.value })} />
                                                        </div>
                                                    )
                                                case "simple":
                                                case "multiple":
                                                    return (
                                                        <div className="Questionnaire-actuel-question">
                                                            <p className="Questionnaire-actuel-question-texte">{question.texte}</p>
                                                            {
                                                                question.choix.map((choix) => {
                                                                    if (choix.type === undefined) {
                                                                        return (
                                                                            <div className="Questionnaire-actuel-question-choix">
                                                                                <input className="Questionnaire-actuel-question-choix-checkbox" type={question.type === "simple" ? "radio" : "checkbox"} name={question.name} value={choix.name || choix} checked={question.type === "simple" ? responses[question.name] === (choix.name || choix) : responses[question.name]?.includes((choix.name || choix))} onChange={question.type === "simple" ? handleChoixSimple : handleChoixMultiple} />
                                                                                <p className="Questionnaire-actuel-question-choix-texte">{choix.name}</p>
                                                                            </div>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <div className="Questionnaire-actuel-question-choix">
                                                                                <input className="Questionnaire-actuel-question-choix-checkbox" type={question.type === "simple" ? "radio" : "checkbox"} name={question.name} value={choix.name || choix} checked={question.type === "simple" ? responses[question.name] === (choix.name || choix) : responses[question.name]?.includes((choix.name || choix))} onChange={question.type === "simple" ? handleChoixSimple : handleChoixMultiple} />
                                                                                <p className="Questionnaire-actuel-question-choix-texte">{choix.name}</p>
                                                                                <input className="Questionnaire-actuel-question-choix-reponse" type="number" value={responses[choix.name] || ""} onChange={(e) => setResponses({ ...responses, [choix.name]: e.target.value })} />
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                default:
                                                    return null;
                                            }
                                        })()
                                    }
                                    <div className="Questionnaire-actuel-question-navigation">
                                        <button className="Questionnaire-actuel-question-navigation-bouton" onClick={handlePagePrecedente} disabled={page === 0 && Object.keys(questionnaire)[0] === categorie}>{page === 0 ? "Catégorie précédente" : "Question précédente"}</button>
                                        <button className="Questionnaire-actuel-question-navigation-bouton" onClick={handlePageSuivante}>{(page === questionnaire[categorie].length - 1) ? "Catégorie suivante" : "Question suivante"}</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <RetourAccueil />
        </div>
    )
}

export default Questionnaire;