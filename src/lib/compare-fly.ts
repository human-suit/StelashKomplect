import { animateFlyFromButton } from "@/lib/fly-animation";

export function animateToCompareFromButton(buttonEl: HTMLElement): void {
  animateFlyFromButton(buttonEl, "compare");
}
