import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:7004/api/auth/password-reset/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Failed to request password reset");
      setMessage("If an account with that email exists, you will receive instructions shortly.");
    } catch (err: any) {
      setError(err.message || "Failed to send request");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <form onSubmit={handleSubmit} className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <Input
          name="email"
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">Send reset email</Button>
        <p className="text-center text-sm">
          Remembered your password? <span className="text-primary cursor-pointer" onClick={() => navigate('/signin')}>Sign in</span>
        </p>
      </form>
    </div>
  );
}
