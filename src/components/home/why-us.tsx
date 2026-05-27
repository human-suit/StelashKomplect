const items = [
  {
    title: "Огромный выбор",
    text: "Широкий ассортимент, большинство позиций на складе.",
  },
  {
    title: "B2B и розница",
    text: "Юрлица и физлица, документы для бухгалтерии, участие в закупках.",
  },
  {
    title: "Под ключ",
    text: "Доставка, сборка и монтаж в согласованные сроки.",
  },
  {
    title: "Удобная оплата",
    text: "Наличные, карта, безнал для организаций.",
  },
  {
    title: "Прямой контакт",
    text: "Без колл-центра — общение с ответственными специалистами.",
  },
];

export function WhyUs() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-xl font-bold text-slate-900">
          Почему выбирают нас
        </h2>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="font-semibold text-slate-900">🔹 {item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
