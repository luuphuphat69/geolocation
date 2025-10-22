import { createContext, useContext, useState, useEffect } from "react";

const AppOptionsContext = createContext();

export const AppOptionsProvider = ({ children }) => {
  // Load from localStorage (or default)
  const [isCelciusUnit, setIsCelciusUnit] = useState(() => {
    const saved = localStorage.getItem("isCelciusUnit");
    return saved !== null ? JSON.parse(saved) : true; // default = Celsius
  });

  useEffect(() => {
    localStorage.setItem("isCelciusUnit", JSON.stringify(isCelciusUnit));
  }, [isCelciusUnit]);

  return (
    <AppOptionsContext.Provider
      value={{
        isCelciusUnit,
        setIsCelciusUnit
      }}
    >
      {children}
    </AppOptionsContext.Provider>
  );
};

export const useAppOptions = () => useContext(AppOptionsContext);