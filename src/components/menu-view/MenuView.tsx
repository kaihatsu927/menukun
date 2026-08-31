import { CSSProperties } from "react";
import { FullMenu, MenuItem, MenuTheme } from "@/lib/types";
import { formatPrice, themeToCssVars } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FontLoader } from "./FontLoader";

interface Props {
  data: FullMenu;
  theme: MenuTheme;
  /** 編集プレビューでは true。非公開の項目も表示する */
  preview?: boolean;
}

function cardClass(card: MenuTheme["card"]): string {
  if (card === "shadow") return "m-surface shadow-[0_6px_24px_rgba(20,20,20,0.09)]";
  if (card === "flat") return "m-surface";
  return "m-surface m-border border"; // outline
}

export function MenuView({ data, theme, preview = false }: Props) {
  const { menu, categories, items } = data;
  const styleVars = themeToCssVars(theme) as CSSProperties;
  const airy = theme.airy;

  const visibleItems = items.filter((i) => i.is_available || preview);
  const anyImage = visibleItems.some((i) => !!i.image_url);

  const sortedCats = [...categories].sort((a, b) => a.position - b.position);
  const groups: { key: string; name: string | null; note: string | null; items: MenuItem[] }[] = [];

  for (const c of sortedCats) {
    const list = visibleItems
      .filter((i) => i.category_id === c.id)
      .sort((a, b) => a.position - b.position);
    if (list.length > 0) groups.push({ key: c.id, name: c.name, note: c.note, items: list });
  }
  const uncategorized = visibleItems
    .filter((i) => !i.category_id || !sortedCats.some((c) => c.id === i.category_id))
    .sort((a, b) => a.position - b.position);
  if (uncategorized.length > 0) {
    groups.push({
      key: "__uncat__",
      name: groups.length > 0 ? "その他" : null,
      note: null,
      items: uncategorized,
    });
  }

  const hasHeaderImage = !!menu.cover_url;

  return (
    <div className="menu-scope min-h-full" style={styleVars}>
      <FontLoader font={theme.font} />
      <div className={cn("mx-auto max-w-2xl px-5 pb-20 sm:px-6", airy ? "pt-12" : "pt-8")}>
        {/* ---- ヘッダー ---- */}
        <header className={cn("text-center", airy ? "mb-14" : hasHeaderImage ? "mb-8" : "mb-10")}>
          {hasHeaderImage && (
            <Thumb
              src={menu.cover_url}
              name={menu.title}
              fit={theme.imageFit}
              className="mb-6 h-44 w-full sm:h-56"
              radius="var(--m-radius)"
            />
          )}
          {menu.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={menu.logo_url}
              alt=""
              className="mx-auto mb-4 h-16 w-16 rounded-full object-cover"
            />
          )}
          <h1
            className={cn(
              "font-bold tracking-tight",
              theme.heading === "serif" && "font-normal",
              theme.bigHeadings ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            )}
          >
            {menu.title}
          </h1>
          {menu.tagline && (
            <p className="m-sub mx-auto mt-2 max-w-md text-sm leading-relaxed sm:text-base">
              {menu.tagline}
            </p>
          )}
          {menu.description && (
            <p className="m-sub mx-auto mt-4 max-w-lg whitespace-pre-line text-sm leading-relaxed">
              {menu.description}
            </p>
          )}
        </header>

        {/* ---- 本体 ---- */}
        {groups.length === 0 ? (
          <p className="m-sub py-16 text-center text-sm">
            {preview ? "項目を追加するとここに表示されます。" : "準備中です。"}
          </p>
        ) : (
          <div className={airy ? "space-y-16" : "space-y-10"}>
            {groups.map((g) => (
              <section key={g.key}>
                {g.name && <CategoryHeading name={g.name} note={g.note} theme={theme} />}
                <ItemList
                  items={g.items}
                  theme={theme}
                  menuHasImages={anyImage}
                  menu={data.menu}
                  airy={airy}
                />
              </section>
            ))}
          </div>
        )}

        <footer className="m-sub mt-16 text-center text-xs">
          <span>Powered by Menuki</span>
        </footer>
      </div>
    </div>
  );
}

