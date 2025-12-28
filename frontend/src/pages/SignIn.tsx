import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your_googl951884061600-pscth36b1shbipqnnclmq4dqk8pku8vi.apps.googleusercontent.come_client_id";

export default function SignInPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(form.email, form.password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <form
        onSubmit={handleSubmit}
        className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" className="w-full">Sign In</Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full mt-2"
          onClick={() => {
            const redirectUri = `${window.location.origin}/oauth-callback`;
            const params = new URLSearchParams({
              client_id: GOOGLE_CLIENT_ID,
              redirect_uri: redirectUri,
              response_type: "code",
              scope: "openid email profile",
              access_type: "offline",
              prompt: "consent",
            });
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
          }}
        >
          Sign in with Google
        </Button>
        <p className="text-center text-sm">
          Don’t have an account?{" "}
          <span
            className="text-primary cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
