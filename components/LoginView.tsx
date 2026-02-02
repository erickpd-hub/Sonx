import { useState } from "react";
import { Mail, Lock, User as UserIcon, Check, X, Loader2 } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { toast } from "sonner";
import { useUsernameCheck } from "../hooks/useUsernameCheck";

interface LoginViewProps {
  isDark: boolean;
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string, username: string) => void;
}

export function LoginView({ isDark, onLogin, onRegister }: LoginViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { status: usernameStatus, errorMessage: usernameError } = useUsernameCheck(username);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin(email, password);
      } else {
        if (usernameStatus === 'unavailable' || usernameStatus === 'invalid') {
          toast.error(usernameError || "Nombre de usuario no válido");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });
        if (error) throw error;

        if (data.session) {
          onRegister(email, password, username);
          toast.success("¡Registro exitoso! Bienvenido.");
        } else {
          toast.success("Registro exitoso! Por favor verifica tu email para continuar.");
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = error.message;

      // Translate common Supabase errors
      if (error.message.includes("Invalid login credentials")) {
        message = "Correo o contraseña incorrectos.";
      } else if (error.message.includes("User already registered")) {
        message = "Este correo ya está registrado.";
      } else if (error.message.includes("Password should be at least")) {
        message = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.message.includes("Email rate limit exceeded")) {
        message = "Has excedido el límite de intentos. Por favor espera unos minutos o usa otro correo.";
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
            <h1 className="text-black">{isLogin ? "INICIAR SESIÓN" : "REGISTRARSE"}</h1>
          </div>
          <p className={isDark ? 'text-white' : 'text-black'}>
            {isLogin ? "Bienvenido de vuelta" : "Únete a la comunidad"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6 space-y-6`}>
          {!isLogin && (
            <div>
              <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block flex items-center gap-2`}>
                <UserIcon className="w-5 h-5" />
                NOMBRE DE USUARIO
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${usernameStatus === 'unavailable' || usernameStatus === 'invalid'
                    ? 'border-red-500'
                    : usernameStatus === 'available'
                      ? 'border-green-500'
                      : isDark ? 'border-white' : 'border-black'
                    } px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all pr-10`}
                  placeholder="tu_nombre"
                  required
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && <Loader2 className="w-5 h-5 animate-spin text-gray-500" />}
                  {usernameStatus === 'available' && <Check className="w-5 h-5 text-green-500" />}
                  {(usernameStatus === 'unavailable' || usernameStatus === 'invalid') && <X className="w-5 h-5 text-red-500" />}
                </div>
              </div>
              {usernameError && (
                <p className="text-red-500 text-sm mt-1 font-bold">{usernameError}</p>
              )}
              {usernameStatus === 'available' && (
                <p className="text-green-500 text-sm mt-1 font-bold">¡Nombre disponible!</p>
              )}
            </div>
          )}

          <div>
            <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block flex items-center gap-2`}>
              <Mail className="w-5 h-5" />
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className={`${isDark ? 'text-white' : 'text-black'} font-black mb-2 block flex items-center gap-2`}>
              <Lock className="w-5 h-5" />
              CONTRASEÑA
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} px-4 py-3 font-black focus:outline-none focus:translate-x-1 focus:translate-y-1 transition-all`}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || (!isLogin && (usernameStatus === 'checking' || usernameStatus === 'unavailable' || usernameStatus === 'invalid'))}
            className={`w-full bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all px-6 py-4 font-black text-black disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? "CARGANDO..." : isLogin ? "ENTRAR" : "CREAR CUENTA"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className={`${isDark ? 'text-white' : 'text-black'} hover:text-[var(--color-brutal-yellow)] transition-colors font-black`}
            >
              {isLogin ? "¿No tienes cuenta? REGÍSTRATE" : "¿Ya tienes cuenta? INICIA SESIÓN"}
            </button>
          </div>
        </form>

        <div className={`mt-6 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} p-4`}>
          <p className={`${isDark ? 'text-white' : 'text-black'} text-sm text-center`}>
            💡 Al registrarte podrás subir tu música, crear playlists y conectar con otros artistas
          </p>
        </div>
      </div>
    </div>
  );
}

