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

  const [showSchedule, setShowSchedule] = useState(() => {
    const saved = localStorage.getItem("showSchedule");
    return saved !== null ? JSON.parse(saved) : false; // default = hidden
  });

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("showSchedule", JSON.stringify(showSchedule));
  }, [showSchedule]);

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
        showSchedule,
        setShowSchedule
      }}
    >
      {children}
    </AppOptionsContext.Provider>
  );
};

export const useAppOptions = () => useContext(AppOptionsContext);