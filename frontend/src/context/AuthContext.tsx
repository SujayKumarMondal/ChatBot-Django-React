import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  username: string;
  email: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  storeUserSearch: (searchQuery: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Restore user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🔹 Sign In (JWT login with Django backend)
  const signIn = async (email: string, password: string) => {
  try {
    const response = await fetch("http://127.0.0.1:7004/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.detail || "Invalid email or password");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    const userProfile: User = {
      username: data.user.username,
      email: data.user.email,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
    };

    setUser(userProfile);
    localStorage.setItem("user", JSON.stringify(userProfile));
  } catch (err: any) {
    throw new Error(err.message || "Login failed");
  }
};


  // 🔹 Register (calls Django backend)
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("http://127.0.0.1:7004/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Registration failed");
      }

      const data = await response.json();

      // Save tokens from register response
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      // Save user profile from register response
      const userProfile: User = {
        username: data.user.username,
        email: data.user.email,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
      };

      setUser(userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));
    } catch (err: any) {
      throw new Error(err.message || "Registration failed");
    }
  };

  // 🔹 Sign Out
  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  // 🔹 Store User Search
  const storeUserSearch = async (searchQuery: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("User is not authenticated");

      const response = await fetch("http://127.0.0.1:7004/api/store_search/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ search_query: searchQuery }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to store search query");
      }
    } catch (err: any) {
      console.error("Error storing search query:", err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, register, storeUserSearch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use Auth
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