/* ---------- カテゴリー見出し ---------- */
function CategoryHeading({
  name,
  note,
  theme,
}: {
  name: string;
  note: string | null;
  theme: MenuTheme;
}) {
  const big = theme.bigHeadings;

  if (theme.heading === "serif") {
    return (
      <div className="mb-5 text-center">
        <h2 className={cn("m-text font-normal", big ? "text-2xl" : "text-xl")}>{name}</h2>
        {note && <p className="m-sub mt-1 text-sm">{note}</p>}
        <div className="mx-auto mt-3 h-px w-10" style={{ background: "var(--m-accent)" }} />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h2
        className={cn(
          "m-accent font-semibold",
          big ? "text-xl sm:text-2xl" : "text-base uppercase tracking-wide",
        )}
      >
        {name}
      </h2>
      {note && <p className="m-sub mt-1 text-sm">{note}</p>}
      {theme.heading === "underline" && (
        <div className="mt-3 border-t" style={{ borderColor: "var(--m-hairline)" }} />
      )}
    </div>
  );
}

function ItemList({
  items,
  theme,
  menuHasImages,
  menu,
  airy,
}: {
  items: MenuItem[];
  theme: MenuTheme;
  menuHasImages: boolean;
  menu: FullMenu["menu"];
  airy: boolean;
}) {
  if (theme.layout === "card") {
    return (
      <div className={cn("grid sm:grid-cols-2", airy ? "gap-6" : "gap-4")}>
        {items.map((i) => (
          <CardItem key={i.id} item={i} theme={theme} menu={menu} />
        ))}
      </div>
    );
  }
  if (theme.layout === "magazine") {
    return (
      <div className={airy ? "space-y-6" : "space-y-4"}>
        {items.map((i) => (
          <MagazineItem key={i.id} item={i} theme={theme} menu={menu} />
        ))}
      </div>
    );
  }
  const compact = theme.layout === "compact";
  return (
    <div className={compact ? "space-y-2" : airy ? "space-y-6" : "space-y-4"}>
      {items.map((i) => (
        <RowItem
          key={i.id}
          item={i}
          theme={theme}
          menu={menu}
          compact={compact}
          showThumb={menuHasImages}
        />
      ))}
    </div>
  );
}

/* ---------- 写真（どんな縦横比でも切れない） ---------- */
function Thumb({
  src,
  name,
  fit,
  className,
  radius,
}: {
  src: string | null;
  name: string;
  fit: MenuTheme["imageFit"];
  className?: string;
  radius?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={radius ? { borderRadius: radius } : undefined}
    >
      {src ? (
        <>
          {fit === "contain" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-125 object-cover blur-2xl"
              style={{ opacity: 0.5 }}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className={cn(
              "relative z-[1] h-full w-full",
              fit === "cover" ? "object-cover" : "object-contain",
            )}
          />
        </>
      ) : (
        <Placeholder name={name} className="h-full w-full" />
      )}
    </div>
  );
}

function Placeholder({ name, className }: { name: string; className?: string }) {
  const ch = name.trim().charAt(0) || "・";
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{
        background:
          "linear-gradient(135deg, color-mix(in srgb, var(--m-accent) 14%, var(--m-surface)), var(--m-surface))",
      }}
    >
      <span className="m-accent text-2xl font-semibold opacity-70">{ch}</span>
    </div>
  );
}

function PriceTag({ item, menu }: { item: MenuItem; menu: FullMenu["menu"] }) {
  if (!menu.show_price) return null;
  const p = formatPrice(item.price, menu.currency, item.price_note);
  if (!p) return null;
  return <span className="shrink-0 text-sm font-medium tabular-nums">{p}</span>;
}

function Badge({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <span className="m-accent-bg inline-block rounded-full px-2 py-0.5 text-[11px] font-medium leading-none">
      {text}
    </span>
  );
}

function CardItem({
  item,
  theme,
  menu,
}: {
  item: MenuItem;
  theme: MenuTheme;
  menu: FullMenu["menu"];
}) {
  return (
    <article
      className={cn(
        "overflow-hidden",
        cardClass(theme.card),
        !item.is_available && "opacity-50",
      )}
      style={{ borderRadius: "var(--m-radius)" }}
    >
      <Thumb src={item.image_url} name={item.name} fit={theme.imageFit} className="aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium leading-snug">{item.name}</h3>
          <PriceTag item={item} menu={menu} />
        </div>
        {item.badge && (
          <div className="mt-2">
            <Badge text={item.badge} />
          </div>
        )}
        {item.description && (
          <p className="m-sub mt-2 whitespace-pre-line text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

function MagazineItem({
  item,
  theme,
  menu,
}: {
  item: MenuItem;
  theme: MenuTheme;
  menu: FullMenu["menu"];
}) {
  return (
    <article
      className={cn(
        "flex gap-4 overflow-hidden p-3",
        cardClass(theme.card),
        !item.is_available && "opacity-50",
      )}
      style={{ borderRadius: "var(--m-radius)" }}
    >
      <Thumb
        src={item.image_url}
        name={item.name}
        fit={theme.imageFit}
        className="h-24 w-24 shrink-0 self-center sm:h-28 sm:w-28"
        radius="calc(var(--m-radius) * 0.6)"
      />
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-medium leading-snug">{item.name}</h3>
          <PriceTag item={item} menu={menu} />
        </div>
        {item.badge && (
          <div className="mt-1.5">
            <Badge text={item.badge} />
          </div>
        )}
        {item.description && (
          <p className="m-sub mt-1.5 whitespace-pre-line text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

function RowItem({
  item,
  theme,
  menu,
  compact,
  showThumb,
}: {
  item: MenuItem;
  theme: MenuTheme;
  menu: FullMenu["menu"];
  compact: boolean;
  showThumb: boolean;
}) {
  return (
    <article
      className={cn(
        "flex gap-3",
        showThumb ? "items-center" : compact ? "items-baseline" : "items-start",
        !item.is_available && "opacity-50",
      )}
    >
      {showThumb && (
        <Thumb
          src={item.image_url}
          name={item.name}
          fit={theme.imageFit}
          className={cn("shrink-0", compact ? "h-11 w-11" : "h-16 w-16")}
          radius="calc(var(--m-radius) * 0.5)"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className={cn("font-medium", compact ? "text-[15px]" : "text-base")}>{item.name}</h3>
          {item.badge && <Badge text={item.badge} />}
          <span
            className="mx-1 hidden flex-1 self-center border-b border-dotted sm:block"
            style={{ borderColor: "var(--m-hairline)" }}
          />
          <PriceTag item={item} menu={menu} />
        </div>
        {item.description && !compact && (
          <p className="m-sub mt-1 whitespace-pre-line text-sm leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}
