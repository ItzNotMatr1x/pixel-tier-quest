import { motion } from "framer-motion";
import { Headphones, Circle } from "lucide-react";
import { useOnlineTesters } from "@/hooks/useOnlineTesters";

export function OnlineTesters() {
  const { online, loading, widgetError } = useOnlineTesters();

  return (
    <section className="container mx-auto px-4 mb-20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Headphones className="w-6 h-6 text-primary drop-shadow-[0_0_8px_hsl(190_100%_50%/0.6)]" />
          <h2 className="font-display font-bold text-2xl text-foreground">Online Testers</h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-heading text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          Live from Discord
        </div>
      </div>

      {loading ? (
        <div className="glass-card p-8 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : online.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Circle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="font-heading text-muted-foreground text-sm">
            {widgetError ? widgetError : "No testers online right now. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {online.map((t, i) => (
            <motion.a
              key={t.id}
              href="https://discord.gg/APudySH8Q8"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.4) }}
              className="glass-card p-4 flex flex-col items-center text-center hover:glow-cyan hover:border-primary/30 transition-all group"
            >
              <div className="relative mb-3">
                {t.member.avatar_url ? (
                  <img
                    src={t.member.avatar_url}
                    alt={t.member.username}
                    className="w-14 h-14 rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-xl text-primary">
                    {t.member.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-background shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              </div>
              <span className="font-heading font-bold text-foreground text-sm truncate w-full group-hover:text-primary transition-colors">
                {t.member.username}
              </span>
              {t.note && (
                <span className="text-[10px] text-muted-foreground font-heading mt-1 truncate w-full">{t.note}</span>
              )}
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
}
