import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useWellnessStore } from "@/hooks/useWellnessStore";
import type { WellnessEvent } from "@/lib/data";
import { Plus, Clock, CheckCircle2, Circle, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  ongoing: { label: "進行中", icon: Clock, color: "oklch(0.70 0.05 50)" },
  waiting: { label: "等待處理", icon: Circle, color: "oklch(0.65 0.04 200)" },
  completed: { label: "已完成", icon: CheckCircle2, color: "oklch(0.72 0.03 145)" },
};

export default function Home() {
  const { events, addEvent } = useWellnessStore();
  const [, navigate] = useLocation();
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [eventText, setEventText] = useState("");

  const handleCreateEvent = () => {
    if (!eventText.trim()) return;
    const newEvent: WellnessEvent = {
      id: `evt-${Date.now()}`,
      title: eventText.slice(0, 30) + (eventText.length > 30 ? "..." : ""),
      description: eventText,
      status: "ongoing",
      createdAt: new Date().toISOString(),
    };
    addEvent(newEvent);
    setEventText("");
    setShowNewEvent(false);
    // 直接跳轉到事件引導流程
    navigate(`/event/${newEvent.id}`);
  };

  const ongoingEvents = events.filter((e) => e.status === "ongoing" || e.status === "waiting");
  const completedEvents = events.filter((e) => e.status === "completed");

  return (
    <Layout>
      {/* Hero 區 */}
      <section className="relative overflow-hidden">
        <div className="container py-12 md:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" style={{ color: "oklch(0.70 0.05 50)" }} />
              <span>今天好嗎？</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight mb-3" style={{ fontFamily: '"Noto Serif TC", serif' }}>
              今天想一起整理<br />哪一件事情？
            </h1>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              我是艾思，你的心理支持夥伴。<br />
              無論是課堂上的挫折、家長溝通的困擾，<br />
              還是行政事務的壓力，讓我們一起面對。
            </p>
            <Button
              size="lg"
              onClick={() => setShowNewEvent(!showNewEvent)}
              className="gap-2 rounded-full px-6"
            >
              <Plus className="w-5 h-5" />
              新增事件
            </Button>
          </div>
        </div>

        {/* 裝飾性呼吸圓圈 */}
        <div
          className="absolute -right-20 -top-10 w-72 h-72 rounded-full opacity-[0.07] breathing-circle hidden md:block"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.03 145), transparent 70%)" }}
        />
        <div
          className="absolute right-20 bottom-0 w-48 h-48 rounded-full opacity-[0.05] breathing-circle hidden md:block"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.05 50), transparent 70%)", animationDelay: "2s" }}
        />
      </section>

      {/* 新增事件區 */}
      {showNewEvent && (
        <section className="container pb-8 soft-fade-in">
          <Card className="p-6 max-w-2xl border-2" style={{ borderColor: "oklch(0.72 0.03 145 / 0.3)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
              今天發生什麼事情？
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              可以用文字描述事件的經過、你的感受、或你想處理的問題。<br />
              <span className="text-primary">建立後，艾思會一步步引導你分析與處理。</span>
            </p>
            <Textarea
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="例如：主任突然要求我三天內完成教育部計畫..."
              className="min-h-[120px] mb-4 resize-none"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowNewEvent(false)}>
                取消
              </Button>
              <Button onClick={handleCreateEvent} disabled={!eventText.trim()} className="gap-2">
                開始分析
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </section>
      )}

      {/* 今日事件 */}
      <section className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            今天的事件
          </h2>
          <span className="text-sm text-muted-foreground">{ongoingEvents.length} 件進行中</span>
        </div>

        {ongoingEvents.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.95 0.008 80)" }}
            >
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">今天還沒有記錄任何事件</p>
            <p className="text-sm text-muted-foreground/70 mt-1">點擊「新增事件」開始記錄</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {ongoingEvents.map((event, i) => {
              const config = STATUS_CONFIG[event.status];
              const StatusIcon = config.icon;
              return (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <Card
                    className="p-5 event-card-hover cursor-pointer stagger-item"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
                        <span className="text-xs font-medium" style={{ color: config.color }}>
                          {config.label}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleDateString("zh-TW", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <h3 className="font-medium mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                    {event.emotion && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full" style={{ background: "oklch(0.95 0.008 80)" }}>
                          {event.emotion}
                        </span>
                        {event.intensity && (
                          <span className="text-xs text-muted-foreground">強度 {event.intensity}/10</span>
                        )}
                      </div>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                      繼續引導流程 <ChevronRight className="w-3 h-3" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 已完成事件 */}
      {completedEvents.length > 0 && (
        <section className="container py-8 border-t border-border/30">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            已完成
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {completedEvents.slice(0, 6).map((event, i) => {
              const config = STATUS_CONFIG.completed;
              const StatusIcon = config.icon;
              return (
                <Link key={event.id} href={`/event/${event.id}`}>
                  <Card
                    className="p-4 event-card-hover cursor-pointer stagger-item opacity-80 hover:opacity-100"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
                      <span className="text-xs font-medium" style={{ color: config.color }}>
                        {config.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium line-clamp-2">{event.title}</h3>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 四大模組快速入口 */}
      <section className="container py-12 border-t border-border/30">
        <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
          工具模組
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          也可以直接選擇想使用的工具
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "emotion-awareness", title: "情緒覺察", icon: "💭", desc: "辨識並命名當下情緒", color: "oklch(0.72 0.03 145)" },
            { id: "cognitive-regulation", title: "認知調節", icon: "🧘", desc: "呼吸、換位、認知重構", color: "oklch(0.70 0.05 50)" },
            { id: "communication-script", title: "溝通腳本", icon: "💬", desc: "NVC 結構化溝通", color: "oklch(0.68 0.04 200)" },
            { id: "decision-guidance", title: "決策引導", icon: "📋", desc: "CARE 流程決策", color: "oklch(0.65 0.03 280)" },
          ].map((mod, i) => (
            <Link key={mod.id} href={`/modules/${mod.id}`}>
              <Card
                className="p-5 event-card-hover cursor-pointer stagger-item h-full"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: `${mod.color}15` }}
                >
                  {mod.icon}
                </div>
                <h3 className="font-semibold mb-1">{mod.title}</h3>
                <p className="text-sm text-muted-foreground">{mod.desc}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
