import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./components/AuthProvider";

import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
    <Toaster
      richColors
      position="top-center"
      toastOptions={{
        style: {
          border: '4px solid black',
          borderRadius: '0px',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          fontWeight: '900',
          textTransform: 'uppercase',
        },
        classNames: {
          success: 'bg-[var(--color-brutal-green)] text-black',
          error: 'bg-[var(--color-brutal-red)] text-white',
          info: 'bg-[var(--color-brutal-blue)] text-white',
          warning: 'bg-[var(--color-brutal-yellow)] text-black',
        }
      }}
    />
  </AuthProvider>
);
