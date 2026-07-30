// 艾思平台 — 核心資料結構與常數

// 情緒類型（基於 Plutchik 情緒輪 + 教師情境擴展）
export interface EmotionType {
  id: string;
  label: string;
  category: "positive" | "negative" | "neutral";
  color: string;
  level: number; // 強度等級 1-3
  teacherContext?: string;
}

export const EMOTION_TYPES: EmotionType[] = [
  // 憤怒系列
  { id: "irritated", label: "煩躁", category: "negative", color: "oklch(0.65 0.06 30)", level: 1, teacherContext: "學生頂嘴、行政干擾" },
  { id: "frustrated", label: "挫折", category: "negative", color: "oklch(0.62 0.07 30)", level: 2, teacherContext: "教學不如預期" },
  { id: "angry", label: "憤怒", category: "negative", color: "oklch(0.58 0.08 25)", level: 3, teacherContext: "被不公平對待" },
  // 悲傷系列
  { id: "disappointed", label: "失落", category: "negative", color: "oklch(0.60 0.03 250)", level: 1, teacherContext: "教學不被理解" },
  { id: "sad", label: "沮喪", category: "negative", color: "oklch(0.55 0.04 250)", level: 2, teacherContext: "學生放棄學習" },
  { id: "heartbroken", label: "心寒", category: "negative", color: "oklch(0.50 0.05 250)", level: 3, teacherContext: "付出不被看見" },
  // 恐懼系列
  { id: "worried", label: "擔憂", category: "negative", color: "oklch(0.65 0.04 200)", level: 1, teacherContext: "評鑑、考績" },
  { id: "anxious", label: "焦慮", category: "negative", color: "oklch(0.60 0.05 200)", level: 2, teacherContext: "家長投訴" },
  { id: "stressed", label: "壓力", category: "negative", color: "oklch(0.55 0.06 200)", level: 3, teacherContext: "多重任務同時湧入" },
  // 厭惡系列
  { id: "bored", label: "倦怠", category: "negative", color: "oklch(0.65 0.02 80)", level: 1, teacherContext: "重複性工作" },
  { id: "weary", label: "疲乏", category: "negative", color: "oklch(0.60 0.02 80)", level: 2, teacherContext: "無意義會議" },
  { id: "exhausted", label: "疲憊", category: "negative", color: "oklch(0.55 0.02 80)", level: 3, teacherContext: "長期超時工作" },
  // 快樂系列
  { id: "peaceful", label: "平靜", category: "positive", color: "oklch(0.72 0.03 145)", level: 1, teacherContext: "順利完成工作" },
  { id: "satisfied", label: "欣慰", category: "positive", color: "oklch(0.70 0.04 145)", level: 2, teacherContext: "學生進步" },
  { id: "fulfilled", label: "成就感", category: "positive", color: "oklch(0.68 0.05 145)", level: 3, teacherContext: "獲得認可" },
  // 信任系列
  { id: "secure", label: "安心", category: "positive", color: "oklch(0.72 0.03 160)", level: 1, teacherContext: "同事協助" },
  { id: "supported", label: "被支持", category: "positive", color: "oklch(0.70 0.04 160)", level: 2, teacherContext: "行政支援" },
  // 中性
  { id: "confused", label: "困惑", category: "neutral", color: "oklch(0.65 0.02 280)", level: 1, teacherContext: "政策不明確" },
  { id: "neutral", label: "平穩", category: "neutral", color: "oklch(0.70 0.01 80)", level: 1, teacherContext: "一般日常" },
];

// 認知扭曲類型
export interface CognitiveDistortion {
  id: string;
  label: string;
  description: string;
  example: string;
  reframe: string;
}

export const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  { id: "all-or-nothing", label: "全有或全無思維", description: "用非黑即白的方式看事情", example: "這堂課完全失敗了", reframe: "這堂課有些部分不理想，但也有不錯的環節" },
  { id: "overgeneralization", label: "過度概化", description: "從單一事件推論所有情況", example: "學生永遠不會聽話", reframe: "這幾位學生今天不配合，不代表所有學生永遠如此" },
  { id: "mental-filter", label: "心理過濾", description: "只注意負面細節", example: "雖然 29 人表現好，但那 1 人讓整堂課毀了", reframe: "29 位學生表現良好，1 位需要額外關注" },
  { id: "disqualifying-positive", label: "否定正面", description: "將正面經驗轉化為負面", example: "他們只是今天運氣好", reframe: "今天的成果是努力來的，不是運氣" },
  { id: "mind-reading", label: "讀心術", description: "假設知道別人在想什麼", example: "家長一定覺得我是爛老師", reframe: "我無法確知家長的想法，需要直接溝通" },
  { id: "fortune-telling", label: "預言家謬誤", description: "預測最壞的結果", example: "明天的觀課一定會搞砸", reframe: "我無法預測未來，但可以做好準備" },
  { id: "catastrophizing", label: "災難化", description: "放大問題的嚴重性", example: "這個投訴會毀掉我的職涯", reframe: "這是一個需要處理的問題，但不會毀掉一切" },
  { id: "emotional-reasoning", label: "情緒推理", description: "以感覺作為事實依據", example: "我感覺失敗，所以我就是失敗", reframe: "感覺不等於事實，我有許多成功的教學經驗" },
  { id: "should-statements", label: "應該句型", description: "用「應該」要求自己或他人", example: "我應該能控制所有學生", reframe: "我可以盡力引導，但無法控制所有人的行為" },
  { id: "labeling", label: "標籤化", description: "給自己或他人貼負面標籤", example: "我就是沒有教學天分", reframe: "這次經驗不理想，不代表我沒有能力" },
];

