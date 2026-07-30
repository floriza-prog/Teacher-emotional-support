import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWellness } from "@/contexts/WellnessContext";
import { SEL_COMPETENCIES } from "@/lib/data";
import { TrendingUp, BookOpen, Heart, Target, GraduationCap, Check } from "lucide-react";
import { Link } from "wouter";

export default function Growth() {
  const { events } = useWellness();
  const completedEvents = events.filter((e) => e.status === "completed");
  const totalEvents = events.length;

  // 統計 SEL 能力練習次數
  const selCounts: Record<string, number> = {};
  SEL_COMPETENCIES.forEach((c) => (selCounts[c.id] = 0));
  events.forEach((e) => {
    if (e.selRecords) {
      e.selRecords.forEach((r) => {
        if (r.completed && selCounts[r.competency] !== undefined) {
          selCounts[r.competency]++;
        }
      });
    }
  });

  const stats = {
    totalEvents,
    completedCount: completedEvents.length,
    emotionsTracked: new Set(events.map((e) => e.emotion).filter(Boolean)).size,
    modulesUsed: new Set(events.map((e) => e.moduleUsed).filter(Boolean)).size,
  };

  const emotionTrend = [
    { day: "一", value: 6 }, { day: "二", value: 7 }, { day: "三", value: 5 },
    { day: "四", value: 8 }, { day: "五", value: 4 },
  ];

  return (
    <Layout>
      <section className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            我的成長
          </h1>
          <p className="text-muted-foreground">
            每一次記錄都是自我覺察的累積，讓我們一起看看你的成長軌跡
          </p>
        </div>

        {/* 統計卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "總事件數", value: stats.totalEvents, icon: BookOpen, color: "oklch(0.72 0.03 145)" },
            { label: "已完成", value: stats.completedCount, icon: Target, color: "oklch(0.70 0.05 50)" },
            { label: "情緒種類", value: stats.emotionsTracked, icon: Heart, color: "oklch(0.68 0.04 200)" },
            { label: "使用工具", value: stats.modulesUsed, icon: TrendingUp, color: "oklch(0.65 0.03 280)" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-4 stagger-item" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${stat.color}12` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <p className="text-2xl font-bold mb-0.5" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* SEL 五項能力歷程 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5" style={{ color: "oklch(0.72 0.03 145)" }} />
            <h2 className="text-lg font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
              SEL 五項能力歷程
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            透過事件處理，你正在逐步培養社會情緒學習（SEL）的核心能力
          </p>

          <div className="space-y-4">
            {SEL_COMPETENCIES.map((comp, i) => {
              const count = selCounts[comp.id] || 0;
              return (
                <div key={comp.id} className="p-4 rounded-xl stagger-item"
                  style={{ background: `${comp.color}06`, animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: `${comp.color}15` }}
                    >{comp.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="font-medium">{comp.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">{comp.englishLabel}</span>
                        </div>
                        <span className="text-sm font-bold" style={{ fontFamily: '"JetBrains Mono", monospace', color: comp.color }}>
                          {count} 次
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{comp.coreQuestion}</p>

                      {/* 能力指標 */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {comp.indicators.map((indicator, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                            style={{ background: count > 0 ? `${comp.color}10` : "oklch(0.95 0.008 80)" }}
                          >
                            {count > 0 && <Check className="w-3 h-3" style={{ color: comp.color }} />}
                            {indicator}
                          </span>
                        ))}
                      </div>

                      {/* 下一步練習目標 */}
                      <div className="flex items-center gap-1.5 text-xs" style={{ color: comp.color }}>
                        <Target className="w-3 h-3" />
                        下一個練習目標：{comp.nextStep}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 情緒趨勢圖 */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            本週情緒強度趨勢
          </h2>
          {totalEvents === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>還沒有足夠的數據</p>
              <p className="text-sm mt-1">開始記錄事件來追蹤你的情緒變化</p>
            </div>
          ) : (
            <div>
              <div className="relative h-48 mb-4">
                <div className="absolute inset-0 flex items-end justify-between gap-3">
                  {emotionTrend.map((d, i) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div className="w-full max-w-[40px] rounded-t-lg transition-all stagger-item"
                        style={{
                          height: `${(d.value / 10) * 100}%`,
                          background: `linear-gradient(to top, oklch(0.72 0.03 145), oklch(0.70 0.05 50))`,
                          animationDelay: `${i * 80}ms`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex items-start justify-between gap-3 pointer-events-none">
                  {emotionTrend.map((d) => (
                    <div key={d.day} className="flex-1 flex justify-center pt-1">
                      <span className="text-xs font-medium" style={{ fontFamily: '"JetBrains Mono", monospace' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between gap-3">
                {emotionTrend.map((d) => (
                  <div key={d.day} className="flex-1 text-center text-sm text-muted-foreground">{d.day}</div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* 個人因應知識庫 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            個人因應知識庫
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            每一次事件都留下紀錄，形成你自己的因應經驗庫
          </p>

          {events.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.95 0.008 80)" }}
              >
                <BookOpen className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">事件庫還是空的</p>
              <p className="text-sm text-muted-foreground/70 mt-1">完成事件後會自動累積在這裡</p>
            </div>
          ) : (
            <div className="space-y-2">
              {events.map((event, i) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-xl stagger-item"
                  style={{ background: "oklch(0.95 0.008 80)", animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: event.status === "completed" ? "oklch(0.72 0.03 145)" : "oklch(0.70 0.05 50)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.createdAt).toLocaleDateString("zh-TW")}
                      {event.emotion && ` · ${event.emotion}`}
                      {event.selReflection && ` · ${event.selReflection.slice(0, 30)}...`}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full shrink-0"
                    style={{
                      background: event.status === "completed" ? "oklch(0.72 0.03 145 / 0.12)" : "oklch(0.70 0.05 50 / 0.12)",
                      color: event.status === "completed" ? "oklch(0.72 0.03 145)" : "oklch(0.70 0.05 50)",
                    }}
                  >
                    {event.status === "completed" ? "成功" : "進行中"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* 返回首頁 */}
        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">回到首頁</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
