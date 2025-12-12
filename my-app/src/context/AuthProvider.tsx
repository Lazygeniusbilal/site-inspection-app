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
  user: { username: string; role: string } | null;
  setUser: (u: { username: string; role: string } | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );
  const [isChecking, setIsChecking] = useState(true);

  // Load token + user once on load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsChecking(false);
  }, []);

  // Always save token
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [token]);

  // Always save user
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Show login modal if no token
  const showLoginModal = !isChecking && !token;

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {showLoginModal && <LoginModal />}
      <div className={showLoginModal ? "blur-sm pointer-events-none" : ""}>
        {children}
      </div>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
