import { Star } from "lucide-react";

export default function StarRating({
  rating,
  count,
  size = 14,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Star size={size} className="fill-gold-500 text-gold-500" />
      <span className="text-sm font-bold text-ink-900">{rating.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-xs font-medium text-ink-400">({count})</span>
      )}
    </span>
  );
}
