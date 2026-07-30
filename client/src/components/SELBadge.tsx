import { SEL_COMPETENCIES } from "@/lib/data";
import { BookOpen, Lightbulb, HelpCircle, Bell, Heart } from "lucide-react";
import { useState } from "react";

interface SELBadgeProps {
  competencyId: string;
  variant?: "badge" | "card";
}

export function SELBadge({ competencyId, variant = "badge" }: SELBadgeProps) {
  const competency = SEL_COMPETENCIES.find((c) => c.id === competencyId);
  if (!competency) return null;

  if (variant === "badge") {
    return (
      <span
        className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
        style={{ background: `${competency.color}15`, color: competency.color }}
      >
        <span>{competency.icon}</span>
        SEL：{competency.label}
      </span>
    );
  }

  return (
    <div
      className="p-4 rounded-xl border-l-4 soft-fade-in"
      style={{ borderColor: competency.color, background: `${competency.color}06` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{competency.icon}</span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${competency.color}15`, color: competency.color }}
        >
          SEL 學習標記
        </span>
      </div>
      <p className="text-sm font-medium mb-1">{competency.label} — {competency.englishLabel}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{competency.learningPoint}</p>
    </div>
  );
}

interface SELMicroLearningProps {
  step: string;
}

export function SELMicroLearningCard({ step }: SELMicroLearningProps) {
  const [expanded, setExpanded] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);

  const learnings = [
    {
      step: "analyze",
      competency: "self_awareness",
      type: "tip" as const,
      title: "SEL 學習提示：區分感受與判斷",
      content: "「我覺得不被尊重」包含一項判斷。可以再問：我真正的情緒是生氣、委屈，還是失望？",
    },
    {
      step: "primary",
      competency: "self_awareness",
      type: "quiz" as const,
      title: "SEL 單題練習：下列哪一項是客觀事實？",
      content: "",
      options: ["主任完全不尊重我", "主任要求我三天內完成計畫", "主任一定認為我能力不好"],
      correctAnswer: 1,
    },
    {
      step: "secondary",
      competency: "self_management",
      type: "tip" as const,
      title: "SEL 學習提示：可控性分析",
      content: "將事情分為「可以直接控制」、「可以影響」和「無法控制」三類，把精力集中在可以控制的部分。",
    },
    {
      step: "navigator",
      competency: "social_awareness",
      type: "tip" as const,
      title: "SEL 學習提示：區分已知與推測",
      content: "已知事實：家長在群組中提出疑問。可能推測：家長可能擔心孩子。尚未確認：家長是否不信任教師。",
    },
    {
      step: "module",
      competency: "relationship_skills",
      type: "reminder" as const,
      title: "行動前提醒",
      content: "在送出訊息前檢查：是否描述具體事實？是否清楚說明需求？是否提出可執行的請求？",
    },
  ];

  const learning = learnings.find((l) => l.step === step);
  if (!learning) return null;

  const competency = SEL_COMPETENCIES.find((c) => c.id === learning.competency);
  if (!competency) return null;

  const typeIcon = {
    tip: Lightbulb,
    quiz: HelpCircle,
    reminder: Bell,
    reflection: Heart,
  };
  const Icon = typeIcon[learning.type];

  return (
    <div
      className="rounded-xl border transition-all cursor-pointer overflow-hidden"
      style={{ borderColor: `${competency.color}30` }}
      onClick={() => setExpanded(!expanded)}
    >
      <div
        className="flex items-center gap-2 p-3"
        style={{ background: `${competency.color}06` }}
      >
        <Icon className="w-4 h-4 shrink-0" style={{ color: competency.color }} />
        <span className="text-sm font-medium flex-1">{learning.title}</span>
        <span
          className="text-xs px-2 py-0.5 rounded-full shrink-0"
          style={{ background: `${competency.color}15`, color: competency.color }}
        >
          {competency.icon} {competency.label}
        </span>
      </div>
      {expanded && (
        <div className="p-4 soft-fade-in">
          {learning.content && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{learning.content}</p>
          )}
          {learning.type === "quiz" && learning.options && (
            <div className="space-y-2">
              {learning.options.map((option, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuizAnswer(i);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                    quizAnswer === i
                      ? i === learning.correctAnswer
                        ? "border-green-400 bg-green-50"
                        : "border-red-400 bg-red-50"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                  {quizAnswer === i && (
                    <span className="ml-2">
                      {i === learning.correctAnswer ? "✓ 正確" : "✗ 再想想"}
                    </span>
                  )}
                </button>
              ))}
              {quizAnswer !== null && quizAnswer === learning.correctAnswer && (
                <p className="text-xs text-muted-foreground mt-2">
                  客觀事實是可以被觀察和驗證的描述，不包含主觀判斷或猜測。
                </p>
              )}
            </div>
          )}
          {learning.type === "reminder" && (
            <div className="space-y-1.5">
              {["是否描述具體事實？", "是否清楚說明需求？", "是否提出可執行的請求？"].map((check) => (
                <label key={check} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded"
                    style={{ accentColor: competency.color }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {check}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      {!expanded && (
        <div className="px-3 pb-2">
          <span className="text-xs text-muted-foreground">點擊展開學習內容</span>
        </div>
      )}
    </div>
  );
}
