"use client";

export default function WorkerAvatar({
  photoUrl,
  name,
  size = 64,
}: {
  photoUrl: string;
  name: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoUrl) {
    return (
      <div className="relative overflow-hidden rounded-xl2 bg-ink-50" style={{ height: size, width: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} style={{ height: size, width: size }} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-xl2 bg-brand-100 font-display font-extrabold text-brand-600"
      style={{ height: size, width: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}
