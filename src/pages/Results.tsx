import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react";
import { useRef } from "react";
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
} from "recharts";
import { motion } from "framer-motion";

const baselineMetrics = [
  { label: "Overall Accuracy", value: "93.37%" },
  { label: "Balanced Accuracy", value: "92.54%" },
];

const classMetricsData = [
  { class: "COVID-19", precision: 97.29, recall: 94.72, f1: 95.99 },
  { class: "Normal", precision: 91, recall: 92, f1: 91 },
  { class: "Lung Opacity", precision: 88, recall: 89.53, f1: 88 },
  { class: "Viral Pneumonia", precision: 100, recall: 90.3, f1: 94.9 },
];

const fgsmAttackData = [
  { epsilon: 0, accuracy: 93.37 },
  { epsilon: 0.001, accuracy: 82.14 },
  { epsilon: 0.002, accuracy: 71.1 },
  { epsilon: 0.004, accuracy: 61.2 },
  { epsilon: 0.008, accuracy: 53.1 },
  { epsilon: 0.01, accuracy: 48.72 },
  { epsilon: 0.02, accuracy: 33.47 },
];

const pgdAttackData = [
  { epsilon: 0, accuracy: 93.37 },
  { epsilon: 0.0005, accuracy: 87.8 },
  { epsilon: 0.001, accuracy: 78.4 },
  { epsilon: 0.002, accuracy: 54.55 },
  { epsilon: 0.003, accuracy: 35.91 },
  { epsilon: 0.005, accuracy: 16.4 },
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

const Results = () => {
  const chartRef = useRef(null);
  const chartInView = useInView(chartRef, { once: true, amount: 0.3 });

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

          {/* Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 mb-12">
            {baselineMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-border bg-card p-6 card-hover text-center"
              >
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-foreground">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Class Metrics Chart */}
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="class" />
                <YAxis />
                <Tooltip formatter={(value) => value.toFixed(2)} />
                <Legend />
                <Bar
                  dataKey="precision"
                  fill="#3b82f6"
                  name="Precision"
                  isAnimationActive={chartInView}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="recall"
                  fill="#8b5cf6"
                  name="Recall"
                  isAnimationActive={chartInView}
                  animationDuration={1200}
                />
                <Bar
                  dataKey="f1"
                  fill="#10b981"
                  name="F1-Score"
                  isAnimationActive={chartInView}
                  animationDuration={1200}
                />
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

          {/* Two-column layout for line charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* FGSM Attack Chart */}
            <motion.div
              className="rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="mb-6 font-display text-lg font-bold text-foreground">
                Under FGSM attack
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fgsmAttackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="epsilon"
                    label={{
                      value: "Epsilon (ε)",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Accuracy (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(2)}%`}
                    labelFormatter={(label) => `ε = ${label.toFixed(4)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#ef4444"
                    dot={{ fill: "#ef4444", r: 5 }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* PGD Attack Chart */}
            <motion.div
              className="rounded-2xl border border-border bg-card p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="mb-6 font-display text-lg font-bold text-foreground">
                Under PGD attack
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={pgdAttackData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="epsilon"
                    label={{
                      value: "Epsilon (ε)",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Accuracy (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => `${value.toFixed(2)}%`}
                    labelFormatter={(label) => `ε = ${label.toFixed(5)}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#dc2626"
                    dot={{ fill: "#dc2626", r: 5 }}
                    activeDot={{ r: 7 }}
                    isAnimationActive={true}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Results;
