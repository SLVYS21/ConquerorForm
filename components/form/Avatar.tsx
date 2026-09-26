"use client";

type Props = {
  src?: string;
  name?: string;
  size?: number;
  ring?: boolean;
};

export function Avatar({ src, name = "", size = 40, ring = false }: Props) {
  const initial = (name.trim()[0] || "?").toUpperCase();
  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: "9999px",
        background: "var(--bubble-bg)",
        boxShadow: ring ? "0 0 0 3px color-mix(in oklab, var(--accent) 30%, transparent)" : "none",
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          style={{ display: "block" }}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-semibold"
          style={{
            fontSize: size * 0.42,
            background: "var(--accent)",
            color: "var(--accent-text)",
          }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
