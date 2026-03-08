import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { searchPlayers, getPlayerAvatarUrl, Player } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export function PlayerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Player[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setResults(searchPlayers(query));
    setOpen(query.length > 0);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectPlayer = (name: string) => {
    setQuery("");
    setOpen(false);
    navigate(`/player/${name}`);
  };

  return (
    <div ref={ref} className="relative">
      <div className="flex items-center glass-card px-3 py-1.5 gap-2 w-64">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && results.length > 0) selectPlayer(results[0].name);
          }}
          placeholder="Search Minecraft Player…"
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full font-body"
        />
      </div>
      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full mt-2 left-0 right-0 glass-card p-1 z-50 max-h-80 overflow-y-auto"
          >
            {results.map(p => (
              <button
                key={p.name}
                onClick={() => selectPlayer(p.name)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-secondary/60 transition-colors text-left"
              >
                <img src={getPlayerAvatarUrl(p.name)} alt={p.name} className="w-6 h-6 rounded-sm" />
                <span className="text-sm font-heading text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">{p.region}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
