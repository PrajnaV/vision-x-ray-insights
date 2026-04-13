import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import cleanMDA from "../images/clean_mda.png";
import fgsmMDA from "../images/fgsm_mda.png";
import pgdMDA from "../images/pgd_mda.png";


const baselineMetrics = [
  { label: "Overall Accuracy", value: "93.37%" },
  { label: "Balanced Accuracy", value: "92.54%" },
];

const classMetricsData = [
  { class: "COVID-19", precision: 97.29, recall: 94.72, f1: 95.99 },
  { class: "Normal", precision: 91.64, recall: 95.59, f1: 93.57 },
  { class: "Lung Opacity", precision: 92.93, recall: 89.53, f1: 91.20 },
  { class: "Viral Pneumonia", precision: 100, recall: 90.3, f1: 94.9 },
];

const fgsmAttackData = [
  { epsilon: 0, accuracy: 93.37 },
  { epsilon: 0.001, accuracy: 82.45 },
  { epsilon: 0.002, accuracy: 71.1 },
  { epsilon: 0.003, accuracy: 63.57 },
  { epsilon: 0.005, accuracy: 54.51 },
  { epsilon: 0.01, accuracy: 44.02 },
  { epsilon: 0.02, accuracy: 35.57 },
];

const pgdAttackData = [
  { epsilon: 0, accuracy: 93.37 },
  { epsilon: 0.0005, accuracy: 87.65 },
  { epsilon: 0.001, accuracy: 78.25 },
  { epsilon: 0.002, accuracy: 54.70 },
  { epsilon: 0.003, accuracy: 35.81 },
  { epsilon: 0.005, accuracy: 16.12},
];

const crossAttackFGSM = [
  { epsilon: "0", original: 93.37, fgsm: 94.33, pgd: 93.04 },
  { epsilon: "0.001", original: 82.45, fgsm: 88.79, pgd: 90.46 },
  { epsilon: "0.002", original: 71.10, fgsm: 82.31, pgd: 87.08 },
  { epsilon: "0.003", original: 63.57, fgsm: 76.59, pgd: 84.22 },
  { epsilon: "0.005", original: 54.51, fgsm: 64.95, pgd: 77.59 },
];

const crossAttackPGD = [
  { epsilon: "0", original: 93.37, fgsm: 94.33, pgd: 93.04 },
  { epsilon: "0.0005", original: 87.74, fgsm: 91.56, pgd: 91.70 },
  { epsilon: "0.001", original: 78.40, fgsm: 87.79, pgd: 90.22 },
  { epsilon: "0.002", original: 54.65, fgsm: 76.82, pgd: 85.65 },
  { epsilon: "0.003", original: 35.91, fgsm: 60.18, pgd: 80.59 },
];

const directGainFGSM = [
  { epsilon: "ε=0.0", standard: 93.37, robust: 94.33 },
  { epsilon: "ε=0.001", standard: 82.45, robust: 88.79 },
  { epsilon: "ε=0.002", standard: 71.10, robust: 82.31 },
  { epsilon: "ε=0.003", standard: 63.57, robust: 76.59 },
  { epsilon: "ε=0.005", standard: 54.51, robust: 64.95 },
];

const directGainPGD = [
  { epsilon: "ε=0.0", standard: 93.37, robust: 94.33 },
  { epsilon: "ε=0.0005", standard: 87.70, robust: 91.70 },
  { epsilon: "ε=0.001", standard: 78.35, robust: 90.22 },
  { epsilon: "ε=0.002", standard: 54.55, robust: 85.65 },
  { epsilon: "ε=0.003", standard: 35.91, robust: 80.59 },
];

