import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";




const AuthContext = createContext(null);




export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();




  async function login(email, password) {
    setLoading(true);


    try {
      const formData = new FormData();


      formData.append("username", email);
      formData.append("password", password);


      const tokenResponse = await api.post(
        "/auth/token",
        formData
      );


      localStorage.setItem(
        "access_token",
        tokenResponse.data.access_token
      );


      const profileResponse = await api.get("/auth/me");


      setAdmin(profileResponse.data);


      navigate("/dashboard");
    } catch (error) {
      throw new Error(
        error.response?.data?.detail || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }




  function logout() {
    localStorage.removeItem("access_token");
    setAdmin(null);


    navigate("/login");
  }




  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}




export function useAuth() {
  const context = useContext(AuthContext);


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }


  return context;
}