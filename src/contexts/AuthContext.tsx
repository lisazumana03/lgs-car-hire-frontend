import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, User, SignupData } from "@/services/api";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (userData: SignupData) => Promise<AuthResult>;
  logout: () => void;
  isAdmin: () => boolean;
  isCustomer: () => boolean;
  loading: boolean;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        } else {
          // Invalid user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (savedUser === "undefined" || savedUser === "null") {
      // Clean up invalid storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const data = await authAPI.login(email, password);

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  const signup = async (userData: SignupData): Promise<AuthResult> => {
    try {
      const data = await authAPI.signup(userData);

      // After signup, log the user in
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }

      return { success: true, user: data.user };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed. Please try again.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "ADMIN";
  };

  const isCustomer = () => {
    return user?.role === "CUSTOMER";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAdmin,
        isCustomer,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