const mdaScores = [
  {
    model: "Standard ViT",
    cleanAccuracy: 93.37,
    baselineBalanced: 95.50,
    maskedBalanced: 92.50,
    mdaScore: 0.030,
    label: "Most localized",
    description:
      "Highest MDA score — model heavily depends on the central lung region. Removing a single 64×64 patch causes a 3pp accuracy drop.",
    color: "red" as const,
  },
  {
    model: "FGSM-trained ViT",
    cleanAccuracy: 91.84,
    baselineBalanced: 96.50,
    maskedBalanced: 94.50,
    mdaScore: 0.020,
    label: "Intermediate",
    description:
      "Adversarial training begins to distribute attention. ",
    color: "amber" as const,
  },
  {
    model: "PGD-trained ViT",
    cleanAccuracy: 91.12,
    baselineBalanced: 94.50,
    maskedBalanced: 93.50,
    mdaScore: 0.010,
    label: "Distributed",
    description:
      "Lowest MDA score — masking the central region causes minimal change in accuracy. Model relies on globally distributed features.",
    color: "teal" as const,
  },
];



const heatmaps = [
  {
    model: "Standard ViT",
    label: "Most localized",
    caption:
      "Concentrated attention on a narrow left-centre lung strip — spatially biased and fragile.",
    insight: "Relies on few specific spots. More concentrated",
    color: "red" as const,
    imagePath: cleanMDA,
  },
  {
    model: "FGSM-trained ViT",
    label: "Partially distributed",
    caption:
      "Attention spread across left-centre and upper-right — more scattered and diffuse attention pattern compared to the clean model.This broader distribution confirms that FGSM trained model is less spatially biased",
    insight: "Multiple warm patches. Less concentrated.",
    color: "amber" as const,
    imagePath: fgsmMDA,
  },
  {
    model: "PGD-trained ViT",
    label: "Most distributed",
    caption:
      "Predominantly blue with no single dominant hotspot — most evenly distributed attention of all three models.This confirms that PGD trained model is most spatially robust.",
    insight: "No dominant hotspot. Globally distributed.",
    color: "teal" as const,
    imagePath: pgdMDA,
  },
];

const colorMap = {
  red: {
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    text: "text-red-400",
    badge: "bg-red-500/20 border-red-500/30 text-red-400",
    bar: "#ef4444",
    insight: "border-red-500/20 bg-red-500/10 text-red-300",
  },
  amber: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/5",
    text: "text-amber-400",
    badge: "bg-amber-500/20 border-amber-500/30 text-amber-400",
    bar: "#f59e0b",
    insight: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  },
  teal: {
    border: "border-teal-500/30",
    bg: "bg-teal-500/5",
    text: "text-teal-400",
    badge: "bg-teal-500/20 border-teal-500/30 text-teal-400",
    bar: "#14b8a6",
    insight: "border-teal-500/20 bg-teal-500/10 text-teal-300",
  },
};

const CustomTooltipDark = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-gray-900 p-3 text-sm shadow-xl">
        <p className="mb-2 font-semibold text-white">ε = {label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value.toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomTooltipGain = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-gray-900 p-3 text-sm shadow-xl">
        <p className="mb-2 font-semibold text-white">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value.toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};



