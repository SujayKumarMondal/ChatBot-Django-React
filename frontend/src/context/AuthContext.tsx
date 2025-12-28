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
  token: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithTokens: (access: string, refresh: string, user: User) => void;
  signOut: () => void;
  logout: () => void; // Alias for signOut, used in ProfilePage
  register: (username: string, email: string, password: string) => Promise<void>;
  storeUserSearch: (searchQuery: string) => Promise<void>;
  refreshTrigger: number; // Trigger for external components to refetch on auth change
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Restore user on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("access_token");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
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
    setToken(data.access);

    const userProfile: User = {
      username: data.user.username,
      email: data.user.email,
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
    };

    setUser(userProfile);
    localStorage.setItem("user", JSON.stringify(userProfile));
    setRefreshTrigger(prev => prev + 1); // Trigger refetch in sidebar
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
      setToken(data.access);

      // Save user profile from register response
      const userProfile: User = {
        username: data.user.username,
        email: data.user.email,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${data.user.email}`,
      };

      setUser(userProfile);
      localStorage.setItem("user", JSON.stringify(userProfile));
      setRefreshTrigger(prev => prev + 1); // Trigger refetch in sidebar
    } catch (err: any) {
      throw new Error(err.message || "Registration failed");
    }
  };

  // 🔹 Sign Out
  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setRefreshTrigger(prev => prev + 1);
  };

  // 🔹 Logout (alias for signOut, used in ProfilePage)
  const logout = () => {
    signOut();
  };

  // 🔹 Sign In With Tokens (used by OAuth callback)
  const signInWithTokens = (access: string, refresh: string, userProfile: User) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setToken(access);
    setUser(userProfile);
    localStorage.setItem("user", JSON.stringify(userProfile));
    setRefreshTrigger(prev => prev + 1);
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
    <AuthContext.Provider value={{ user, token, signIn, signInWithTokens, signOut, logout, register, storeUserSearch, refreshTrigger }}>
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
