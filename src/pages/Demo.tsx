import { useState, useRef, useCallback } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const MODELS: { value: ModelType; label: string }[] = [
  { value: "standard", label: "Standard ViT" },
  { value: "fgsm", label: "FGSM-robust ViT" },
  { value: "pgd", label: "PGD-robust ViT" },
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
    <div className="container py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1 text-sm font-medium text-primary">
          Interactive demo
        </span>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Try the classifier
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Left panel */}
        <div className="flex flex-col gap-4">
          {/* Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">X-ray image</CardTitle>
            </CardHeader>
            <CardContent>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Uploaded X-ray" className="max-h-40 rounded object-contain" />
                ) : (
                  <>
                    <Upload className="h-8 w-8" />
                    <span className="text-sm">Click to upload</span>
                  </>
                )}
              </button>
            </CardContent>
          </Card>

          {/* Model */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Model</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {MODELS.map((m) => (
                <label key={m.value} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="model"
                    checked={model === m.value}
                    onChange={() => setModel(m.value)}
                    className="accent-primary"
                  />
                  {m.label}
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Attack */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Attack</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-4">
                {(["none", "attack"] as const).map((a) => (
                  <label key={a} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="attack"
                      checked={attackMode === a}
                      onChange={() => setAttackMode(a)}
                      className="accent-primary"
                    />
                    {a === "none" ? "No attack" : "Attack"}
                  </label>
                ))}
              </div>
              {attackMode === "attack" && (
                <select
                  value={epsilon}
                  onChange={(e) => setEpsilon(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {EPSILONS.map((ep) => (
                    <option key={ep} value={ep}>ε = {ep}</option>
                  ))}
                </select>
              )}
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
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
          <Card>
            <CardContent className="grid grid-cols-2 gap-6 p-6">
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Clean image</span>
                <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-muted/40">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Clean X-ray" className="max-h-full max-w-full rounded object-contain" />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">MDA heatmap overlay</span>
                <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-muted/40">
                  {result?.heatmap_base64 ? (
                    <img
                      src={`data:image/png;base64,${result.heatmap_base64}`}
                      alt="Heatmap"
                      className="max-h-full max-w-full rounded object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">No heatmap</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardContent className="p-6">
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                  {error}
                </div>
              )}
              {!result && !error && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Run the classifier to see results
                </p>
              )}
              {result && (
                <div className="space-y-6">
                  <div className="rounded-lg bg-primary/10 px-4 py-3 text-center">
                    <span className="text-sm font-medium text-primary">
                      Predicted: <strong>{CLASS_DISPLAY[result.predicted_class] ?? result.predicted_class}</strong>
                      {" · "}
                      {(result.confidence_scores[result.predicted_class] * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                  <div className="space-y-3">
                    {CLASS_LABELS.map((cls) => {
                      const score = result.confidence_scores[cls] ?? 0;
                      const isPredicted = cls === result.predicted_class;
                      return (
                        <div key={cls} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className={isPredicted ? "font-semibold text-foreground" : "text-muted-foreground"}>
                              {CLASS_DISPLAY[cls]}
                            </span>
                            <span className={isPredicted ? "font-semibold text-foreground" : "text-muted-foreground"}>
                              {(score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full transition-all ${isPredicted ? "bg-primary" : "bg-muted-foreground/30"}`}
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Demo;
