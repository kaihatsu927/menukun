import { CSSProperties } from "react";
import { MenuTheme } from "@/lib/types";
import { themeToCssVars } from "@/lib/theme";

/** テンプレート選択カード用の小さな見た目サンプル */
export function MiniPreview({ theme, label }: { theme: MenuTheme; label: string }) {
  const vars = themeToCssVars(theme) as CSSProperties;
  return (
    <div
      className="menu-scope overflow-hidden rounded-lg border"
      style={{ ...vars, borderColor: "var(--m-border)" }}
    >
      <div className="p-3">
        <div className="text-center text-[11px] font-bold" style={{ color: "var(--m-text)" }}>
          {label}
        </div>
        <div className="m-accent mx-auto mt-1 h-0.5 w-6 rounded" style={{ background: "var(--m-accent)" }} />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden"
              style={{
                background: "var(--m-surface)",
                borderRadius: "calc(var(--m-radius) * 0.4)",
                border: "1px solid var(--m-hairline)",
              }}
            >
              <div
                className="h-6 w-full"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in srgb, var(--m-accent) 16%, var(--m-surface)), var(--m-surface))",
                }}
              />
              <div className="space-y-1 p-1.5">
                <div className="h-1 w-3/4 rounded" style={{ background: "var(--m-border)" }} />
                <div className="h-1 w-1/2 rounded" style={{ background: "var(--m-hairline)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
