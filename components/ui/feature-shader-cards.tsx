'use client';

import { Warp } from '@paper-design/shaders-react';
import { ArrowRight, Layers } from 'lucide-react';
import { useEffect, useState } from 'react';

import Link from '@/components/site/safe-link';
import { areaStyle } from '@/lib/area-theme';
import { categoryIcons } from '@/lib/category-icons';

export type LegislationMapArea = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  subtopics: string[];
  count: number;
};

const featuredIds = [
  'kurulus',
  'izin',
  'hava',
  'atiksu',
  'atik',
  'entegre',
];

const shaderColors: Record<string, string[]> = {
  kurulus: ['#11142e', '#494ea0', '#24275a', '#777cd0'],
  izin: ['#071f19', '#0f6e5a', '#123b31', '#42a88f'],
  hava: ['#071c26', '#1c6e8c', '#103c50', '#54a8c5'],
  atiksu: ['#061e20', '#0f6b70', '#104044', '#48a6ab'],
  atik: ['#241705', '#8a5a0f', '#4b3209', '#c18a31'],
  entegre: ['#171027', '#5b3c8c', '#322052', '#9475c5'],
};

function useShaderEffects() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(wide.matches && !reduced.matches);

    update();
    wide.addEventListener('change', update);
    reduced.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      reduced.removeEventListener('change', update);
    };
  }, []);

  return enabled;
}

export default function FeatureShaderCards({
  areas,
}: {
  areas: LegislationMapArea[];
}) {
  const shadersEnabled = useShaderEffects();
  const featured = featuredIds
    .map((id) => areas.find((area) => area.id === id))
    .filter((area): area is LegislationMapArea => Boolean(area));
  const otherAreas = areas.filter((area) => !featuredIds.includes(area.id));

  return (
    <>
      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((area, index) => {
          const Icon = categoryIcons[area.id] ?? Layers;
          return (
            <li key={area.id} style={areaStyle(area.id)}>
              <Link
                href={`/mevzuat?alan=${area.id}`}
                className="group relative isolate flex h-full min-h-64 overflow-hidden rounded-2xl border border-white/12 bg-[#10201c] p-6 text-white shadow-[0_18px_50px_-32px_rgba(10,20,18,0.8)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-white"
              >
                <span
                  className="absolute inset-0 bg-[radial-gradient(circle_at_85%_10%,color-mix(in_srgb,var(--area)_45%,transparent),transparent_45%),linear-gradient(145deg,#10201c,#08110f)]"
                  aria-hidden="true"
                />
                {shadersEnabled && (
                  <span className="absolute inset-0 opacity-80" aria-hidden="true">
                    <Warp
                      style={{ height: '100%', width: '100%' }}
                      proportion={0.34 + (index % 3) * 0.04}
                      softness={0.9}
                      distortion={0.14}
                      swirl={0.42 + (index % 2) * 0.1}
                      swirlIterations={8}
                      shape={index % 2 === 0 ? 'checks' : 'stripes'}
                      shapeScale={0.09}
                      scale={1}
                      rotation={0}
                      speed={0.32}
                      colors={shaderColors[area.id]}
                    />
                  </span>
                )}
                <span
                  className="absolute inset-0 bg-[linear-gradient(145deg,rgba(6,14,12,0.55),rgba(6,14,12,0.9)_76%)]"
                  aria-hidden="true"
                />

                <span className="relative flex min-w-0 flex-1 flex-col">
                  <span className="flex items-start justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/15 px-2.5 py-1 font-mono text-xs tabular-nums text-white/75 backdrop-blur-sm">
                      {area.count} kayıt
                    </span>
                  </span>
                  <span className="mt-5 block text-lg font-semibold leading-snug tracking-[-0.015em]">
                    {area.label}
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-white/72">
                    {area.description}
                  </span>
                  <span className="mt-3 block text-xs leading-5 text-white/55">
                    {area.subtopics.slice(0, 3).join(' · ')}
                  </span>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-semibold text-white">
                    Kayıtları aç
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {otherAreas.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-base font-semibold">Diğer çalışma alanları</h3>
            <span className="text-sm text-muted-foreground">
              {otherAreas.length} başlık
            </span>
          </div>
          <ul className="mt-3 grid border-y border-border sm:grid-cols-2 lg:grid-cols-3">
            {otherAreas.map((area) => {
              const Icon = categoryIcons[area.id] ?? Layers;
              return (
                <li
                  key={area.id}
                  style={areaStyle(area.id)}
                  className="border-b border-border last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                >
                  <Link
                    href={`/mevzuat?alan=${area.id}`}
                    className="group flex min-h-24 items-center gap-3 px-3 py-4 hover:bg-muted/60"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-area/10 text-area">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">
                        {area.shortLabel}
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {area.subtopics.slice(0, 2).join(' · ')}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                      {area.count}
                      <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
