import { useState, useEffect, useRef, type ReactElement } from "react";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import "./Perfil.css";
import { IonContent, IonPage } from '@ionic/react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Perfil(): ReactElement {
  const { user, setUser } = useAuth();

  const [editing, setEditing] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [status, setStatus] = useState<string>("online");
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const isEditingRef = useRef(false);

  const getFullImageUrl = (picture: string | null) => {
    console.log("🔍 getFullImageUrl - picture recibida:", picture);
    if (!picture) {
      console.log("❌ picture es null o undefined");
      return null;
    }
    
    if (picture.startsWith('http://') || picture.startsWith('https://')) {
      console.log("✅ URL completa:", picture);
      return picture;
    }
    
    if (picture.startsWith('/media/')) {
      const url = `${API_URL}${picture}`;
      console.log("✅ URL con /media/:", url);
      return url;
    }
    
    if (picture.startsWith('media/')) {
      const url = `${API_URL}/${picture}`;
      console.log("✅ URL con media/:", url);
      return url;
    }
    
    if (picture.startsWith('profiles/')) {
      const url = `${API_URL}/media/${picture}`;
      console.log("✅ URL con profiles/:", url);
      return url;
    }
    
    const url = `${API_URL}/media/profiles/${picture}`;
    console.log("✅ URL por defecto:", url);
    return url;
  };

  // ✅ Cargar usuario al montar
  useEffect(() => {
    console.log("🔄 useEffect - Cargando usuario al montar");
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("access");
        if (token) {
          console.log("📡 Llamando a getMe...");
          const userData = await authService.getMe(token);
          console.log("👤 Usuario recibido:", userData);
          console.log("🖼️ profile_picture del usuario:", userData.profile_picture);
          
          setUser(userData);
          const imageUrl = getFullImageUrl(userData.profile_picture);
          setProfileImageUrl(imageUrl);
          console.log("🖼️ profileImageUrl seteado a:", imageUrl);
          isFirstLoad.current = false;
        } else {
          console.log("⚠️ No hay token");
        }
      } catch (error) {
        console.error("❌ Error al cargar usuario:", error);
      }
    };
    
    loadUser();
  }, []);

  // ✅ Actualizar imagen cuando cambia el usuario
  useEffect(() => {
    console.log("🔄 useEffect - user cambió:", user?.profile_picture);
    console.log("  editing:", editing);
    console.log("  isEditingRef.current:", isEditingRef.current);
    
    if (user && !editing && !isEditingRef.current) {
      console.log("✅ Actualizando imagen desde user");
      const newUrl = getFullImageUrl(user.profile_picture);
      console.log("  Nueva URL:", newUrl);
      console.log("  URL anterior:", profileImageUrl);
      setProfileImageUrl(newUrl);
    } else {
      console.log("⏭️ NO se actualiza imagen porque:");
      if (editing) console.log("  - Estamos en edición");
      if (isEditingRef.current) console.log("  - isEditingRef es true");
      if (!user) console.log("  - No hay user");
    }
  }, [user, editing]);

  // ✅ Abrir edición
  useEffect(() => {
    console.log("🔄 useEffect - editing cambió a:", editing);
    if (editing && user) {
      console.log("📝 Abriendo edición");
      isEditingRef.current = true;
      setUsername(user.username);
      setBio(user.bio ?? "");
      setStatus(user.status ?? "online");
      
      console.log("  user.profile_picture:", user.profile_picture);
      console.log("  image (File):", image);
      console.log("  previewUrl:", previewUrl);
      
      if (!image && !previewUrl) {
        console.log("✅ Guardando imagen actual en profileImageUrl");
        const url = getFullImageUrl(user.profile_picture);
        setProfileImageUrl(url);
        console.log("  profileImageUrl setteado a:", url);
      } else {
        console.log("⏭️ No se actualiza imagen porque hay image o preview");
      }
    } else {
      console.log("❌ Cerrando edición o no hay user");
    }
  }, [editing, user]);

  // ✅ Cerrar edición
  useEffect(() => {
    if (!editing) {
      console.log("🔚 Cerrando edición - isEditingRef = false");
      isEditingRef.current = false;
    }
  }, [editing]);

  // ✅ Preview de imagen
  useEffect(() => {
    console.log("🔄 useEffect - image cambió:", image?.name);
    if (!image) {
      console.log("❌ No hay imagen, previewUrl = null");
      setPreviewUrl(null);
      return;
    }

    console.log("📸 Creando preview para:", image.name);
    const objectUrl = URL.createObjectURL(image);
    setPreviewUrl(objectUrl);
    console.log("  previewUrl:", objectUrl);

    return () => {
      console.log("🗑️ Revocando URL:", objectUrl);
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);

  if (!user) {
    console.log("⏳ Renderizando: Cargando...");
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

  const profileImage = profileImageUrl;
  const currentImage = previewUrl || profileImage;

  console.log("🎨 Renderizando Perfil");
  console.log("  profileImageUrl:", profileImageUrl);
  console.log("  previewUrl:", previewUrl);
  console.log("  currentImage:", currentImage);
  console.log("  user.profile_picture:", user.profile_picture);

  const getStatusText = (value: string) => {
    switch (value) {
      case "online": return "Online";
      case "away": return "Ausente";
      case "busy": return "Ocupado";
      case "invisible": return "Offline";
      default: return "Offline";
    }
  };

  const getStatusClass = (value: string) => {
    if (value === "invisible") return "offline";
    return value;
  };

  const handleCancel = () => {
    console.log("❌ Cancelando edición");
    setImage(null);
    setPreviewUrl(null);
    setEditing(false);
    isEditingRef.current = false;
  };

  const handleSave = async () => {
    console.log("💾 Guardando cambios");
    try {
      setLoading(true);
      const token = localStorage.getItem("access");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const formData = new FormData();

      if (canEditUsername()) {
        formData.append("username", username);
        console.log("  username:", username);
      }

      formData.append("bio", bio);
      formData.append("status", status);
      console.log("  bio:", bio);
      console.log("  status:", status);

      if (image) {
        formData.append("profile_picture", image);
        console.log("  📸 Enviando imagen:", image.name, image.size, image.type);
      } else {
        console.log("  ⚠️ No hay imagen para enviar");
      }

      console.log("📡 Enviando updateProfile...");
      await authService.updateProfile(token, formData);
      console.log("✅ updateProfile completado");
      
      console.log("📡 Recargando usuario con getMe...");
      const updatedUser = await authService.getMe(token);
      console.log("👤 Usuario actualizado:", updatedUser);
      console.log("🖼️ profile_picture del usuario actualizado:", updatedUser.profile_picture);
      
      setUser(updatedUser);
      const newUrl = getFullImageUrl(updatedUser.profile_picture);
      setProfileImageUrl(newUrl);
      console.log("🖼️ profileImageUrl actualizado a:", newUrl);
      
      setImage(null);
      setPreviewUrl(null);
      setEditing(false);
      isEditingRef.current = false;
      setLoading(false);
      
      console.log("✅ Guardado completado");
    } catch (error) {
      console.error("❌ Error actualizando perfil:", error);
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="perfil-page">
          {/* HEADER */}
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

            <button 
              className="edit-profile-btn" 
              onClick={() => setEditing(true)}
              disabled={loading}
            >
              Editar perfil
            </button>
          </div>

          {/* INFO DE CUENTA */}
          <div className="perfil-section">
            <div className="section-title">
              <h2>Información de la cuenta</h2>
              <span>Datos públicos de tu perfil</span>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span className="info-card-label">Usuario</span>
                <span className="info-card-value">{user.username}</span>
              </div>

              <div className="info-card">
                <span className="info-card-label">Correo</span>
                <span className="info-card-value">{user.email}</span>
              </div>

              <div className="info-card">
                <span className="info-card-label">Estado</span>
                <div className={`status-indicator ${getStatusClass(user.status)}`}>
                  <span></span>
                  {getStatusText(user.status)}
                </div>
              </div>

              <div className="info-card">
                <span className="info-card-label">Miembro desde</span>
                <span className="info-card-value">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* MODAL EDITAR */}
          {editing && (
            <div className="edit-modal-overlay" onClick={handleCancel}>
              <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
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
                            console.log("📸 Usuario seleccionó imagen:", e.target.files[0].name);
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
                  <button 
                    className="cancel-btn" 
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="save-btn" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
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