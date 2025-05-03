import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type UserRole = "client" | "coach" | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  specialty?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole;
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole, specialty?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BASE_URL = "http://localhost:5000/api"; // Change to your backend URL

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Updated login function: send role to backend
  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: role ? role.charAt(0).toUpperCase() + role.slice(1) : undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return false;
      }

      localStorage.setItem("token", data.token);

      const safeUser: User = {
        id: data.user.id || data.user._id, // <-- add fallback for _id
        name: data.user.name,
        email: data.user.email,
        role: data.user.role?.toLowerCase() as UserRole,
        profilePicture: data.user.profilePicture || "",
        bio: data.user.bio || "",
        specialty: data.user.specialty || "",
      };
      setUser(safeUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(safeUser));
      toast.success(`Welcome back, ${safeUser.name}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
      return false;
    }
  };

  // Updated signup function: send specialty if role is coach
  const signup = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    specialty?: string
  ): Promise<boolean> => {
    try {
      const payload: any = { name, email, password, role: role ? role.charAt(0).toUpperCase() + role.slice(1) : undefined };
      if (role === "coach" && specialty) {
        payload.specialty = specialty;
      }
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Signup failed");
        return false;
      }

      toast.success("Registration successful! You can now log in.");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("An error occurred during signup");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        role: user?.role || null,
        setUser,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};