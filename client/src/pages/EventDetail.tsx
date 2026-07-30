import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWellnessStore } from "@/hooks/useWellnessStore";
import { MODULES, APPRAISAL_TYPES, RESOURCE_TYPES, COPING_STRATEGIES } from "@/lib/data";
import { ChevronRight, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Link } from "wouter";

interface EventDetailProps {
  id: string;
}

export default function EventDetail({ id }: EventDetailProps) {
  const { events, setStatus } = useWellnessStore();
  const event = events.find((e) => e.id === id);

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

  const statusConfig = {
    ongoing: { label: "進行中", icon: Clock, color: "oklch(0.70 0.05 50)" },
    waiting: { label: "等待處理", icon: Circle, color: "oklch(0.65 0.04 200)" },
    completed: { label: "已完成", icon: CheckCircle2, color: "oklch(0.72 0.03 145)" },
  };
  const config = statusConfig[event.status];
  const StatusIcon = config.icon;

  return (
    <Layout>
      <section className="container py-8 max-w-3xl">
        {/* 事件標題 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
            <span className="text-sm font-medium" style={{ color: config.color }}>{config.label}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(event.createdAt).toLocaleDateString("zh-TW", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <h1 className="text-2xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            {event.title}
          </h1>
          <p className="text-muted-foreground">{event.description}</p>
        </div>

        {/* AI 分析區 */}
        <Card className="p-6 mb-4">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            AI 事件分析
          </h2>

          {/* 初級評估 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">初級評估 — 這件事對你代表什麼？</h3>
            <div className="space-y-3">
              {APPRAISAL_TYPES.map((type) => {
                const value = event.appraisal?.[type.id as keyof typeof event.appraisal] || (type.id === "threat" ? 7 : type.id === "challenge" ? 4 : 1);
                return (
                  <div key={type.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{type.label}</span>
                      <span className="text-sm font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{value}</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "oklch(0.95 0.008 80)" }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${value * 10}%`, background: type.color }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 次級評估 — 資源地圖 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">資源盤點 — 目前有哪些資源？</h3>
            <div className="grid grid-cols-2 gap-3">
              {RESOURCE_TYPES.map((resource) => (
                <div key={resource.id} className="p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                  <p className="text-sm font-medium mb-1">{resource.label}</p>
                  <div className="flex flex-wrap gap-1">
                    {resource.items.slice(0, 3).map((item) => (
                      <span key={item} className="text-xs px-2 py-0.5 rounded-full bg-background">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 導航建議 */}
          <div className="p-4 rounded-xl" style={{ background: "oklch(0.72 0.03 145 / 0.06)" }}>
            <h3 className="text-sm font-medium mb-2">🤖 AI 建議 — 目前最需要的是什麼？</h3>
            <p className="text-sm text-muted-foreground mb-3">
              根據事件分析，建議依序使用以下工具：
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {MODULES.map((mod, i) => (
                <div key={mod.id} className="flex items-center gap-2">
                  <Link href={`/modules/${mod.id}`}>
                    <span
                      className="px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer hover:scale-105 transition-transform"
                      style={{ background: `${mod.color}15`, color: mod.color }}
                    >
                      {mod.icon} {mod.title}
                    </span>
                  </Link>
                  {i < MODULES.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 因應策略 */}
        <Card className="p-5 mb-4">
          <h3 className="text-sm font-medium mb-3">因應策略建議</h3>
          <div className="space-y-2">
            {COPING_STRATEGIES.map((strategy) => (
              <div key={strategy.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "oklch(0.95 0.008 80)" }}>
                <div className="flex-1">
                  <p className="text-sm font-medium">{strategy.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{strategy.description}</p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">{strategy.condition}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 行動 */}
        <div className="flex gap-3">
          {event.status !== "completed" && (
            <Button onClick={() => setStatus(event.id, "completed")} className="gap-2">
              <CheckCircle2 className="w-4 h-4" />
              標記為已完成
            </Button>
          )}
          <Link href="/">
            <Button variant="outline">回到首頁</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
