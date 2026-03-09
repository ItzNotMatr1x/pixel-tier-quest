import { Link, useLocation } from "react-router-dom";
import { PlayerSearch } from "./PlayerSearch";
import { Shield } from "lucide-react";
import pixelValleyLogo from "@/assets/pixelvalley-logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/leaderboard", label: "Overall Leaderboard" },
  { to: "/gamemodes", label: "Gamemode Rankings" },
  { to: "/players", label: "Players" },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex-shrink-0">
            <img src={pixelValleyLogo} alt="Pixel Valley" className="w-9 h-9 rounded-md" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-lg text-sm font-heading font-medium transition-all
                  ${location.pathname === link.to
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <PlayerSearch />
            <div className="flex items-center gap-3 text-[11px] font-heading">
              <span className="text-muted-foreground font-bold tracking-wider text-glow-cyan">play.pixelvalley.fun</span>
              <a
                href="https://discord.gg/x7QFZNat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted-foreground hover:text-[#5865F2] transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Discord
              </a>
            </div>
          </div>
          <Link
            to="/admin"
            className={`p-2 rounded-lg transition-all ${location.pathname === '/admin' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'}`}
            title="Admin Panel"
          >
            <Shield className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
