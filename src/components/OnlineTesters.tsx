import { motion } from "framer-motion";
import { Headphones, Circle, UserRound } from "lucide-react";
import { useOnlineTesters, DisplayTester } from "@/hooks/useOnlineTesters";

function TesterGrid({ testers, offline = false }: { testers: DisplayTester[]; offline?: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {testers.map((tester, index) => (
        <motion.a key={tester.id} href="https://discord.gg/APudySH8Q8" target="_blank" rel="noreferrer"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(index * 0.04, 0.4) }}
          className={`glass-card p-4 flex flex-col items-center text-center hover:glow-cyan hover:border-primary/30 transition-all group ${offline ? "opacity-70" : ""}`}>
          <div className="relative mb-3">
            {tester.avatar_url ? <img src={tester.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover" loading="lazy" /> :
              <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center"><UserRound className="w-6 h-6 text-muted-foreground" /></div>}
            <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${offline ? "bg-muted-foreground" : "bg-primary"}`} />
          </div>
          <span className="font-heading font-bold text-foreground text-sm truncate w-full group-hover:text-primary transition-colors">{tester.username}</span>
          {tester.note && <span className="text-[10px] text-muted-foreground font-heading mt-1 truncate w-full">{tester.note}</span>}
        </motion.a>
      ))}
    </div>
  );
}

export function OnlineTesters() {
  const { online, offline, loading, widgetError } = useOnlineTesters();

  return (
    <section className="container mx-auto px-4 mb-20">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <Headphones className="w-6 h-6 text-primary" />
          <h2 className="font-display font-bold text-2xl text-foreground">Online Testers</h2>
        </div>
        <span className="text-xs font-heading text-muted-foreground">Live from Discord</span>
      </div>
      {loading ? <div className="glass-card p-8 flex items-center justify-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div> : (
        <>
          {online.length ? <TesterGrid testers={online} /> : <div className="glass-card p-8 text-center"><Circle className="w-8 h-8 text-muted-foreground mx-auto mb-2" /><p className="font-heading text-muted-foreground text-sm">{widgetError || "No testers online right now. Check back soon!"}</p></div>}
          {offline.length > 0 && <div className="mt-10"><h3 className="font-display font-bold text-xl text-foreground mb-5">Offline Testers</h3><TesterGrid testers={offline} offline /></div>}
        </>
      )}
    </section>
  );
}