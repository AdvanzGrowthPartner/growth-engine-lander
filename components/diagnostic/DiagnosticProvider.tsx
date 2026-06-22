"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Contexto compartido del diagnóstico.
// Es el "contrato" estable entre la landing (que dispara los CTAs)
// y el modal (que en la Fase 4 trae el flujo completo).
type DiagnosticContextValue = {
  isOpen: boolean;
  storeUrl: string;
  open: (url?: string) => void;
  close: () => void;
  setStoreUrl: (url: string) => void;
};

const DiagnosticContext = createContext<DiagnosticContextValue | null>(null);

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  const open = useCallback((url?: string) => {
    if (typeof url === "string" && url.trim()) setStoreUrl(url.trim());
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DiagnosticContext.Provider
      value={{ isOpen, storeUrl, open, close, setStoreUrl }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) {
    throw new Error("useDiagnostic debe usarse dentro de <DiagnosticProvider>");
  }
  return ctx;
}
