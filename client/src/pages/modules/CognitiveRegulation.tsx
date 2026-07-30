import { useState, useEffect, useRef, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BREATHING_EXERCISES, PERSPECTIVE_ROLES, COGNITIVE_DISTORTIONS } from "@/lib/data";
import { ChevronRight, ChevronLeft, Play, Pause, RefreshCw, Wind, Users, Search, ArrowRight } from "lucide-react";

type SubModule = "menu" | "breathing" | "perspective" | "distortion";

interface CognitiveRegulationProps {
  eventId?: string;
}

export default function CognitiveRegulation({ eventId }: CognitiveRegulationProps = {}) {
  const [subModule, setSubModule] = useState<SubModule>("menu");

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.70 0.05 50 / 0.12)" }}
            >
              🧘
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                認知調節
              </h1>
              <p className="text-sm text-muted-foreground">呼吸練習、角色換位、認知重構</p>
            </div>
          </div>
        </div>

        {subModule === "menu" && (
          <div className="soft-fade-in grid gap-4 md:grid-cols-2">
            <BreathingCard onClick={() => setSubModule("breathing")} />
            <PerspectiveCard onClick={() => setSubModule("perspective")} />
            <DistortionCard onClick={() => setSubModule("distortion")} />
            <div
              className="p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3"
              style={{ background: "oklch(0.95 0.008 80)" }}
            >
              <p className="text-sm text-muted-foreground">
                每個功能都在 2 步內可啟動<br />
                降低使用門檻，高壓時更容易取用
              </p>
              {eventId && (
                <Button
                  onClick={() => (window.location.href = `/event/${eventId}`)}
                  className="gap-2"
                  size="sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  繼續引導流程
                </Button>
              )}
            </div>
          </div>
        )}

        {subModule === "breathing" && <BreathingExercise onBack={() => setSubModule("menu")} />}
        {subModule === "perspective" && <PerspectiveTaking onBack={() => setSubModule("menu")} />}
        {subModule === "distortion" && <CognitiveDistortionCheck onBack={() => setSubModule("menu")} />}
      </section>
    </Layout>
  );
}

// === 呼吸練習 ===
function BreathingCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="p-5 event-card-hover cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.70 0.05 50 / 0.12)" }}>
          <Wind className="w-5 h-5" style={{ color: "oklch(0.70 0.05 50)" }} />
        </div>
        <div>
          <h3 className="font-semibold mb-1">呼吸錨點</h3>
          <p className="text-sm text-muted-foreground">4-7-8 呼吸法 / 方塊呼吸法，2-5 分鐘</p>
        </div>
      </div>
    </Card>
  );
}

