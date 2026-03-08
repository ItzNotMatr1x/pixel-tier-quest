export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-16">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="font-heading font-bold text-sm text-muted-foreground">
          © {new Date().getFullYear()} Pixel Tiers. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60 font-heading mt-1">
          Made by <span className="text-primary font-semibold">ItzNotMatr1x</span>
        </p>
      </div>
    </footer>
  );
}
