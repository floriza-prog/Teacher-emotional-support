import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { MODULES } from "@/lib/data";
import { ChevronRight, Clock } from "lucide-react";

export default function Modules() {
  return (
    <Layout>
      <section className="container py-12">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2" style={{ fontFamily: '"Noto Serif TC", serif' }}>
          工具模組
        </h1>
        <p className="text-muted-foreground mb-8">
          四個相互串聯的心理支持工具，可以單獨使用，也可以依事件流程串接
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {MODULES.map((mod, i) => (
            <Link key={mod.id} href={`/modules/${mod.id}`}>
              <Card
                className="p-6 event-card-hover cursor-pointer stagger-item h-full"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ background: `${mod.color}15` }}
                  >
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold">{mod.title}</h2>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: `${mod.color}15`, color: mod.color }}
                      >
                        {mod.selCompetency}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">{mod.subtitle}</p>
                    <p className="text-sm text-muted-foreground/80 leading-relaxed mb-3">
                      {mod.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mod.duration}
                      </span>
                      <span className="flex items-center gap-1 text-primary">
                        開始使用
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* 模組串聯說明 */}
        <div className="mt-12 p-6 rounded-2xl" style={{ background: "oklch(0.95 0.008 80)" }}>
          <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: '"Noto Serif TC", serif' }}>
            模組如何串聯？
          </h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            每個模組不是孤立的工具，而是可以依據你的需求無縫串接。例如：
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["情緒覺察", "認知調節", "溝通腳本", "決策引導"].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-background font-medium">{label}</span>
                {i < 3 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            先覺察情緒，再調節認知，然後準備溝通腳本，最後做出決定 — 一個完整的事件處理流程。
          </p>
        </div>
      </section>
    </Layout>
  );
}
