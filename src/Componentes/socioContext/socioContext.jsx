import React, { createContext, useContext, useState } from "react";

const SocioContext = createContext();

export const SocioProvider = ({ children }) => {
  const [socio, setSocio] = useState(null);

  return (
    <SocioContext.Provider value={{ socio, setSocio }}>
      {children}
    </SocioContext.Provider>
  );
};

export const useSocio = () => {
  const context = useContext(SocioContext);
  if (!context) {
    throw new Error("useSocio debe usarse dentro de SocioProvider");
  }
  return context;
};