// Animated counter hook */
const useCountUp = (target: number, inView: boolean, decimals = 3) => {
  const [count, setCount] = useState(0);
  const prevInView = useRef(false);

  if (inView && !prevInView.current) {
    prevInView.current = true;
    let start = 0;
    const duration = 1200;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(parseFloat((progress * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return count;
};

const MDAScoreCard = ({
  item,
  inView,
}: {
  item: (typeof mdaScores)[0];
  inView: boolean;
}) => {
  const c = colorMap[item.color];
  const animatedScore = useCountUp(item.mdaScore, inView);
  const animatedBaseline = useCountUp(item.baselineBalanced, inView, 2);
  const animatedMasked = useCountUp(item.maskedBalanced, inView, 2);

  return (
    <motion.div
      className={`rounded-2xl border p-6 ${c.border} ${c.bg} flex flex-col gap-4`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h4 className={`text-sm font-semibold ${c.text}`}>{item.model}</h4>
        <span
          className={`text-xs rounded-full border px-2 py-0.5 ${c.badge}`}
        >
          {item.label}
        </span>
      </div>

      {/* MDA score — large animated number */}
      <div className="text-center my-4">
        <div className={`font-display text-5xl font-bold ${c.text}`}>
          {inView ? animatedScore.toFixed(3) : "0.00"}
        </div>
        <div className="text-xs text-muted-foreground/3 mt-1">MDA score</div>
      </div>

      {/* Accuracy rows */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-muted-foreground/2 rounded-lg border border-white/10 p-3">
        <div>
          <p className="text-[10px] text-muted-foreground/2 mb-0.5">Baseline balanced</p>
          <p className={`text-sm font-semibold ${c.text}`}>
            {inView ? animatedBaseline.toFixed(2) : "0.00"}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground/2 mb-0.5">Masked balanced</p>
          <p className={`text-sm font-semibold ${c.text}`}>
            {inView ? animatedMasked.toFixed(2) : "0.00"}%
          </p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground/2 mb-0.5">MDA score</p>
          <p className={`text-sm font-semibold ${c.text}`}>
            {inView ? animatedScore.toFixed(3) : "0.000"}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground/2 mt-1 leading-relaxed">
        {item.description}
      </p>
      
    </motion.div>
  );
};

const Results = () => {
  const chartRef = useRef(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.3 });
  const [activeTab, setActiveTab] = useState<"fgsm" | "pgd">("fgsm");
  const mdaSectionRef = useRef(null);
  const mdaSectionInView = useInView(mdaSectionRef, { once: true, amount: 0.2 });

  const crossData = activeTab === "fgsm" ? crossAttackFGSM : crossAttackPGD;
  const crossLabel =
    activeTab === "fgsm"
      ? "Under FGSM attack — all three models compared"
      : "Under PGD attack — all three models compared";

  return (
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
          Clean accuracy, adversarial vulnerability, robustness improvements,
          and MDA interpretability analysis across three model variants.
        </p>
      </section>

      {/* Baseline classification performance */}
      <section className="w-full px-4 pb-16">
        <div className="container max-w-4xl">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
            Baseline classification performance
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {baselineMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-border bg-card p-6 card-hover text-center">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className="mt-2 font-display text-4xl font-bold text-foreground">{metric.value}</p>
              </div>
            ))}
          </div>

          <motion.div
            ref={chartRef}
            className="rounded-2xl border border-border bg-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={chartInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="mb-6 font-display text-lg font-bold text-foreground">
              Per-class performance metrics
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={classMetricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="class" tick={{ fill: "#9ca3af" }} />
                <YAxis tick={{ fill: "#9ca3af" }} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(value: any) => value.toFixed(2)}
                />
                <Legend wrapperStyle={{ color: "#9ca3af" }} />
                <Bar dataKey="precision" fill="#3b82f6" name="Precision" isAnimationActive={chartInView} animationDuration={1200} />
                <Bar dataKey="recall" fill="#8b5cf6" name="Recall" isAnimationActive={chartInView} animationDuration={1200} />
                <Bar dataKey="f1" fill="#10b981" name="F1-Score" isAnimationActive={chartInView} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </section>

      {/* Adversarial Vulnerability */}
      <section className="w-full px-4 pb-16">
        <div className="container max-w-4xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-foreground">
            How attacks degrade the standard model
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              className="rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="mb-6 font-display text-lg font-bold text-foreground">Under FGSM attack</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fgsmAttackData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="epsilon" tick={{ fill: "#9ca3af" }} label={{ value: "Epsilon (ε)", position: "insideBottomRight", offset: -5, fill: "#9ca3af" }} />
                  <YAxis tick={{ fill: "#9ca3af" }} label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft", fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} labelStyle={{ color: "#fff" }} formatter={(v: any) => `${v.toFixed(2)}%`} labelFormatter={(l) => `ε = ${Number(l).toFixed(4)}`} />
                  <ReferenceLine y={50} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: "Near-random", fill: "#ef4444", fontSize: 11 }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#ef4444" dot={{ fill: "#ef4444", r: 5 }} activeDot={{ r: 7 }} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              className="rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="mb-6 font-display text-lg font-bold text-foreground">Under PGD attack</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pgdAttackData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="epsilon" tick={{ fill: "#9ca3af" }} label={{ value: "Epsilon (ε)", position: "insideBottomRight", offset: -5, fill: "#9ca3af" }} />
                  <YAxis tick={{ fill: "#9ca3af" }} label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft", fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} labelStyle={{ color: "#fff" }} formatter={(v: any) => `${v.toFixed(2)}%`} labelFormatter={(l) => `ε = ${Number(l).toFixed(5)}`} />
                  <ReferenceLine y={50} stroke="rgba(239,68,68,0.4)" strokeDasharray="4 4" label={{ value: "Near-random", fill: "#ef4444", fontSize: 11 }} />
                  <Line type="monotone" dataKey="accuracy" stroke="#dc2626" dot={{ fill: "#dc2626", r: 5 }} activeDot={{ r: 7 }} animationDuration={1000} />
                </LineChart>
              </ResponsiveContainer>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Adversarial Training Comparison */}
      <section className="w-full px-4 pb-16">
        <div className="container max-w-4xl">
          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
            How adversarial training restores robustness
          </h2>
          <p className="mb-10 text-muted-foreground text-sm">
            Each model tested against the attack it was trained on, then compared across all attack types.
          </p>

          {/* Part A */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-6 rounded bg-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Direct robustness gain — same-attack evaluation
              </h3>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div
                className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-amber-400">FGSM training vs FGSM attack</h4>
                  <span className="text-xs rounded-full bg-amber-500/20 text-amber-400 px-2 py-0.5 border border-amber-500/30">
                    up to +11.21pp gain at ε = 0.002
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  FGSM adversarial training improves resistance to FGSM attacks at every perturbation strength.
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={directGainFGSM} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="epsilon" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltipGain />} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    <Bar dataKey="standard" name="Standard model" fill="rgba(156,163,175,0.4)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} />
                    <Bar dataKey="robust" name="FGSM-trained model" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="rounded-2xl border border-teal-500/30 bg-teal-500/5 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-teal-400">PGD training vs PGD attack</h4>
                  <span className="text-xs rounded-full bg-teal-500/20 text-teal-400 px-2 py-0.5 border border-teal-500/30">
                    up to +31.00pp gain at ε = 0.002
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  PGD adversarial training dramatically improves resistance — gains widen at higher perturbation strengths.
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={directGainPGD} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="epsilon" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltipGain />} />
                    <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                    <Bar dataKey="standard" name="Standard model" fill="rgba(156,163,175,0.4)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} />
                    <Bar dataKey="robust" name="PGD-trained model" fill="#14b8a6" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1200} />
                  </BarChart>
                </ResponsiveContainer>

              </motion.div>
            </div>
          </div>

          {/* Part B */}
          <motion.div
            className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1 w-6 rounded bg-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">
                Cross-attack comparison — all three models
              </h3>
            </div>
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setActiveTab("fgsm")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                  activeTab === "fgsm"
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20"
                }`}
              >
                Under FGSM attack
              </button>
              <button
                onClick={() => setActiveTab("pgd")}
                className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-all ${
                  activeTab === "pgd"
                    ? "bg-teal-500/20 text-teal-400 border-teal-500/40"
                    : "bg-transparent text-muted-foreground border-white/10 hover:border-white/20"
                }`}
              >
                Under PGD attack
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{crossLabel}</p>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={crossData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="epsilon" tick={{ fill: "#9ca3af", fontSize: 11 }} label={{ value: "Epsilon (ε)", position: "insideBottomRight", offset: -5, fill: "#9ca3af", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 11 }} label={{ value: "Accuracy (%)", angle: -90, position: "insideLeft", fill: "#9ca3af", fontSize: 11 }} />
                <Tooltip content={<CustomTooltipDark />} />
                <Legend wrapperStyle={{ color: "#9ca3af", fontSize: 12 }} />
                <Line type="monotone" dataKey="original" name="Standard model" stroke="#6b7280" strokeWidth={2} dot={{ fill: "#6b7280", r: 4 }} activeDot={{ r: 6 }} animationDuration={800} />
                <Line type="monotone" dataKey="fgsm" name="FGSM-trained" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b", r: 4 }} activeDot={{ r: 6 }} animationDuration={900} />
                <Line type="monotone" dataKey="pgd" name="PGD-trained" stroke="#14b8a6" strokeWidth={2.5} dot={{ fill: "#14b8a6", r: 4 }} activeDot={{ r: 6 }} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-6 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3">
              <p className="text-sm text-teal-300 leading-relaxed">
                <span className="font-semibold">Key insight — </span>
                Both adversarial training methods improve robustness. FGSM training provides strong same-attack defense (up to +13pp), while PGD training delivers superior and more transferable robustness (up to +44pp). The PGD-trained model leads under both attack types —establishing a clear robustness hierarchy:{" "}
                <span className="font-semibold">Original &lt; FGSM-trained &lt; PGD-trained</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MDA Scores Section */}
      <section className="w-full px-4 pb-16" ref={mdaSectionRef}>
        <div className="container max-w-4xl">

          {/* Section header */}
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-display text-2xl font-bold text-foreground">
              MDA interpretability analysis
            </h2>
            <span className="text-xs rounded-full bg-teal-500/20 text-teal-400 px-3 py-1 border border-teal-500/30 font-semibold">
              Unique contribution
            </span>
          </div>
          <p className="mb-10 text-muted-foreground text-sm">
            Lower MDA score = model relies on globally distributed features = more robust and transparent.
            Central 64×64 lung region masked across 200 stratified test images.
          </p>

          {/* Three MDA score cards */}
          <div className="grid gap-6 lg:grid-cols-3 mb-10">
            {mdaScores.map((item, i) => (
              <MDAScoreCard
                key={item.model}
                item={item}
                inView={mdaSectionInView}
              />
            ))}
          </div>

         

          {/* Insight box */}
          <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3">
            <p className="text-sm text-teal-300 leading-relaxed">
              <span className="font-semibold">Key insight — </span>
              As adversarial training strength increases from none → FGSM → PGD, the MDA score
              halves each time: 0.030 → 0.020 → 0.010. This progressive reduction shows that
              stronger adversarial training not only improves robustness but also encourages the model
              to develop more spatially generalised representations — less reliant on any single region.
            </p>
          </div>

        </div>
      </section>

      {/* MDA Heatmaps Section */}
      <section className="w-full px-4 pb-24">
        <div className="container max-w-4xl">

          <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
            Spatial attention visualisation
          </h2>
          <p className="mb-10 text-muted-foreground text-sm">
            Same chest X-ray processed through each model — red = high importance, blue = low importance.
            Generated using occlusion-based attribution with a 32×32 sliding window at stride 16.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {heatmaps.map((item, i) => {
              const c = colorMap[item.color];
              return (
                <motion.div
                  key={item.model}
                  className={`rounded-2xl border ${c.border} ${c.bg} overflow-hidden flex flex-col`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {/* Image area */}
                  <div className="aspect-square w-full bg-black/30 flex items-center justify-center relative overflow-hidden">
                    {item.imagePath ? (
                      <img
                        src={item.imagePath}
                        alt={`${item.model} MDA heatmap`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <div
                          className="w-16 h-16 rounded-full opacity-20"
                          style={{
                            background:
                              item.color === "red"
                                ? "radial-gradient(circle, #ef4444, #1e3a5f)"
                                : item.color === "amber"
                                ? "radial-gradient(circle, #f59e0b, #1e3a5f)"
                                : "radial-gradient(circle, #14b8a6, #1e3a5f)",
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Replace with heatmap image
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-semibold ${c.text}`}>
                        {item.model}
                      </span>
                      <span
                        className={`text-xs rounded-full border px-2 py-0.5 ${c.badge}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.caption}
                    </p>
                    <div
                      className={`rounded-lg border px-3 py-2 text-xs ${c.insight}`}
                    >
                      {item.insight}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          

        </div>
      </section>

    </div>
  );
};

export default Results;