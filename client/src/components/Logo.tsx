interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-label="艾思標誌"
    >
      {/* 外圈 — 覺察 */}
      <path
        d="M 24 4 A 20 20 0 1 1 4 24"
        stroke="oklch(0.72 0.03 145)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* 內圈 — 調節 */}
      <path
        d="M 24 14 A 10 10 0 1 1 14 24"
        stroke="oklch(0.70 0.05 50)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* 中心點 */}
      <circle cx="24" cy="24" r="2.5" fill="oklch(0.72 0.03 145)" />
    </svg>
  );
}

export function LogoFull({ size = 40, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Logo size={size} />
      <span
        className="text-xl font-semibold tracking-wide"
        style={{ fontFamily: '"Noto Serif TC", serif' }}
      >
        艾思
      </span>
    </div>
  );
}
