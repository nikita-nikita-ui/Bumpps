import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("bummps_admin");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email, password) => {
    await new Promise((res) => setTimeout(res, 1200));
    const profile = {
      name: "Ayesha Malik",
      email,
      role: "Super Admin",
      avatar: "https://i.pravatar.cc/150?img=47",
    };
    localStorage.setItem("bummps_admin", JSON.stringify(profile));
    setAdmin(profile);
    return profile;
  };

  const logout = () => {
    localStorage.removeItem("bummps_admin");
    setAdmin(null);
  };

  return <AuthContext.Provider value={{ admin, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
