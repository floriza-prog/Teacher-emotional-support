import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWellness } from "@/contexts/WellnessContext";
import { APPRAISAL_TYPES, RESOURCE_TYPES, COPING_STRATEGIES, MODULES, EMOTION_TYPES } from "@/lib/data";
import {
  ChevronRight, ChevronLeft, Check, AlertCircle,
  Sparkles, Brain, Radar, Compass, Target, RefreshCw,
  Wind, Users, Search, MessageCircle, ClipboardList, ArrowRight
} from "lucide-react";
import { Link } from "wouter";

interface EventDetailProps {
  id: string;
}

type GuideStep =
  | "analyze"     // Step 2: AI 事件分析
  | "primary"     // Step 3: 初級評估
  | "secondary"   // Step 4: 次級評估 (資源地圖)
  | "navigator"   // Step 5: AI 導航
  | "module"      // Step 6: 進入對應模組
  | "action"      // Step 7: 行動計畫
  | "reappraisal" // Step 8: 再評估
  | "complete";   // 完成

const STEP_ORDER: GuideStep[] = [
  "analyze", "primary", "secondary", "navigator", "module", "action", "reappraisal", "complete"
];

const STEP_LABELS: Record<GuideStep, { title: string; subtitle: string; icon: typeof Sparkles }> = {
  analyze: { title: "AI 事件分析", subtitle: "艾思正在拆解你的事件", icon: Sparkles },
  primary: { title: "初級評估", subtitle: "這件事對你代表什麼？", icon: Brain },
  secondary: { title: "次級評估", subtitle: "目前有哪些資源？", icon: Radar },
  navigator: { title: "AI 導航", subtitle: "目前最需要的是什麼？", icon: Compass },
  module: { title: "進入工具", subtitle: "讓我們開始處理", icon: Target },
  action: { title: "行動計畫", subtitle: "今天的下一步", icon: ClipboardList },
  reappraisal: { title: "再評估", subtitle: "後來如何？", icon: RefreshCw },
  complete: { title: "完成", subtitle: "事件已處理完成", icon: Check },
};

