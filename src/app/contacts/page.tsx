'use client';

import { Container, Button, Input } from "@/app/ui/components";
import { DEFAULT_STORE_ADDRESS } from "@/utils/constants";
import { Text } from "@/utils/ui/Text";
import Image from "next/image";
import React from "react";

export default function Contacts() {
  return (
    <Container className="mt-10 mb-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Page header */}
        <div className="text-center mb-10">
          <Text.Header className="mb-2">Контакти</Text.Header>
          <Text.Paragraph className="text-gray-600">
            Ми на зв’язку з Пн по Пт з 9:00 до 18:00. Напишіть або зателефонуйте — відповімо протягом робочого дня.
          </Text.Paragraph>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Contact cards + map */}
          <div className="space-y-6">
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard
                title="Email"
                lines={["hello@tgs.shop"]}
                hrefs={["mailto:hello@tgs.shop"]}
                icon={
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M4 6h16v12H4z" fill="none" />
                    <path
                      d="M4 8l8 5 8-5M4 6h16v12H4z"
                      className="fill-none stroke-current"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <InfoCard
                title="Телефон"
                lines={["+380 93 587 69 35"]}
                hrefs={["tel:+380935876935"]}
                icon={
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h2a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.6a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.48-1.18a2 2 0 0 1 2.11-.45c.83.3 1.7.51 2.6.63A2 2 0 0 1 22 16.92Z"
                      className="fill-none stroke-current"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
              <InfoCard
                title="Адреса"
                lines={["м. Київ, вул. Хрещатик, 1", "01001, Україна"]}
                icon={
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      d="M12 21s7-5.33 7-11a7 7 0 1 0-14 0c0 5.67 7 11 7 11Z"
                      className="fill-none stroke-current"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="10" r="2.5" className="fill-none stroke-current" strokeWidth="1.5" />
                  </svg>
                }
              />
              <InfoCard
                title="Графік роботи"
                lines={["Пн-Пт: 9:00–18:00", "Сб: 10:00–16:00", "Нд: Вихідний"]}
                icon={
                  <svg viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      d="M8 2v3M16 2v3M3 9h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                      className="fill-none stroke-current"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </div>

            {/* Socials */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <Text.Subheader className="text-base font-semibold mb-4 text-gray-800">Соціальні мережі</Text.Subheader>
              <div className="flex flex-wrap items-center gap-3">
                <SocialLink href="https://t.me/" label="Telegram">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M21 3L3 10.53l6.34 2.13L19 7l-7.66 7.66.5 3.81 2.77-2.77 3.6 2.17L21 3Z"
                      className="fill-current"
                    />
                  </svg>
                </SocialLink>
                <SocialLink href="https://instagram.com/" label="Instagram">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                      className="fill-none stroke-current"
                      strokeWidth="1.5"
                    />
                    <circle cx="12" cy="12" r="3.5" className="fill-none stroke-current" strokeWidth="1.5" />
                    <circle cx="17" cy="7" r="1" className="fill-current" />
                  </svg>
                </SocialLink>
                <SocialLink href="https://twitter.com/" label="Twitter / X">
                  <svg viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M4 4l8 10L7 20h3l4-4 6 8h-3l-5-7-5 7H2l7-9L2 4h2l6 8 5-8h3l-7 10L6 4H4Z"
                      className="fill-current"
                    />
                  </svg>
                </SocialLink>
              </div>
            </div>

            {/* Map / location */}
            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-card">
              <div className="overflow-hidden rounded-xl h-[260px] w-full">
                {/* You can swap src to your real map embed */}
                <iframe
                  title={DEFAULT_STORE_ADDRESS}
                  src={`https://www.google.com/maps?q=${DEFAULT_STORE_ADDRESS}&output=embed`}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Contact form */}
          <div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
              <Text.Subheader className="text-xl font-bold mb-2">Напишіть нам</Text.Subheader>
              <Text.Paragraph className="text-gray-600 mb-6">
                Залиште повідомлення — ми відповімо на вказаний email якнайшвидше.
              </Text.Paragraph>
              <ContactForm />
            </div>

            {/* Small help box */}
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <Text.Paragraph className="text-sm text-gray-700">
                Питання щодо замовлення? Вкажіть номер замовлення у темі, щоб ми швидше знайшли інформацію.
              </Text.Paragraph>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

/* ---------- Tiny presentational pieces ---------- */

function InfoCard({
  title,
  lines,
  hrefs,
  icon,
}: {
  title: string;
  lines: string[];
  hrefs?: string[];
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div>
          <Text.Subheader className="text-base font-semibold text-gray-800">{title}</Text.Subheader>
          <div className="mt-1 space-y-0.5">
            {lines.map((l, i) =>
              hrefs?.[i] ? (
                <a key={i} href={hrefs[i]} className="text-primary hover:underline">
                  {l}
                </a>
              ) : (
                <p key={i} className="text-gray-700">
                  {l}
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:border-primary hover:text-primary"
      aria-label={label}
    >
      <span className="text-primary">{children}</span>
      <span>{label}</span>
    </a>
  );
}

/* ---------- Client contact form ---------- */

function ContactForm() {
  "use client";

  const [state, setState] = React.useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
    submitting: boolean;
    sent: boolean;
    error?: string;
  }>({
    name: "",
    email: "",
    subject: "",
    message: "",
    submitting: false,
    sent: false,
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.name || !state.email || !state.message) {
      setState((s) => ({ ...s, error: "Будь ласка, заповніть обов’язкові поля." }));
      return;
    }
    setState((s) => ({ ...s, submitting: true, error: undefined }));
    // TODO: connect to your API route
    await new Promise((r) => setTimeout(r, 900));
    setState((s) => ({ ...s, submitting: false, sent: true }));
  };

  if (state.sent) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
      >
        Повідомлення надіслано! Ми відповімо на ваш email найближчим часом.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ім&apos;я *
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Ваше ім’я"
            value={state.name}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={state.email}
            onChange={onChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Тема
        </label>
        <Input
          id="subject"
          name="subject"
          placeholder="Про що ваше звернення?"
          value={state.subject}
          onChange={onChange}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Повідомлення *
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Ваше повідомлення..."
          value={state.message}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <Button type="submit" className="w-full md:w-auto px-6 py-3" disabled={state.submitting}>
        {state.submitting ? "Відправляємо…" : "Надіслати повідомлення"}
      </Button>
    </form>
  );
}
