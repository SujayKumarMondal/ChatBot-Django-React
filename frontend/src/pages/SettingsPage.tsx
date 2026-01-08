import { useState, useEffect } from "react";
import { useTheme, themePresets, accentColors, Theme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Settings, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();
  const {
    currentTheme,
    setTheme,
    accentColor,
    setAccentColor,
    highContrast,
    setHighContrast,
    warmPalette,
    setWarmPalette,
  } = useTheme();

  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "base");
  const [messageDensity, setMessageDensity] = useState(
    localStorage.getItem("messageDensity") || "comfortable"
  );
  const [autoScroll, setAutoScroll] = useState(
    localStorage.getItem("autoScroll") !== "false"
  );
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") !== "false"
  );
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem("soundEnabled") !== "false"
  );
  const [compactSidebar, setCompactSidebar] = useState(
    localStorage.getItem("compactSidebar") === "true"
  );

  // Initialize data attributes on mount
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-font-size", fontSize);
    root.setAttribute("data-message-density", messageDensity);
  }, []);

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.setAttribute("data-font-size", size);
  };

  const handleMessageDensityChange = (density: string) => {
    setMessageDensity(density);
    localStorage.setItem("messageDensity", density);
    document.documentElement.setAttribute("data-message-density", density);
  };

  const handleAutoScrollChange = (value: boolean) => {
    setAutoScroll(value);
    localStorage.setItem("autoScroll", String(value));
  };

  const handleNotificationsChange = (value: boolean) => {
    setNotifications(value);
    localStorage.setItem("notifications", String(value));
  };

  const handleSoundChange = (value: boolean) => {
    setSoundEnabled(value);
    localStorage.setItem("soundEnabled", String(value));
  };

  const handleCompactSidebarChange = (value: boolean) => {
    setCompactSidebar(value);
    localStorage.setItem("compactSidebar", String(value));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="flex items-center gap-4 px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-muted transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-8 space-y-8">
        {/* Theme Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Moon className="h-5 w-5" />
            Theme
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(Object.entries(themePresets) as [Theme, any][]).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  currentTheme === key
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-sm">{theme.label}</div>
                <div className="text-xs text-muted-foreground">{theme.description}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Accent Color Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Accent Color</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={`h-12 rounded-lg border-2 transition-transform hover:scale-110 ${
                  accentColor === color.value
                    ? "border-foreground scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={`Select ${color.name} accent`}
              />
            ))}
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Accessibility</h3>
          <div className="space-y-3">
            <ToggleOption
              label="High Contrast Mode"
              description="Increases color contrast for better visibility"
              checked={highContrast}
              onChange={setHighContrast}
            />
            <ToggleOption
              label="Warm Color Palette"
              description="Uses warm tones instead of cool tones"
              checked={warmPalette}
              onChange={setWarmPalette}
            />
          </div>
        </section>

        {/* Font Size Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Font Size</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Small", value: "small" },
              { label: "Base", value: "base" },
              { label: "Large", value: "large" },
              { label: "Extra Large", value: "xl" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleFontSizeChange(value)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  fontSize === value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Message Display Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Message Display</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { label: "Compact", value: "compact" },
              { label: "Comfortable", value: "comfortable" },
              { label: "Spacious", value: "spacious" },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleMessageDensityChange(value)}
                className={`px-3 py-2 rounded-lg border transition-colors ${
                  messageDensity === value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* Chat Behavior Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Chat Behavior</h3>
          <div className="space-y-3">
            <ToggleOption
              label="Auto-Scroll to Latest"
              description="Automatically scroll to the latest message"
              checked={autoScroll}
              onChange={handleAutoScrollChange}
            />
            <ToggleOption
              label="Compact Sidebar"
              description="Make sidebar narrower with icon-only view"
              checked={compactSidebar}
              onChange={handleCompactSidebarChange}
            />
          </div>
        </section>

        {/* Notification Settings */}
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          <div className="space-y-3">
            <ToggleOption
              label="Enable Notifications"
              description="Show desktop notifications for new messages"
              checked={notifications}
              onChange={handleNotificationsChange}
            />
            <ToggleOption
              label="Sound Effects"
              description="Play sound for notifications"
              checked={soundEnabled}
              onChange={handleSoundChange}
              disabled={!notifications}
            />
          </div>
        </section>

        {/* Reset Section */}
        <section className="space-y-4 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground">Reset</h3>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            variant="outline"
            className="w-full"
          >
            Reset All Settings to Default
          </Button>
        </section>
      </div>
    </div>
  );
}

interface ToggleOptionProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleOption({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleOptionProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border border-border ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 rounded cursor-pointer accent-primary"
        aria-label={label}
      />
    </div>
  );
}
