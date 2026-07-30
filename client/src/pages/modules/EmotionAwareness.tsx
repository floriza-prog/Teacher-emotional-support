import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { EMOTION_TYPES } from "@/lib/data";
import { ChevronRight, ChevronLeft, Check, Heart } from "lucide-react";

type Step = "input" | "quick-select" | "analysis" | "confirm" | "next-action";

export default function EmotionAwareness() {
  const [step, setStep] = useState<Step>("input");
  const [text, setText] = useState("");
  const [quickEmotion, setQuickEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [confirmedEmotion, setConfirmedEmotion] = useState<string | null>(null);

  // 模擬「AI 分析」— 基於關鍵詞推測情緒
  const analyzeText = (input: string) => {
    const keywords: Record<string, string[]> = {
      exhausted: ["累", "疲", "撐", "耗"],
      frustrated: ["糟", "挫折", "失敗", "沒用"],
      anxious: ["焦慮", "擔心", "害怕", "緊張"],
      angry: ["氣", "怒", "煩", "不滿"],
      sad: ["難過", "沮喪", "失落", "失望"],
      disappointed: ["失望", "心寒", "不值得"],
    };
    for (const [emotion, words] of Object.entries(keywords)) {
      if (words.some((w) => input.includes(w))) return emotion;
    }
    return "neutral";
  };

  const suggestedEmotion = text ? analyzeText(text) : null;
  const suggestedEmotionData = EMOTION_TYPES.find((e) => e.id === suggestedEmotion);

  const handleQuickSelect = (emotionId: string) => {
    setQuickEmotion(emotionId);
    setSelectedEmotion(emotionId);
    setStep("analysis");
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      setStep("analysis");
    }
  };

  const handleConfirm = () => {
    setConfirmedEmotion(selectedEmotion);
    setStep("confirm");
  };

  const reset = () => {
    setStep("input");
    setText("");
    setQuickEmotion(null);
    setSelectedEmotion(null);
    setConfirmedEmotion(null);
    setIntensity(5);
  };

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        {/* 模組標題 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.72 0.03 145 / 0.12)" }}
            >
              💭
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                情緒覺察
              </h1>
              <p className="text-sm text-muted-foreground">辨識並命名當下情緒</p>
            </div>
          </div>
        </div>

        {/* 步步驟一：輸入 */}
        {step === "input" && (
          <div className="soft-fade-in">
            <Card className="p-6 mb-6">
              <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                現在感覺如何？
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                可以用文字描述，也可以直接選擇情緒標籤
              </p>

              {/* 文字輸入 */}
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="今天那堂課真的很糟，學生都不聽話，我好累..."
                className="min-h-[100px] mb-4 resize-none"
              />
              <Button onClick={handleTextSubmit} disabled={!text.trim()} className="gap-2 mb-6">
                送出記錄
                <ChevronRight className="w-4 h-4" />
              </Button>

              {/* 分隔線 */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">或快速選擇</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* 快速選擇 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {EMOTION_TYPES.filter((e) => e.level <= 2).map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => handleQuickSelect(emotion.id)}
                    className="p-3 rounded-xl border border-border hover:border-primary/40 transition-all text-center"
                    style={{ background: `${emotion.color}08` }}
                  >
                    <div
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ background: emotion.color, opacity: 0.7 }}
                    />
                    <span className="text-sm font-medium">{emotion.label}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* 步驟二：分析結果 */}
        {step === "analysis" && (
          <div className="soft-fade-in">
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "oklch(0.72 0.03 145 / 0.12)" }}>
                  <Heart className="w-4 h-4" style={{ color: "oklch(0.72 0.03 145)" }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  情緒觀察
                </h2>
              </div>

              {text && (
                <p className="text-sm text-muted-foreground mb-4 italic">
                  「{text}」
                </p>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                  <span className="text-sm text-muted-foreground">情緒類型</span>
                  <span className="font-medium">
                    {suggestedEmotionData?.label || EMOTION_TYPES.find((e) => e.id === quickEmotion)?.label || "平穩"}
                  </span>
                </div>
                <div className="p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">情緒強度</span>
                    <span className="font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {intensity}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={intensity}
                    onChange={(e) => setIntensity(Number(e.target.value))}
                    className="custom-slider w-full"
                  />
                </div>
                {suggestedEmotionData?.teacherContext && (
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                    <span className="text-sm text-muted-foreground">常見情境</span>
                    <span className="text-sm">{suggestedEmotionData.teacherContext}</span>
                  </div>
                )}
              </div>

              {/* 情緒命名引導 */}
              <p className="text-sm text-muted-foreground mb-3">
                如果要更精確描述，以下哪個詞更接近您現在的感受？
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {EMOTION_TYPES.map((emotion) => (
                  <button
                    key={emotion.id}
                    onClick={() => setSelectedEmotion(emotion.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      selectedEmotion === emotion.id
                        ? "text-white shadow-md"
                        : "hover:scale-105"
                    }`}
                    style={{
                      background: selectedEmotion === emotion.id ? emotion.color : `${emotion.color}15`,
                      color: selectedEmotion === emotion.id ? "white" : "inherit",
                    }}
                  >
                    {emotion.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-3 justify-between">
                <Button variant="ghost" onClick={() => setStep("input")}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  返回
                </Button>
                <Button onClick={handleConfirm} disabled={!selectedEmotion} className="gap-2">
                  確認記錄
                  <Check className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 步驟三：確認 */}
        {step === "confirm" && confirmedEmotion && (
          <div className="soft-fade-in">
            <Card className="p-6 mb-6 text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "oklch(0.72 0.03 145 / 0.12)" }}
              >
                <Check className="w-8 h-8" style={{ color: "oklch(0.72 0.03 145)" }} />
              </div>
              <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                已記錄：{EMOTION_TYPES.find((e) => e.id === confirmedEmotion)?.label}（{intensity}/10）
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                你的感受已經被記下來了。情緒沒有對錯，每一種感受都值得被看見。
              </p>

              <h3 className="text-sm font-medium mb-3">您現在需要什麼？</h3>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-4"
                  onClick={() => (window.location.href = "/modules/cognitive-regulation")}
                >
                  <span className="text-2xl">🧘</span>
                  <span className="text-sm">靜一靜</span>
                  <span className="text-xs text-muted-foreground">呼吸練習</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-4"
                  onClick={() => (window.location.href = "/modules/cognitive-regulation")}
                >
                  <span className="text-2xl">🔄</span>
                  <span className="text-sm">換個角度</span>
                  <span className="text-xs text-muted-foreground">認知調節</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-4"
                  onClick={() => (window.location.href = "/growth")}
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">看趨勢</span>
                  <span className="text-xs text-muted-foreground">情緒變化</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex flex-col items-center gap-1 h-auto py-4"
                  onClick={reset}
                >
                  <span className="text-2xl">✔️</span>
                  <span className="text-sm">只是記錄</span>
                  <span className="text-xs text-muted-foreground">結束</span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </section>
    </Layout>
  );
}
