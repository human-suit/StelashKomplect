"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/data/hero-slides";
import { heroSlides as staticSlides } from "@/data/hero-slides";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** Пауза между слайдами */
const INTERVAL_MS = 9000;
/** Длительность плавного перехода */
const FADE_MS = 900;

function SlideContent({ slide }: { slide: HeroSlide }) {
  return (
    <>
      {slide.badge && (
        <p className="mb-2 text-sm font-medium text-blue-200">{slide.badge}</p>
      )}
      <h1 className="text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
        {slide.title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
        {slide.subtitle}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
        <ButtonLink
          href={slide.ctaPrimary.href}
          variant="secondary"
          size="lg"
          className="!bg-white !text-[var(--color-primary)] hover:!opacity-95"
        >
          {slide.ctaPrimary.label}
        </ButtonLink>
        {slide.ctaSecondary && (
          <ButtonLink
            href={slide.ctaSecondary.href}
            variant="outline"
            size="lg"
            className="!border-white !text-white hover:!bg-white/10"
          >
            {slide.ctaSecondary.label}
          </ButtonLink>
        )}
      </div>
    </>
  );
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const list = slides.length > 0 ? slides : staticSlides;

  useEffect(() => {
    if (list.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [list.length]);

  if (list.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-slate-900">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      {/* Фоны — плавный кроссфейд */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {list.map((s, i) => (
          <div
            key={`bg-${s.id}`}
            className={cn(
              "absolute inset-0 bg-gradient-to-br transition-opacity ease-in-out",
              s.gradient,
              i === index ? "opacity-100" : "opacity-0",
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
          />
        ))}
      </div>

      <div className="relative flex flex-col text-white">
        <div className="px-4 pt-10 pb-6 sm:pt-12 sm:pb-8">
          <div className="mx-auto grid max-w-7xl">
            {list.map((s, i) => (
              <div
                key={s.id}
                className={cn(
                  "col-start-1 row-start-1 ease-in-out",
                  "transition-[opacity,transform]",
                  i === index
                    ? "relative z-10 translate-y-0 opacity-100"
                    : "pointer-events-none z-0 translate-y-2 opacity-0",
                )}
                style={{ transitionDuration: `${FADE_MS}ms` }}
                aria-hidden={i !== index}
              >
                <SlideContent slide={s} />
              </div>
            ))}
          </div>
        </div>

        {list.length > 1 && (
          <div
            className="relative z-10 flex justify-center gap-1 border-t border-white/15 px-4 py-3"
            aria-label="Переключение слайдов"
          >
            {list.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Слайд ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className="touch-auto flex min-h-[44px] min-w-[44px] items-center justify-center p-2"
              >
                <span
                  className={cn(
                    "block h-2 rounded-full ease-in-out",
                    "transition-all duration-500",
                    i === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/50 hover:bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
