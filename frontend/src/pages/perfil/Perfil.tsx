import { useState, useEffect, type ReactElement } from "react";

import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import "./Perfil.css";

import { IonContent, IonPage } from '@ionic/react'

const API_URL = import.meta.env.VITE_API_URL;
const API_HOST = new URL(API_URL).origin;

export default function Perfil(): ReactElement {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [status, setStatus] = useState<string>("online");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (editing && user) {
      setUsername(user.username);
      setBio(user.bio ?? "");
      setStatus(user.status ?? "online");
      setImage(null);
    }
  }, [editing, user]);

  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  if (!user) {
    return <h2>Cargando...</h2>;
  }

  const canEditUsername = () => {
    if (!user.username_last_changed) {
      return true;
    }

    const lastChange = new Date(user.username_last_changed);

    const nextChange = new Date(lastChange);

    nextChange.setDate(nextChange.getDate() + 30);

    return new Date() >= nextChange;
  };

  const profileImage = user.profile_picture
    ? user.profile_picture.startsWith("http")
      ? user.profile_picture
      : `${API_HOST}${user.profile_picture}`
    : null;

  const getStatusText = (value: string) => {
    switch (value) {
      case "online":
        return "Online";

      case "away":
        return "Ausente";

      case "busy":
        return "Ocupado";

      case "invisible":
        return "Offline";

      default:
        return "Offline";
    }
  };

  const getStatusClass = (value: string) => {
    if (value === "invisible") {
      return "offline";
    }

    return value;
  };

  const currentImage = previewUrl || profileImage;

  const handleCancel = () => {
    setImage(null);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");

      const formData = new FormData();

      if (canEditUsername()) {
        formData.append("username", username);
      }

      formData.append("bio", bio);

      formData.append("status", status);

      if (image) {
        formData.append("profile_picture", image);
      }

      const updatedUser = await authService.updateProfile(token!, formData);

      setUser(updatedUser);

      setEditing(false);
    } catch (error) {
      console.error("Error actualizando perfil:", error);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="perfil-page">
          <div className="perfil-header">
            <div className="perfil-avatar">
              {profileImage ? (
                <img src={profileImage} alt={user.username} />
              ) : (
                <span>{user.username.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="perfil-info">
              <h1>{user.username}</h1>

              <p>{user.email}</p>

              {user.bio && <p>{user.bio}</p>}

              <div className={`perfil-status ${getStatusClass(user.status)}`}>
                <span></span>

                {getStatusText(user.status)}
              </div>
            </div>

            <button className="edit-profile-btn" onClick={() => setEditing(true)}>
              Editar perfil
            </button>
          </div>

          <div className="perfil-section">
            <div className="section-title">
              <h2>Información de la cuenta</h2>

              <span>Datos públicos de tu perfil</span>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span>Usuario</span>

                <strong>{user.username}</strong>
              </div>

              <div className="info-card">
                <span>Correo</span>

                <strong>{user.email}</strong>
              </div>

              <div className="info-card status-card">
                <span className="info-card-label">Estado</span>

                <div className={`status-indicator ${getStatusClass(user.status)}`}>
                  <span></span>

                  {getStatusText(user.status)}
                </div>
              </div>

              <div className="info-card">
                <span>Miembro desde</span>

                <strong>{new Date(user.created_at).toLocaleDateString()}</strong>
              </div>
            </div>
          </div>

          {editing && (
            <div className="edit-modal-overlay">
              <div className="edit-modal">
                <div className="edit-modal-header">
                  <h2>Editar perfil</h2>
                </div>

                <div className="edit-modal-body">
                  <div className="avatar-upload">
                    <div className="avatar-preview">
                      {currentImage ? (
                        <img src={currentImage} alt="Avatar preview" />
                      ) : (
                        <span>{username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>

                    <label className="upload-btn">
                      Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImage(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Nombre de usuario</label>

                    <input
                      value={username}
                      disabled={!canEditUsername()}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="username-warning">
                    El nombre de usuario solo puede cambiarse cada 30 días.
                  </div>

                  <div className="form-group">
                    <label>Biografía</label>

                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Estado</label>

                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="online">🟢 Online</option>

                      <option value="away">🟡 Ausente</option>

                      <option value="busy">🔴 Ocupado</option>

                      <option value="invisible">⚫ Invisible</option>
                    </select>
                  </div>
                </div>

                <div className="edit-modal-footer">
                  <button className="cancel-btn" onClick={handleCancel}>
                    Cancelar
                  </button>

                  <button className="save-btn" onClick={handleSave}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
