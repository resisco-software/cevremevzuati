import Link from 'next/link';
import { Layers3 } from 'lucide-react';

import { categoryIcons } from '@/lib/category-icons';
import { cn } from '@/lib/utils';

function GridPattern({
  width,
  height,
  seed,
}: {
  width: number;
  height: number;
  seed: number;
}) {
  const patternId = `field-grid-${seed}`;
  const squares = [
    [7 + (seed % 3), 1 + (seed % 4)],
    [8 + ((seed * 2) % 3), 2 + ((seed * 3) % 4)],
    [9 + ((seed * 5) % 2), 3 + (seed % 3)],
  ];

  return (
    <svg aria-hidden="true" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x="-12"
          y="4"
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      <svg x="-12" y="4" className="overflow-visible">
        {squares.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            width={width + 1}
            height={height + 1}
            x={x * width}
            y={y * height}
            className="fill-foreground/6"
          />
        ))}
      </svg>
    </svg>
  );
}

export function FieldCard({
  id,
  index,
  label,
  description,
  count,
  href,
}: {
  id: string;
  index: number;
  label: string;
  description: string;
  count: number;
  href: string;
}) {
  const Icon = categoryIcons[id] ?? Layers3;

  return (
    <Link
      href={href}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-rule bg-card p-5 shadow-paper',
        'transition-[border-color,box-shadow,transform] duration-150',
        'hover:-translate-y-0.5 hover:border-seal/40 hover:shadow-lift',
      )}
    >
      <div className="pointer-events-none absolute inset-0 text-foreground/20 [mask-image:linear-gradient(white,transparent)]">
        <GridPattern width={20} height={20} seed={index} />
      </div>
      <div className="relative flex items-start justify-between gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-accent text-seal">
          <Icon className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <span className="record text-xs text-muted-foreground">
          {String(index + 1).padStart(2, '0')} · {count} kayıt
        </span>
      </div>
      <h3 className="relative mt-5 font-display text-md font-semibold leading-snug group-hover:text-seal">
        {label}
      </h3>
      <p className="relative mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </Link>
  );
}
