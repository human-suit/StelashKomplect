export function animateToCompareFromButton(buttonEl: HTMLElement): void {
  if (typeof window === "undefined") return;

  const target = findCompareTarget();
  if (!target) return;

  const sourceImage = findSourceImage(buttonEl);
  if (!sourceImage) return;

  const from = sourceImage.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  if (from.width === 0 || from.height === 0) return;

  const clone = sourceImage.cloneNode(true) as HTMLImageElement;
  clone.style.position = "fixed";
  clone.style.left = `${from.left}px`;
  clone.style.top = `${from.top}px`;
  clone.style.width = `${from.width}px`;
  clone.style.height = `${from.height}px`;
  clone.style.borderRadius = "10px";
  clone.style.objectFit = "cover";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "9999";
  clone.style.transition =
    "transform 850ms cubic-bezier(0.22, 0.65, 0.2, 1), opacity 850ms ease, width 850ms ease, height 850ms ease, filter 850ms ease";
  clone.style.willChange = "transform, opacity, width, height";
  clone.style.transformOrigin = "center center";
  clone.style.filter = "saturate(1)";
  document.body.appendChild(clone);

  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);

  requestAnimationFrame(() => {
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.18)`;
    clone.style.opacity = "0.08";
    clone.style.width = "22px";
    clone.style.height = "22px";
    clone.style.filter = "saturate(0.75)";
  });

  window.setTimeout(() => {
    clone.remove();
  }, 900);
}

function findCompareTarget(): HTMLElement | null {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>("[data-compare-target]"),
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
