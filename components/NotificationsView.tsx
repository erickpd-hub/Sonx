import { Heart, UserPlus, Music, Clock } from "lucide-react";
import { useNotifications } from "../hooks/useNotifications";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NotificationsViewProps {
    isDark: boolean;
    userId?: string;
}

export function NotificationsView({ isDark, userId }: NotificationsViewProps) {
    const { notifications, loading } = useNotifications(userId);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className={`animate-spin rounded-full h-12 w-12 border-b-4 ${isDark ? 'border-white' : 'border-black'}`}></div>
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className={`w-16 h-16 mb-4 rounded-full ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-gray-100'} flex items-center justify-center`}>
                    <Clock className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-black'}`}>
                    No hay notificaciones
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Tu actividad reciente aparecerá aquí
                </p>
            </div>
        );
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'like_track':
                return <Heart className="w-5 h-5 text-white fill-white" />;
            case 'new_follower':
                return <UserPlus className="w-5 h-5 text-white" />;
            case 'new_track':
                return <Music className="w-5 h-5 text-white" />;
            default:
                return <Clock className="w-5 h-5 text-white" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'like_track':
                return 'bg-[var(--color-brutal-red)]';
            case 'new_follower':
                return 'bg-[var(--color-brutal-blue)]';
            case 'new_track':
                return 'bg-[var(--color-brutal-green)]';
            default:
                return 'bg-gray-500';
        }
    };

    const getMessage = (notification: any) => {
        switch (notification.type) {
            case 'like_track':
                return (
                    <span>
                        A <span className="font-bold">{notification.actor.username}</span> le gustó tu canción
                    </span>
                );
            case 'new_follower':
                return (
                    <span>
                        <span className="font-bold">{notification.actor.username}</span> comenzó a seguirte
                    </span>
                );
            case 'new_track':
                return (
                    <span>
                        <span className="font-bold">{notification.actor.username}</span> subió una nueva canción
                    </span>
                );
            default:
                return <span>Nueva actividad de {notification.actor.username}</span>;
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
                    <h1 className="text-2xl md:text-4xl font-black text-black uppercase tracking-tighter">
                        NOTIFICACIONES
                    </h1>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} p-4 flex items-center gap-4 transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none`}
                    >
                        {/* Actor Avatar */}
                        <div className="relative">
                            <div className={`w-12 h-12 border-2 ${isDark ? 'border-white' : 'border-black'}`}>
                                <ImageWithFallback
                                    src={notification.actor.avatar_url || "https://images.unsplash.com/photo-1647220419119-316822d9d053?w=100"}
                                    alt={notification.actor.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Type Icon Badge */}
                            <div className={`absolute -bottom-2 -right-2 w-8 h-8 ${getIconBg(notification.type)} border-2 ${isDark ? 'border-white' : 'border-black'} flex items-center justify-center`}>
                                {getIcon(notification.type)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 ml-2">
                            <p className={`${isDark ? 'text-white' : 'text-black'} text-lg`}>
                                {getMessage(notification)}
                            </p>
                            <p className={`text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
