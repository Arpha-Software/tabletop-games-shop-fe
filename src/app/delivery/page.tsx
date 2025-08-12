// src/app/delivery/page.tsx
import { Container } from "@/app/ui/components";
import { Text } from "@/utils/ui/Text";
import Link from "next/link";

export default function Delivery() {
  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero / Intro */}
        <section className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <Text.Header className="mb-2 text-xl md:text-2xl">Доставка</Text.Header>
              <Text.Span className="text-gray-600 text-sm">
                Швидко доправимо замовлення по всій Україні: від відділення до адресної доставки.
              </Text.Span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>1–2 дні по Україні</Badge>
              <Badge>Відстеження</Badge>
              <Badge>Самовивіз безкоштовно</Badge>
            </div>
          </div>
        </section>

        {/* Methods */}
        <section className="space-y-4">
          <SectionTitle>Способи доставки</SectionTitle>

          <div className="grid md:grid-cols-2 gap-6">
            <MethodCard
              icon={<TruckIcon />}
              title="Нова Пошта"
              desc="Доставка до відділення або поштомату по всій Україні."
              meta={[{ label: "Термін", value: "1–2 дні" }, { label: "Вартість", value: "від 70₴" }]}
            />
            <MethodCard
              icon={<MailIcon />}
              title="Укрпошта"
              desc="Доставка до відділення або адресна доставка."
              meta={[{ label: "Термін", value: "2–4 дні" }, { label: "Вартість", value: "від 50₴" }]}
            />
            <MethodCard
              icon={<CourierIcon />}
              title="Курʼєр (Київ)"
              desc="Адресна доставка курʼєром у межах Києва."
              meta={[{ label: "Термін", value: "в день замовлення" }, { label: "Вартість", value: "від 100₴" }]}
            />
            <MethodCard
              icon={<StoreIcon />}
              title="Самовивіз"
              desc="Забір замовлення з нашого магазину у Львові."
              meta={[{ label: "Термін", value: "в день замовлення" }, { label: "Вартість", value: "безкоштовно" }]}
            />
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700">
            <p className="mb-1 font-medium">Примітка</p>
            <p>
              Точна вартість доставки залежить від ваги/розмірів посилки та тарифів перевізника.
              Остаточну суму буде показано під час оформлення замовлення.
            </p>
          </div>
        </section>

        {/* Terms */}
        <section className="space-y-4">
          <SectionTitle>Умови доставки</SectionTitle>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6 grid md:grid-cols-3 gap-6">
            <TermCard
              title="Мінімальна сума"
              lines={["Безкоштовна доставка від 500₴*"]}
              foot="*Залежить від способу доставки та акційних умов."
              icon={<TagIcon />}
            />
            <TermCard
              title="Оплата"
              lines={["Онлайн карткою", "Накладений платіж", "Готівка при самовивозі"]}
              icon={<CardIcon />}
            />
            <TermCard
              title="Відстеження"
              lines={["SMS/Viber з номером ТТН", "Посилання на відстеження у кабінеті"]}
              icon={<TrackIcon />}
            />
          </div>
        </section>

        {/* How it works */}
        <section className="space-y-4">
          <SectionTitle>Як це працює</SectionTitle>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6">
            <ol className="relative ms-4 space-y-6">
              <Step index={1} title="Оформіть замовлення">
                Оберіть товари, спосіб доставки та оплату. Підтвердіть замовлення.
              </Step>
              <Step index={2} title="Обробка та відправка">
                Ми збираємо замовлення, пакуємо та передаємо перевізнику.
              </Step>
              <Step index={3} title="Відстеження">
                Отримайте ТТН та слідкуйте за статусом у застосунку перевізника.
              </Step>
              <Step index={4} title="Отримання">
                Заберіть посилку у відділенні/поштоматі або дочекайтесь курʼєра.
              </Step>
            </ol>
            <div className="mt-6">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-white text-sm hover:bg-primary/90 transition"
              >
                Перейти до оформлення
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Zones */}
        <section className="space-y-4">
          <SectionTitle>Зони доставки</SectionTitle>

          <div className="grid md:grid-cols-3 gap-6">
            <ZoneCard title="Київ" desc="Доставка по всіх районах міста. Адресна доставка курʼєром — того ж дня." />
            <ZoneCard title="Київська область" desc="Доставка до районних центрів та великих населених пунктів." />
            <ZoneCard title="Вся Україна" desc="Доставка у будь-яке місто через Нову Пошту та Укрпошту." />
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <SectionTitle>Часті питання</SectionTitle>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 divide-y">
            <FaqItem q="Чи можна змінити адресу доставки?">
              Так, до моменту відправки замовлення. Звʼяжіться з нами телефоном або email.
            </FaqItem>
            <FaqItem q="Що робити, якщо товар не підійшов?">
              Можна повернути протягом 14 днів, якщо товар не використовувався та збережено товарний вигляд.
            </FaqItem>
            <FaqItem q="Чи можна забрати замовлення в інший час?">
              Так, при самовивозі — у години роботи магазину: Пн–Пт 9:00–18:00, Сб 10:00–16:00.
            </FaqItem>
          </div>
        </section>
      </div>
    </Container>
  );
}

