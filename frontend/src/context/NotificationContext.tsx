import { createContext, useContext, useState, useEffect, type ReactNode, type ReactElement } from 'react'
import type NotificationType from '../types/notification'

interface NotificationContextType {
    notifications: NotificationType[],
    markAsRead: (id: number) => void,
    markAllAsRead: () => void,
    unreadCount: number,
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: NotificationType[] = [
    { id: 1, type: 'oferta', text: 'Cyberpunk 2077 tiene 30% de descuento', time: 'Hace 2 horas', read: false },
    { id: 2, type: 'actualizacion', text: 'Nueva actualización disponible para Elden Ring', time: 'Hace 5 horas', read: false },
    { id: 3, type: 'sistema', text: 'Bienvenido a Arcadia', time: 'Hace 1 día', read: true },
]

function loadInitial(): NotificationType[] {
    try {
        const stored = localStorage.getItem('arcadia_notifications')
        return stored ? JSON.parse(stored) : defaultNotifications
    } catch {
        return defaultNotifications
    }
}

export function NotificationProvider({ children }: { children: ReactNode }): ReactElement {
    const [notifications, setNotifications] = useState<NotificationType[]>(loadInitial)

    useEffect(() => {
        localStorage.setItem('arcadia_notifications', JSON.stringify(notifications))
    }, [notifications])

    const markAsRead = (id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )

        const markAsRead = (id: number) => {
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

export function useNotifications(): NotificationContextType {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications debe usarse dentro de un NotificationProvider')
    }
    return context
}