function BreathingExercise({ onBack }: { onBack: () => void }) {
  const [exerciseId, setExerciseId] = useState("4-7-8");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [preStress, setPreStress] = useState<number | null>(null);
  const [postStress, setPostStress] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const exercise = BREATHING_EXERCISES.find((e) => e.id === exerciseId)!;
  const phaseDuration = exercise.pattern[phase];

  const handlePhaseChange = useCallback(() => {
    setPhase((prev) => {
      if (prev === "inhale") return "hold";
      if (prev === "hold") return "exhale";
      return "inhale";
    });
    setCount(0);
  }, []);

  useEffect(() => {
    if (!isActive) return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c + 1 >= phaseDuration) {
          if (phase === "exhale") {
            setRound((r) => {
              if (r + 1 >= exercise.rounds) {
                setIsActive(false);
                setShowResult(true);
                return r;
              }
              return r + 1;
            });
          }
          handlePhaseChange();
          return 0;
        }
        return c + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [isActive, phase, phaseDuration, exercise.rounds, handlePhaseChange]);

  const start = () => {
    setPreStress(null);
    setPostStress(null);
    setShowResult(false);
    setPhase("inhale");
    setCount(0);
    setRound(0);
    setIsActive(true);
  };

  const phaseLabel = phase === "inhale" ? "吸氣中" : phase === "hold" ? "屏住呼吸" : "吐氣中";
  const phaseColor = phase === "inhale" ? "oklch(0.72 0.03 145)" : phase === "hold" ? "oklch(0.70 0.05 50)" : "oklch(0.65 0.04 200)";
  const scale = phase === "inhale" ? 1 + (count / phaseDuration) * 0.4 : phase === "exhale" ? 1.4 - (count / phaseDuration) * 0.4 : 1.4;

  return (
    <div className="soft-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-1">
        <ChevronLeft className="w-4 h-4" /> 返回
      </Button>

      {!isActive && !showResult && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            選擇呼吸練習
          </h2>
          <div className="grid gap-3 mb-6">
            {BREATHING_EXERCISES.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setExerciseId(ex.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  exerciseId === ex.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{ex.name}</span>
                  <span className="text-xs text-muted-foreground">{ex.rounds} 輪</span>
                </div>
                <p className="text-sm text-muted-foreground">{ex.description}</p>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">練習前的壓力指數（1-10）</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                value={preStress || 5}
                onChange={(e) => setPreStress(Number(e.target.value))}
                className="custom-slider flex-1"
              />
              <span className="font-medium w-8 text-center" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {preStress || 5}
              </span>
            </div>
          </div>

          <Button onClick={start} className="w-full gap-2" size="lg">
            <Play className="w-5 h-5" />
            開始練習
          </Button>
        </Card>
      )}

      {isActive && (
        <Card className="p-8 text-center">
          <div className="relative w-64 h-64 mx-auto mb-6 flex items-center justify-center">
            {/* 外圈 */}
            <div
              className="absolute inset-0 rounded-full transition-all"
              style={{
                background: `radial-gradient(circle, ${phaseColor}30, transparent 70%)`,
                transform: `scale(${scale})`,
                transition: "transform 1s linear",
              }}
            />
            {/* 內圈 */}
            <div
              className="absolute inset-8 rounded-full transition-all"
              style={{
                border: `3px solid ${phaseColor}`,
                transform: `scale(${scale * 0.9})`,
                transition: "transform 1s linear",
                opacity: 0.6,
              }}
            />
            {/* 中心文字 */}
            <div className="relative z-10">
              <p className="text-lg font-medium mb-1" style={{ color: phaseColor }}>
                {phaseLabel}
              </p>
              <p className="text-4xl font-bold" style={{ fontFamily: '"JetBrains Mono", monospace', color: phaseColor }}>
                {count}
              </p>
              <p className="text-xs text-muted-foreground mt-1">/ {phaseDuration} 秒</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            第 {round + 1} / {exercise.rounds} 輪
          </p>

          <div className="w-full max-w-xs mx-auto bg-muted rounded-full h-2 mb-6">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${((round + (phase === "exhale" ? 1 : phase === "hold" ? 0.67 : 0.33)) / exercise.rounds) * 100}%`,
                background: phaseColor,
              }}
            />
          </div>

          <Button variant="outline" onClick={() => setIsActive(false)} className="gap-2">
            <Pause className="w-4 h-4" />
            暫停
          </Button>
        </Card>
      )}

      {showResult && (
        <Card className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            練習完成
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            你完成了 {exercise.rounds} 輪 {exercise.name}，做得很好。
          </p>

          <div className="mb-6">
            <label className="text-sm text-muted-foreground mb-2 block">練習後的壓力指數（1-10）</label>
            <div className="flex items-center gap-3 max-w-xs mx-auto">
              <input
                type="range"
                min="1"
                max="10"
                value={postStress || 5}
                onChange={(e) => setPostStress(Number(e.target.value))}
                className="custom-slider flex-1"
              />
              <span className="font-medium w-8 text-center" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {postStress || 5}
              </span>
            </div>
          </div>

          {preStress && postStress && (
            <div className="p-4 rounded-xl mb-6" style={{ background: "oklch(0.95 0.008 80)" }}>
              <p className="text-sm text-muted-foreground mb-1">壓力變化</p>
              <p className="text-2xl font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                {preStress} → {postStress}
              </p>
              {postStress < preStress && (
                <p className="text-sm mt-1" style={{ color: "oklch(0.72 0.03 145)" }}>
                  壓力降低了 {preStress - postStress} 分，繼續保持
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={start} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              再做一次
            </Button>
            <Button onClick={onBack}>完成</Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// === 角色換位 ===
function PerspectiveCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="p-5 event-card-hover cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.68 0.04 200 / 0.12)" }}>
          <Users className="w-5 h-5" style={{ color: "oklch(0.68 0.04 200)" }} />
        </div>
        <div>
          <h3 className="font-semibold mb-1">角色換位</h3>
          <p className="text-sm text-muted-foreground">從不同角度理解事件，3-5 分鐘</p>
        </div>
      </div>
    </Card>
  );
}

function PerspectiveTaking({ onBack }: { onBack: () => void }) {
  const [situation, setSituation] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleRole = (id: string) => {
    setSelectedRoles((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // 模擬角色視角生成
  const generatePerspective = (roleId: string, situation: string) => {
    const perspectives: Record<string, string> = {
      student: "從學生的角度來看，這件事可能讓我感到困惑或壓力。我可能不太理解老師的用意，或者覺得自己被誤解了。我也許不是故意要搗亂，而是不知道該怎麼表達自己的困難。",
      parent: "作為家長，看到這件事我可能會擔心孩子的狀況。我不是要質疑老師的專業，而是出於對孩子的關心。也許我的表達方式不夠好，但我的出發點是希望孩子能得到更好的支持。",
      principal: "從行政的角度來看，這是一個需要平衡各方利益的情境。我理解老師的困難，同時也需要考量學校的整體運作和家長的感受。這也是建立溝通管道的機會。",
      colleague: "作為同事，我可能也遇過類似的情況。這確實不容易處理，但我相信你有能力應對。也許我們可以一起討論看看有什麼好的做法。",
      counselor: "從輔導專業的角度來看，這個事件涉及多方情緒需求。建議先釐清各方的核心需求，再尋求雙贏的解決方案。必要時可以引入輔導資源協助。",
    };
    return perspectives[roleId] || "從這個角度來看，事件可能有不同的面貌。";
  };

  return (
    <div className="soft-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-1">
        <ChevronLeft className="w-4 h-4" /> 返回
      </Button>

      {!showResults ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            讓我們從不同角度看這件事
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            先描述一下事件的情境，然後選擇你想了解的角色視角
          </p>
          <Textarea
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            placeholder="例如：家長在群組公開質疑我的教學方式..."
            className="min-h-[100px] mb-4 resize-none"
          />

          <p className="text-sm font-medium mb-3">選擇想了解的角色（可複選）</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {PERSPECTIVE_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${
                  selectedRoles.includes(role.id)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setShowResults(true)}
            disabled={!situation.trim() || selectedRoles.length === 0}
            className="gap-2"
          >
            生成視角
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <div>
          {selectedRoles.map((roleId, i) => {
            const role = PERSPECTIVE_ROLES.find((r) => r.id === roleId)!;
            return (
              <Card key={roleId} className="p-5 mb-4 stagger-item" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{role.icon}</span>
                  <h3 className="font-semibold">【{role.label}的可能視角】</h3>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {generatePerspective(roleId, situation)}
                </p>
              </Card>
            );
          })}

          <Card className="p-5 mb-4" style={{ background: "oklch(0.95 0.008 80)" }}>
            <p className="text-sm font-medium mb-3">💡 這些視角有帶給您什麼新的想法嗎？</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => (window.location.href = "/modules/communication-script")}>
                想準備具體的溝通內容
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                想再深入了解某個角色
              </Button>
              <Button variant="outline" size="sm" onClick={onBack}>
                回到選單
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// === 認知扭曲識別 ===
function DistortionCard({ onClick }: { onClick: () => void }) {
  return (
    <Card className="p-5 event-card-hover cursor-pointer" onClick={onClick}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "oklch(0.65 0.03 280 / 0.12)" }}>
          <Search className="w-5 h-5" style={{ color: "oklch(0.65 0.03 280)" }} />
        </div>
        <div>
          <h3 className="font-semibold mb-1">檢視想法</h3>
          <p className="text-sm text-muted-foreground">識別 10 種常見認知扭曲，3-5 分鐘</p>
        </div>
      </div>
    </Card>
  );
}

function CognitiveDistortionCheck({ onBack }: { onBack: () => void }) {
  const [thought, setThought] = useState("");
  const [matchedDistortions, setMatchedDistortions] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 模擬認知扭曲偵測
  const detectDistortions = (text: string) => {
    const patterns: Record<string, string[]> = {
      "all-or-nothing": ["完全", "總是", "從不", "徹底", "全"],
      "overgeneralization": ["永遠", "每次都", "從來沒", "所有"],
      "mind-reading": ["一定覺得", "肯定認為", "一定在想"],
      "fortune-telling": ["一定會", "肯定會", "注定"],
      "catastrophizing": ["毀了", "完蛋", "糟透了", "無法挽回"],
      "emotional-reasoning": ["我感覺", "我覺得就是"],
      "should-statements": ["應該", "必須", "不可以"],
      "labeling": ["我就是", "我根本", "我這種人"],
    };
    const matched: string[] = [];
    for (const [id, words] of Object.entries(patterns)) {
      if (words.some((w) => text.includes(w))) matched.push(id);
    }
    return matched.length > 0 ? matched : ["all-or-nothing"]; // 預設回一個
  };

  const handleAnalyze = () => {
    const result = detectDistortions(thought);
    setMatchedDistortions(result);
    setShowResults(true);
  };

  return (
    <div className="soft-fade-in">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-1">
        <ChevronLeft className="w-4 h-4" /> 返回
      </Button>

      {!showResults ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            檢視你的想法
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            寫下你腦中反覆出現的想法，讓我們一起看看其中是否有認知扭曲
          </p>
          <Textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="例如：這堂課完全失敗了，我是個失敗的老師..."
            className="min-h-[100px] mb-4 resize-none"
          />
          <Button onClick={handleAnalyze} disabled={!thought.trim()} className="gap-2">
            分析想法
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Card>
      ) : (
        <div>
          <Card className="p-5 mb-4">
            <p className="text-sm text-muted-foreground mb-2">你的想法：</p>
            <p className="italic text-foreground/90 mb-4">「{thought}」</p>
            <div className="border-t border-border pt-4">
              <p className="text-sm font-medium mb-3">偵測到的認知扭曲：</p>
              <div className="space-y-3">
                {matchedDistortions.map((id) => {
                  const distortion = COGNITIVE_DISTORTIONS.find((d) => d.id === id);
                  if (!distortion) return null;
                  return (
                    <div key={id} className="p-4 rounded-xl" style={{ background: "oklch(0.65 0.03 280 / 0.06)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "oklch(0.65 0.03 280 / 0.12)", color: "oklch(0.55 0.04 280)" }}>
                          {distortion.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{distortion.description}</p>
                      <div className="text-sm">
                        <p className="mb-1"><span className="text-muted-foreground">原本的想法：</span>{distortion.example}</p>
                        <p><span className="text-muted-foreground">重新框架：</span><span style={{ color: "oklch(0.72 0.03 145)" }}>{distortion.reframe}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          <Card className="p-5" style={{ background: "oklch(0.72 0.03 145 / 0.06)" }}>
            <p className="text-sm font-medium mb-2">💡 認知重構引導</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              想法不等於事實。當我們用不同的方式解讀同一件事，情緒也會跟著改變。
              嘗試用更客觀、更平衡的角度來看待這個情境。
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                重新檢視
              </Button>
              <Button size="sm" onClick={onBack}>
                完成
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