/* ============ Small building blocks ============ */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text.Subheader className="text-lg font-semibold">{children}</Text.Subheader>;
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700">
      {children}
    </span>
  );
}

function MethodCard({
  icon,
  title,
  desc,
  meta,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  meta: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-6">
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-xl border border-gray-200 bg-gray-50 p-3">{icon}</div>
        <div className="flex-1">
          <Text.Subheader className="text-base mb-1">{title}</Text.Subheader>
          <Text.Span className="text-sm text-gray-600">{desc}</Text.Span>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {meta.map((m, i) => (
              <div key={i} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <p className="text-[11px] text-gray-500">{m.label}</p>
                <p className="text-sm font-medium text-gray-900">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TermCard({
  title,
  lines,
  foot,
  icon,
}: {
  title: string;
  lines: string[];
  foot?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-5">
      <div className="flex items-start gap-3">
        <div className="shrink-0 rounded-lg border border-gray-200 bg-gray-50 p-2">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          <ul className="mt-2 space-y-1">
            {lines.map((l, i) => (
              <li key={i} className="text-sm text-gray-700">• {l}</li>
            ))}
          </ul>
          {foot && <p className="mt-2 text-xs text-gray-500">{foot}</p>}
        </div>
      </div>
    </div>
  );
}

function Step({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="ms-4">
      <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary" />
      <p className="text-sm font-medium text-gray-900">
        Крок {index}. {title}
      </p>
      <p className="text-sm text-gray-600 mt-1">{children}</p>
    </li>
  );
}

function ZoneCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm ring-1 ring-black/5 p-5">
      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group p-4 open:bg-gray-50">
      <summary className="flex cursor-pointer list-none items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{q}</span>
        <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition group-open:rotate-180">
          ▼
        </span>
      </summary>
      <div className="mt-3 text-sm text-gray-600">{children}</div>
    </details>
  );
}

/* ============ Tiny inline icons (no extra deps) ============ */
function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M17 8h3l3 4v6h-2a3 3 0 1 1-6 0H9a3 3 0 1 1-6 0H1V6h16v2Zm0 2H3v6h1.17A3.001 3.001 0 0 1 7 18h8a3 3 0 0 1 5.83 0H21v-3h-4v-5Zm-2 2v3h6l-2.25-3H15Z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v1.2l10 5.6l10-5.6V6a2 2 0 0 0-2-2Zm0 5.4l-8 4.48L4 9.4V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.4Z" />
    </svg>
  );
}
function CourierIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M9 2h6l1 3h4a2 2 0 0 1 2 2v3h-6l-2-2H6L5 5h3l1-3ZM2 10h11l2 2h7v6h-2a3 3 0 1 1-6 0H9a3 3 0 1 1-6 0H1v-6a2 2 0 0 1 1-2Z" />
    </svg>
  );
}
function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M3 9l1-5h16l1 5h-2v10H5V9H3Zm4 0v8h10V9H7Zm0-2h10l-.4-2H7.4L7 7Z" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M21 7v7.59l-8.7 8.7a1 1 0 0 1-1.42 0L2 14.41V3a1 1 0 0 1 1-1h7.59L21 12.41V7ZM7.5 8A1.5 1.5 0 1 0 7.5 5a1.5 1.5 0 0 0 0 3Z" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v2H1V7a2 2 0 0 1 2-2Zm-2 6h22v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-6Zm4 4h6v2H5v-2Z" />
    </svg>
  );
}
function TrackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="text-gray-700">
      <path fill="currentColor" d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Zm0 9.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}
