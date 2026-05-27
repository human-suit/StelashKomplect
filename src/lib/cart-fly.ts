import { animateFlyFromButton } from "@/lib/fly-animation";

export function animateToCartFromButton(buttonEl: HTMLElement): void {
  animateFlyFromButton(buttonEl, "cart");
}
