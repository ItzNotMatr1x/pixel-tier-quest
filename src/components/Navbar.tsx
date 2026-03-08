import { Link, useLocation } from "react-router-dom";
import { PlayerSearch } from "./PlayerSearch";
import { Swords, Shield } from "lucide-react";

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
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Swords className="w-7 h-7 text-primary group-hover:drop-shadow-[0_0_8px_hsl(190_100%_50%/0.8)] transition-all" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-foreground text-glow-cyan">
              PIXEL TIERS
            </span>
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
          <div className="hidden sm:block">
            <PlayerSearch />
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
