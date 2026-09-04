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
  kurulus: ['#111a18', '#22312d', '#192421', '#36463f'],
  izin: ['#101b18', '#21352f', '#172621', '#385046'],
  hava: ['#111c1b', '#243735', '#192725', '#3b504c'],
  atiksu: ['#101c19', '#213832', '#172823', '#385248'],
  atik: ['#171a15', '#33352a', '#24271e', '#4a4a37'],
  entegre: ['#151817', '#303431', '#222624', '#464c48'],
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
                className="group soft-dark-surface relative isolate flex h-full min-h-64 overflow-hidden rounded-2xl p-6 text-white transition-colors duration-200 focus-visible:outline-white"
              >
                <span
                  className="absolute inset-0 bg-[radial-gradient(circle_at_88%_5%,color-mix(in_srgb,var(--area)_7%,transparent),transparent_44%),linear-gradient(155deg,#14231f,#0b1613)]"
                  aria-hidden="true"
                />
                {shadersEnabled && (
                  <span className="absolute inset-0 opacity-[0.08]" aria-hidden="true">
                    <Warp
                      style={{ height: '100%', width: '100%' }}
                      proportion={0.34 + (index % 3) * 0.04}
                      softness={1}
                      distortion={0.025}
                      swirl={0.08 + (index % 2) * 0.025}
                      swirlIterations={8}
                      shape={index % 2 === 0 ? 'checks' : 'stripes'}
                      shapeScale={0.09}
                      scale={1}
                      rotation={0}
                      speed={0.08}
                      colors={shaderColors[area.id]}
                    />
                  </span>
                )}
                <span
                  className="absolute inset-0 bg-[linear-gradient(145deg,rgba(9,21,18,0.68),rgba(7,15,13,0.88)_78%)]"
                  aria-hidden="true"
                />

                <span className="relative flex min-w-0 flex-1 flex-col">
                  <span className="flex items-start justify-between gap-4">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.07]">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 font-mono text-xs tabular-nums text-white/70">
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
          <ul className="mt-4 grid overflow-hidden border-y border-border sm:grid-cols-2 lg:grid-cols-3">
            {otherAreas.map((area) => {
              const Icon = categoryIcons[area.id] ?? Layers;
              return (
                <li
                  key={area.id}
                  style={areaStyle(area.id)}
                  className="border-b border-border last:border-b-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                >
                  <Link
                    href={`/mevzuat?alan=${area.id}`}
                    className="area-index-link group flex min-h-24 items-center gap-3 px-3 py-4 sm:px-4"
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
