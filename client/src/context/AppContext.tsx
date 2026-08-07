import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

interface AppContextValue {
  appName: string;
  setAppName: (name: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appName, setAppName] = useState("TTCM Full-Stack Starter");

  const value = useMemo(
    () => ({
      appName,
      setAppName
    }),
    [appName]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider.");
  }
  return context;
};
