export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-6 text-center space-y-2">
        <p className="font-heading font-bold text-sm text-muted-foreground">
          © {new Date().getFullYear()} Thunder Tiers. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60 font-heading">
          Made by <span className="text-primary font-semibold">ItzNotMatr1x</span>
        </p>
        <a
          href="https://discord.gg/APudySH8Q8"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs font-heading font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Join our Discord →
        </a>
      </div>
    </footer>
  );
}
