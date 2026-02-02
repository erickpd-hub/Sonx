import { Check, X, Crown } from "lucide-react";

interface SubscriptionViewProps {
  isDark: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
}

export function SubscriptionView({ isDark, isPremium, onSubscribe }: SubscriptionViewProps) {
  const freeFeatures = [
    { text: 'Subida ilimitada de música', included: true },
    { text: 'Reproducción ilimitada', included: true },
    { text: 'Perfil de artista', included: true },
    { text: 'Anuncios al descargar', included: false },
    { text: 'Samples de pago', included: false },
    { text: 'Descargas limitadas', included: false },
  ];

  const premiumFeatures = [
    { text: 'Subida ilimitada de música', included: true },
    { text: 'Reproducción ilimitada', included: true },
    { text: 'Perfil de artista destacado', included: true },
    { text: 'Sin anuncios', included: true },
    { text: 'Samples gratis', included: true },
    { text: 'Descargas ilimitadas', included: true },
    { text: 'Estadísticas avanzadas', included: true },
    { text: 'Prioridad en búsqueda', included: true },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <div className={`inline-block bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-3 mb-4`}>
          <h1 className="text-black">PLANES Y PRECIOS</h1>
        </div>
        <p className={`${isDark ? 'text-white' : 'text-black'} text-xl`}>
          Elige el plan perfecto para tu carrera musical
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className={`${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
          <div className="text-center mb-6">
            <h3 className={`${isDark ? 'text-white' : 'text-black'} mb-2`}>GRATIS</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className={`text-5xl font-black ${isDark ? 'text-white' : 'text-black'}`}>$0</span>
              <span className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>/ mes</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {freeFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-[var(--color-brutal-green)] flex-shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-[var(--color-brutal-red)] flex-shrink-0" />
                )}
                <span className={`${isDark ? 'text-white' : 'text-black'} ${!feature.included && 'opacity-50'}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <button
            disabled={!isPremium}
            className={`w-full ${isDark ? 'bg-[var(--color-dark-bg)] text-white' : 'bg-white text-black'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow' : 'brutal-shadow'} px-6 py-4 font-black ${!isPremium ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'}`}
          >
            {isPremium ? 'PLAN ACTUAL' : 'USAR GRATIS'}
          </button>
        </div>

        {/* Premium Plan */}
        <div className={`bg-[var(--color-brutal-yellow)] border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-xl' : 'brutal-shadow-xl'} p-6 relative`}>
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white border-4 ${isDark ? 'border-white' : 'border-white'} px-6 py-2">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              <span className="font-black">POPULAR</span>
            </div>
          </div>

          <div className="text-center mb-6 mt-4">
            <h3 className="text-black mb-2">PREMIUM</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-black text-black">$50</span>
              <span className="text-black opacity-70">MXN / mes</span>
            </div>
          </div>

          <ul className="space-y-3 mb-8">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-black flex-shrink-0" />
                <span className="text-black font-black">
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>

          <button
            onClick={onSubscribe}
            disabled={isPremium}
            className={`w-full bg-black text-white border-4 ${isDark ? 'border-white' : 'border-white'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} px-6 py-4 font-black ${isPremium ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'}`}
          >
            {isPremium ? '✓ SUSCRITO' : 'SUSCRIBIRSE AHORA'}
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className={`mt-8 ${isDark ? 'bg-[var(--color-dark-surface)]' : 'bg-white'} border-4 ${isDark ? 'border-white' : 'border-black'} ${isDark ? 'brutal-shadow-lg' : 'brutal-shadow-lg'} p-6`}>
        <h3 className={`${isDark ? 'text-white' : 'text-black'} mb-4`}>PREGUNTAS FRECUENTES</h3>
        <div className="space-y-4">
          <div>
            <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
              ¿Puedo cancelar mi suscripción en cualquier momento?
            </p>
            <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>
              Sí, puedes cancelar tu suscripción cuando quieras. Mantendrás acceso premium hasta el final del período pagado.
            </p>
          </div>
          <div>
            <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
              ¿Cómo funcionan los anuncios?
            </p>
            <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>
              Los usuarios gratuitos ven un anuncio de 5 segundos antes de descargar. Los artistas reciben una comisión por cada anuncio visto.
            </p>
          </div>
          <div>
            <p className={`${isDark ? 'text-white' : 'text-black'} font-black mb-1`}>
              ¿Qué son los samples gratuitos?
            </p>
            <p className={`${isDark ? 'text-white' : 'text-black'} opacity-70`}>
              Con Premium, puedes descargar samples de nuestra biblioteca sin límites para usar en tus producciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
