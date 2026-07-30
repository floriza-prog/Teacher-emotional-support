import { Link, useLocation } from "wouter";
import { LogoFull } from "./Logo";
import { Button } from "@/components/ui/button";
import { Home, BookHeart, Settings, Menu, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "今日", icon: Home },
    { path: "/modules", label: "工具模組", icon: BookHeart },
    { path: "/growth", label: "我的成長", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 頂部導航 */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <LogoFull size={36} />
          </Link>

          {/* 桌面導航 */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={`gap-2 ${active ? "text-secondary-foreground" : "text-muted-foreground"}`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* 手機選單按鈕 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="選單"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* 手機導航 */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
            <div className="container py-3 flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={active ? "secondary" : "ghost"}
                      className="w-full justify-start gap-2"
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* 主內容 */}
      <main className="flex-1 page-enter">{children}</main>

      {/* 頁尾 */}
      <footer className="border-t border-border/50 mt-12">
        <div className="container py-8 text-center">
          <p className="text-sm text-muted-foreground">
            艾思 — 為教師而生的心理支持工具
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            本平台提供之內容僅供自我覺察與學習參考，不替代專業心理諮商服務
          </p>
        </div>
      </footer>
    </div>
  );
}
