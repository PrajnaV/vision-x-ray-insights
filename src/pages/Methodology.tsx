import { Database, Cpu, Zap, Shield, Eye } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "Dataset",
    desc: "COVID-19 Radiography Dataset with 21,165 chest X-ray images across four classes: COVID-19, Normal, Lung Opacity, and Viral Pneumonia. Images resized to 224 × 224 and normalised with ImageNet statistics.",
    detail: "Stratified 80/10/10 train-val-test split preserving class distribution.",
  },
  {
    icon: Cpu,
    title: "Model architecture",
    desc: "Vision Transformer (ViT-B/16) pre-trained on ImageNet-21k. The patch embedding layer divides each image into 14 × 14 non-overlapping patches of 16 × 16 pixels, producing 196 tokens fed into a 12-layer transformer encoder.",
    detail: "Classification head replaced with a 4-class linear layer; fine-tuned end-to-end for 20 epochs.",
  },
  {
    icon: Zap,
    title: "Adversarial attacks",
    desc: "Fast Gradient Sign Method (FGSM) applies a single-step perturbation along the sign of the loss gradient. Projected Gradient Descent (PGD) iterates this process with small steps and projects back onto the ε-ball.",
    detail: "Evaluated at ε ∈ {0.002, 0.003, 0.005} to measure model fragility.",
  },
  {
    icon: Shield,
    title: "Adversarial training",
    desc: "Two robust models are trained: one with FGSM-augmented batches (50 % clean / 50 % adversarial), and one with PGD-augmented batches at ε = 0.003, 7 steps, step size α = 0.001.",
    detail: "The objective is to minimise worst-case loss over the perturbation set.",
  },
  {
    icon: Eye,
    title: "Interpretability (MDA)",
    desc: "Model Decision Attribution systematically occludes 16 × 16 patches and measures the drop in predicted probability. The resulting attribution map is up-sampled and overlaid as a heatmap on the original image.",
    detail: "High-attribution regions indicate which areas most influence the model's prediction.",
  },
];

const Methodology = () => (
  <div className="flex flex-col items-center overflow-hidden">
    {/* Header */}
    <section className="relative w-full px-4 pb-12 pt-24 text-center">
      <div className="pointer-events-none absolute inset-0 dot-pattern opacity-30" />
      <span className="relative mb-4 inline-block rounded-full bg-primary/5 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
        Methodology
      </span>
      <h1 className="relative font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
        How it works
      </h1>
      <p className="relative mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
        A five-stage pipeline from data preparation through model evaluation and visual explanation.
      </p>
    </section>

    {/* Timeline */}
    <section className="w-full px-4 pb-24">
      <div className="container max-w-3xl">
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-primary/30 via-accent/20 to-transparent md:block" />

          {steps.map((step, i) => (
            <div key={step.title} className="group relative flex gap-6 py-8">
              {/* Icon node */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card shadow-sm transition-shadow group-hover:shadow-md group-hover:shadow-primary/10">
                <step.icon className="h-5 w-5 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 rounded-2xl border border-border bg-card p-6 card-hover">
                <div className="mb-1 flex items-center gap-3">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                <p className="mt-2 text-sm font-medium text-foreground/70">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Methodology;
