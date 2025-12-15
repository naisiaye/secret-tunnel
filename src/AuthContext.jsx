import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [location, setLocation] = useState("GATE");

  const signUp = async (username, password) => {
    console.log(`signup called`, username, password);
    const response = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const retreivedToken = await response.json();
    if (response.ok) {
      setToken(retreivedToken.token);
      setLocation("TABLET");
    }
  };
  // signUp();
  const authenticate = async () => {
    if (!token) throw Error(`NO TOKEN`);
    const response = await fetch(`${API}/authenticate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const tokenVerified = await response.json();
    if (!response.ok) {
      throw new Error(`Authentication Failed`);
    }
    setLocation("TUNNEL");
    return tokenVerified;
  };
  const value = {
    token,
    setToken,
    location,
    setLocation,
    signUp,
    authenticate,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
export default AuthContext;
