import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react";

const cleanAccuracy = [
  { model: "Standard ViT", accuracy: "94.2%", trend: "up" as const },
  { model: "FGSM-robust ViT", accuracy: "91.8%", trend: "down" as const },
  { model: "PGD-robust ViT", accuracy: "90.5%", trend: "down" as const },
];

const robustAccuracy = [
  { attack: "FGSM ε=0.003", standard: "31.4%", fgsm: "78.6%", pgd: "74.2%" },
  { attack: "PGD ε=0.003", standard: "12.8%", fgsm: "62.3%", pgd: "71.9%" },
  { attack: "PGD ε=0.005", standard: "4.1%", fgsm: "48.7%", pgd: "59.3%" },
];

const keyFindings = [
  {
    icon: AlertTriangle,
    title: "Standard ViT is fragile",
    desc: "Accuracy drops from 94.2% to 12.8% under PGD attack at ε = 0.003, revealing severe adversarial vulnerability.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "Adversarial training works",
    desc: "PGD-robust model retains 71.9% accuracy under the same attack, a 59 percentage-point improvement over the standard model.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: TrendingDown,
    title: "Clean accuracy trade-off",
    desc: "Robust models sacrifice 2–4% clean accuracy, a modest cost for substantially improved adversarial resilience.",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
];

const Results = () => (
  <div className="flex flex-col items-center overflow-hidden">
    {/* Header */}
    <section className="relative w-full px-4 pb-12 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />
      <span className="relative mb-4 inline-block rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        Results
      </span>
      <h1 className="relative font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
        Evaluation results
      </h1>
      <p className="relative mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
        Comparing classification accuracy, adversarial robustness, and the accuracy–robustness trade-off across all three models.
      </p>
    </section>

    {/* Clean accuracy */}
    <section className="w-full px-4 pb-16">
      <div className="container max-w-4xl">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Clean accuracy</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {cleanAccuracy.map((row) => (
            <div key={row.model} className="rounded-2xl border border-border bg-card p-6 card-hover text-center">
              <p className="text-sm font-medium text-muted-foreground">{row.model}</p>
              <p className="mt-2 font-display text-4xl font-bold text-foreground">{row.accuracy}</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-sm">
                {row.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-accent" />
                )}
                <span className={row.trend === "up" ? "text-success" : "text-accent"}>
                  {row.trend === "up" ? "Best on clean" : "Trade-off"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Robust accuracy table */}
    <section className="w-full px-4 pb-16">
      <div className="container max-w-4xl">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Accuracy under attack</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Attack</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Standard</th>
                <th className="px-6 py-4 text-right font-semibold text-primary">FGSM-robust</th>
                <th className="px-6 py-4 text-right font-semibold text-primary">PGD-robust</th>
              </tr>
            </thead>
            <tbody>
              {robustAccuracy.map((row) => (
                <tr key={row.attack} className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium text-foreground">{row.attack}</td>
                  <td className="px-6 py-4 text-right text-accent font-semibold">{row.standard}</td>
                  <td className="px-6 py-4 text-right text-foreground">{row.fgsm}</td>
                  <td className="px-6 py-4 text-right text-foreground font-semibold">{row.pgd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Key findings */}
    <section className="w-full px-4 pb-24">
      <div className="container max-w-4xl">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Key findings</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {keyFindings.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-6 card-hover">
              <div className={`mb-4 inline-flex rounded-xl ${f.bg} p-3`}>
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
              <h3 className="mb-2 font-display text-base font-bold text-foreground">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Results;
