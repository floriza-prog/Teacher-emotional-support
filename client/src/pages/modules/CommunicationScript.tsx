import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, ChevronLeft, Copy, Check, MessageCircle } from "lucide-react";

type Step = "input" | "config" | "result";
type Tone = "formal" | "gentle" | "brief";

interface CommunicationScriptProps {
  eventId?: string;
}

export default function CommunicationScript({ eventId }: CommunicationScriptProps = {}) {
  const [step, setStep] = useState<Step>("input");
  const [situation, setSituation] = useState("");
  const [targetRole, setTargetRole] = useState("parent");
  const [goal, setGoal] = useState("resolve");
  const [tone, setTone] = useState<Tone>("gentle");
  const [copied, setCopied] = useState(false);

  // 模擬 NVC 腳本生成
  const generateScript = () => {
    const scripts: Record<Tone, { observation: string; feeling: string; need: string; request: string; full: string }> = {
      formal: {
        observation: `關於您提到的${situation.slice(0, 20)}...一事，我已了解您的關心。`,
        feeling: "我對此也感到關注，並重視您的回饋。",
        need: "因為我希望每位學生都能得到最適合的學習支持。",
        request: "懇請您撥冗與我進一步討論，讓我們共同找出對孩子最好的方式。",
        full: "",
      },
      gentle: {
        observation: `看到您的留言後，我注意到您提到了${situation.slice(0, 20)}...`,
        feeling: "我有些擔心，也很重視您的回饋。",
        need: "因為我希望每位孩子都能得到適合的支持。",
        request: "可以請您方便時私訊我，讓我更了解孩子的狀況嗎？",
        full: "",
      },
      brief: {
        observation: `收到您關於${situation.slice(0, 20)}...的訊息。`,
        feeling: "我很重視。",
        need: "希望確保孩子得到最好的支持。",
        request: "方便的話請私訊我詳談，謝謝。",
        full: "",
      },
    };
    const s = scripts[tone];
    s.full = `${s.observation}\n${s.feeling}\n${s.need}\n${s.request}`;
    return s;
  };

  const script = step === "result" ? generateScript() : null;

  const handleCopy = () => {
    if (script) {
      navigator.clipboard.writeText(script.full);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toneLabels: Record<Tone, string> = {
    formal: "較正式",
    gentle: "較溫和",
    brief: "較簡短",
  };

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "oklch(0.68 0.04 200 / 0.12)" }}
            >
              💬
            </div>
            <div>
              <h1 className="text-2xl font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                溝通腳本
              </h1>
              <p className="text-sm text-muted-foreground">NVC 四要素結構化溝通</p>
            </div>
          </div>
        </div>

        {/* 步驟一：情境輸入 */}
        {step === "input" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                描述你想溝通的情境
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                越具體越好，包括發生了什麼事、對象是誰、你想達成什麼
              </p>
              <Textarea
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="例如：家長在群組公開質疑我的教學方式，我想回覆他..."
                className="min-h-[120px] mb-4 resize-none"
              />
              <Button onClick={() => setStep("config")} disabled={!situation.trim()} className="gap-2">
                下一步
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Card>
          </div>
        )}

        {/* 步驟二：設定 */}
        {step === "config" && (
          <div className="soft-fade-in">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                溝通設定
              </h2>

              <div className="space-y-5 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">溝通對象</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "parent", label: "👨‍👩‍👧 家長" },
                      { id: "student", label: "👨‍🎓 學生" },
                      { id: "colleague", label: "👥 同事" },
                      { id: "admin", label: "🏫 行政主管" },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() => setTargetRole(r.id)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          targetRole === r.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">溝通目標</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "resolve", label: "解決衝突" },
                      { id: "explain", label: "說明情況" },
                      { id: "request", label: "提出請求" },
                      { id: "apologize", label: "表達歉意" },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGoal(g.id)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          goal === g.id ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">語氣強度</label>
                  <div className="flex flex-wrap gap-2">
                    {(["formal", "gentle", "brief"] as Tone[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          tone === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"
                        }`}
                      >
                        {toneLabels[t]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-between">
                <Button variant="ghost" onClick={() => setStep("input")}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> 返回
                </Button>
                <Button onClick={() => setStep("result")} className="gap-2">
                  生成腳本
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* 步驟三：結果 */}
        {step === "result" && script && (
          <div className="soft-fade-in">
            <Card className="p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle className="w-5 h-5" style={{ color: "oklch(0.68 0.04 200)" }} />
                <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
                  溝通腳本建議（NVC 結構）
                </h2>
              </div>

              {/* NVC 四要素 */}
              <div className="space-y-3 mb-6">
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "oklch(0.72 0.03 145)", background: "oklch(0.72 0.03 145 / 0.05)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "oklch(0.72 0.03 145)" }}>✓ 觀察（Observation）</p>
                  <p className="text-sm">{script.observation}</p>
                </div>
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "oklch(0.70 0.05 50)", background: "oklch(0.70 0.05 50 / 0.05)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "oklch(0.70 0.05 50)" }}>✓ 感受（Feeling）</p>
                  <p className="text-sm">{script.feeling}</p>
                </div>
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "oklch(0.68 0.04 200)", background: "oklch(0.68 0.04 200 / 0.05)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "oklch(0.68 0.04 200)" }}>✓ 需要（Need）</p>
                  <p className="text-sm">{script.need}</p>
                </div>
                <div className="p-4 rounded-xl border-l-4" style={{ borderColor: "oklch(0.65 0.03 280)", background: "oklch(0.65 0.03 280 / 0.05)" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "oklch(0.65 0.03 280)" }}>✓ 請求（Request）</p>
                  <p className="text-sm">{script.request}</p>
                </div>
              </div>

              {/* 完整腳本 */}
              <div className="p-4 rounded-xl mb-4" style={{ background: "oklch(0.95 0.008 80)" }}>
                <p className="text-sm font-medium mb-2">完整腳本</p>
                <p className="text-sm whitespace-pre-line leading-relaxed">{script.full}</p>
              </div>

              <Button variant="outline" onClick={handleCopy} className="gap-2 mb-4">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "已複製" : "複製腳本"}
              </Button>

              {/* 其他版本 */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">其他版本</p>
                <div className="flex gap-2">
                  {(["formal", "gentle", "brief"] as Tone[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                        tone === t ? "border-primary bg-primary/10 text-primary" : "border-border"
                      }`}
                    >
                      {toneLabels[t]}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep("config")}>
                <ChevronLeft className="w-4 h-4 mr-1" /> 重新設定
              </Button>
              {eventId ? (
                <Button onClick={() => (window.location.href = `/event/${eventId}`)} className="gap-2">
                  繼續引導流程
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => (window.location.href = "/modules/decision-guidance")} className="gap-2">
                  進入決策引導
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
