// In this file we will create context once user is logged in we will share the token with all the files
"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import LoginModal from "@/app/components/LoginModal";

interface AuthContextType {
  token: string | null;
  setToken: (t: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  // automatically get the token from localstorage if it exists
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken as string | null);
    setIsChecking(false);
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Show login modal if no token (after initial check)
  const showLoginModal = !isChecking && !token;

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {showLoginModal && <LoginModal />}
      <div className={showLoginModal ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");
  return context;
}
