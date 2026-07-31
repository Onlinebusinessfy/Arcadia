import type { ReactElement } from "react";
import "./Acerca.css";
import { FiInfo } from "react-icons/fi";
import { IonContent, IonPage } from "@ionic/react";

export default function Acerca(): ReactElement {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="about-page">
          <div className="about-header">
            <FiInfo size={36} className="page-icon" />
            <span className="about-label">SOBRE NOSOTROS</span>
            <h1>Acerca de Arcadia</h1>
          </div>

          <div className="about-content">
            <p>
              Arcadia es una plataforma creada para conectar a los jugadores en
              un solo lugar. Combinamos la experiencia de descubrir videojuegos
              con herramientas de comunicación que te permiten mantenerte cerca
              de tu comunidad mientras juegas.
            </p>

            <p>
              Explora nuestro catálogo de títulos, descubre nuevos lanzamientos
              y mantente en contacto con tus amigos mediante chats, servidores y
              funciones para compartir pantalla en tiempo real.
            </p>

            <p>
              Nuestra misión es ofrecer una experiencia donde jugar, descubrir y
              socializar formen parte del mismo ecosistema, permitiendo que los
              videojuegos sean más accesibles y divertidos para todos.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat">
              <h2>100+</h2>
              <span>Juegos disponibles</span>
            </div>

            <div className="stat">
              <h2>24/7</h2>
              <span>Conectado con amigos</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
