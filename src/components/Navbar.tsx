import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "About" },
  { to: "/methodology", label: "Methodology" },
  { to: "/results", label: "Results" },
  { to: "/demo", label: "Demo" },
];

const Navbar = () => (
  <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
    <nav className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="font-display text-lg font-semibold tracking-tight text-foreground">
          ViT-XRay
        </span>
        <span className="rounded-full border border-primary/30 bg-primary/5 px-3 py-0.5 text-xs font-medium text-primary">
          Research Prototype
        </span>
      </div>

      <div className="flex items-center gap-8">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-primary ${
                isActive
                  ? "text-primary border-b-2 border-primary pb-0.5"
                  : "text-muted-foreground"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  </header>
);

export default Navbar;
