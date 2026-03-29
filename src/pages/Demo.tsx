import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type ModelType = "standard" | "fgsm" | "pgd";
type AttackMode = "none" | "attack";

interface ClassificationResult {
  predicted_class: string;
  confidence_scores: Record<string, number>;
  heatmap_base64: string;
}

const CLASS_LABELS = ["COVID", "Normal", "Lung_Opacity", "Viral_Pneumonia"];
const CLASS_DISPLAY: Record<string, string> = {
  COVID: "COVID",
  Normal: "Normal",
  Lung_Opacity: "Lung Opacity",
  Viral_Pneumonia: "Viral Pneumonia",
};

const MODELS: { value: ModelType; label: string; desc: string }[] = [
  { value: "standard", label: "Standard ViT", desc: "Baseline model" },
  { value: "fgsm", label: "FGSM-robust ViT", desc: "Adversarially trained" },
  { value: "pgd", label: "PGD-robust ViT", desc: "Strongest defence" },
];

const EPSILONS = ["0.002", "0.003", "0.005"];

const Demo = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [model, setModel] = useState<ModelType>("standard");
  const [attackMode, setAttackMode] = useState<AttackMode>("none");
  const [epsilon, setEpsilon] = useState("0.002");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  }, []);

  const runClassification = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      const attackParam = attackMode === "none" ? "none" : epsilon;
      const res = await fetch(
        `http://localhost:8000/classify?model=${model}&attack=${attackParam}`,
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error(`Server error (${res.status})`);
      const data: ClassificationResult = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Classification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center overflow-hidden">
      {/* Header */}
      <section className="relative w-full px-4 pb-10 pt-24 text-center">
        <div className="pointer-events-none absolute inset-0 hero-glow" />
        <span className="relative mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          Interactive demo
        </span>
        <h1 className="relative font-display text-3xl font-bold text-foreground sm:text-4xl">
          Try the classifier
        </h1>
      </section>

      <div className="container grid gap-8 px-4 pb-20 lg:grid-cols-[340px_1fr]">
        {/* Left panel */}
        <div className="flex flex-col gap-4">
          {/* Upload */}
          <div className="rounded-2xl border border-border bg-card p-5 card-hover">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">X-ray image</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6 text-muted-foreground transition-all hover:border-primary/40 hover:bg-primary/[0.02] hover:text-primary"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Uploaded X-ray" className="max-h-40 rounded-lg object-contain" />
              ) : (
                <>
                  <div className="rounded-xl bg-muted p-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Click to upload</span>
                </>
              )}
            </button>
          </div>

          {/* Model */}
          <div className="rounded-2xl border border-border bg-card p-5 card-hover">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Model</p>
            <div className="flex flex-col gap-2">
              {MODELS.map((m) => (
                <label
                  key={m.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                    model === m.value
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-transparent hover:bg-muted/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="model"
                    checked={model === m.value}
                    onChange={() => setModel(m.value)}
                    className="accent-primary"
                  />
                  <div>
                    <span className="text-sm font-medium text-foreground">{m.label}</span>
                    <span className="block text-xs text-muted-foreground">{m.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Attack */}
          <div className="rounded-2xl border border-border bg-card p-5 card-hover">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Attack</p>
            <div className="flex gap-2">
              {(["none", "attack"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAttackMode(a)}
                  className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    attackMode === a
                      ? "border-primary/40 bg-primary/5 text-primary shadow-sm"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  {a === "none" ? "No attack" : "Attack"}
                </button>
              ))}
            </div>
            {attackMode === "attack" && (
              <select
                value={epsilon}
                onChange={(e) => setEpsilon(e.target.value)}
                className="mt-3 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm"
              >
                {EPSILONS.map((ep) => (
                  <option key={ep} value={ep}>ε = {ep}</option>
                ))}
              </select>
            )}
          </div>

          <Button
            size="lg"
            className="w-full rounded-xl shadow-lg shadow-primary/20 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            disabled={!imageFile || loading}
            onClick={runClassification}
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {loading ? "Classifying…" : "Run classification"}
          </Button>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-6">
          {/* Images */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clean image</span>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-muted/30">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Clean X-ray" className="max-h-full max-w-full rounded-lg object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">MDA heatmap overlay</span>
                <div className="flex aspect-square w-full items-center justify-center rounded-xl border border-border bg-muted/30">
                  {result?.heatmap_base64 ? (
                    <img
                      src={`data:image/png;base64,${result.heatmap_base64}`}
                      alt="Heatmap"
                      className="max-h-full max-w-full rounded-lg object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No heatmap</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="rounded-2xl border border-border bg-card p-6">
            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            )}
            {!result && !error && (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Run the classifier to see results
              </p>
            )}
            {result && (
              <div className="space-y-6">
                <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/5 px-5 py-4 text-center">
                  <span className="text-sm font-medium text-primary">
                    Predicted: <strong>{CLASS_DISPLAY[result.predicted_class] ?? result.predicted_class}</strong>
                    {" · "}
                    {(result.confidence_scores[result.predicted_class] * 100).toFixed(1)}% confidence
                  </span>
                </div>
                <div className="space-y-4">
                  {CLASS_LABELS.map((cls) => {
                    const score = result.confidence_scores[cls] ?? 0;
                    const isPredicted = cls === result.predicted_class;
                    return (
                      <div key={cls} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className={isPredicted ? "font-semibold text-foreground" : "text-muted-foreground"}>
                            {CLASS_DISPLAY[cls]}
                          </span>
                          <span className={isPredicted ? "font-semibold text-foreground" : "text-muted-foreground"}>
                            {(score * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isPredicted
                                ? "bg-gradient-to-r from-primary to-accent"
                                : "bg-muted-foreground/20"
                            }`}
                            style={{ width: `${score * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
