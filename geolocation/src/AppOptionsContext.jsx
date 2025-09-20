import { createContext, useContext, useState, useEffect } from "react";

const AppOptionsContext = createContext();

export const AppOptionsProvider = ({ children }) => {
  // Load from localStorage (or default)
  const [isCelciusUnit, setIsCelciusUnit] = useState(() => {
    const saved = localStorage.getItem("isCelciusUnit");
    return saved !== null ? JSON.parse(saved) : true; // default = Celsius
  });

  const [showCurrentCard, setShowCurrentCard] = useState(() => {
    const saved = localStorage.getItem("showCurrentCard");
    return saved !== null ? JSON.parse(saved) : true; // default = show
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isCelciusUnit", JSON.stringify(isCelciusUnit));
  }, [isCelciusUnit]);

  useEffect(() => {
    localStorage.setItem("showCurrentCard", JSON.stringify(showCurrentCard));
  }, [showCurrentCard]);

  return (
    <AppOptionsContext.Provider
      value={{
        isCelciusUnit,
        setIsCelciusUnit,
        showCurrentCard,
        setShowCurrentCard,
      }}
    >
      {children}
    </AppOptionsContext.Provider>
  );
};

export const useAppOptions = () => useContext(AppOptionsContext);