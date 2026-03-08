import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md glow-cyan"
      >
        <div className="flex items-center gap-3 mb-2 justify-center">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="font-display font-bold text-2xl text-foreground">Admin Access</h1>
        </div>
        <p className="text-center text-muted-foreground font-heading text-sm mb-6">Authorized personnel only</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="glass-card px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50"
              placeholder="Enter admin email"
            />
          </div>
          <div>
            <label className="text-xs font-heading text-muted-foreground uppercase tracking-wider mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="glass-card px-4 py-2.5 text-sm font-body text-foreground placeholder:text-muted-foreground outline-none w-full bg-transparent focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-destructive text-sm font-heading bg-destructive/10 rounded-lg px-3 py-2">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-4 h-4" /> Sign In</>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
