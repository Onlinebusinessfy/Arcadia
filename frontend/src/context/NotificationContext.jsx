import { createContext, useContext, useState, useEffect } from 'react'

const NotificationContext = createContext(null)

const defaultNotifications = [
    { id: 1, type: 'oferta', text: 'Cyberpunk 2077 tiene 30% de descuento', time: 'Hace 2 horas', read: false },
    { id: 2, type: 'actualizacion', text: 'Nueva actualización disponible para Elden Ring', time: 'Hace 5 horas', read: false },
    { id: 3, type: 'sistema', text: 'Bienvenido a Arcadia', time: 'Hace 1 día', read: true },
]

function loadInitial() {
    try {
        const stored = localStorage.getItem('arcadia_notifications')
        return stored ? JSON.parse(stored) : defaultNotifications
    } catch {
        return defaultNotifications
    }
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState(loadInitial)

    useEffect(() => {
        localStorage.setItem('arcadia_notifications', JSON.stringify(notifications))
    }, [notifications])

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )

        const markAsRead = (id) => {
            console.log('markAsRead llamado con id:', id)
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            )
        }
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const unreadCount = notifications.filter(n => !n.read).length

    return (
        <NotificationContext.Provider value={{
            notifications,
            markAsRead,
            markAllAsRead,
            unreadCount,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications debe usarse dentro de un NotificationProvider')
    }
    return context
}