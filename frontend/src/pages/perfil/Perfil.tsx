import { useState, type ReactElement } from "react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import "./Perfil.css";

export default function Perfil(): ReactElement {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState(false);

  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [image, setImage] = useState<File | null>(null);

  console.log(user?.profile_picture);

  if (!user) {
    return <h2>Cargando...</h2>;
  }

  const profileImage = user.profile_picture
    ? user.profile_picture.startsWith("http")
      ? user.profile_picture
      : `http://127.0.0.1:8000${user.profile_picture}`
    : null;

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");

      const formData = new FormData();

      formData.append("username", username);
      formData.append("bio", bio);

      if (image) {
        formData.append("profile_picture", image);
      }

      const updatedUser = await authService.updateProfile(
        token!,
        formData
      );

      setUser(updatedUser);

      setEditing(false);

      alert("Perfil actualizado.");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="perfil-page">

      {/* HEADER */}

      <div className="perfil-header">

        <div className="perfil-avatar">

          {profileImage ? (
            <img
              src={profileImage!}
              alt={user.username}
            />
          ) : (
            <span>
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}

        </div>

        <div className="perfil-info">

          <h1>{user.username}</h1>

          <p>{user.email}</p>

          {user.bio && (
            <p>{user.bio}</p>
          )}

          <div className="perfil-status">
            {user.status}
          </div>

        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setEditing(true)}
        >
          Editar perfil
        </button>

      </div>

      {/* INFORMACIÓN */}

      <div className="perfil-section">

        <div className="section-title">
          <h2>Información de la cuenta</h2>
          <span>Datos públicos de tu perfil</span>
        </div>

        <div className="info-grid">

          <div className="info-card">
            <span className="info-card-label">
              Nombre de usuario
            </span>

            <span className="info-card-value">
              {user.username}
            </span>
          </div>

          <div className="info-card">
            <span className="info-card-label">
              Correo electrónico
            </span>

            <span className="info-card-value">
              {user.email}
            </span>
          </div>

          <div className="info-card">
            <span className="info-card-label">
              Estado
            </span>

            <div className="status-pill">
              <span className="status-dot"></span>
              {user.status}
            </div>
          </div>

          <div className="info-card">
            <span className="info-card-label">
              Miembro desde
            </span>

            <span className="info-card-value">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

        </div>

      </div>

      {/* MODAL */}

      {editing && (

        <div className="edit-modal-overlay">

          <div className="edit-modal">

            <div className="edit-modal-header">
              <h2>Editar perfil</h2>
            </div>

            <div className="edit-modal-body">

              <div className="avatar-upload">

                <div className="avatar-preview">

                  {profileImage ? (

                    <img
                      src={profileImage!}
                      alt={user.username}
                    />

                  ) : (

                    <span>
                      {username
                        .charAt(0)
                        .toUpperCase()}
                    </span>

                  )}

                </div>

                <label className="upload-btn">

                  Cambiar foto

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(
                        e.target.files?.[0] ??
                        null
                      )
                    }
                  />

                </label>

              </div>

              <div className="form-group">

                <label>
                  Nombre de usuario
                </label>

                <input
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="username-warning">
                El nombre de usuario solo puede cambiarse una vez cada 30 días.
              </div>

              <div className="form-group">

                <label>Biografía</label>

                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="edit-modal-footer">

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditing(false)
                }
              >
                Cancelar
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
              >
                Guardar cambios
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}