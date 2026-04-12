import { ArrowDown, Shield, Eye, Cpu, Zap, BarChart3, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "4", label: "Disease classes", icon: Layers },
  { value: "ViT-B/16", label: "Model backbone", icon: Cpu },
  { value: "FGSM + PGD", label: "Attacks evaluated", icon: Zap },
  { value: "3", label: "Models compared", icon: BarChart3 },
];

const features = [
  {
    icon: Cpu,
    title: "Vision Transformer",
    desc: "ViT-B/16 architecture fine-tuned on chest X-ray imagery for multi-class classification across four pulmonary conditions.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: Shield,
    title: "Adversarial robustness",
    desc: "Adversarial training with FGSM and PGD attacks to harden the model against imperceptible perturbations.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Eye,
    title: "Interpretability",
    desc: "Occlusion-based attribution maps (MDA) to visualise which regions the model relies on for its predictions.",
    gradient: "from-success to-success/60",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Hero */}
      <section className="relative flex w-full flex-col items-center px-4 pb-24 pt-28 text-center">
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-40" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute left-[15%] top-[20%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" style={{ animation: "float 6s ease-in-out infinite" }} />
        <div className="pointer-events-none absolute right-[10%] top-[30%] h-48 w-48 rounded-full bg-accent/5 blur-3xl" style={{ animation: "float 8s ease-in-out infinite 1s" }} />

        <span className="relative mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 text-sm font-medium text-primary shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Final Year Project — 2024–25
        </span>

        <h1 className="relative max-w-4xl font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Robust and interpretable chest X-ray classification using{" "}
          <span className="gradient-text">Vision Transformers</span>
        </h1>

        <p className="relative mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Evaluating adversarial vulnerability, improving robustness through adversarial training, and explaining model decisions using occlusion-based attribution maps.
        </p>

        <div className="relative mt-10 flex gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            onClick={() => navigate("/demo")}
          >
            Try the demo
          </Button>
          
        </div>
      </section>

      {/* Stats */}
      <section className="w-full border-y border-border bg-card/50">
        <div className="container grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="group flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-muted/50">
              <s.icon className="mb-1 h-5 w-5 text-primary/60 transition-colors group-hover:text-primary" />
              <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Scroll cue */}
      <div className="py-6">
        <ArrowDown className="h-5 w-5 animate-bounce text-muted-foreground/60" />
      </div>

      {/* Features */}
      <section className="w-full px-4 pb-20">
        <div className="container">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Core pillars
            </span>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Three research objectives
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 card-hover"
              >
                {/* Subtle gradient corner */}
                <div className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-[0.07] transition-opacity group-hover:opacity-[0.12]`} />

                <div className={`mb-5 inline-flex rounded-xl bg-gradient-to-br ${f.gradient} p-3 text-white shadow-sm`}>
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative w-full overflow-hidden border-t border-border">
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <div className="container relative flex flex-col items-center gap-6 py-20 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">
            See it in action
          </h2>
          <p className="max-w-lg text-muted-foreground">
            Upload a chest X-ray and watch the model classify it in real time, with attention heatmaps showing exactly where it looks.
          </p>
          <Button
            size="lg"
            className="rounded-full px-10 shadow-lg shadow-primary/20"
            onClick={() => navigate("/demo")}
          >
            Launch interactive demo
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;
