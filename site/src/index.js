import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from 'react-cookie';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './pages/App';
import NotFound from './pages/NotFound';
import Inscription from './pages/Inscription';
import Connexion from './pages/Connexion';
import Questionnaire from './pages/Questionnaire';
import Profil from './pages/Profil';
import Resultat from './pages/Resultat';
import './index.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/inscription",
    element: <Inscription />
  },
  {
    path: "/connexion",
    element: <Connexion />
  },
  {
    path: "/questionnaire",
    element: <Questionnaire />
  },
  {
    path: "/resultat/:id",
    element: <Resultat />
  },
  {
    path: "/profil",
    element: <Profil />
  },
  {
    path: "*",
    element: <NotFound />
  } 
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CookiesProvider>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </CookiesProvider>
);