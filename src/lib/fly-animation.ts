const THUMB_SIZE = 44;
const END_SIZE = 18;
const DURATION_MS = 780;

type FlyTarget = "cart" | "compare";

export function animateFlyFromButton(
  buttonEl: HTMLElement,
  target: FlyTarget,
): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const targetEl = findVisibleTarget(
    target === "cart" ? "[data-cart-target]" : "[data-compare-target]",
  );
  if (!targetEl) return;

  const sourceImage = findSourceImage(buttonEl);
  if (!sourceImage) return;

  const from = sourceImage.getBoundingClientRect();
  const to = targetEl.getBoundingClientRect();
  if (from.width === 0 || from.height === 0) return;

  const startX = from.left + from.width / 2 - THUMB_SIZE / 2;
  const startY = from.top + from.height / 2 - THUMB_SIZE / 2;
  const endX = to.left + to.width / 2 - END_SIZE / 2;
  const endY = to.top + to.height / 2 - END_SIZE / 2;
  const dx = endX - startX;
  const dy = endY - startY;
  const endScale = END_SIZE / THUMB_SIZE;

  const clone = document.createElement("img");
  clone.src = sourceImage.currentSrc || sourceImage.src;
  clone.alt = "";
  clone.decoding = "async";
  clone.style.cssText = [
    "position:fixed",
    `left:${startX}px`,
    `top:${startY}px`,
    `width:${THUMB_SIZE}px`,
    `height:${THUMB_SIZE}px`,
    "border-radius:8px",
    "object-fit:cover",
    "pointer-events:none",
    "z-index:9999",
    "box-shadow:0 6px 16px rgba(15,23,42,0.18)",
    "transform-origin:center center",
    "will-change:transform,opacity",
  ].join(";");

  document.body.appendChild(clone);

  const animation = clone.animate(
    [
      {
        transform: "translate(0, 0) scale(1)",
        opacity: 1,
        offset: 0,
      },
      {
        transform: `translate(${dx * 0.45}px, ${dy * 0.2}px) scale(0.82)`,
        opacity: 0.95,
        offset: 0.45,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(${endScale})`,
        opacity: 0.12,
        offset: 1,
      },
    ],
    {
      duration: DURATION_MS,
      easing: "cubic-bezier(0.33, 0.08, 0.24, 1)",
      fill: "forwards",
    },
  );

  animation.onfinish = () => clone.remove();
  animation.oncancel = () => clone.remove();
}

function findVisibleTarget(selector: string): HTMLElement | null {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>(selector),
  );
  return (
    targets.find((el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    }) ?? null
  );
}

function findSourceImage(buttonEl: HTMLElement): HTMLImageElement | null {
  const root =
    buttonEl.closest("article") ??
    buttonEl.closest("li") ??
    buttonEl.closest("section") ??
    buttonEl.parentElement;
  if (!root) return null;

  const img = root.querySelector("img");
  if (img) return img as HTMLImageElement;

  const fallback = document.querySelector("main img");
  return fallback as HTMLImageElement | null;
}
