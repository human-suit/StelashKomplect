import { ButtonLink } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-900">Страница не найдена</h1>
      <p className="mt-2 text-sm text-slate-600">
        Возможно, товар снят с продажи или ссылка устарела
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <ButtonLink href="/" variant="primary" size="lg" fullWidth>
          На главную
        </ButtonLink>
        <Link
          href="/catalog"
          className="text-sm font-semibold text-[var(--color-primary)]"
        >
          Перейти в каталог
        </Link>
      </div>
    </div>
  );
}
