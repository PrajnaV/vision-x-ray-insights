import { useState } from "react";
import { Database, Cpu, Zap, Shield, Eye, GitBranch } from "lucide-react";

const phases = [
  {
    icon: Database,
    title: "Data Preparation",
    summary:
      "COVID-19 Radiography Dataset with chest X-ray images across four clinically relevant classes, cleaned and augmented for optimal training.",
    stats: [
      { label: "Dataset Size", value: "20,950" },
      { label: "Image Resolution", value: "224 × 224 px" },
      { label: "Classes", value: "4" },
    ],
    details: [
      {
        label: "Data Cleaning",
        desc: "Two-stage duplicate removal using perceptual hashing (pHash) and Structural Similarity Index (SSIM)",
        color: "bg-blue-500",
      },
      {
        label: "Augmentation",
        desc: "Class-aware strategy: minority classes with strong augmentation (flips, rotations ±15°, brightness/contrast jitter, erasing); majority classes with light augmentation",
        color: "bg-purple-500",
      },
      {
        label: "Normalization",
        desc: "ImageNet statistics applied for compatibility with pretrained transformer weights",
        color: "bg-emerald-500",
      },
    ],
  },
  {
    icon: Cpu,
    title: "ViT-B/16 Fine-Tuning",
    summary:
      "Pre-trained ViT-B/16 fine-tuned on chest X-rays using a progressive unfreezing strategy to adapt pretrained representations to the medical imaging domain",
    stats: [
      { label: "Patch Size", value: "16 × 16 px" },
      { label: "Encoder layers", value: "12" },
      { label: "Batch Size", value: "32" },
    ],
    details: [
      {
        label: "Architecture",
        desc: "Each 224×224 image is divided into 196 non-overlapping 16×16 patches. Each patch is linearly projected into a 768-dimensional embedding space with learned positional encoding. A learnable [CLS] token is prepended and processed through 12 transformer encoder layers",
        color: "bg-blue-500",
      },
      {
        label: "Fine-Tuning",
        desc: "Only the classification head is trained for the first 10 epochs at learning rate 1e-3.In the second phase, the top four transformer encoder blocks are unfrozen and trained jointly with the head using cosine annealing LR starting at 1e-4. Progressive unfreezing prevents catastrophic forgetting while enabling domain adaptation to medical imaging.",
        color: "bg-purple-500",
      },
      {
        label: "Output",
        desc: "The final [CLS] token representation is passed through a linear classification head mapping to four output classes — COVID, Normal, Lung Opacity, Viral Pneumonia",
        color: "bg-emerald-500",
      },
    ],
  },
  {
    icon: Zap,
    title: "Attack Evaluation",
    summary:
      "To evaluate the adversarial robustness of the trained ViT model, two widely used gradient-based adversarial attacks were applied. ",
    stats: [
      { label: "Single-Step attack", value: "FGSM" },
      { label: "Iterative attack", value: "PGD" },
    ],
    attackCards: [
      {
        name: "FGSM Attack",
        epsilon: "0.001—0.005",
        desc: "Fast Gradient Sign Method applies a single-step perturbation in the direction of the gradient sign at maximum epsilon magnitude. Computationally efficient but provides weaker adversarial examples.",
        parameters: [{ label: "Epsilon ε" }],
      },
      {
        name: "PGD Attack",
        epsilon: "0.0005—0.003",
        alpha: "ϵ/4",
        steps: "7",
        desc: "Projected Gradient Descent is an iterative attack that finds worst-case perturbations by taking multiple small steps within the epsilon ball. Stronger and more effective than FGSM.",
        parameters: [
          { label: "Epsilon ε" },
          { label: "Alpha α" },
          { label: "Steps" },
        ],
      },
    ],
  },
  {
    icon: Shield,
    title: "Adversarial Training and Evaluation",
    summary:
      "Robust models trained with adversarial augmentation using both FGSM and PGD to minimize worst-case loss.",
    trainingCards: [
      {
        name: "FGSM Adversarial Training",
        desc: "Single-step gradient-based perturbations (ε) are applied to create adversarial examples, separated from clean images in each batch. The model computes the gradient of the loss with respect to input images and adds perturbations in the direction of the gradient sign. Training on this combined dataset enables the model to reliably classify both original and adversarially modified inputs.",
      },
      {
        name: "PGD Adversarial Training",
        desc: "Iterative gradient-based perturbations (ε) generate stronger adversarial examples. Each batch is divided equally between clean and adversarial images for balanced robustness training. The model experiences worst-case perturbations during training, improving its defensive capability against iterative attacks.",
      },
      {
        name: "Evaluation & Cross-Attack Analysis",
        desc: "Trained models are evaluated against both FGSM and PGD attacks to measure robustness gains. Cross-attack analysis tests whether robustness transfers across different attack types. Results demonstrate that PGD training produces substantially stronger and more transferable robustness compared to FGSM training, with advantages becoming increasingly evident at higher perturbation strengths.",
      },
    ],
  },
  {
    icon: Eye,
    title: "MDA Analysis",
    summary:
      "Model Decision Attribution systematically occludes regions to analyze and compare how clean and adversarially trained ViT models make classification decisions on chest X-rays.",
    stats: [
      { label: "Test Dataset", value: "200 images" },
      { label: "Per Class", value: "50 images" },
      { label: "Masked Region", value: "64×64 px" },
    ],
    details: [
      {
        label: "Model Comparison",
        desc: "Three Vision Transformer models were analyzed: a clean baseline model trained on original images, an FGSM adversarially trained model, and a PGD adversarially trained model. Balanced Accuracy was computed to ensure equal importance across all four classes (COVID-19, Normal, Lung Opacity, Viral Pneumonia) regardless of their proportion.",
        color: "bg-blue-500",
      },
      {
        label: "MDA Score Calculation",
        desc: "The MDA score quantifies model reliance on the central 64×64 lung region by calculating the difference between balanced accuracy on original images and balanced accuracy after masking that region. This metric reveals the importance of clinically relevant areas to the model's decision-making and enables direct comparison of attention patterns across the three models.",
        color: "bg-purple-500",
      },
      {
        label: "Spatial Attribution & Heatmaps",
        desc: "Spatial MDA heatmaps were generated by sliding a masking window across the entire image and measuring changes in prediction confidence. This systematic occlusion approach produces visual maps highlighting important regions used by the model, revealing how adversarial training influences decision-making behavior and whether models maintain focus on medically significant areas.",
        color: "bg-emerald-500",
      },
    ],
  },
];