export default function EventDetail({ id }: EventDetailProps) {
  const { events, updateEvent, getEvent } = useWellness();
  const event = getEvent(id);

  // 引導流程狀態
  const [step, setStep] = useState<GuideStep>("analyze");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    emotion: string;
    intensity: number;
    keywords: string[];
    coreNeed: string;
  } | null>(null);

  // 初級評估
  const [appraisal, setAppraisal] = useState<{ threat: number; challenge: number; loss: number }>({
    threat: 5, challenge: 3, loss: 1,
  });

  // 次級評估 — 資源
  const [resources, setResources] = useState<Record<string, number>>({
    personal: 7, social: 5, organizational: 6, psychological: 3,
  });

  // AI 導航建議
  const [recommendedModule, setRecommendedModule] = useState<string | null>(null);

  // 行動計畫
  const [actionItems, setActionItems] = useState<string[]>(["", "", ""]);

  // 再評估
  const [reappraisalResult, setReappraisalResult] = useState<{ outcome: string; newStress: number }>({
    outcome: "", newStress: 5,
  });

  // 模擬 AI 分析
  useEffect(() => {
    if (step === "analyze" && event && !analysisResult) {
      setAnalyzing(true);
      const timer = setTimeout(() => {
        // 基於事件文字推測情緒
        const text = event.description;
        let emotion = "neutral";
        let intensity = 5;
        const keywords: string[] = [];

        if (text.includes("累") || text.includes("疲") || text.includes("撐")) {
          emotion = "exhausted"; intensity = 7; keywords.push("累", "疲");
        } else if (text.includes("焦慮") || text.includes("擔心") || text.includes("緊張")) {
          emotion = "anxious"; intensity = 8; keywords.push("焦慮", "擔心");
        } else if (text.includes("氣") || text.includes("怒") || text.includes("煩")) {
          emotion = "frustrated"; intensity = 6; keywords.push("煩", "氣");
        } else if (text.includes("難過") || text.includes("沮喪") || text.includes("失落")) {
          emotion = "sad"; intensity = 6; keywords.push("難過", "失落");
        } else if (text.includes("要求") || text.includes("突然") || text.includes("期限")) {
          emotion = "anxious"; intensity = 8; keywords.push("要求", "突然");
        }

        // 推測核心需求
        let coreNeed = "支持";
        if (text.includes("時間") || text.includes("三天") || text.includes("期限")) coreNeed = "時間";
        else if (text.includes("家長") || text.includes("溝通")) coreNeed = "溝通";
        else if (text.includes("學生") || text.includes("課堂")) coreNeed = "教學支持";

        setAnalysisResult({ emotion, intensity, keywords, coreNeed });
        setAnalyzing(false);

        // 根據情緒強度自動設定初級評估
        if (intensity >= 7) {
          setAppraisal({ threat: 8, challenge: 4, loss: 1 });
        } else {
          setAppraisal({ threat: 5, challenge: 5, loss: 2 });
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [step, event, analysisResult]);

  // AI 導航邏輯
  useEffect(() => {
    if (step === "navigator") {
      const threat = appraisal.threat;
      const psychResource = resources.psychological;
      if (threat >= 7 && psychResource <= 4) {
        // 情緒過高，先穩定情緒
        setRecommendedModule("cognitive-regulation");
      } else if (analysisResult?.coreNeed === "溝通") {
        // 需要回覆家長，直接進入溝通腳本
        setRecommendedModule("communication-script");
      } else if (analysisResult?.coreNeed === "時間") {
        // 選擇很多，進入決策模組
        setRecommendedModule("decision-guidance");
      } else {
        // 預設情緒覺察
        setRecommendedModule("emotion-awareness");
      }
    }
  }, [step, appraisal, resources, analysisResult]);

  if (!event) {
    return (
      <Layout>
        <section className="container py-16 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h1 className="text-xl font-semibold mb-2">找不到這個事件</h1>
          <p className="text-muted-foreground mb-6">可能已被刪除或連結無效</p>
          <Link href="/">
            <Button>回到首頁</Button>
          </Link>
        </section>
      </Layout>
    );
  }

  const currentStepIndex = STEP_ORDER.indexOf(step);
  const StepIcon = STEP_LABELS[step].icon;
  const recommendedModuleData = MODULES.find((m) => m.id === recommendedModule);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIndex]);
    }
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEP_ORDER[prevIndex]);
    }
  };

  const handleCompleteEvent = () => {
    updateEvent(event.id, {
      status: "completed",
      emotion: analysisResult?.emotion,
      intensity: analysisResult?.intensity,
      appraisal,
      moduleUsed: recommendedModule || undefined,
      outcome: reappraisalResult.outcome,
    });
    setStep("complete");
  };

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        {/* 事件標題 */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-3 gap-1 text-muted-foreground">
              <ChevronLeft className="w-4 h-4" /> 回到首頁
            </Button>
          </Link>
          <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            {event.title}
          </h1>
          <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>

        {/* 引導步驟進度條 */}
        <div className="mb-8">
          <div className="flex items-center gap-1">
            {STEP_ORDER.map((s, i) => {
              const isCurrent = s === step;
              const isPast = i < currentStepIndex;
              return (
                <div key={s} className="flex items-center gap-1 flex-1 last:flex-none">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                      isCurrent ? "text-white scale-110 shadow-md" : isPast ? "text-white" : "text-muted-foreground bg-muted"
                    }`}
                    style={{
                      background: isCurrent || isPast ? "oklch(0.72 0.03 145)" : undefined,
                    }}
                  >
                    {isPast ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  {i < STEP_ORDER.length - 1 && (
                    <div
                      className="flex-1 h-1 rounded-full transition-all"
                      style={{ background: isPast ? "oklch(0.72 0.03 145)" : "oklch(0.90 0.006 80)" }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <StepIcon className="w-4 h-4" style={{ color: "oklch(0.72 0.03 145)" }} />
            <span className="text-sm font-medium">{STEP_LABELS[step].title}</span>
            <span className="text-sm text-muted-foreground">— {STEP_LABELS[step].subtitle}</span>
          </div>
        </div>

        {/* === Step 2: AI 事件分析 === */}
        {step === "analyze" && (
          <div className="soft-fade-in">
            {analyzing ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4">
                  <div
                    className="w-16 h-16 rounded-full breathing-circle"
                    style={{ background: "radial-gradient(circle, oklch(0.72 0.03 145 / 0.3), transparent 70%)" }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">艾思正在分析你的事件...</p>
                <div className="mt-4 w-full max-w-xs mx-auto bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      background: "oklch(0.72 0.03 145)",
                      width: "60%",
                      transition: "width 2s ease-in-out",
                    }}
                  />
                </div>
              </Card>
            ) : analysisResult ? (
              <Card className="p-6 soft-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5" style={{ color: "oklch(0.72 0.03 145)" }} />
                  <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                    事件分析結果
                  </h2>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                    <span className="text-sm text-muted-foreground">事件</span>
                    <span className="text-sm font-medium text-right">{event.description}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                    <span className="text-sm text-muted-foreground">情緒</span>
                    <span className="font-medium">
                      {EMOTION_TYPES.find((e) => e.id === analysisResult.emotion)?.label || analysisResult.emotion}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">壓力指數</span>
                      <span className="font-bold text-lg" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {analysisResult.intensity}/10
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "oklch(0.90 0.006 80)" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${analysisResult.intensity * 10}%`,
                          background: analysisResult.intensity >= 7 ? "oklch(0.60 0.08 25)" : "oklch(0.70 0.05 50)",
                        }}
                      />
                    </div>
                  </div>
                  {analysisResult.keywords.length > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                      <span className="text-sm text-muted-foreground">關鍵詞</span>
                      <div className="flex gap-1">
                        {analysisResult.keywords.map((k) => (
                          <span key={k} className="text-xs px-2 py-1 rounded-full bg-background">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                    <span className="text-sm text-muted-foreground">核心需求</span>
                    <span className="font-medium" style={{ color: "oklch(0.70 0.05 50)" }}>{analysisResult.coreNeed}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} className="gap-2">
                    下一步：初級評估
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ) : null}
          </div>
        )}

        {/* === Step 3: 初級評估 === */}
        {step === "primary" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-5 h-5" style={{ color: "oklch(0.65 0.03 280)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  這件事情對你代表什麼？
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                艾思根據你的事件做了初步判斷，你可以調整以下評估：
              </p>

              <div className="space-y-6 mb-6">
                {APPRAISAL_TYPES.map((type) => {
                  const value = appraisal[type.id as keyof typeof appraisal];
                  return (
                    <div key={type.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium">{type.label}</span>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                        <span className="text-lg font-bold" style={{ fontFamily: '"JetBrains Mono", monospace', color: type.color }}>
                          {value}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={(e) => setAppraisal((prev) => ({ ...prev, [type.id]: Number(e.target.value) }))}
                        className="custom-slider w-full"
                        style={{ accentColor: type.color }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* 解讀 */}
              <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.72 0.03 145 / 0.06)" }}>
                <p className="text-sm leading-relaxed">
                  {appraisal.threat > appraisal.challenge && appraisal.threat > appraisal.loss && (
                    <>
                      <strong>艾思的觀察：</strong>你主要不是失去什麼，而是<span style={{ color: "oklch(0.60 0.08 25)" }}>擔心做不好</span>。這會影響我們後續選擇的策略。
                    </>
                  )}
                  {appraisal.challenge >= appraisal.threat && appraisal.challenge >= appraisal.loss && (
                    <>
                      <strong>艾思的觀察：</strong>你主要將這件事視為一個<span style={{ color: "oklch(0.70 0.05 50)" }}>挑戰</span>，雖然有難度，但也代表有成長的機會。
                    </>
                  )}
                  {appraisal.loss > appraisal.threat && appraisal.loss > appraisal.challenge && (
                    <>
                      <strong>艾思的觀察：</strong>你主要感受到的是一種<span style={{ color: "oklch(0.55 0.05 250)" }}>失去</span>，讓我們一起看看如何面對這個失落感。
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> 上一步
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  下一步：資源盤點
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === Step 4: 次級評估 (資源地圖) === */}
        {step === "secondary" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Radar className="w-5 h-5" style={{ color: "oklch(0.68 0.04 200)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  目前有哪些資源？
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                艾思幫你整理了四類資源，請調整每項資源的充足程度（0-10）：
              </p>

              <div className="space-y-5 mb-6">
                {RESOURCE_TYPES.map((resource) => {
                  const value = resources[resource.id] || 5;
                  return (
                    <div key={resource.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-sm font-medium">{resource.label}</span>
                          <p className="text-xs text-muted-foreground">{resource.description}</p>
                        </div>
                        <span className="text-sm font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                          {value}/10
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={value}
                        onChange={(e) => setResources((prev) => ({ ...prev, [resource.id]: Number(e.target.value) }))}
                        className="custom-slider w-full"
                      />
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.items.map((item) => (
                          <span key={item} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "oklch(0.95 0.008 80)" }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 資源缺口分析 */}
              <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.70 0.05 50 / 0.06)" }}>
                <p className="text-sm font-medium mb-2">📊 資源缺口分析</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {resources.psychological <= 3 && "你的心理能量偏低，建議先做呼吸練習來恢復精力。"}
                  {resources.personal >= 6 && resources.psychological <= 3 && "你有能力處理這件事，但目前缺乏精力，先休息再行動。"}
                  {resources.personal <= 4 && "你可能需要更多技能或支援，建議尋求同事或主管的協助。"}
                  {Object.values(resources).every((v) => v >= 5) && "你的資源相對充足，可以積極面對這個挑戰。"}
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> 上一步
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  下一步：AI 導航
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === Step 5: AI 導航 === */}
        {step === "navigator" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <Compass className="w-5 h-5" style={{ color: "oklch(0.72 0.03 145)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  目前最需要的是什麼？
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                根據以上分析，艾思為你推薦最適合的處理路線：
              </p>

              {/* 推薦模組 */}
              {recommendedModuleData && (
                <div
                  className="p-5 rounded-2xl mb-6 border-2 soft-fade-in"
                  style={{ borderColor: `${recommendedModuleData.color}40`, background: `${recommendedModuleData.color}08` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                      style={{ background: `${recommendedModuleData.color}15` }}
                    >
                      {recommendedModuleData.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${recommendedModuleData.color}20`, color: recommendedModuleData.color }}>
                          AI 推薦
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{recommendedModuleData.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{recommendedModuleData.subtitle}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {recommendedModule === "cognitive-regulation" && "你的情緒強度較高且心理能量偏低，建議先透過呼吸練習穩定情緒，再處理問題。"}
                        {recommendedModule === "communication-script" && "你的核心需求是溝通，建議直接生成 NVC 結構化溝通化溝通腳本，幫助你準備具體的回應內容。"}
                        {recommendedModule === "decision-guidance" && "你面臨的選擇較多，建議透過 CARE 流程結構化地分析並做出決定。"}
                        {recommendedModule === "emotion-awareness" && "建議先覺察並命名當下情緒，建立情緒基線，再決定後續行動。"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 其他選項 */}
              <p className="text-sm text-muted-foreground mb-3">也可以選擇其他工具：</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {MODULES.filter((m) => m.id !== recommendedModule).map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => setRecommendedModule(mod.id)}
                    className="p-3 rounded-xl border border-border hover:border-primary/40 transition-all text-left"
                  >
                    <span className="text-xl mr-1">{mod.icon}</span>
                    <span className="text-sm font-medium">{mod.title}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> 上一步
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  進入工具
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === Step 6: 進入模組 === */}
        {step === "module" && recommendedModuleData && (
          <div className="soft-fade-in">
            <Card className="p-6 text-center">
              <div
                className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center text-4xl"
                style={{ background: `${recommendedModuleData.color}12` }}
              >
                {recommendedModuleData.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                {recommendedModuleData.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                {recommendedModuleData.description}
              </p>

              <Link href={`/modules/${recommendedModule}`}>
                <Button size="lg" className="gap-2 rounded-full px-8 mb-4">
                  開始使用
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>

              <div className="flex justify-center">
                <Button variant="ghost" onClick={handleNext} className="text-sm text-muted-foreground">
                  稍後再使用，先看行動計畫
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === Step 7: 行動計畫 === */}
        {step === "action" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="w-5 h-5" style={{ color: "oklch(0.70 0.05 50)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  今天的行動
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                艾思幫你整理了接下來的行動步驟，你可以修改或新增：
              </p>

              <div className="space-y-3 mb-6">
                {actionItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "oklch(0.72 0.03 145 / 0.12)", color: "oklch(0.72 0.03 145)" }}
                    >
                      {i + 1}
                    </div>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const newItems = [...actionItems];
                        newItems[i] = e.target.value;
                        setActionItems(newItems);
                      }}
                      placeholder={`行動步驟 ${i + 1}`}
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setActionItems([...actionItems, ""])}
                  className="text-sm text-primary flex items-center gap-1 ml-10"
                >
                  + 新增步驟
                </button>
              </div>

              {/* 提醒 */}
              <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.95 0.008 80)" }}>
                <p className="text-sm text-muted-foreground">
                  <strong>⏰ 再評估提醒：</strong>艾思會在 48 小時後提醒你回來追蹤這件事的後續發展。
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> 上一步
                </Button>
                <Button onClick={handleNext} className="gap-2">
                  下一步：再評估
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === Step 8: 再評估 === */}
        {step === "reappraisal" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-5 h-5" style={{ color: "oklch(0.68 0.04 200)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  昨天那件事情，後來如何？
                </h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                回顧一下這件事的後續發展，讓艾思重新評估你的狀態：
              </p>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">事情的結果如何？</label>
                  <Textarea
                    value={reappraisalResult.outcome}
                    onChange={(e) => setReappraisalResult((prev) => ({ ...prev, outcome: e.target.value }))}
                    placeholder="例如：主任同意延期了，壓力減輕很多..."
                    className="resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">現在的壓力指數（1-10）</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={reappraisalResult.newStress}
                      onChange={(e) => setReappraisalResult((prev) => ({ ...prev, newStress: Number(e.target.value) }))}
                      className="custom-slider flex-1"
                    />
                    <span className="font-bold text-lg w-8 text-center" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                      {reappraisalResult.newStress}
                    </span>
                  </div>
                </div>
              </div>

              {/* 前後對比 */}
              {analysisResult && (
                <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.95 0.008 80)" }}>
                  <p className="text-sm text-muted-foreground mb-3">壓力變化</p>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">事件發生時</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {analysisResult.intensity}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">現在</p>
                      <p className="text-2xl font-bold" style={{ fontFamily: '"JetBrains Mono", monospace', color: "oklch(0.72 0.03 145)" }}>
                        {reappraisalResult.newStress}
                      </p>
                    </div>
                    {reappraisalResult.newStress < analysisResult.intensity && (
                      <div className="ml-auto text-sm" style={{ color: "oklch(0.72 0.03 145)" }}>
                        壓力降低了 {analysisResult.intensity - reappraisalResult.newStress} 分
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 學習洞察 */}
              {reappraisalResult.outcome && (
                <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.72 0.03 145 / 0.06)" }}>
                  <p className="text-sm font-medium mb-1">💡 艾思的觀察</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {reappraisalResult.newStress < analysisResult!.intensity
                      ? "你的壓力來源可能不是能力不足，而是時間限制或情境壓力。這次經驗會存入你的個人因應知識庫。"
                      : "壓力尚未明顯降低，這也是重要的學習。也許需要不同的策略，或尋求更多支持。"}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <Button variant="ghost" onClick={handlePrev} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> 上一步
                </Button>
                <Button onClick={handleCompleteEvent} className="gap-2" disabled={!reappraisalResult.outcome.trim()}>
                  <Check className="w-4 h-4" />
                  完成事件
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* === 完成 === */}
        {step === "complete" && (
          <div className="soft-fade-in">
            <Card className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: "oklch(0.72 0.03 145 / 0.12)" }}
              >
                <Check className="w-10 h-10" style={{ color: "oklch(0.72 0.03 145)" }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                事件已完成
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                這次經驗已存入你的個人因應知識庫。每一次記錄都是自我覺察的累積，
                下次遇到類似情境時，艾思會參考這次的經驗來幫助你。
              </p>

              <div className="flex gap-3 justify-center">
                <Link href="/growth">
                  <Button variant="outline" className="gap-2">
                    查看我的成長
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button className="gap-2">
                    回到首頁
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </section>
    </Layout>
  );
}