// NVC 溝通腳本結構
export interface NVCTemplate {
  observation: string;
  feeling: string;
  need: string;
  request: string;
}

// 決策引導 CARE 流程步驟
export interface CAREStep {
  id: string;
  label: string;
  title: string;
  description: string;
  questions: string[];
}

export const CARE_STEPS: CAREStep[] = [
  {
    id: "clarify",
    label: "C",
    title: "澄清 (Clarify)",
    description: "釐清當前情境的核心問題",
    questions: [
      "發生了什麼事？請描述具體情境",
      "這件事涉及哪些人？",
      "你心中理想的處理方式會是什麼樣子？",
    ],
  },
  {
    id: "analyze",
    label: "A",
    title: "分析 (Analyze)",
    description: "分析各方利益與影響",
    questions: [
      "這個決定會影響到哪些人？",
      "對你自己而言，什麼樣的做法讓你感到心安？",
      "有哪些可能的選項？",
    ],
  },
  {
    id: "decide",
    label: "R",
    title: "決定 (Resolve)",
    description: "做出考量周全的決定",
    questions: [
      "綜合以上分析，你傾向哪個選項？",
      "這個選項的風險是什麼？你願意承擔嗎？",
      "需要哪些資源或支援來執行？",
    ],
  },
  {
    id: "evaluate",
    label: "E",
    title: "評估 (Evaluate)",
    description: "評估決策品質與後續追蹤",
    questions: [
      "這個決定符合你的價值觀嗎？",
      "你會如何追蹤執行結果？",
      "如果結果不如預期，你的備案是什麼？",
    ],
  },
];

// 呼吸練習類型
export interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  pattern: { inhale: number; hold: number; exhale: number };
  rounds: number;
  instructions: string[];
}

export const BREATHING_EXERCISES: BreathingExercise[] = [
  {
    id: "4-7-8",
    name: "4-7-8 呼吸法",
    description: "吸氣 4 秒、屏息 7 秒、吐氣 8 秒，重複 4 輪",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    rounds: 4,
    instructions: [
      "慢慢吸氣...感受空氣進入身體",
      "溫柔地屏住呼吸...讓氧氣充分吸收",
      "緩緩吐氣...感受身體逐漸放鬆",
      "很好，讓我們繼續下一輪",
    ],
  },
  {
    id: "box",
    name: "方塊呼吸法",
    description: "吸氣 4 秒、屏息 4 秒、吐氣 4 秒、屏息 4 秒，重複 4 輪",
    pattern: { inhale: 4, hold: 4, exhale: 4 },
    rounds: 4,
    instructions: [
      "吸氣 4 秒...保持穩定",
      "屏住呼吸 4 秒...感受平靜",
      "吐氣 4 秒...釋放壓力",
      "再次屏息 4 秒...準備下一輪",
    ],
  },
];

