import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function LoginPrompt() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Chatbot Character SVG */}
        <svg
          viewBox="0 0 200 220"
          className="w-40 h-40 mx-auto mb-8"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Antenna */}
          <line x1="100" y1="15" x2="100" y2="35" stroke="#6366F1" strokeWidth="4" />
          <circle cx="100" cy="10" r="6" fill="#6366F1" />

          {/* Head */}
          <rect
            x="45"
            y="35"
            width="110"
            height="80"
            rx="20"
            fill="#E5E7EB"
            stroke="#6366F1"
            strokeWidth="3"
          />

          {/* Eyes */}
          <rect x="65" y="65" width="25" height="12" rx="6" fill="#111827" />
          <rect x="110" y="65" width="25" height="12" rx="6" fill="#111827" />
          <circle cx="72" cy="69" r="2" fill="#ffffff" />
          <circle cx="117" cy="69" r="2" fill="#ffffff" />

          {/* Mouth */}
          <path
            d="M80 90 Q100 100 120 90"
            stroke="#6366F1"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />

          {/* Body */}
          <rect
            x="60"
            y="120"
            width="80"
            height="55"
            rx="15"
            fill="#6366F1"
          />

          {/* Chat Icon on Body */}
          <rect x="85" y="135" width="30" height="18" rx="4" fill="#ffffff" />
          <circle cx="92" cy="144" r="2" fill="#6366F1" />
          <circle cx="100" cy="144" r="2" fill="#6366F1" />
          <circle cx="108" cy="144" r="2" fill="#6366F1" />

          {/* Arms */}
          <rect x="35" y="130" width="25" height="12" rx="6" fill="#E5E7EB" />
          <rect x="140" y="130" width="25" height="12" rx="6" fill="#E5E7EB" />

          {/* Legs */}
          <rect x="78" y="175" width="12" height="25" rx="4" fill="#6366F1" />
          <rect x="110" y="175" width="12" height="25" rx="4" fill="#6366F1" />
        </svg>

        {/* Message */}
        <h2 className="text-3xl font-bold mb-3 text-foreground">
          Welcome to ChatPaat
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Sign in to start chatting with your AI assistant and experience smart,
          real-time conversations.
          <p>
            It can make mistakes, check wisely before you act!
          </p>
        </p>
          

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/signin")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base"
          >
            Sign In
          </Button>
          <Button
            onClick={() => navigate("/register")}
            variant="outline"
            className="py-3 text-base"
          >
            Create Account
          </Button>
        </div>

        {/* Additional info */}
        <p className="text-xs text-muted-foreground mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-primary hover:underline font-semibold"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
}
