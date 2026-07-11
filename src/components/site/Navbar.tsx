export function Navbar() {
  const linkClass = "hover:text-primary transition-colors data-[status=active]:text-primary";
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="size-3 bg-primary animate-pulse" />
          <span className="font-display text-xl font-extrabold tracking-tighter uppercase italic">
            Field.AI
          </span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
          <a href="/#prediction" className={linkClass}>Prédictions</a>
          <a href="/dashboard" className={linkClass}>Dashboard</a>
          <a href="/#classement" className={linkClass}>Classement</a>
          <a href="/#methodologie" className={linkClass}>Méthodologie</a>
        </div>
        <a
          href="/#prediction"
          className="px-4 py-1.5 border border-primary text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
        >
          Accès Modèle
        </a>
      </div>
    </nav>
  );
}