// 角色換位模擬角色庫
export interface PerspectiveRole {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export const PERSPECTIVE_ROLES: PerspectiveRole[] = [
  { id: "student", label: "學生", icon: "👨‍🎓", description: "從學生的角度思考" },
  { id: "parent", label: "家長", icon: "👨‍👩‍👧", description: "從家長的角度思考" },
  { id: "principal", label: "校長/主任", icon: "🏫", description: "從行政主管的角度思考" },
  { id: "colleague", label: "同事", icon: "👥", description: "從同事的角度思考" },
  { id: "counselor", label: "輔導老師", icon: "🎓", description: "從輔導專業的角度思考" },
];

// 初級評估類型
export interface AppraisalType {
  id: string;
  label: string;
  description: string;
  color: string;
}

export const APPRAISAL_TYPES: AppraisalType[] = [
  { id: "threat", label: "威脅 (Threat)", description: "擔心做不好、會失敗", color: "oklch(0.60 0.08 25)" },
  { id: "challenge", label: "挑戰 (Challenge)", description: "有難度但可以成長", color: "oklch(0.65 0.06 50)" },
  { id: "loss", label: "損失 (Loss)", description: "已經失去或將會失去", color: "oklch(0.55 0.05 250)" },
];

// 資源類型
export interface ResourceType {
  id: string;
  label: string;
  description: string;
  items: string[];
}

export const RESOURCE_TYPES: ResourceType[] = [
  {
    id: "personal",
    label: "個人能力",
    description: "你具備的技能與能力",
    items: ["教學能力", "行政能力", "情緒調節能力", "問題解決能力"],
  },
  {
    id: "social",
    label: "人際支持",
    description: "可以尋求協助的人",
    items: ["主任", "校長", "同事", "家人朋友", "輔導老師"],
  },
  {
    id: "organizational",
    label: "組織資源",
    description: "學校提供的資源",
    items: ["校內流程", "SOP", "法規依據", "預算", "設備"],
  },
  {
    id: "psychological",
    label: "心理資源",
    description: "內在的心理能量",
    items: ["睡眠", "專注力", "體力", "動機", "自我效能感"],
  },
];

// 因應策略類型
export interface CopingStrategy {
  id: string;
  label: string;
  description: string;
  recommendedModule: string;
  condition: string;
}

export const COPING_STRATEGIES: CopingStrategy[] = [
  { id: "emotion-focused", label: "情緒焦點因應", description: "先穩定情緒，再處理問題", recommendedModule: "cognitive", condition: "當情緒強度高（7以上）時優先使用" },
  { id: "problem-focused", label: "問題焦點因應", description: "直接分析並解決問題", recommendedModule: "decision", condition: "當情緒穩定且問題明確時使用" },
  { id: "social-support", label: "社會支持因應", description: "尋求他人協助與溝通", recommendedModule: "communication", condition: "當需要與他人互動時使用" },
  { id: "cognitive-reappraisal", label: "認知重評估", description: "重新解讀事件意義", recommendedModule: "cognitive", condition: "當想法造成持續困擾時使用" },
];

// SEL 五項核心能力
export interface SELCompetency {
  id: string;
  label: string;
  englishLabel: string;
  coreQuestion: string;
  color: string;
  icon: string;
  learningPoint: string;
  indicators: string[];
  nextStep: string;
}

export const SEL_COMPETENCIES: SELCompetency[] = [
  {
    id: "self_awareness",
    label: "自我覺察",
    englishLabel: "Self-Awareness",
    coreQuestion: "我現在有什麼感受？為什麼這件事對我這麼重要？",
    color: "oklch(0.72 0.03 145)",
    icon: "💭",
    learningPoint: "情緒不是問題本身，而是幫助我們了解需求與價值的訊號。",
    indicators: ["能正確命名情緒", "能辨識身體反應", "能區分事實、想法與感受", "能說出事件中的核心需求"],
    nextStep: "區分事實與負面推測",
  },
  {
    id: "self_management",
    label: "自我管理",
    englishLabel: "Self-Management",
    coreQuestion: "我如何在情緒中保持穩定，並採取適當行動？",
    color: "oklch(0.70 0.05 50)",
    icon: "🧘",
    learningPoint: "自我管理並不是壓抑情緒，而是在理解情緒後，選擇較有利的回應方式。",
    indicators: ["能延後衝動性反應", "能選擇適合的調節策略", "情緒調節前後強度有變化", "能完成行動計畫"],
    nextStep: "建立穩定練習",
  },
  {
    id: "social_awareness",
    label: "社會覺察",
    englishLabel: "Social Awareness",
    coreQuestion: "對方可能怎麼理解這件事？情境中還有哪些人的需要？",
    color: "oklch(0.68 0.04 200)",
    icon: "👥",
    learningPoint: "理解他人的觀點，不代表同意對方，而是增加對情境的完整理解。",
    indicators: ["能提出兩種以上觀點", "能區分事實與推測", "能辨識他人的可能需求", "能減少單一負面歸因"],
    nextStep: "減少未確認推測",
  },
  {
    id: "relationship_skills",
    label: "人際關係技巧",
    englishLabel: "Relationship Skills",
    coreQuestion: "我如何清楚表達自己，同時維持界線與合作？",
    color: "oklch(0.65 0.04 160)",
    icon: "💬",
    learningPoint: "清楚的表達包含具體事實、自己的感受與需要，以及明確可行的請求。",
    indicators: ["能使用具體而非指責性語言", "能清楚提出請求", "能表達界線", "能尋求適當支持"],
    nextStep: "加強界線表達",
  },
  {
    id: "responsible_decision_making",
    label: "負責任決策",
    englishLabel: "Responsible Decision-Making",
    coreQuestion: "哪一個選擇最符合價值、倫理與長期結果？",
    color: "oklch(0.65 0.03 280)",
    icon: "📋",
    learningPoint: "負責任決策不只是選擇最快的方法，也要考慮安全、公平、關係與長期影響。",
    indicators: ["能提出多個方案", "能考慮短期與長期結果", "能考慮不同利害關係人", "能檢查公平、倫理及規範"],
    nextStep: "加入長期與倫理考量",
  },
];

// SEL 學習記錄
export interface SELLearningRecord {
  competency: string;
  behavior: string;
  completed: boolean;
  userConfidence?: number;
}

// SEL 微學習提示
export interface SELMicroLearning {
  step: string;
  competency: string;
  type: "tip" | "quiz" | "reminder" | "reflection";
  title: string;
  content: string;
  options?: string[];
}

export const SEL_MICRO_LEARNINGS: SELMicroLearning[] = [
  {
    step: "analyze",
    competency: "self_awareness",
    type: "tip",
    title: "SEL 學習提示：區分感受與判斷",
    content: "「我覺得不被尊重」包含一項判斷。可以再問：我真正的情緒是生氣、委屈，還是失望？",
  },
  {
    step: "primary",
    competency: "self_awareness",
    type: "quiz",
    title: "SEL 單題練習：下列哪一項是客觀事實？",
    content: "",
    options: ["主任完全不尊重我", "主任要求我三天內完成計畫", "主任一定認為我能力不好"],
  },
  {
    step: "secondary",
    competency: "self_management",
    type: "tip",
    title: "SEL 學習提示：可控性分析",
    content: "將事情分為「可以直接控制」、「可以影響」和「無法控制」三類，把精力集中在可以控制的部分。",
  },
  {
    step: "navigator",
    competency: "social_awareness",
    type: "tip",
    title: "SEL 學習提示：區分已知與推測",
    content: "已知事實：家長在群組中提出疑問。可能推測：家長可能擔心孩子。尚未確認：家長是否不信任教師。",
  },
  {
    step: "module",
    competency: "relationship_skills",
    type: "reminder",
    title: "行動前提醒",
    content: "在送出訊息前檢查：是否描述具體事實？是否清楚說明需求？是否提出可執行的請求？",
  },
  {
    step: "reappraisal",
    competency: "responsible_decision_making",
    type: "reflection",
    title: "行動後反思",
    content: "這次哪一項能力最有幫助？覺察自己的情緒 / 管理衝動 / 理解對方觀點 / 清楚表達 / 比較不同方案",
  },
];

// 事件狀態
export type EventStatus = "ongoing" | "waiting" | "completed";

// 事件資料結構
export interface WellnessEvent {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  createdAt: string;
  emotion?: string;
  intensity?: number;
  appraisal?: { threat: number; challenge: number; loss: number };
  moduleUsed?: string;
  outcome?: string;
  selRecords?: SELLearningRecord[];
  selReflection?: string;
  nextLearningGoal?: string;
}

// 模組資訊
export interface ModuleInfo {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  duration: string;
  selCompetency: string;
}

export const MODULES: ModuleInfo[] = [
  {
    id: "emotion-awareness",
    title: "情緒覺察",
    subtitle: "辨識並命名當下情緒",
    description: "透過結構化的情緒記錄與非評判性回饋，幫助你精確識別和命名情緒，建立長期的情緒趨勢追蹤。",
    icon: "💭",
    color: "oklch(0.72 0.03 145)",
    duration: "2-3 分鐘",
    selCompetency: "自我覺察 (Self-Awareness)",
  },
  {
    id: "cognitive-regulation",
    title: "認知調節",
    subtitle: "呼吸練習、角色換位、認知重構",
    description: "提供正念呼吸引導、多角色視角模擬、認知扭曲識別與重構，幫助你從不同角度看待壓力事件。",
    icon: "🧘",
    color: "oklch(0.70 0.05 50)",
    duration: "2-5 分鐘",
    selCompetency: "自我管理 (Self-Management)",
  },
  {
    id: "communication-script",
    title: "溝通腳本",
    subtitle: "NVC 四要素結構化溝通",
    description: "基於非暴力溝通（NVC）的四要素框架，生成觀察-感受-需要-請求的結構化溝通腳本，提供多版本選擇。",
    icon: "💬",
    color: "oklch(0.68 0.04 200)",
    duration: "3-5 分鐘",
    selCompetency: "關係技巧 (Relationship Skills)",
  },
  {
    id: "decision-guidance",
    title: "決策引導",
    subtitle: "CARE 流程結構化決策",
    description: "透過澄清-分析-決定-評估的四步驟引導式流程，幫助你在複雜情境中做出考量周全的決定。",
    icon: "📋",
    color: "oklch(0.65 0.03 280)",
    duration: "5-10 分鐘",
    selCompetency: "負責任決策 (Responsible Decision-Making)",
  },
];