const Methodology = () => {
  const [selectedPhase, setSelectedPhase] = useState(0);

  return (
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
        <p className="relative mx-auto mt-5 max-w-4xl text-lg text-muted-foreground">
          A five-stage pipeline from data preparation through adversarial
          robustness analysis and explainability.
        </p>
      </section>

      {/* Interactive Pipeline */}
      <section className="w-full px-4 pb-16">
        <div className="container max-w-4xl mx-auto flex gap-8">
          {/* Vertical Pipeline */}
          <div className="relative flex flex-col items-center gap-4">
            {/* Background vertical line */}
            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/30 via-accent/20 to-transparent" />

            {phases.map((phase, i) => (
              <div
                key={phase.title}
                className="relative flex flex-col items-center w-full"
              >
                {/* Phase Button */}
                <button
                  onClick={() => setSelectedPhase(i)}
                  className={`group relative z-10 flex h-16 w-16 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                    selectedPhase === i
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  aria-label={`Phase ${i + 1}: ${phase.title}`}
                >
                  <phase.icon
                    className={`h-6 w-6 transition-colors duration-300 ${
                      selectedPhase === i
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                </button>

                {/* Title below button */}
                <p className="mt-3 text-center text-sm font-medium text-foreground">
                  {phase.title}
                </p>

                {/* Arrow Connector */}
                {i < phases.length - 1 && (
                  <div
                    className={`mt-4 h-6 w-1 rounded-full transition-colors duration-300 ${
                      selectedPhase >= i ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-border" />

          {/* Detail Panel with Animation */}
          <div className="flex-1 relative min-w-[28rem]">
            <div
              className={`rounded-2xl border border-border bg-card p-8 transition-all duration-500 ${
                selectedPhase >= 0
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {/* Phase Counter and Title */}
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {selectedPhase + 1}
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  {phases[selectedPhase].title}
                </h2>
              </div>

              {/* Summary Paragraph */}
              <p className="text-sm leading-relaxed text-muted-foreground mb-8">
                {phases[selectedPhase].summary}
              </p>

              {/* Stat Strip */}
              {phases[selectedPhase].stats && (
                <div
                  className="grid gap-4 mb-12 justify-center"
                  style={{
                    gridTemplateColumns: `repeat(${phases[selectedPhase].stats.length}, minmax(0, 1fr))`,
                    maxWidth: "fit-content",
                    margin: "0 auto 3rem",
                  }}
                >
                  {phases[selectedPhase].stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-card p-4 text-center"
                    >
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
                        {stat.label}
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Classes Bubbles - Data Preparation only */}
              {selectedPhase === 0 && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2">
                    {[
                      "COVID-19",
                      "Normal",
                      "Lung Opacity",
                      "Viral Pneumonia",
                    ].map((className, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-full border border-border bg-card text-sm font-medium text-foreground"
                      >
                        {className}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attack Cards - Attack Evaluation only */}
              {phases[selectedPhase].attackCards && (
                <div className="space-y-6 mb-8">
                  {phases[selectedPhase].attackCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-card p-4"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        {card.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {card.desc}
                      </p>

                      {/* Parameters with descriptions */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {card.parameters.map((param, pidx) => (
                          <div
                            key={pidx}
                            className="px-3 py-1 rounded-full border border-border bg-card text-xs font-medium text-foreground"
                          >
                            {param.label}
                          </div>
                        ))}
                      </div>

                      {/* Parameter summary description */}
                      <p className="text-xs text-muted-foreground mb-4 italic">
                        {card.name === "FGSM Attack"
                          ? "These parameters control the magnitude and direction of the single-step perturbation applied to generate adversarial examples."
                          : "These parameters define the iterative strategy: epsilon bounds the perturbation radius, alpha controls the magnitude of each gradient step, and steps determines the number of iterations to find worst-case perturbations."}
                      </p>

                      {/* Epsilon range always shown */}
                      <p className="text-xs text-muted-foreground mb-2">
                        <span className="font-medium">Epsilon Range:</span>{" "}
                        {card.epsilon}
                      </p>

                      {/* PGD specific values */}
                      {card.alpha && (
                        <p className="text-xs text-muted-foreground mb-2">
                          <span className="font-medium">Alpha (α):</span>{" "}
                          {card.alpha}
                        </p>
                      )}
                      {card.steps && (
                        <p className="text-xs text-muted-foreground">
                          <span className="font-medium">Steps:</span>{" "}
                          {card.steps}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Training Cards - Adversarial Training and Evaluation only */}
              {phases[selectedPhase].trainingCards && (
                <div className="space-y-6 mb-8">
                  {phases[selectedPhase].trainingCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <h3 className="text-sm font-semibold text-foreground mb-3">
                        {card.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {card.desc}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Detail Card with Rows */}
              {!phases[selectedPhase].attackCards &&
                !phases[selectedPhase].trainingCards && (
                  <div className="rounded-lg border border-border bg-card overflow-hidden">
                    {phases[selectedPhase].details.map((detail, idx) => (
                      <div
                        key={idx}
                        className={`p-4 flex gap-4 ${
                          idx !== phases[selectedPhase].details.length - 1
                            ? "border-b border-border"
                            : ""
                        }`}
                      >
                        {/* Colored Dot */}
                        <div
                          className={`shrink-0 w-3 h-3 rounded-full ${detail.color} mt-1.5`}
                        />

                        {/* Content */}
                        <div className="flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                            {detail.label}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {detail.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Animated Background Glow */}
            <div
              className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-transparent blur-xl transition-opacity duration-500 ${
                selectedPhase >= 0 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex justify-center gap-1">
          {phases.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${
                i <= selectedPhase ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Methodology;
