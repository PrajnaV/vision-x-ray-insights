import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "About" },
  { to: "/methodology", label: "Methodology" },
  { to: "/results", label: "Results" },
  { to: "/demo", label: "Demo" },
];

const Navbar = () => (
  <header className="sticky top-0 z-50 glass">
    <nav className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative flex h-7 w-7 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent opacity-80" />
          <div className="absolute inset-[3px] rounded-full bg-card" />
          <div className="relative h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          ViT-XRay
        </span>
        <span className="rounded-full bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-0.5 text-xs font-semibold text-primary">
          Research Prototype
        </span>
      </div>

      <div className="flex items-center gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/8"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  </header>
);

export default Navbar;
