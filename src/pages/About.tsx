import { ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "4", label: "disease classes" },
  { value: "ViT-B/16", label: "model backbone" },
  { value: "FGSM + PGD", label: "attacks evaluated" },
  { value: "3", label: "models compared" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      {/* Hero */}
      <section className="flex w-full flex-col items-center px-4 pb-20 pt-24 text-center">
        <span className="mb-6 rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
          Final Year Project — 2024–25
        </span>

        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
          Robust and interpretable chest X-ray classification using Vision Transformers
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Evaluating adversarial vulnerability, improving robustness through adversarial training, and explaining model decisions using occlusion-based attribution maps.
        </p>

        <div className="mt-10 flex gap-4">
          <Button size="lg" className="rounded-full px-8" onClick={() => navigate("/demo")}>
            Try the demo
          </Button>
          <Button variant="outline" size="lg" className="rounded-full px-8">
            View report
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full border-t border-border">
        <div className="container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="font-display text-2xl font-bold text-foreground">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="py-4">
        <ArrowDown className="h-5 w-5 animate-bounce text-muted-foreground" />
      </div>
    </div>
  );
};

export default About;
