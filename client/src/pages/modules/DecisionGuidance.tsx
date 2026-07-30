import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CARE_STEPS } from "@/lib/data";
import { ChevronRight, ChevronLeft, Check, ClipboardList } from "lucide-react";

export default function DecisionGuidance() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [showResult, setShowResult] = useState(false);

  const step = CARE_STEPS[currentStep];
  const isLastStep = currentStep === CARE_STEPS.length - 1;

  const handleAnswer = (questionIndex: number, value: string) => {
    const key = `${step.id}-${questionIndex}`;
    setAnswers((prev) => ({ ...prev, [key]: [value] }));
  };

  const handleNext = () => {
    if (isLastStep) {
      setShowResult(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const allAnswered = step.questions.every((_, i) => answers[`${step.id}-${i}`]);

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.65 0.03 280 / 0.12)" }}
            >
              📋
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                決策引導
              </h1>
              <p className="text-sm text-muted-foreground">CARE 流程結構化決策</p>
            </div>
          </div>
        </div>

        {!showResult ? (
          <div className="soft-fade-in">
            {/* 進度條 */}
            <div className="flex items-center gap-2 mb-8">
              {CARE_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      i === currentStep
                        ? "text-white scale-110"
                        : i < currentStep
                        ? "text-white"
                        : "text-muted-foreground bg-muted"
                    }`}
                    style={{
                      background: i <= currentStep ? "oklch(0.65 0.03 280)" : undefined,
                    }}
                  >
                    {s.label}
                  </div>
                  {i < CARE_STEPS.length - 1 && (
                    <div
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{ background: i < currentStep ? "oklch(0.65 0.03 280)" : "oklch(0.90 0.006 80)" }}
                    />
                  )}
                </div>
              ))}
            </div>

            <Card className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "oklch(0.65 0.03 280)" }}
                  >
                    {step.label}
                  </span>
                  <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                    {step.title}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>

              <div className="space-y-4 mb-6">
                {step.questions.map((question, i) => (
                  <div key={i}>
                    <label className="text-sm font-medium mb-2 block">
                      {i + 1}. {question}
                    </label>
                    <Textarea
                      value={answers[`${step.id}-${i}`]?.[0] || ""}
                      onChange={(e) => handleAnswer(i, e.target.value)}
                      placeholder="在這裡寫下你的想法..."
                      className="resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3 justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> 上一步
                </Button>
                <Button onClick={handleNext} disabled={!allAnswered} className="gap-2">
                  {isLastStep ? "完成決策" : "下一步"}
                  {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  {isLastStep && <Check className="w-4 h-4" />}
                </Button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="soft-fade-in">
            <Card className="p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.72 0.03 145 / 0.12)" }}
                >
                  <Check className="w-5 h-5" style={{ color: "oklch(0.72 0.03 145)" }} />
                </div>
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  你的決策整理
                </h2>
              </div>

              {CARE_STEPS.map((s, i) => (
                <div key={s.id} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "oklch(0.65 0.03 280)" }}
                    >
                      {s.label}
                    </span>
                    <h3 className="font-medium text-sm">{s.title}</h3>
                  </div>
                  <div className="ml-8 space-y-1">
                    {s.questions.map((q, qi) => {
                      const answer = answers[`${s.id}-${qi}`]?.[0];
                      return answer ? (
                        <div key={qi} className="text-sm">
                          <span className="text-muted-foreground">{q}</span>
                          <p className="mt-0.5 text-foreground/90">{answer}</p>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-5" style={{ background: "oklch(0.72 0.03 145 / 0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-5 h-5" style={{ color: "oklch(0.72 0.03 145)" }} />
                <h3 className="font-medium">行動計畫</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                根據你的決策，建議的下一步行動：
              </p>
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "oklch(0.72 0.03 145)" }} />
                  今天完成第一個行動步驟
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "oklch(0.72 0.03 145)" }} />
                  設定 48 小時後的自我追蹤提醒
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "oklch(0.72 0.03 145)" }} />
                  如需要，尋求同事或主管的支援
                </label>
              </div>
              <Button onClick={() => (window.location.href = "/")} className="gap-2">
                回到首頁
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        )}
      </section>
    </Layout>
  );
}
