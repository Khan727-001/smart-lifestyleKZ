/**
 * ============================================================
 *  S.M.A.R.T. LIFESTYLE — Landing Page
 * ============================================================
 *
 *  КАК РЕДАКТИРОВАТЬ
 *  ─────────────────
 *  Весь контент — в константах ниже (до строки ~200).
 *  Компоненты (функции) — не трогать.
 *
 *  ШРИФТЫ (3 стиля):
 *    Cormorant Garamond — заголовки H1/H2 (элегантный, контрастный)
 *    Bebas Neue         — лейблы, капслок-подписи (резкий, механический)
 *    DM Sans            — основной текст, описания (чистый, нейтральный)
 *
 *  ФОТОГРАФИИ → src/imports/
 *  ЦВЕТА:
 *    #5C5248 — тёмный шоколад
 *    #8A7B6C — тёплый каштан
 *    #C9A882 — золотистый (кнопки)
 *    #E8DDD4 — светлый беж
 *    #F3EDE6 — молочный фон
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { supabase } from "@/lib/supabase";
import { submitLead, getLeadAttribution } from "@/lib/leads";
import { trackLeadConversion } from "@/lib/analytics";
import type { Review as SupabaseReview, PricingCondition, PricingPlan } from "@/lib/supabase";
import {
  fetchReviews, fetchAllReviews, addReview, updateReview, deleteReview, reorderReviews,
  fetchAllPricingConditions, addPricingCondition, updatePricingCondition, deletePricingCondition, reorderPricingConditions,
  fetchPricingPlans, updatePricingPlan,
} from "@/lib/db";

import photoHero     from "@/imports/653E131D-F5CD-48E2-8824-1B859AF4BDF1.png";
import photoContacts from "@/imports/DDACD5E0-059E-4203-A62E-81DE7BE47B21.png";
import photoAnton    from "@/imports/FF84E886-799A-4F5E-9C49-49F8F497113B.png";
import photoRinata   from "@/imports/A4172E07-B57A-49B9-9BC2-FE4877F1E425.png";

import {
  Menu, X, ArrowRight, ChevronDown, ChevronUp,
  Phone, MessageCircle, Check, ChevronLeft, ChevronRight,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  ОБЩАЯ ИНФОРМАЦИЯ
// ─────────────────────────────────────────────────────────────
const SITE = {
  name:     "S.M.A.R.T. Lifestyle",
  tagline:  "Психологическая помощь",
  phone:    "+7 702 877 9911",
  whatsapp: "https://wa.me/77028779911",
  telegram: "https://t.me/+77028779911",
  city:     "Алматы",
};

const WA = (msg = "Здравствуйте! Хочу записаться на консультацию.") =>
  `https://wa.me/77028779911?text=${encodeURIComponent(msg)}`;

// ─────────────────────────────────────────────────────────────
//  ГЛАВНЫЙ БАННЕР
// ─────────────────────────────────────────────────────────────
const HERO = {
  heading: ["Для тех, кто хочет", "разобраться в причинах", "тревоги и напряжения"],
  subtext:
    "Индивидуальная и семейная психологическая помощь по системе S.M.A.R.T. Lifestyle.",
  stats: [
    { number: "7+",    label: "лет практики" },
    { number: "10 000+", label: "улучшили качество жизни" },
  ],
};

// ─────────────────────────────────────────────────────────────
//  СТАТИСТИКА (отдельный блок)
// ─────────────────────────────────────────────────────────────
const STATS = [
  { number: "7+",    label: "лет практики",                desc: "Опыт сопровождения клиентов в вопросах эмоционального состояния, отношений и жизненных кризисов" },
  { number: "5 000+", label: "клиентов получили помощь",    desc: "Люди, которые смогли лучше понять себя, изменить модели поведения и улучшить качество жизни" },
  { number: "10 000+",label: "улучшили качество жизни",     desc: "Больше ясности, осознанности и внутреннего баланса" },
  { number: "10+",    label: "стран",                        desc: "Психологическая помощь доступна очно в Алматы и онлайн независимо от места проживания" },
  { number: "1",      label: "семья Исламовых",              desc: "Доверие, честность и личная ответственность за результат" },
  { number: "1",      label: "глобальная цель",              desc: "Понять себя — первый шаг к изменению жизни вокруг" },
];

// ─────────────────────────────────────────────────────────────
//  ЦИТАТА (тёмный блок)
// ─────────────────────────────────────────────────────────────
const STATEMENT = {
  text:      "Мы помогаем понять причины трудностей, изменить привычные модели поведения и сформировать более устойчивое состояние.",
  highlight: "изменить привычные модели поведения",
  caption:   "Принцип работы S.M.A.R.T. Lifestyle",
};

// ─────────────────────────────────────────────────────────────
//  ЗАПРОСЫ
// ─────────────────────────────────────────────────────────────
const PROBLEMS = [
  "Тревога и постоянное внутреннее напряжение",
  "Эмоциональное выгорание — нет сил ни на работу, ни на близких",
  "Сложности в отношениях, конфликты, которые повторяются по кругу",
  "Зависимое поведение, которое мешает управлять своей жизнью",
  "Низкая самооценка и неуверенность в себе",
  "Семейные конфликты и сложности с родителями или детьми",
  "Внутренние ограничения — убеждения и сценарии, которые держат на месте",
  "Ощущение тупика — всё правильно, а жизнь не меняется",
];

// ─────────────────────────────────────────────────────────────
//  ФОРМАТЫ РАБОТЫ
// ─────────────────────────────────────────────────────────────
const FORMATS = [
  {
    num:     "01",
    title:   "Индивидуальная консультация",
    tagline: "Личная работа по заданному плану",
    desc:    "Личная работа один на один со специалистом по заданному плану. Каждая консультация выстраивается под решение конкретной проблемы, будь то тревога, отношения, выгорание или самооценка.",
    items:   [
      "Индивидуальный план решения",
      "Полная конфиденциальность",
      "⁠Очно в Алматы, онлайн по всему миру",
    ],
    formats: ["Очно", "Онлайн"],
    dark:    false,
  },
  {
    num:     "02",
    title:   "Семейная / Парная консультация",
    tagline: "Работа с отношениями",
    desc:    "Для пар и семей, которые сталкиваются с повторяющимися конфликтами, эмоциональной дистанцией и непониманием. Мы работаем с паттернами взаимодействия, ролями и непроговорёнными ожиданиями. Цель — не просто решить отдельный конфликт, а создать более здоровую систему взаимодействия.",
    items:   [
      "Совместная консультация для пары или семьи",
      "Работа с динамикой и ролями",
      "Инструменты для решения конкретных проблем в отношениях и взаимодействиях",
      "Очно в Алматы или онлайн по всему миру",
    ],
    formats: ["Очно", "Онлайн"],
    dark:    true,
  },
];

// ─────────────────────────────────────────────────────────────
//  СПЕЦИАЛИСТЫ
// ─────────────────────────────────────────────────────────────
const EXPERTS = [
  {
    photo:          photoAnton,
    name:           "Исламов Антон Валерьевич",
    specialty:      "Психолог-консультант · Конфликтолог",
    experience:     "10 лет практики",
    bio:            "Работает с кризисными состояниями, сложностями в отношениях, семейными конфликтами, зависимым поведением и эмоциональными трудностями. Сочетает знания конфликтологии и психологии, помогая клиентам понимать причины сложных ситуаций и находить новые способы взаимодействия с собой и окружающими. Индивидуальные консультации — только с мужчинами.",
    qualifications: [
      "Магистрант психологии",
      "Профессиональная переподготовка: «Клиническая психология»",
      "Психолог-консультант · Конфликтолог",
      "Автор метода S.M.A.R.T. Lifestyle",
    ],
    methods: [
      "НЛП, КПТ — работа с мышлением, эмоциональными реакциями и поведенческими стратегиями",
      "Эриксоновский гипноз — работа с глубинными подсознательными процессами",
      "Работа с внутренним ребёнком и эмоциональными травмами",
      "Транзактный анализ — осознание и изменение внутренних сценариев",
      "Экзистенциальный подход — поиск смысла и восстановление жизненной опоры",
      "Исламская психология — духовная гармония и внутренняя устойчивость",
    ],
    tagline: "Каждый процесс индивидуален и адаптирован под конкретного человека и его ситуацию.",
    formats: ["Очно · Алматы", "Онлайн"],
    tags:    ["Конфликты и отношения", "Семья и пары", "Кризисные состояния", "Зависимое поведение", "Мужская психология"],
    photoLeft: false,
  },
  {
    photo:          photoRinata,
    name:           "Исламова Рината Адхамовна",
    specialty:      "Психолог-консультант · Женский сексолог - консультант",
    experience:     "7 лет практики",
    bio:            "Работает с тревожными состояниями, самооценкой, эмоциональными трудностями, отношениями и вопросами личных границ. Помогает клиентам лучше понимать себя, свои чувства и потребности, развивать внутреннюю устойчивость и находить новые способы взаимодействия с жизненными ситуациями.",
    qualifications: [
      "Магистрант психологии",
      "Профессиональная переподготовка: «Клиническая психология»",
      "Психолог-консультант · Женский сексолог",
      "Член международной ассоциации психологов",
    ],
    methods: [
      "НЛП и КПТ — перестройка мышления, эмоциональных реакций и поведения",
      "ТОТ (телесно-ориентированная терапия) — освобождение телесных блоков и напряжений",
      "Эриксоновский гипноз, трансовые и медитативные практики",
      "Работа с внутренним ребёнком и эмоциональными травмами",
      "Аналитическая работа с внутренними конфликтами и установками",
    ],
    tagline: "Каждый процесс индивидуален и адаптирован под конкретного человека и его ситуацию.",
    formats: ["Очно · Алматы", "Онлайн"],
    tags:    ["Женская сексология", "Самооценка", "Тревога и стресс", "Эмоциональные трудности"],
    photoLeft: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  ОТЗЫВЫ
// ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name:       "Лида",
    specialist: "Рината Исламова",
    text:       "Когда я обратилась к Ринате, я находилась практически на грани депрессии. В жизни мало что приносило радость, и я не понимала, как самостоятельно выбраться из этого состояния. Уже примерно после трёх сессий я заметила первые положительные изменения, а за 10 встреч произошла глубокая внутренняя трансформация: изменилось моё мышление, восприятие жизни и отношение к себе. Очень благодарна Ринате за профессионализм и поддержку.",
  },
  {
    name:       "Анель",
    specialist: "Рината Исламова",
    text:       "Хочу поблагодарить Ринату за проделанную качественную работу. Прошла 10 сеансов и почувствовала лёгкость, ясность в голове и в мыслях, разобралась во многих моментах, которые снижали качество жизни, начала понимать себя и других больше. Я в процессе изменений, буду обращаться по необходимости.",
  },
  {
    name:       "Усман",
    specialist: "Антон Исламов",
    text:       "Огромная благодарность Антону — убрали тараканов, разложили всё по полочкам. Помог встать на ноги. Научил прислушиваться к себе и трезво оценивать эмоциональное состояние. Рекомендую.",
  },
  {
    name:       "Диана",
    specialist: "Рината Исламова",
    text:       "Хочу выразить огромную благодарность своему психологу. Это специалист, который действительно слышит, чувствует и понимает. Благодаря нашей работе я стала лучше разбираться в себе, спокойнее реагировать на сложные ситуации и увереннее принимать решения.",
  },
  {
    name:       "Галина",
    specialist: "Антон Исламов",
    text:       "Благодарность Антону за работу! Моё эмоциональное состояние пришло в норму. Проработали травмы, которые очень сильно влияли на мою жизнь. Желаю успехов центру психологической помощи! Ваша помощь важна для лечения наших душ!",
  },
  {
    name:       "Олжас",
    specialist: "Антон Исламов",
    text:       "Пришёл с паническими атаками — сделали разбор. За пару сеансов убрали все атаки. Понял что и как, откуда и почему. После каждого посещения приходят только позитивные эмоции. Антон — профессионал своего дела. Всем настоятельно рекомендую!",
  },
  {
    name:       "Владимир",
    specialist: "Антон Исламов",
    text:       "Хочу выразить благодарность Антону за проделанную работу. Очень внимательный, профессиональный и чуткий специалист. Все сессии проходили максимально комфортно, а главное — результативно. Благодаря его подходу удалось разобраться в важных для меня вопросах и найти новые решения. Рекомендую как отличного психолога!",
  },
  {
    name:       "Никита",
    specialist: "Рината Исламова",
    text:       "У меня была мощная паническая атака — было страшно. Благодаря Ринате я плавно вышел из этого состояния, без медикаментов, только работа над собой. Сейчас мне гораздо легче. Я снова кайфую от жизни. Очень рекомендую!",
  },
  {
    name:       "Светлана",
    specialist: "Рината Исламова",
    text:       "Хочу поблагодарить Ринату Адхамовну за профессионализм и поддержку в трудный период моей жизни. Она помогла мне выйти из апатии и тревожности. Благодаря её помощи я обрела уверенность, которую давно не чувствовала. Готова рекомендовать Ринату Адхамовну всем, кому нужна подобная помощь.",
  },
  {
    name:       "Гулжан",
    specialist: "Рината Исламова",
    text:       "С первого сеанса поняла, что мне комфортно работать с Ринатой — главное раскрыться, расслабиться, доверять. Это было самое важное для меня. Моё лучшее решение — прийти за помощью именно к ней. Благодаря совместной работе очень большие изменения происходят в моей жизни в лучшую сторону.",
  },
];

// ─────────────────────────────────────────────────────────────
//  СТОИМОСТЬ
//  Укажите реальные цены
// ─────────────────────────────────────────────────────────────
const PRICING = [
  {
    planId:    "individual",
    title:     "Индивидуальная консультация",
    duration:  "50 мин",
    desc:      "Индивидуальная психологическая помощь по Вашему запросу и жизненной ситуации",
    kzt:       "50 000 ₸",
    usd:       "100$",
    formats:   ["Очно", "Онлайн"],
    who:       "Антон Исламов · Рината Исламова",
    details: [
      "Разбор запроса с первых минут — без затяжного знакомства",
      "Понимание причин эмоциональных реакций и поведения",
      "Работа с причинами, а не с симптомами",
      "Индивидуальный план решения проблем под Ваш запрос",
      "Полная конфиденциальность",
      "Доступно очно в Алматы или онлайн по всему миру",
    ],
  },
  {
    planId:    "family",
    title:     "Семейная / Парная консультация",
    duration:  "80 мин",
    desc:      "Работа с отношениями, конфликтами и повторяющимися сценариями",
    kzt:       "75 000 ₸",
    usd:       "150$",
    formats:   ["Очно", "Онлайн"],
    who:       "Антон Исламов",
    details: [
      "Совместная работа пары или семьи со специалистом",
      "Разбор паттернов взаимодействия и ролей",
      "Работа над устрашением повторяющихся конфликтов и непроговоренных ожиданий",
      "Применение техник для проработки эмоциональных состояний в моменте",
      "Доступно очно в Алматы или онлайн по всему миру",
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  МЕТОД S.M.A.R.T.
// ─────────────────────────────────────────────────────────────
const SMART_STEPS = [
  {
    letter: "S",
    abbr:   "Stabilization",
    ru:     "Стабилизация",
    desc:   "Первый шаг — снизить острое напряжение. Мы создаём безопасное пространство, где можно остановиться и выдохнуть. Никаких резких решений, только устойчивая почва под ногами.",
  },
  {
    letter: "M",
    abbr:   "Mindset",
    ru:     "Мышление",
    desc:   "Выявляем убеждения, которые незаметно управляют Вами и снижают качество жизни. Формируем новые установки и критическое мышление.",
  },
  {
    letter: "A",
    abbr:   "Awareness",
    ru:     "Осознанность",
    desc:   "Учимся замечать себя: свои реакции, потребности, триггеры. Осознанность — это не медитация, а способность остановиться перед автоматическим действием и выбрать более эффективное.",
  },
  {
    letter: "R",
    abbr:   "Recovery",
    ru:     "Восстановление",
    desc:   "Строим новые стратегии поведения, которые работают в реальной жизни. Восстанавливаем ресурс, учимся устанавливать границы и выходить из деструктивных паттернов.",
  },
  {
    letter: "T",
    abbr:   "Transformation",
    ru:     "Трансформация",
    desc:   "Закрепляем изменения. На этом этапе новое поведение становится привычным и не требует усилий. Вы меняетесь не потому, что стараетесь, а потому, что стали другим.",
  },
];

// ─────────────────────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Как понять, нужна ли мне психологическая помощь?",
    a: "Если тревога, напряжение или повторяющиеся сложности мешают Вам жить привычной жизнью, справляться с работой, отношениями или собственным состоянием — это уже достаточный повод обратиться за помощью.",
  },
  {
    q: "Как проходит первая консультация?",
    a: "Первая консультация — ⁠это диагностика и разбор Вашего запроса. Формируем ясное понимание, выявляем первопричины, определяем вектор и стратегию дальнейшей работы",
  },
  {
    q: "Сколько консультаций потребуется?",
    a: "Количество консультаций зависит от запроса, целей и индивидуальной ситуации. Некоторые вопросы проясняются за несколько консультаций, другие требуют более длительной системной работы. Мы всегда обсуждаем это совместно.",
  },
  {
    q: "Можно ли обратиться без чёткого запроса?",
    a: "Да. Иногда человек чувствует тревогу, пустоту или внутреннее напряжение, но не может сформулировать, в чем проблема. Это нормально — понимание запроса часто формируется уже в процессе первой консультации.",
  },
  {
    q: "Можно ли работать онлайн так же эффективно, как очно?",
    a: "Да. Онлайн-формат позволяет сохранять глубину, контакт и результативность. Для многих клиентов он даже более эффективен — за счёт безопасности, комфорта и открытости. Психологическая помощь не зависит от расстояния.",
  },
  {
    q: "Чем Вы отличаетесь от других специалистов?",
    a: "Мы работаем именно с причинами, а не с внешними проявлениями проблемы, которые влияют на Ваше состояние, решения и отношения.",
  },
  {
    q: "Гарантируете ли Вы результат?",
    a: "Мы гарантируем честную работу, профессионализм и полную вовлечённость. Результат всегда рождается во взаимодействии — мы создаём пространство и структуру изменений, Вы делаете внутреннюю работу.",
  },
  {
    q: "Как записаться на консультацию?",
    a: "Напишите нам в WhatsApp или Telegram — мы свяжемся с Вами, уточним запрос и подберём оптимальный формат работы. Можно также оставить заявку через сайт.",
  },
];

// ══════════════════════════════════════════════════════════════
//  ТИПЫ
// ══════════════════════════════════════════════════════════════
type ReviewItem = { name: string; specialist: string; text: string };
type PricingDetails = { [planId: string]: string[] };

type BookingContext = {
  source: string;
  service?: string;
  price?: string;
  duration?: string;
  specialist?: string;
};

const BOOKING_EVENT = "smart-lifestyle:booking";
const PRIVACY_EVENT = "smart-lifestyle:privacy";
const PRIVACY_VERSION = "2026-09-23";

function openPrivacy() {
  window.dispatchEvent(new CustomEvent(PRIVACY_EVENT));
}

function openBooking(context: BookingContext) {
  window.dispatchEvent(new CustomEvent<BookingContext>(BOOKING_EVENT, { detail: context }));
}

function formatBookingSource(context: BookingContext) {
  return [
    context.source,
    context.service,
    context.price,
    context.duration,
    context.specialist,
  ].filter(Boolean).join(" · ");
}

function createLeadRequestId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const PHONE_PREFIX = "+7 (";

function formatPhone(value: string) {
  const raw = value.trim();
  let digits = raw.replace(/\D/g, "");

  if (raw.startsWith("+7") || (digits.length >= 11 && digits.startsWith("7"))) {
    digits = digits.slice(1);
  } else if (digits.length >= 11 && digits.startsWith("8")) {
    digits = digits.slice(1);
  }

  const local = digits.slice(0, 10);
  if (!local) return PHONE_PREFIX;
  if (local.length <= 3) return `+7 (${local}`;

  const area = local.slice(0, 3);
  const first = local.slice(3, 6);
  const second = local.slice(6, 8);
  const third = local.slice(8, 10);

  let formatted = `+7 (${area})`;
  if (first) formatted += ` ${first}`;
  if (second) formatted += `-${second}`;
  if (third) formatted += `-${third}`;
  return formatted;
}

function isObviousFakePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local = digits.startsWith("7") ? digits.slice(1) : digits;

  if (local.length !== 10) return true;
  if (/^(\d)\1{9}$/.test(local)) return true;
  if (local === "1234567890" || local === "9876543210") return true;
  if (/^(\d{2})\1{4}$/.test(local)) return true;
  if (/^(\d{5})\1$/.test(local)) return true;

  return false;
}

function isValidPhone(value: string) {
  return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value) && !isObviousFakePhone(value);
}

// Fallback: данные из констант если Supabase недоступен
function fallbackReviews(): ReviewItem[] { return REVIEWS; }
function fallbackPricingDetails(): PricingDetails {
  return Object.fromEntries(PRICING.map(p => [p.planId, p.details]));
}

// ══════════════════════════════════════════════════════════════
//  УТИЛИТЫ
// ══════════════════════════════════════════════════════════════

// Шестерёнка
function Gear({ size = 120, className = "" }: { size?: number; className?: string }) {
  const r = size / 2, inner = r * 0.68, hole = r * 0.28, teeth = 12;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = (n: number) => (n / teeth) * Math.PI * 2 - Math.PI / 2;
    pts.push(`${inner * Math.cos(a(i))},${inner * Math.sin(a(i))}`);
    pts.push(`${r * Math.cos(a(i + 0.3))},${r * Math.sin(a(i + 0.3))}`);
    pts.push(`${r * Math.cos(a(i + 0.7))},${r * Math.sin(a(i + 0.7))}`);
    pts.push(`${inner * Math.cos(a(i + 1))},${inner * Math.sin(a(i + 1))}`);
  }
  return (
    <svg width={size} height={size} viewBox={`${-r} ${-r} ${size} ${size}`} className={className}>
      <polygon points={pts.join(" ")} fill="currentColor" />
      <circle r={hole} fill="#F3EDE6" />
      <circle r={hole * 0.35} fill="currentColor" />
    </svg>
  );
}

// Fade-in при скролле
function FadeIn({ children, delay = 0, y = 24, className = "" }: {
  children: React.ReactNode; delay?: number; y?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: on ? 1 : 0,
      transform: on ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 900ms cubic-bezier(0.25,0.1,0.25,1) ${delay}ms, transform 900ms cubic-bezier(0.25,0.1,0.25,1) ${delay}ms`,
    }}>{children}</div>
  );
}

// Ghost-цифра
function GhostNum({ n }: { n: string }) {
  return (
    <span aria-hidden className="absolute -top-4 left-0 font-['Cormorant_Garamond'] select-none pointer-events-none leading-none"
      style={{ fontSize: "clamp(80px,14vw,160px)", color: "#5C5248", opacity: 0.04 }}>{n}</span>
  );
}

// Лейбл в стиле Bebas Neue
function Label({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`font-['Bebas_Neue'] text-[15px] tracking-[0.22em] mb-4 ${light ? "text-[#C9A882]/80" : "text-[#8A7B6C]"}`}>
      {children}
    </p>
  );
}

// Слайдер — механическое скольжение
function useSlider(total: number) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx(i => (i - 1 + total) % total);
  const next = () => setIdx(i => (i + 1) % total);
  return { idx, prev, next };
}

// Механический слайдер — точный пиксельный сдвиг через ref
function MechanicalSlider({
  idx,
  onNext,
  onPrev,
  children,
}: {
  idx: number;
  onNext: () => void;
  onPrev: () => void;
  children: React.ReactNode[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideW, setSlideW] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);

  useEffect(() => {
    const measure = () => setSlideW(window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const vw = slideW || window.innerWidth;

  return (
    // Выламываемся из контейнера на всю ширину экрана
    <div
      ref={containerRef}
      style={{
        overflow: "hidden",
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        touchAction: "pan-y",
      }}
      onTouchStart={e => {
        startX.current = e.touches[0].clientX;
        startY.current = e.touches[0].clientY;
      }}
      onTouchEnd={e => {
        const dx = startX.current - e.changedTouches[0].clientX;
        const dy = startY.current - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
          dx > 0 ? onNext() : onPrev();
        }
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          transform: `translateX(-${idx * vw}px)`,
          transition: "transform 2200ms cubic-bezier(0.83, 0, 0.17, 1)",
          willChange: "transform",
        }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            style={{ width: `${vw}px`, minWidth: `${vw}px`, flexShrink: 0, boxSizing: "border-box" }}
          >
            {/* Внутренний контент с паддингами контейнера */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
              {child}
            </div>
          </div>
        ))}
      </div>
    </div>
  
  );
}

// Свайп — только горизонтальный, не блокирует вертикальный скролл
function useSwipe(onNext: () => void, onPrev: () => void) {
  const x0 = useRef(0);
  const y0 = useRef(0);
  return {
    onTouchStart: (e: React.TouchEvent) => {
      x0.current = e.touches[0].clientX;
      y0.current = e.touches[0].clientY;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      const dx = x0.current - e.changedTouches[0].clientX;
      const dy = y0.current - e.changedTouches[0].clientY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 44) {
        dx > 0 ? onNext() : onPrev();
      }
    },
  };
}

// Кастомный курсор
function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rx = -100, ry = -100, dx = -100, dy = -100;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    let raf: number;
    const onMove = (e: MouseEvent) => { dx = e.clientX; dy = e.clientY; };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      rx = lerp(rx, dx, 0.1); ry = lerp(ry, dy, 0.1);
      if (dot.current)  dot.current.style.transform  = `translate(${dx - 3}px,${dy - 3}px)`;
      if (ring.current) ring.current.style.transform = `translate(${rx - 18}px,${ry - 18}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const grow   = () => { if (ring.current) { ring.current.style.width = "48px"; ring.current.style.height = "48px"; } };
    const shrink = () => { if (ring.current) { ring.current.style.width = "36px"; ring.current.style.height = "36px"; } };
    document.querySelectorAll("a,button").forEach(el => { el.addEventListener("mouseenter", grow); el.addEventListener("mouseleave", shrink); });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="hidden lg:block pointer-events-none">
      <div ref={dot}  style={{ position:"fixed", top:0, left:0, width:6, height:6, background:"#C9A882", borderRadius:"50%", zIndex:9999, pointerEvents:"none" }} />
      <div ref={ring} style={{ position:"fixed", top:0, left:0, width:36, height:36, border:"1px solid #C9A882", borderRadius:"50%", zIndex:9998, pointerEvents:"none", opacity:0.5, transition:"width 350ms ease,height 350ms ease" }} />
    </div>
  );
}

// SEO — полная оптимизация
function useSEO() {
  useEffect(() => {
    // ── Lang ──────────────────────────────────────────────────
    document.documentElement.lang = "ru";

    // ── Title ─────────────────────────────────────────────────
    document.title = "Психологическая помощь в Алматы — S.M.A.R.T. Lifestyle | Психолог-консультант Исламов Антон, Исламова Рината";

    // ── Helpers ───────────────────────────────────────────────
    const meta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    const link = (rel: string, href: string, extra: Record<string,string> = {}) => {
      let el = document.querySelector(`link[rel="${rel}"][href="${href}"]`) as HTMLLinkElement;
      if (!el) { el = document.createElement("link"); el.rel = rel; el.href = href; Object.entries(extra).forEach(([k,v]) => el!.setAttribute(k, v)); document.head.appendChild(el); }
    };
    const jsonLd = (id: string, data: object) => {
      let el = document.getElementById(id) as HTMLScriptElement;
      if (!el) { el = document.createElement("script"); el.id = id; el.type = "application/ld+json"; document.head.appendChild(el); }
      el.textContent = JSON.stringify(data);
    };

    // ── Preconnect ────────────────────────────────────────────
    link("preconnect", "https://fonts.googleapis.com");
    link("preconnect", "https://fonts.gstatic.com", { crossorigin: "" });
    link("canonical", window.location.origin);

    // ── Meta basic ────────────────────────────────────────────
    meta("description", "Психологическая помощь в Алматы и онлайн. Индивидуальные и семейные консультации по методу S.M.A.R.T. Lifestyle. Помогаем справиться с тревогой, выгоранием, сложностями в отношениях и зависимым поведением. Антон и Рината Исламовы. Запись в WhatsApp.");
    meta("keywords", "психологическая помощь Алматы, психолог в Алматы, консультация психолога Алматы, семейная консультация Алматы, тревога помощь Алматы, выгорание психолог, SMART Lifestyle, психолог онлайн Казахстан, Исламов психолог Алматы, Исламова психолог Алматы, сложности в отношениях, психологическая консультация цена, зависимое поведение помощь");
    meta("robots", "index, follow, max-snippet:-1, max-image-preview:large");
    meta("author", "S.M.A.R.T. Lifestyle");
    meta("geo.region", "KZ-ALA");
    meta("geo.placename", "Алматы");

    // ── Open Graph ────────────────────────────────────────────
    meta("og:title", "Психологическая помощь в Алматы — S.M.A.R.T. Lifestyle", true);
    meta("og:description", "Индивидуальные и семейные консультации. Помогаем разобраться с тревогой, выгоранием, сложностями в отношениях. Антон и Рината Исламовы. Очно и онлайн.", true);
    meta("og:type", "website", true);
    meta("og:locale", "ru_RU", true);
    meta("og:url", window.location.origin, true);
    meta("og:site_name", "S.M.A.R.T. Lifestyle", true);

    // ── Twitter Card ──────────────────────────────────────────
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", "Психологическая помощь в Алматы — S.M.A.R.T. Lifestyle");
    meta("twitter:description", "Индивидуальные и семейные консультации. Помогаем с тревогой, выгоранием, сложностями в отношениях. Очно и онлайн.");

    // ── JSON-LD: LocalBusiness ────────────────────────────────
    jsonLd("ld-local", {
      "@context": "https://schema.org",
      "@type": "PsychologicalService",
      "name": "S.M.A.R.T. Lifestyle",
      "description": "Психологическая помощь в Алматы и онлайн. Индивидуальные и семейные консультации по методу S.M.A.R.T. Lifestyle.",
      "url": window.location.origin,
      "telephone": "+77028779911",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Алматы",
        "addressCountry": "KZ",
      },
      "areaServed": ["Алматы", "Казахстан", "Онлайн"],
      "availableLanguage": "Russian",
      "priceRange": "50000–75000 ₸",
      "sameAs": [
        "https://wa.me/77028779911",
        "https://t.me/+77028779911",
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Психологическая помощь",
        "itemListElement": PRICING.map(p => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": p.title,
            "description": p.desc,
          },
          "price": p.kzt.replace(/\s/g, "").replace("₸",""),
          "priceCurrency": "KZT",
        })),
      },
    });

    // ── JSON-LD: Person (specialists) ─────────────────────────
    jsonLd("ld-persons", {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "name": "Исламов Антон Валерьевич",
          "jobTitle": "Психолог-консультант, конфликтолог",
          "description": "Автор метода S.M.A.R.T. Lifestyle. 10 лет практики. Работает с кризисными состояниями, конфликтами, зависимым поведением и эмоциональными трудностями.",
          "worksFor": { "@type": "Organization", "name": "S.M.A.R.T. Lifestyle" },
          "knowsAbout": ["психологическое консультирование", "НЛП", "КПТ", "зависимое поведение", "конфликтология", "семейная психология"],
        },
        {
          "@type": "Person",
          "name": "Исламова Рината Адхамовна",
          "jobTitle": "Психолог-консультант, женский сексолог",
          "description": "Член международной ассоциации психологов. 7 лет практики. Работает с тревогой, самооценкой, отношениями и эмоциональными трудностями.",
          "worksFor": { "@type": "Organization", "name": "S.M.A.R.T. Lifestyle" },
          "knowsAbout": ["психологическое консультирование", "телесно-ориентированная терапия", "эриксоновский гипноз", "самооценка", "тревога"],
        },
      ],
    });

    // ── JSON-LD: FAQPage (показывается в Google напрямую) ─────
    jsonLd("ld-faq", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": FAQ_ITEMS.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a,
        },
      })),
    });

  }, []);
}

// ══════════════════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════════════════
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.style.touchAction = open ? "none" : "";
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [open]);

  const links = [["Запросы","#problems"],["Специалисты","#experts"],["Форматы","#formats"],["Отзывы","#reviews"],["Метод","#method"],["FAQ","#faq"],["Контакты","#contacts"]];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 65,
        background: open ? "transparent" : "rgba(243,237,230,0.98)",
        backdropFilter: open ? "none" : "blur(12px)",
        borderBottom: open ? "none" : "1px solid rgba(201,168,130,0.2)",
      }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <a href="#hero" onClick={() => setOpen(false)} className={`font-['Bebas_Neue'] text-[20px] tracking-[0.15em] transition-colors duration-500 ${open ? "text-[#F3EDE6]" : "text-[#5C5248]"}`}>
            S.M.A.R.T. <span className={`transition-colors duration-500 ${open ? "text-[#C9A882]" : "text-[#8A7B6C]"}`}>Lifestyle</span>
          </a>
          <div className="hidden lg:flex items-center gap-10">
            {links.slice(0,5).map(([l,h])=>(
              <a key={h} href={h} className="font-['DM_Sans'] text-[12px] tracking-[0.12em] uppercase text-[#5C5248]/50 hover:text-[#5C5248] transition-colors">{l}</a>
            ))}
          </div>
          <button type="button" onClick={() => openBooking({ source: "Шапка сайта" })} className="hidden lg:inline-flex items-center gap-2 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-5 py-2.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
            Записаться
          </button>
          <button onClick={() => setOpen(!open)} className="lg:hidden relative z-[70] p-2 flex flex-col gap-[5px] justify-center">
            <span className={`block w-6 h-px transition-all duration-500 origin-center ${open ? "bg-[#F3EDE6] rotate-45 translate-y-[6px]" : "bg-[#5C5248]"}`} />
            <span className={`block h-px transition-all duration-500 ${open ? "bg-[#F3EDE6] w-0 opacity-0" : "bg-[#5C5248] w-6"}`} />
            <span className={`block w-6 h-px transition-all duration-500 origin-center ${open ? "bg-[#F3EDE6] -rotate-45 -translate-y-[6px]" : "bg-[#5C5248]"}`} />
          </button>
        </div>
      </nav>

      {/* Полноэкранное мобильное меню */}
      <div className="fixed inset-0 z-[55] lg:hidden flex flex-col" style={{ background:"#40382F", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition:"opacity 500ms cubic-bezier(0.25,0.1,0.25,1)" }}>
        <div className="absolute top-16 left-6 right-6 h-px bg-[#C9A882]/20" />
        <div className="flex-1 flex flex-col justify-center px-8 pt-20 pb-10">
          <nav className="space-y-0">
            {links.map(([l,h],i) => (
              <a key={h} href={h} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 border-b border-[#F3EDE6]/8 group"
                style={{ opacity: open ? 1 : 0, transform: open ? "translateX(0)" : "translateX(-12px)", transition: `opacity 600ms ease ${150 + i * 55}ms, transform 600ms ease ${150 + i * 55}ms` }}>
                <span className="font-['DM_Sans'] text-[10px] text-[#C9A882]/40 w-5 shrink-0">{String(i+1).padStart(2,"0")}</span>
                <span className="font-['Cormorant_Garamond'] text-[30px] font-normal text-[#F3EDE6] group-hover:text-[#C9A882] transition-colors duration-500 leading-none">{l}</span>
              </a>
            ))}
          </nav>
          <div className="mt-10 pt-8 border-t border-[#F3EDE6]/10 flex flex-col gap-3" style={{ opacity: open ? 1 : 0, transition:"opacity 600ms ease 600ms" }}>
            <a href={SITE.whatsapp} className="font-['DM_Sans'] text-[12px] tracking-[0.12em] uppercase text-[#C9A882]/60">{SITE.phone} · WhatsApp</a>
            <a href={SITE.telegram} className="font-['DM_Sans'] text-[12px] tracking-[0.12em] uppercase text-[#C9A882]/60">{SITE.phone} · Telegram</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
//  HERO
// ══════════════════════════════════════════════════════════════
function Hero() {
  return (
    <section id="hero" className="bg-[#F3EDE6]">
      {/* Мобиль */}
      <div className="lg:hidden">
        <div className="relative w-full overflow-hidden" style={{ height:"58vmax" }}>
          <ImageWithFallback src={photoHero} alt="Психологи-консультанты S.M.A.R.T. Lifestyle Алматы — Антон и Рината Исламовы" className="w-full h-full object-cover object-top" />
        </div>
        <div className="px-6 pt-8 pb-16">
          <Label>{SITE.tagline}</Label>
          <h1 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[0.95] mb-7" style={{ fontSize:"clamp(38px,10vw,52px)" }}>
            {HERO.heading.map((l,i)=><span key={i}>{i===HERO.heading.length-1?<em>{l}</em>:l}<br/></span>)}
          </h1>
          <div className="w-10 h-px bg-[#C9A882] mb-6" />
          <p className="font-['DM_Sans'] text-[14px] text-[#5C5248]/60 leading-relaxed mb-9">{HERO.subtext}</p>
          <button type="button" onClick={() => openBooking({ source: "Главный баннер" })} className="flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.15em] px-6 py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
            Записаться на консультацию <ArrowRight size={14}/>
          </button>
        </div>
      </div>

      {/* Десктоп */}
      <div className="hidden lg:block relative min-h-screen overflow-hidden">
        <div className="absolute top-0 right-0 w-[52%] h-full">
          <ImageWithFallback src={photoHero} alt="Глубинная психотерапия в Алматы — S.M.A.R.T. Lifestyle" className="w-full h-full object-cover object-top" />
        </div>
        <div className="relative max-w-7xl mx-auto px-12 pt-44 pb-32 min-h-screen flex flex-col justify-between">
          <div className="w-[44%] mt-auto">
            <Label>{SITE.tagline}</Label>
            <h1 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[0.92] mb-10" style={{ fontSize:"clamp(44px,4vw,62px)" }}>
              {HERO.heading.map((l,i)=><span key={i}>{i===HERO.heading.length-1?<em>{l}</em>:l}<br/></span>)}
            </h1>
            <div className="w-12 h-px bg-[#C9A882] mb-8" />
            <p className="font-['DM_Sans'] text-[14px] text-[#5C5248]/60 leading-relaxed max-w-sm mb-12">{HERO.subtext}</p>
            <div className="flex items-center gap-8">
              <button type="button" onClick={() => openBooking({ source: "Главный баннер" })} className="inline-flex items-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.15em] px-8 py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                Записаться <ArrowRight size={14}/>
              </button>
              <a href="#problems" className="font-['DM_Sans'] text-[12px] tracking-[0.12em] uppercase text-[#5C5248]/40 hover:text-[#5C5248] transition-colors">О методе ↓</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  STATEMENT
// ══════════════════════════════════════════════════════════════
function Statement() {
  const parts = STATEMENT.text.split(STATEMENT.highlight);
  return (
    <section className="bg-[#40382F] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn>
          <p className="font-['Cormorant_Garamond'] italic font-normal text-[#F3EDE6] leading-[1.2]" style={{ fontSize:"clamp(24px,3.5vw,52px)" }}>
            {parts[0]}<em className="text-[#C9A882] not-italic">{STATEMENT.highlight}</em>{parts[1]}
          </p>
          <div className="mt-8 flex items-center gap-5">
            <div className="w-8 h-px bg-[#C9A882]"/>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.22em] text-[#C9A882]/60">{STATEMENT.caption}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  STATS
// ══════════════════════════════════════════════════════════════
function StatsToProblemsTransition() {
  return (
    <div className="bg-[#5C5248] py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <p className="font-['Cormorant_Garamond'] italic text-[#F3EDE6] leading-snug" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>Работаем с причинами, а не с симптомами</p>
        <button type="button" onClick={() => openBooking({ source: "Блок статистики" })}
          className="inline-flex items-center gap-2 border border-[#C9A882]/40 text-[#C9A882] font-['Bebas_Neue'] text-[14px] tracking-[0.18em] px-6 py-3 hover:bg-[#C9A882] hover:text-[#5C5248] transition-colors whitespace-nowrap self-start lg:self-auto">
          Записаться <ArrowRight size={13}/>
        </button>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className="bg-[#F3EDE6] py-10 lg:py-16 border-b border-[#E8DDD4]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Все 6 цифр в одной сетке — компактно */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8DDD4]">
          {STATS.map((s, i) => (
            <FadeIn key={s.label} delay={i * 60} className={`p-5 lg:p-8 ${i >= 3 ? "bg-[#EBE0D5]" : "bg-[#F3EDE6]"}`}>
              <p className={`font-['Cormorant_Garamond'] font-normal leading-none mb-1 ${i >= 3 ? "italic" : ""}`}
                style={{ fontSize: "clamp(32px, 5vw, 64px)", color: "#5C5248" }}>
                {s.number}
              </p>
              <p className="font-['Bebas_Neue'] text-[12px] lg:text-[13px] tracking-[0.15em] text-[#8A7B6C] mb-1 uppercase leading-snug">{s.label}</p>
              <p className="font-['DM_Sans'] text-[11px] text-[#5C5248]/45 leading-relaxed hidden lg:block">{s.desc}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  PROBLEMS
// ══════════════════════════════════════════════════════════════
function Problems() {
  const list = (
    <div>
      {PROBLEMS.map((p,i)=>(
        <FadeIn key={i} delay={i * 55}>
          <div className="flex items-baseline gap-6 py-5 border-b border-[#C9A882]/20 group hover:border-[#8A7B6C]/40 transition-colors">
            <span className="font-['DM_Sans'] text-[11px] text-[#8A7B6C]/40 w-6 shrink-0">{String(i+1).padStart(2,"0")}</span>
            <p className="font-['Cormorant_Garamond'] text-[22px] font-normal text-[#5C5248] leading-snug group-hover:text-[#8A7B6C] transition-colors">{p}</p>
          </div>
        </FadeIn>
      ))}
    </div>
  );
  const heading = (
    <>
      <div className="relative">
        <GhostNum n="01" />
        <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.1] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>
          Ваш запрос —<br/><em>отправная точка</em>
        </h2>
      </div>
      <div className="w-8 h-px bg-[#C9A882] mt-6 mb-5"/>
      <p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/55 leading-relaxed">Любой из этих запросов — достаточная причина, чтобы начать работу.</p>
      <button type="button" onClick={() => openBooking({ source: "Блок запросов" })} className="inline-flex items-center gap-2 mt-8 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.15em] px-6 py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
        Записаться <ArrowRight size={12}/>
      </button>
    </>
  );
  return (
    <section id="problems" className="bg-[#F3EDE6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="lg:hidden">{list}<div className="mt-12">{heading}</div></div>
        <div className="hidden lg:grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 self-start">{heading}</div>
          <div>{list}</div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  FORMATS
// ══════════════════════════════════════════════════════════════
function Formats() {
  return (
    <section id="formats" className="bg-[#F3EDE6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[620px]">
          {FORMATS.map((f,i)=>(
            <div key={i} className={`px-8 lg:px-14 py-20 lg:py-28 ${f.dark ? "bg-[#5C5248]" : "border-b lg:border-b-0 lg:border-r border-[#E8DDD4]"}`}>
              <Label light={f.dark}>Формат {f.num}</Label>
              <h2 className={`font-['Cormorant_Garamond'] font-normal leading-[1.05] mb-2 ${f.dark ? "text-[#F3EDE6]" : "text-[#5C5248]"}`} style={{ fontSize:"clamp(26px,3vw,44px)" }}>
                {f.title}
              </h2>
              <p className={`font-['Cormorant_Garamond'] italic text-[18px] mb-7 ${f.dark ? "text-[#C9A882]" : "text-[#8A7B6C]"}`}>{f.tagline}</p>
              <div className={`w-8 h-px mb-7 ${f.dark ? "bg-[#C9A882]/40" : "bg-[#C9A882]"}`}/>
              <p className={`font-['DM_Sans'] text-[14px] leading-[1.8] mb-8 ${f.dark ? "text-[#F3EDE6]/55" : "text-[#5C5248]/60"}`}>{f.desc}</p>
              <ul className="space-y-3.5 mb-6">
                {f.items.map(t=>(
                  <li key={t} className={`flex items-center gap-3 font-['DM_Sans'] text-[13px] ${f.dark ? "text-[#F3EDE6]/60" : "text-[#5C5248]/70"}`}>
                    <span className={`w-4 h-px shrink-0 ${f.dark ? "bg-[#C9A882]/40" : "bg-[#C9A882]"}`}/>{t}
                  </li>
                ))}
              </ul>
              {/* Очно/Онлайн теги */}
              <div className="flex gap-2 mb-10">
                {f.formats.map(fmt=>(
                  <span key={fmt} className={`font-['Bebas_Neue'] text-[13px] tracking-[0.15em] px-3 py-1.5 border ${f.dark ? "border-[#C9A882]/30 text-[#C9A882]/70" : "border-[#C9A882]/40 text-[#8A7B6C]"}`}>{fmt}</span>
                ))}
              </div>
              <button type="button" onClick={() => openBooking({ source: "Форматы", service: f.title })} className={`inline-flex items-center gap-3 font-['Bebas_Neue'] text-[15px] tracking-[0.15em] px-7 py-4 transition-colors ${f.dark ? "border border-[#C9A882] text-[#C9A882] hover:bg-[#C9A882] hover:text-[#5C5248]" : "bg-[#C9A882] text-[#5C5248] hover:bg-[#8A7B6C] hover:text-[#F3EDE6]"}`}>
                Записаться <ArrowRight size={12}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  EXPERTS — без слайдера, стекированные
// ══════════════════════════════════════════════════════════════
// Попап специалиста — полный экран на мобиле, карточка на десктопе
function ExpertModal({ expert, onClose }: { expert: typeof EXPERTS[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-[80]" onClick={onClose}>
      <div className="absolute inset-0 bg-[#5C5248]/50 backdrop-blur-sm lg:block hidden" />

      {/* Мобиль — полный экран, десктоп — центрированная карточка */}
      <div
        className="absolute inset-0 lg:inset-auto lg:relative lg:flex lg:items-center lg:justify-center lg:min-h-screen"
        onClick={onClose}
      >
        <div
          className="bg-[#F3EDE6] w-full h-full lg:h-auto lg:max-w-2xl lg:max-h-[88vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Кнопка закрытия — только на десктопе абсолютная, на мобиле внизу */}
          <button
            onClick={onClose}
            className="hidden lg:flex absolute top-4 right-4 z-30 w-9 h-9 items-center justify-center bg-[#F3EDE6]/90 backdrop-blur-sm text-[#5C5248] hover:text-[#8A7B6C] transition-colors"
          >
            <X size={18}/>
          </button>

          {/* Фото — только на мобиле */}
          <div className="w-full lg:hidden overflow-hidden">
            <ImageWithFallback
              src={expert.photo}
              alt={expert.name}
              className="w-full object-cover object-top"
            />
          </div>

          {/* Контент — на мобиле добавляем отступ снизу под фиксированную панель */}
          <div className="p-6 lg:p-10 pb-28 lg:pb-10">
            <p className="font-['Bebas_Neue'] text-[12px] tracking-[0.2em] text-[#8A7B6C] mb-1">{expert.experience}</p>
            <h3 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-tight mb-1" style={{ fontSize: "clamp(26px,3vw,40px)" }}>{expert.name}</h3>
            <p className="font-['Cormorant_Garamond'] italic text-[15px] text-[#8A7B6C] mb-5">{expert.specialty}</p>
            <div className="w-8 h-px bg-[#C9A882] mb-5"/>
            <p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/65 leading-[1.8] mb-7">{expert.bio}</p>

            <div className="mb-6">
              <p className="font-['Bebas_Neue'] text-[12px] tracking-[0.18em] text-[#5C5248]/40 mb-3">Квалификация</p>
              <ul className="space-y-1.5">
                {expert.qualifications.map(q=>(
                  <li key={q} className="flex items-start gap-2 font-['DM_Sans'] text-[12px] text-[#5C5248]/65">
                    <span className="w-3 h-px bg-[#C9A882] mt-2 shrink-0"/>{q}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <p className="font-['Bebas_Neue'] text-[12px] tracking-[0.18em] text-[#5C5248]/40 mb-3">Методы работы</p>
              <ul className="space-y-2">
                {expert.methods.map(m=>(
                  <li key={m} className="flex items-start gap-2 font-['DM_Sans'] text-[12px] text-[#5C5248]/65 leading-relaxed">
                    <span className="text-[#C9A882] mt-0.5 shrink-0">◈</span>{m}
                  </li>
                ))}
              </ul>
              {expert.tagline && (
                <p className="font-['Cormorant_Garamond'] italic text-[14px] text-[#8A7B6C] mt-4 pt-4 border-t border-[#C9A882]/20">{expert.tagline}</p>
              )}
            </div>

            <div className="flex gap-2 flex-wrap mb-7">
              {expert.formats.map(f=>(
                <span key={f} className="font-['Bebas_Neue'] text-[12px] tracking-[0.12em] text-[#5C5248] bg-[#E8DDD4] px-3 py-1.5">{f}</span>
              ))}
            </div>

            {/* Кнопка записаться — только на десктопе внутри контента */}
            <button type="button" onClick={() => { onClose(); openBooking({ source: "Специалисты", specialist: expert.name }); }}
              className="hidden lg:flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] py-4 w-full hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
              Записаться <ArrowRight size={13}/>
            </button>
          </div>

          {/* Фиксированная панель снизу — только мобиль */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F3EDE6] border-t border-[#E8DDD4] p-4 flex gap-3">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center border border-[#5C5248]/20 text-[#5C5248] shrink-0 hover:bg-[#E8DDD4] transition-colors"
            >
              <X size={18}/>
            </button>
            <button type="button" onClick={() => { onClose(); openBooking({ source: "Специалисты", specialist: expert.name }); }}
              className="flex-1 flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
              Записаться <ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Experts() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="experts" className="bg-[#F3EDE6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12 lg:mb-20">
          <Label>Команда</Label>
          <div className="relative">
            <GhostNum n="03" />
            <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>Специалисты</h2>
          </div>
        </FadeIn>

        {EXPERTS.map((e, i) => (
          <FadeIn key={e.name} delay={i * 100} className="border-t border-[#E8DDD4]">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Фото — кликабельное */}
              <div
                className={`overflow-hidden order-1 relative cursor-pointer group ${e.photoLeft ? "lg:order-1" : "lg:order-2"}`}
                onClick={() => setActive(i)}
              >
                <ImageWithFallback src={e.photo} alt={`${e.name} — психолог-консультант S.M.A.R.T. Lifestyle Алматы`} className="w-full h-[320px] lg:h-full object-cover object-top lg:min-h-[460px] transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-[#5C5248]/0 group-hover:bg-[#5C5248]/20 transition-all duration-500 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 font-['Bebas_Neue'] text-[13px] tracking-[0.2em] text-[#F3EDE6] border border-[#F3EDE6]/60 px-5 py-2.5">
                    Подробнее
                  </span>
                </div>
              </div>

              {/* Краткий текст */}
              <div className={`px-0 py-8 lg:py-14 flex flex-col justify-center order-2 ${e.photoLeft ? "lg:order-2 lg:pl-14 lg:border-l" : "lg:order-1 lg:pr-14 lg:border-r"} border-[#E8DDD4]`}>
                <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.2em] text-[#8A7B6C] mb-1">{e.experience}</p>
                <h3 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.0] mb-2" style={{ fontSize:"clamp(26px,2.8vw,42px)" }}>{e.name}</h3>
                <p className="font-['Cormorant_Garamond'] italic text-[17px] text-[#8A7B6C] mb-5">{e.specialty}</p>
                <div className="w-8 h-px bg-[#C9A882] mb-5"/>
                <p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/60 leading-[1.8] mb-6">{e.bio}</p>
                <div className="flex flex-wrap gap-2 mb-7">
                  {e.tags.map(t=>(
                    <span key={t} className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#8A7B6C] border border-[#C9A882]/30 px-3 py-1.5">{t}</span>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => setActive(i)}
                    className="inline-flex items-center gap-2 border border-[#5C5248]/30 text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-6 py-3.5 hover:bg-[#5C5248] hover:text-[#F3EDE6] transition-colors"
                  >
                    О специалисте
                  </button>
                  <button type="button" onClick={() => openBooking({ source: "Специалисты", specialist: e.name })}
                    className="inline-flex items-center gap-2 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-6 py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                    Записаться <ArrowRight size={12}/>
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {active !== null && <ExpertModal expert={EXPERTS[active]} onClose={() => setActive(null)} />}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  REVIEWS — механический слайдер
// ══════════════════════════════════════════════════════════════
function Reviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(fallbackReviews);
  useEffect(() => {
    fetchReviews()
      .then(rows => { if (rows.length > 0) setReviews(rows); })
      .catch(() => {/* остаётся fallback */});
  }, []);
  const { idx, prev, next } = useSlider(reviews.length);
  const swipe = useSwipe(next, prev);
  return (
    <section id="reviews" className="bg-[#E8DDD4] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Label>Отзывы</Label>
            <div className="relative">
              <GhostNum n="04" />
              <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>Истории клиентов</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prev} className="w-10 h-10 border border-[#C9A882]/40 flex items-center justify-center text-[#5C5248] hover:bg-[#C9A882]/20 transition-colors"><ChevronLeft size={18}/></button>
            <span className="font-['DM_Sans'] text-[12px] text-[#5C5248]/40">{idx+1} / {reviews.length}</span>
            <button onClick={next} className="w-10 h-10 border border-[#C9A882]/40 flex items-center justify-center text-[#5C5248] hover:bg-[#C9A882]/20 transition-colors"><ChevronRight size={18}/></button>
          </div>
        </FadeIn>

        <MechanicalSlider idx={idx} onNext={next} onPrev={prev}>
          {reviews.map((r,i)=>(
            <div key={i} className="bg-[#F3EDE6] p-6 lg:p-14 border-l-4 border-[#C9A882]">
              <div className="font-['Cormorant_Garamond'] text-[#C9A882] text-5xl lg:text-7xl leading-none mb-4 lg:mb-6 select-none">"</div>
              <p className="font-['Cormorant_Garamond'] italic font-normal text-[#5C5248] leading-relaxed mb-6 lg:mb-8" style={{ fontSize:"clamp(16px,2.2vw,26px)" }}>{r.text}</p>
              <div>
                <p className="font-['Bebas_Neue'] text-[14px] tracking-[0.2em] text-[#5C5248]">{r.name}</p>
                <p className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#8A7B6C] mt-1">{r.specialist}</p>
              </div>
            </div>
          ))}
        </MechanicalSlider>

        <div className="flex items-center gap-2 mt-6">
          {REVIEWS.map((_,i)=>(
            <div key={i} style={{ width: i===idx ? "28px" : "6px", height:"1.5px", background: i===idx ? "#8A7B6C" : "#C9A882", opacity: i===idx ? 1 : 0.4, transition:"all 1500ms cubic-bezier(0.76,0,0.24,1)" }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  PRICING
// ══════════════════════════════════════════════════════════════
function PricingModal({ item, details, priceKzt, priceUsd, onClose }: { item: typeof PRICING[0]; details: string[]; priceKzt: string; priceUsd: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 z-[80] flex items-end lg:items-center justify-center p-4 lg:p-8"
      onClick={onClose}>
      <div className="absolute inset-0 bg-[#5C5248]/40 backdrop-blur-sm" />
      <div className="relative bg-[#F3EDE6] w-full max-w-lg lg:max-w-xl p-8 lg:p-12 z-10"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-5 right-5 text-[#5C5248]/40 hover:text-[#5C5248] transition-colors">
          <X size={20}/>
        </button>

        <Label>{item.duration}</Label>
        <h3 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-tight mb-2" style={{ fontSize: "clamp(24px,3vw,36px)" }}>
          {item.title}
        </h3>
        <p className="font-['Cormorant_Garamond'] italic text-[16px] text-[#8A7B6C] mb-6">{item.who}</p>
        <div className="w-8 h-px bg-[#C9A882] mb-6"/>

        <ul className="space-y-3 mb-8">
          {details.map((d, i) => (
            <li key={i} className="flex items-start gap-3 font-['DM_Sans'] text-[13px] text-[#5C5248]/70 leading-relaxed">
              <span className="text-[#C9A882] shrink-0 mt-0.5">◈</span>{d}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mb-6 pt-6 border-t border-[#E8DDD4]">
          <div>
            <p className="font-['Cormorant_Garamond'] text-[28px] font-normal text-[#5C5248]">{priceKzt}</p>
            <p className="font-['DM_Sans'] text-[12px] text-[#8A7B6C]/60">{priceUsd}</p>
          </div>
          <div className="flex gap-2">
            {item.formats.map(f => (
              <span key={f} className="font-['Bebas_Neue'] text-[12px] tracking-[0.12em] text-[#8A7B6C] border border-[#C9A882]/30 px-3 py-1.5">{f}</span>
            ))}
          </div>
        </div>

        <button type="button" onClick={() => {
            onClose();
            openBooking({
              source: "Стоимость",
              service: item.title,
              price: priceKzt,
              duration: item.duration,
              specialist: item.who,
            });
          }}
          className="flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] py-4 w-full hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
          Записаться <ArrowRight size={14}/>
        </button>
      </div>
    </div>
  );
}

function Pricing() {
  const [active, setActive] = useState<number | null>(null);
  const [pricingDetails, setPricingDetails] = useState<PricingDetails>(fallbackPricingDetails);
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    fetchAllPricingConditions()
      .then(rows => {
        if (rows.length === 0) return;
        const grouped: PricingDetails = {};
        for (const r of rows) {
          if (!grouped[r.plan_id]) grouped[r.plan_id] = [];
          if (r.is_active) grouped[r.plan_id].push(r.text);
        }
        setPricingDetails(grouped);
      })
      .catch(() => {});
    fetchPricingPlans().then(setPlans).catch(() => {});
  }, []);

  const getDetails = (p: typeof PRICING[0]) => pricingDetails[p.planId] ?? p.details;
  const getPrice = (p: typeof PRICING[0]) => {
    const plan = plans.find(pl => pl.plan_id === p.planId);
    return { kzt: plan?.price_kzt ?? p.kzt, usd: plan?.price_usd ?? p.usd };
  };
  return (
    <section id="pricing" className="bg-[#F3EDE6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-14 lg:mb-20">
          <div className="relative">
            <GhostNum n="05" />
            <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>Стоимость</h2>
          </div>
        </FadeIn>
        <div>
          {PRICING.map((p,i)=>(
            <FadeIn key={i} delay={i * 80}>
              <button
                onClick={() => setActive(i)}
                className="w-full text-left grid grid-cols-1 lg:grid-cols-[auto_1fr_auto_auto_auto] gap-3 lg:gap-10 border-t border-[#E8DDD4] py-6 lg:items-center group hover:bg-[#F3EDE6]/60 transition-colors cursor-pointer"
              >
                <span className="font-['DM_Sans'] text-[11px] text-[#8A7B6C]/40 w-6 hidden lg:block">{String(i+1).padStart(2,"0")}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-['Cormorant_Garamond'] text-[22px] font-normal text-[#5C5248] group-hover:text-[#8A7B6C] transition-colors">{p.title}</h3>
                  </div>
                  <p className="font-['DM_Sans'] text-[12px] text-[#5C5248]/50 mb-2">{p.desc}</p>
                  <p className="font-['DM_Sans'] text-[11px] text-[#8A7B6C]/60 italic">{p.who}</p>
                </div>
                <p className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#8A7B6C]">{p.duration}</p>
                <div>
                  <p className="font-['Cormorant_Garamond'] text-[22px] font-normal text-[#5C5248]">{getPrice(p).kzt}</p>
                  <p className="font-['DM_Sans'] text-[11px] text-[#8A7B6C]/60">{getPrice(p).usd}</p>
                </div>
                <span className="font-['Bebas_Neue'] text-[12px] tracking-[0.15em] text-[#8A7B6C] border border-[#C9A882]/40 px-4 py-2 group-hover:bg-[#C9A882] group-hover:text-[#5C5248] transition-colors whitespace-nowrap">
                  Подробнее
                </span>
              </button>
            </FadeIn>
          ))}
          <div className="border-t border-[#E8DDD4]"/>
        </div>
        <p className="font-['DM_Sans'] text-[12px] text-[#5C5248]/40 mt-6">* Нажмите на строку, чтобы узнать подробнее. Точная стоимость уточняется при записи.</p>
      </div>

      {active !== null && <PricingModal item={PRICING[active]} details={getDetails(PRICING[active])} priceKzt={getPrice(PRICING[active]).kzt} priceUsd={getPrice(PRICING[active]).usd} onClose={() => setActive(null)} />}
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  METHOD — механический слайдер + шестерёнки
// ══════════════════════════════════════════════════════════════
function Method() {
  const { idx, prev, next } = useSlider(SMART_STEPS.length);
  const swipe = useSwipe(next, prev);
  return (
    <section id="method" className="bg-[#E8DDD4] py-20 lg:py-28 overflow-hidden relative">
      <div className="absolute -top-16 -right-16 opacity-[0.06] pointer-events-none"><Gear size={320} className="text-[#5C5248]"/></div>
      <div className="absolute -bottom-20 -left-20 opacity-[0.05] pointer-events-none"><Gear size={260} className="text-[#8A7B6C]"/></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <Label>Методология</Label>
            <div className="relative">
              <GhostNum n="06" />
              <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>
                Система<br/><em>S.M.A.R.T. Lifestyle</em>
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={prev} className="w-10 h-10 border border-[#C9A882]/40 flex items-center justify-center text-[#5C5248] hover:bg-[#C9A882]/20 transition-colors"><ChevronLeft size={18}/></button>
            <span className="font-['DM_Sans'] text-[12px] text-[#5C5248]/40">{idx+1} / {SMART_STEPS.length}</span>
            <button onClick={next} className="w-10 h-10 border border-[#C9A882]/40 flex items-center justify-center text-[#5C5248] hover:bg-[#C9A882]/20 transition-colors"><ChevronRight size={18}/></button>
          </div>
        </FadeIn>

        {/* Прогресс */}
        <div className="flex gap-1 mb-10">
          {SMART_STEPS.map((_,i)=>(
            <div key={i} className="h-px flex-1 transition-all duration-500" style={{ background: i===idx ? "#8A7B6C" : "#C9A882", opacity: i===idx ? 1 : 0.3 }}/>
          ))}
        </div>

        {/* Механический слайдер */}
        <MechanicalSlider idx={idx} onNext={next} onPrev={prev}>
          {SMART_STEPS.map((s,i)=>(
            <div key={i} className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-20 items-start bg-[#E8DDD4] relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#5C5248] flex items-center justify-center shrink-0">
                  <span className="font-['Cormorant_Garamond'] text-3xl lg:text-4xl font-normal text-[#C9A882]">{s.letter}</span>
                </div>
                <div>
                  <p className="font-['Bebas_Neue'] text-[12px] tracking-[0.18em] text-[#8A7B6C] mb-1">Шаг 0{i+1} из 5 · {s.abbr}</p>
                  <h3 className="font-['Cormorant_Garamond'] text-[22px] lg:text-[26px] font-normal text-[#5C5248]">{s.ru}</h3>
                </div>
              </div>
              <div>
                <p className="font-['DM_Sans'] text-[14px] lg:text-[15px] text-[#5C5248]/70 leading-[1.75]">{s.desc}</p>
              </div>
            </div>
          ))}
        </MechanicalSlider>

        <div className="flex items-center gap-2 mt-10">
          {SMART_STEPS.map((_,i)=>(
            <div key={i} style={{ width: i===idx ? "28px" : "6px", height:"1.5px", background: i===idx ? "#8A7B6C" : "#C9A882", opacity: i===idx ? 1 : 0.4, transition:"all 1500ms cubic-bezier(0.76,0,0.24,1)" }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  FAQ
// ══════════════════════════════════════════════════════════════
function FaqSection() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <section id="faq" className="bg-[#F3EDE6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <FadeIn className="lg:sticky lg:top-32 self-start">
            <Label>FAQ</Label>
            <div className="relative">
              <GhostNum n="07" />
              <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>
                Частые<br/>вопросы
              </h2>
            </div>
            <div className="w-8 h-px bg-[#C9A882] mt-8 mb-6"/>
            <a href={SITE.whatsapp} className="inline-flex items-center gap-2 font-['DM_Sans'] text-[12px] tracking-[0.12em] uppercase text-[#5C5248]/55 hover:text-[#5C5248] transition-colors">
              <MessageCircle size={14}/> Задать вопрос
            </a>
          </FadeIn>
          <div>
            {FAQ_ITEMS.map((f,i)=>(
              <div key={i} className="border-t border-[#E8DDD4]">
                <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-start justify-between py-6 text-left gap-6 group">
                  <span className="font-['Cormorant_Garamond'] text-[20px] font-normal text-[#5C5248] leading-snug group-hover:text-[#8A7B6C] transition-colors">{f.q}</span>
                  {open===i ? <ChevronUp size={16} className="text-[#8A7B6C] shrink-0 mt-1"/> : <ChevronDown size={16} className="text-[#8A7B6C] shrink-0 mt-1"/>}
                </button>
                {open===i && <div className="pb-6"><p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/60 leading-relaxed max-w-lg">{f.a}</p></div>}
              </div>
            ))}
            <div className="border-t border-[#E8DDD4]"/>
          </div>
        </div>
      </div>
    </section>
  );
}

function ConsentCheckbox({
  checked,
  onChange,
  light = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  light?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <input
        type="checkbox"
        required
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A882]"
      />
      <span className={`font-['DM_Sans'] text-[11px] leading-relaxed ${light ? "text-[#F3EDE6]/55" : "text-[#5C5248]/55"}`}>
        Я ознакомился(ась) и соглашаюсь с{" "}
        <button
          type="button"
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            openPrivacy();
          }}
          className={`underline underline-offset-2 transition-colors ${light ? "text-[#C9A882] hover:text-[#F3EDE6]" : "text-[#8A7B6C] hover:text-[#5C5248]"}`}
        >
          Политикой конфиденциальности
        </button>{" "}
        и обработкой персональных данных.
      </span>
    </label>
  );
}

function PrivacyModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener(PRIVACY_EVENT, handleOpen);
    return () => window.removeEventListener(PRIVACY_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-end lg:items-center justify-center p-0 lg:p-8" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-[#40382F]/75 backdrop-blur-sm" />
      <article
        className="relative z-10 w-full lg:max-w-3xl max-h-[94vh] overflow-y-auto bg-[#F3EDE6] px-7 py-8 lg:px-12 lg:py-11"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Закрыть политику конфиденциальности"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-[#5C5248]/45 hover:text-[#5C5248] transition-colors"
        >
          <X size={20}/>
        </button>

        <Label>Конфиденциальность</Label>
        <h2 className="font-['Cormorant_Garamond'] text-[30px] lg:text-[42px] font-normal text-[#5C5248] leading-[1.05] pr-10">
          Политика обработки персональных данных
        </h2>
        <div className="w-10 h-px bg-[#C9A882] mt-6 mb-7"/>

        <div className="space-y-7 font-['DM_Sans'] text-[13px] leading-[1.75] text-[#5C5248]/70">
          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">1. Общие положения</p>
            <p>
              Настоящая политика описывает, какие данные получает сайт S.M.A.R.T. Lifestyle при отправке заявки,
              для каких целей они используются и какие сервисы участвуют в обработке. Администратор сайта:
              S.M.A.R.T. Lifestyle, Алматы. Контактный телефон: {SITE.phone}.
            </p>
          </section>

          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">2. Какие данные мы получаем</p>
            <p>
              Имя, номер телефона, текст обращения, выбранная услуга или блок сайта, адрес страницы, рекламные
              параметры UTM и gclid, а также дата, время и версия согласия с настоящей политикой.
            </p>
          </section>

          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">3. Для чего используются данные</p>
            <p>
              Для связи с пользователем, обработки запроса и записи на консультацию, определения источника заявки,
              анализа эффективности сайта и рекламы, а также улучшения работы сайта и качества коммуникации.
            </p>
          </section>

          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">4. Используемые сервисы</p>
            <p>
              Данные заявки сохраняются в Supabase. Для внутреннего уведомления о новой заявке используется Telegram.
              Для аналитики посещений и события отправки заявки используется Google Analytics 4. Эти сервисы могут
              обрабатывать технические данные в соответствии со своими условиями и политиками.
            </p>
          </section>

          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">5. Хранение и отзыв согласия</p>
            <p>
              Данные хранятся в объеме, необходимом для обработки обращения и связанных с ним целей. Пользователь
              может обратиться через указанные на сайте контакты, чтобы запросить уточнение, изменение или удаление
              предоставленных данных, а также отозвать согласие в пределах применимых требований.
            </p>
          </section>

          <section>
            <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.16em] uppercase text-[#8A7B6C] mb-2">6. Согласие</p>
            <p>
              Установка отметки в форме и последующая отправка заявки означает, что пользователь ознакомился с
              настоящей политикой и дает согласие на обработку переданных персональных данных для указанных целей.
            </p>
          </section>
        </div>

        <div className="mt-9 pt-6 border-t border-[#E8DDD4] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-['DM_Sans'] text-[11px] text-[#5C5248]/40">Версия политики: {PRIVACY_VERSION}</p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.16em] px-7 py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors"
          >
            Ознакомился(ась)
          </button>
        </div>
      </article>
    </div>
  );
}

function BookingModal() {
  const [open, setOpen] = useState(false);
  const [context, setContext] = useState<BookingContext | null>(null);
  const [form, setForm] = useState({ name:"", phone:PHONE_PREFIX, message:"", website:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [consent, setConsent] = useState(false);
  const leadRequestId = useRef(createLeadRequestId());

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const detail = (event as CustomEvent<BookingContext>).detail;
      if (!detail?.source) return;
      leadRequestId.current = createLeadRequestId();
      setContext(detail);
      setForm({ name:"", phone:PHONE_PREFIX, message:"", website:"" });
      setSent(false);
      setSending(false);
      setSubmitError("");
      setConsent(false);
      setOpen(true);
    };

    window.addEventListener(BOOKING_EVENT, handleOpen);
    return () => window.removeEventListener(BOOKING_EVENT, handleOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  if (!open || !context) return null;

  const leadSource = formatBookingSource(context);
  const close = () => {
    if (sending) return;
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !consent || !isValidPhone(form.phone)) return;

    setSending(true);
    setSubmitError("");

    try {
      const attribution = getLeadAttribution();
      const result = await submitLead({
        requestId: leadRequestId.current,
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim() || undefined,
        website: form.website,
        ...attribution,
        source: leadSource,
        consentAccepted: consent,
        consentVersion: PRIVACY_VERSION,
      });

      trackLeadConversion({
        leadId: result.leadId,
        source: leadSource,
      });
      setSent(true);
    } catch (error) {
      console.error("Lead submit failed", error);
      setSubmitError("Не удалось отправить заявку. Попробуйте еще раз или свяжитесь с нами через WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-8" onClick={close}>
      <div className="absolute inset-0 bg-[#40382F]/65 backdrop-blur-sm" />
      <div
        className="relative z-10 bg-[#F3EDE6] w-full lg:max-w-xl max-h-[92vh] overflow-y-auto p-7 lg:p-10"
        onClick={e => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Закрыть форму"
          className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center text-[#5C5248]/50 hover:text-[#5C5248] transition-colors"
        >
          <X size={20}/>
        </button>

        <Label>Запись</Label>
        <h3 className="font-['Cormorant_Garamond'] text-[30px] lg:text-[36px] font-normal text-[#5C5248] leading-tight mb-3">
          Оставьте заявку
        </h3>
        <p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/55 leading-relaxed mb-6">
          Мы свяжемся с вами и уточним удобное время.
        </p>

        {sent ? (
          <div className="py-8">
            <Check size={28} className="text-[#C9A882] mb-4"/>
            <p className="font-['Cormorant_Garamond'] text-[25px] text-[#5C5248] mb-2">Заявка отправлена</p>
            <p className="font-['DM_Sans'] text-[13px] text-[#5C5248]/55">Свяжемся с вами в ближайшее время.</p>
            <button type="button" onClick={close}
              className="mt-7 w-full border border-[#C9A882]/50 text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.16em] py-3.5 hover:bg-[#E8DDD4] transition-colors">
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
              <label htmlFor="booking-website">Website</label>
              <input
                id="booking-website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={e => setForm(v => ({ ...v, website: e.target.value }))}
              />
            </div>

            <div>
              <label htmlFor="booking-name" className="font-['Bebas_Neue'] text-[12px] tracking-[0.16em] text-[#8A7B6C] block mb-2">Имя</label>
              <input
                id="booking-name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                placeholder="Как к вам обращаться"
                onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                className="w-full bg-transparent border-b border-[#5C5248]/15 text-[#5C5248] placeholder-[#5C5248]/30 font-['DM_Sans'] text-[16px] py-3 focus:outline-none focus:border-[#C9A882] transition-colors"
              />
              {form.phone.length === 18 && isObviousFakePhone(form.phone) && (
                <p className="font-['DM_Sans'] text-[11px] text-red-700/70 mt-2">Проверьте номер телефона</p>
              )}
            </div>

            <div>
              <label htmlFor="booking-phone" className="font-['Bebas_Neue'] text-[12px] tracking-[0.16em] text-[#8A7B6C] block mb-2">Телефон</label>
              <input
                id="booking-phone"
                type="tel"
                required
                inputMode="numeric"
                autoComplete="tel"
                value={form.phone}
                maxLength={18}
                pattern="^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$"
                title="Введите номер полностью: +7 (___) ___-__-__"
                onFocus={e => {
                  const end = e.currentTarget.value.length;
                  requestAnimationFrame(() => e.currentTarget.setSelectionRange(end, end));
                }}
                onChange={e => setForm(v => ({ ...v, phone: formatPhone(e.target.value) }))}
                className="w-full bg-transparent border-b border-[#5C5248]/15 text-[#5C5248] placeholder-[#5C5248]/30 font-['DM_Sans'] text-[16px] py-3 focus:outline-none focus:border-[#C9A882] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="booking-message" className="font-['Bebas_Neue'] text-[12px] tracking-[0.16em] text-[#8A7B6C] block mb-2">Запрос (необязательно)</label>
              <textarea
                id="booking-message"
                rows={3}
                value={form.message}
                placeholder="Коротко — с чем хотите разобраться..."
                onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                className="w-full bg-transparent border-b border-[#5C5248]/15 text-[#5C5248] placeholder-[#5C5248]/30 font-['DM_Sans'] text-[16px] py-3 focus:outline-none focus:border-[#C9A882] transition-colors resize-none"
              />
            </div>

            <div className="pt-1">
              <ConsentCheckbox checked={consent} onChange={setConsent} />
            </div>

            <button type="submit" disabled={sending || !consent || !isValidPhone(form.phone)}
              className="w-full bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.18em] py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors disabled:opacity-45 disabled:cursor-not-allowed">
              {sending ? "Отправляем..." : "Отправить заявку"}
            </button>

            {submitError && (
              <p className="font-['DM_Sans'] text-[12px] leading-relaxed text-red-700/80" role="alert">{submitError}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  CONTACTS
// ══════════════════════════════════════════════════════════════
function Contacts() {
  const [form, setForm] = useState({ name:"", phone:PHONE_PREFIX, message:"", website:"" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [consent, setConsent] = useState(false);
  const leadRequestId = useRef(createLeadRequestId());

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending || !consent || !isValidPhone(form.phone)) return;

    setSending(true);
    setSubmitError("");

    try {
      const attribution = getLeadAttribution();
      const leadSource = "Контакты · форма внизу сайта";
      const result = await submitLead({
        requestId: leadRequestId.current,
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim() || undefined,
        website: form.website,
        ...attribution,
        source: leadSource,
        consentAccepted: consent,
        consentVersion: PRIVACY_VERSION,
      });

      trackLeadConversion({
        leadId: result.leadId,
        source: leadSource,
      });
      setSent(true);
    } catch (error) {
      console.error("Lead submit failed", error);
      setSubmitError("Не удалось отправить заявку. Попробуйте еще раз или напишите нам в WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacts" className="bg-[#5C5248]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative hidden lg:block">
          <ImageWithFallback src={photoContacts} alt="Записаться на психологическую консультацию в Алматы — S.M.A.R.T. Lifestyle" className="w-full h-full object-cover object-top min-h-[600px]" />
          <div className="absolute inset-0 bg-[#5C5248]/40"/>
          <div className="absolute bottom-14 left-12 right-12">
            <p className="font-['Cormorant_Garamond'] italic font-normal text-[#F3EDE6] leading-[1.1]" style={{ fontSize:"clamp(24px,2.8vw,40px)" }}>
              Начните изменения<br/>уже сегодня
            </p>
            <div className="w-8 h-px bg-[#C9A882] mt-5"/>
          </div>
        </div>
        <div className="px-8 lg:px-14 py-16 lg:py-20">
          <Label light>Контакты</Label>
          <h2 className="font-['Cormorant_Garamond'] font-normal text-[#F3EDE6] leading-[1.05] mb-10" style={{ fontSize:"clamp(28px,3.2vw,44px)" }}>
            Сделайте<br/>первый шаг
          </h2>
          {sent ? (
            <div className="py-10 border-t border-[#F3EDE6]/10">
              <Check size={28} className="text-[#C9A882] mb-5"/>
              <p className="font-['Cormorant_Garamond'] text-[24px] font-normal text-[#F3EDE6] mb-3">Заявка отправлена</p>
              <p className="font-['DM_Sans'] text-[13px] text-[#F3EDE6]/50">Свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-5">
              <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="contact-name" className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/60 block mb-2">Имя</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  placeholder="Как к вам обращаться"
                  onChange={e => setForm(v => ({ ...v, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-[#F3EDE6]/15 text-[#F3EDE6] placeholder-[#F3EDE6]/20 font-['DM_Sans'] text-[14px] py-3 focus:outline-none focus:border-[#C9A882]/50 transition-colors"
                />
                {form.phone.length === 18 && isObviousFakePhone(form.phone) && (
                  <p className="font-['DM_Sans'] text-[11px] text-red-300/80 mt-2">Проверьте номер телефона</p>
                )}
              </div>
              <div>
                <label htmlFor="contact-phone" className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/60 block mb-2">Телефон</label>
                <input
                  id="contact-phone"
                  type="tel"
                  required
                  inputMode="numeric"
                  autoComplete="tel"
                  value={form.phone}
                  maxLength={18}
                  pattern="^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$"
                  title="Введите номер полностью: +7 (___) ___-__-__"
                  onFocus={e => {
                    const end = e.currentTarget.value.length;
                    requestAnimationFrame(() => e.currentTarget.setSelectionRange(end, end));
                  }}
                  onChange={e => setForm(v => ({ ...v, phone: formatPhone(e.target.value) }))}
                  className="w-full bg-transparent border-b border-[#F3EDE6]/15 text-[#F3EDE6] placeholder-[#F3EDE6]/20 font-['DM_Sans'] text-[14px] py-3 focus:outline-none focus:border-[#C9A882]/50 transition-colors"
                />
              </div>
              <div>
                <label className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/60 block mb-2">Запрос (необязательно)</label>
                <textarea rows={3} value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
                  placeholder="Коротко — с чем хотите разобраться..."
                  className="w-full bg-transparent border-b border-[#F3EDE6]/15 text-[#F3EDE6] placeholder-[#F3EDE6]/20 font-['DM_Sans'] text-[14px] py-3 focus:outline-none focus:border-[#C9A882]/50 transition-colors resize-none"/>
              </div>
              <div className="pt-3">
                <div className="mb-4">
                  <ConsentCheckbox checked={consent} onChange={setConsent} light />
                </div>
                <button
                  type="submit"
                  disabled={sending || !consent || !isValidPhone(form.phone)}
                  className="w-full bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.18em] py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  {sending ? "Отправляем..." : "Отправить заявку"}
                </button>
                {submitError && (
                  <p className="font-['DM_Sans'] text-[12px] leading-relaxed text-[#F3EDE6]/70 mt-3" role="alert">
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          )}
          <div className="mt-10 pt-8 border-t border-[#F3EDE6]/10 flex flex-wrap gap-6">
            <a href={SITE.whatsapp} className="flex items-center gap-3 group">
              <MessageCircle size={15} className="text-[#C9A882]"/>
              <span className="font-['DM_Sans'] text-[11px] tracking-[0.12em] uppercase text-[#F3EDE6]/50 group-hover:text-[#C9A882] transition-colors">WhatsApp</span>
            </a>
            <a href={SITE.telegram} className="flex items-center gap-3 group">
              <MessageCircle size={15} className="text-[#C9A882]"/>
              <span className="font-['DM_Sans'] text-[11px] tracking-[0.12em] uppercase text-[#F3EDE6]/50 group-hover:text-[#C9A882] transition-colors">Telegram</span>
            </a>
            <a href={`tel:+77028779911`} className="flex items-center gap-3 group">
              <Phone size={15} className="text-[#C9A882]"/>
              <span className="font-['DM_Sans'] text-[11px] tracking-[0.12em] uppercase text-[#F3EDE6]/50 group-hover:text-[#C9A882] transition-colors">{SITE.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="bg-[#3D3830] border-t border-[#F3EDE6]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-['Bebas_Neue'] text-[18px] tracking-[0.15em] text-[#F3EDE6]/50">
          S.M.A.R.T. <span className="text-[#8A7B6C]">Lifestyle</span>
        </span>
        <p className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/25">© 2026 · {SITE.city}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[["Метод","#method"],["Специалисты","#experts"],["FAQ","#faq"]].map(([l,h])=>(
            <a key={h} href={h} className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 hover:text-[#F3EDE6]/60 transition-colors">{l}</a>
          ))}
          <button type="button" onClick={openPrivacy}
            className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 hover:text-[#F3EDE6]/60 transition-colors">
            Конфиденциальность
          </button>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
//  CONTACT WIDGET
// ══════════════════════════════════════════════════════════════
function ContactWidget() {
  const [open, setOpen] = useState(false);
  const contacts = [
    { label:"WhatsApp", href: SITE.whatsapp, color:"#25D366", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> },
    { label:"Telegram", href: SITE.telegram, color:"#229ED9", icon:<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg> },
    { label:"Позвонить", href:`tel:+77028779911`, color:"#5C5248", icon:<Phone size={18}/> },
  ];
  return (
    <div className="fixed bottom-6 right-4 lg:right-8 z-50 flex flex-col items-end gap-3">
      <div className="flex flex-col items-end gap-2">
        {contacts.map((c,i)=>(
          <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 shadow-lg"
            style={{ background:"#F3EDE6", border:"1px solid rgba(201,168,130,0.3)", opacity: open ? 1 : 0, transform: open ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)", pointerEvents: open ? "auto" : "none", transition:`opacity 350ms ease ${i*60}ms, transform 350ms ease ${i*60}ms` }}>
            <span className="font-['Bebas_Neue'] text-[13px] tracking-[0.12em] text-[#5C5248]/60 whitespace-nowrap">{c.label}</span>
            <span style={{ color: c.color }}>{c.icon}</span>
          </a>
        ))}
      </div>
      <button onClick={() => setOpen(!open)} className="w-14 h-14 shadow-xl flex items-center justify-center transition-all duration-500" style={{ background: open ? "#5C5248" : "#C9A882", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
        {open ? <X size={20} color="#F3EDE6"/> : <MessageCircle size={22} color="#5C5248"/>}
      </button>
      {!open && <span className="absolute bottom-0 right-0 w-14 h-14 pointer-events-none" style={{ border:"1px solid #C9A882", animation:"ping 2.5s cubic-bezier(0,0,0.2,1) infinite", opacity:0.4 }}/>}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  LANDING PAGE
// ══════════════════════════════════════════════════════════════
function LandingPage() {
  useSEO();
  return (
    <div className="min-h-screen bg-[#F3EDE6]">
      <CustomCursor/>
      <header><Nav/></header>
      <main>
        <Hero/>
        <Statement/>
        <Stats/>
        <StatsToProblemsTransition/>
        <Problems/>
        <Formats/>
        <Experts/>
        <Reviews/>
        <Pricing/>
        <Method/>
        <FaqSection/>
        <Contacts/>
      </main>
      <footer><Footer/></footer>
      <ContactWidget/>
      <BookingModal/>
      <PrivacyModal/>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  ADMIN — панель управления (Supabase Auth)
// ══════════════════════════════════════════════════════════════

// ── Спиннер загрузки ─────────────────────────────────────────
function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div style={{ width:28, height:28, border:"2px solid #C9A882", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── Вход через Supabase Auth ──────────────────────────────────
function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    setLoading(false);
    if (error) setErr(error.message === "Invalid login credentials" ? "Неверный email или пароль" : error.message);
    else onAuth();
  };

  return (
    <div className="min-h-screen bg-[#2A2520] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="font-['Bebas_Neue'] text-[22px] tracking-[0.2em] text-[#C9A882] mb-1">S.M.A.R.T. Lifestyle</p>
        <p className="font-['DM_Sans'] text-[13px] text-[#F3EDE6]/30 mb-10 tracking-[0.08em]">Панель управления</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 block mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="admin@example.com"
              className="w-full bg-[#3D3830] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[14px] px-5 py-3.5 placeholder-[#F3EDE6]/20 focus:outline-none focus:border-[#C9A882]/50 transition-colors" />
          </div>
          <div>
            <label className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 block mb-2">Пароль</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} required
              placeholder="••••••••"
              className="w-full bg-[#3D3830] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[14px] px-5 py-3.5 placeholder-[#F3EDE6]/20 focus:outline-none focus:border-[#C9A882]/50 transition-colors" />
          </div>
          {err && <p className="font-['DM_Sans'] text-[12px] text-red-400">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-[#C9A882] text-[#2A2520] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors disabled:opacity-50">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Главная панель ────────────────────────────────────────────
function AdminPanel() {
  const [tab, setTab] = useState<"reviews" | "pricing">("reviews");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const logout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  const tabCls = (t: string) =>
    `font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-5 py-2.5 transition-colors ${tab === t ? "bg-[#C9A882] text-[#2A2520]" : "text-[#F3EDE6]/40 hover:text-[#F3EDE6]/80"}`;

  // ── REVIEWS ──
  const [reviews, setReviews] = useState<SupabaseReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ name: "", specialist: "", text: "" });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const loadReviewsAdmin = useCallback(async () => {
    setReviewsLoading(true);
    try { setReviews(await fetchAllReviews()); }
    catch (e: any) { showToast("Ошибка загрузки: " + e.message); }
    finally { setReviewsLoading(false); }
  }, []);

  useEffect(() => { if (tab === "reviews") loadReviewsAdmin(); }, [tab, loadReviewsAdmin]);

  const handleAddReview = async () => {
    if (!newReview.name.trim() || !newReview.text.trim()) return;
    setSaving(true);
    try {
      await addReview({
        name: newReview.name.trim(),
        specialist: newReview.specialist.trim() || "S.M.A.R.T. Lifestyle",
        text: newReview.text.trim(),
        sort_order: reviews.length,
        is_active: true,
      });
      setNewReview({ name: "", specialist: "", text: "" });
      await loadReviewsAdmin();
      showToast("Отзыв добавлен");
    } catch (e: any) { showToast("Ошибка: " + e.message); }
    finally { setSaving(false); }
  };

  const handleToggleReview = async (r: SupabaseReview) => {
    try {
      await updateReview(r.id, { is_active: !r.is_active });
      setReviews(prev => prev.map(x => x.id === r.id ? { ...x, is_active: !r.is_active } : x));
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast("Удалено");
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleMoveReview = async (id: string, dir: -1 | 1) => {
    const arr = [...reviews];
    const i = arr.findIndex(r => r.id === id);
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setReviews(arr);
    try { await reorderReviews(arr.map(r => r.id)); }
    catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleSaveEditReview = async (id: string) => {
    try {
      await updateReview(id, { text: editText });
      setReviews(prev => prev.map(r => r.id === id ? { ...r, text: editText } : r));
      setEditingReview(null);
      showToast("Сохранено");
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  // ── PRICING PLANS (цены) ──
  const [pricePlans, setPricePlans] = useState<PricingPlan[]>([]);
  const handleUpdatePrice = async (plan_id: string, field: "price_kzt" | "price_usd", value: string) => {
    setPricePlans(prev => prev.map(p => p.plan_id === plan_id ? { ...p, [field]: value } : p));
    try { await updatePricingPlan(plan_id, { [field]: value }); showToast("Цена обновлена"); }
    catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  // ── PRICING CONDITIONS ──
  const [conditions, setConditions] = useState<PricingCondition[]>([]);
  const [condLoading, setCondLoading] = useState(true);
  const [newCond, setNewCond] = useState<{ [planId: string]: string }>({});

  const loadConditions = useCallback(async () => {
    setCondLoading(true);
    try {
      const [conds, plans] = await Promise.all([fetchAllPricingConditions(), fetchPricingPlans()]);
      setConditions(conds);
      setPricePlans(plans);
    }
    catch (e: any) { showToast("Ошибка загрузки: " + e.message); }
    finally { setCondLoading(false); }
  }, []);

  useEffect(() => { if (tab === "pricing") loadConditions(); }, [tab, loadConditions]);

  const handleAddCond = async (planId: string) => {
    const text = (newCond[planId] ?? "").trim();
    if (!text) return;
    const planItems = conditions.filter(c => c.plan_id === planId);
    try {
      await addPricingCondition({ plan_id: planId, text, sort_order: planItems.length, is_active: true });
      setNewCond(prev => ({ ...prev, [planId]: "" }));
      await loadConditions();
      showToast("Добавлено");
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleUpdateCond = async (id: string, text: string) => {
    try {
      await updatePricingCondition(id, { text });
      setConditions(prev => prev.map(c => c.id === id ? { ...c, text } : c));
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleToggleCond = async (c: PricingCondition) => {
    try {
      await updatePricingCondition(c.id, { is_active: !c.is_active });
      setConditions(prev => prev.map(x => x.id === c.id ? { ...x, is_active: !c.is_active } : x));
    } catch { /* ignore */ }
  };

  const handleDeleteCond = async (id: string) => {
    if (!confirm("Удалить пункт?")) return;
    try {
      await deletePricingCondition(id);
      setConditions(prev => prev.filter(c => c.id !== id));
      showToast("Удалено");
    } catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  const handleMoveCond = async (id: string, dir: -1 | 1) => {
    const planId = conditions.find(c => c.id === id)?.plan_id;
    const planItems = conditions.filter(c => c.plan_id === planId);
    const i = planItems.findIndex(c => c.id === id);
    const j = i + dir;
    if (j < 0 || j >= planItems.length) return;
    const newOrder = [...planItems];
    [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    const merged = conditions.map(c => {
      const found = newOrder.find(n => n.id === c.id);
      return found ?? c;
    });
    setConditions(merged);
    try { await reorderPricingConditions(newOrder.map(c => c.id)); }
    catch (e: any) { showToast("Ошибка: " + e.message); }
  };

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#2A2520] flex flex-col">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-[#C9A882] text-[#2A2520] font-['DM_Sans'] text-[13px] px-5 py-3 shadow-lg" style={{ animation:"fadeIn 0.3s ease" }}>
          {toast}
          <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#221E1A] border-b border-[#F3EDE6]/8 px-6 lg:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="/" className="font-['Bebas_Neue'] text-[18px] tracking-[0.15em] text-[#C9A882]">S.M.A.R.T. Lifestyle</a>
          <span className="text-[#F3EDE6]/20 text-[10px] font-['DM_Sans'] tracking-[0.15em] uppercase border border-[#F3EDE6]/10 px-2 py-0.5">Admin</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="/" target="_blank" className="font-['DM_Sans'] text-[12px] text-[#F3EDE6]/30 hover:text-[#F3EDE6]/70 transition-colors">Сайт ↗</a>
          <button onClick={logout} className="font-['DM_Sans'] text-[12px] text-[#F3EDE6]/30 hover:text-red-400 transition-colors">Выйти</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#2A2520] border-b border-[#F3EDE6]/8 px-6 lg:px-10 flex gap-1 pt-4">
        <button className={tabCls("reviews")} onClick={() => setTab("reviews")}>Отзывы</button>
        <button className={tabCls("pricing")} onClick={() => setTab("pricing")}>Условия</button>
      </div>

      <div className="flex-1 px-6 lg:px-10 py-8 max-w-4xl">

        {/* ── REVIEWS TAB ── */}
        {tab === "reviews" && (
          <div>
            <p className="font-['Cormorant_Garamond'] text-[28px] text-[#F3EDE6] font-normal mb-8">
              Отзывы
              {!reviewsLoading && <span className="text-[#C9A882] font-['DM_Sans'] text-[16px] font-normal ml-3">{reviews.length} шт.</span>}
            </p>

            {/* Add */}
            <div className="bg-[#3D3830] border border-[#F3EDE6]/8 p-6 mb-8">
              <p className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/70 mb-5">Добавить отзыв</p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 block mb-2">Имя *</label>
                  <input value={newReview.name} onChange={e => setNewReview(r => ({ ...r, name: e.target.value }))}
                    placeholder="Например: Алия"
                    className="w-full bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#C9A882]/40 transition-colors placeholder-[#F3EDE6]/20" />
                </div>
                <div>
                  <label className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 block mb-2">Специалист</label>
                  <input value={newReview.specialist} onChange={e => setNewReview(r => ({ ...r, specialist: e.target.value }))}
                    placeholder="Рината Исламова / Антон Исламов"
                    className="w-full bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#C9A882]/40 transition-colors placeholder-[#F3EDE6]/20" />
                </div>
              </div>
              <div className="mb-4">
                <label className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 block mb-2">Текст отзыва *</label>
                <textarea value={newReview.text} onChange={e => setNewReview(r => ({ ...r, text: e.target.value }))}
                  rows={4} placeholder="Текст отзыва..."
                  className="w-full bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-4 py-2.5 focus:outline-none focus:border-[#C9A882]/40 transition-colors resize-none placeholder-[#F3EDE6]/20" />
              </div>
              <button onClick={handleAddReview} disabled={saving}
                className="bg-[#C9A882] text-[#2A2520] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-6 py-2.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors disabled:opacity-50">
                {saving ? "Сохранение..." : "Добавить"}
              </button>
            </div>

            {/* List */}
            {reviewsLoading ? <Spinner /> : (
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={r.id} className={`bg-[#3D3830] border p-5 transition-opacity ${r.is_active ? "border-[#F3EDE6]/8" : "border-[#F3EDE6]/4 opacity-50"}`}>
                    <div className="flex items-start gap-3">
                      {/* Order */}
                      <div className="flex flex-col gap-1 pt-0.5 shrink-0">
                        <button onClick={() => handleMoveReview(r.id, -1)} disabled={i === 0}
                          className="text-[#F3EDE6]/20 hover:text-[#C9A882] transition-colors disabled:opacity-20">
                          <ChevronUp size={14}/>
                        </button>
                        <button onClick={() => handleMoveReview(r.id, 1)} disabled={i === reviews.length - 1}
                          className="text-[#F3EDE6]/20 hover:text-[#C9A882] transition-colors disabled:opacity-20">
                          <ChevronDown size={14}/>
                        </button>
                      </div>
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-['Bebas_Neue'] text-[14px] tracking-[0.15em] text-[#C9A882]">{r.name}</span>
                          <span className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/30">·</span>
                          <span className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/40 truncate">{r.specialist}</span>
                        </div>
                        {editingReview === r.id ? (
                          <div>
                            <textarea value={editText} onChange={e => setEditText(e.target.value)} rows={4}
                              className="w-full bg-[#2A2520] border border-[#C9A882]/40 text-[#F3EDE6] font-['DM_Sans'] text-[12px] px-3 py-2 focus:outline-none resize-none mb-2" />
                            <div className="flex gap-3">
                              <button onClick={() => handleSaveEditReview(r.id)}
                                className="font-['Bebas_Neue'] text-[12px] tracking-[0.12em] bg-[#C9A882] text-[#2A2520] px-4 py-1.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                                Сохранить
                              </button>
                              <button onClick={() => setEditingReview(null)}
                                className="font-['DM_Sans'] text-[12px] text-[#F3EDE6]/30 hover:text-[#F3EDE6]/60 transition-colors">
                                Отмена
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="font-['DM_Sans'] text-[12px] text-[#F3EDE6]/50 leading-relaxed line-clamp-2">{r.text}</p>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => { setEditingReview(r.id); setEditText(r.text); }}
                          title="Редактировать"
                          className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/25 hover:text-[#C9A882] transition-colors px-1">
                          ✎
                        </button>
                        <button onClick={() => handleToggleReview(r)}
                          title={r.is_active ? "Скрыть" : "Показать"}
                          className={`w-9 h-5 rounded-full transition-colors ${r.is_active ? "bg-[#C9A882]" : "bg-[#F3EDE6]/10"}`}
                          style={{ position:"relative" }}>
                          <span className="absolute top-0.5 transition-all"
                            style={{ left: r.is_active ? "calc(100% - 18px)" : "2px", width:16, height:16, background:"#F3EDE6", borderRadius:"50%", display:"block" }}/>
                        </button>
                        <button onClick={() => handleDeleteReview(r.id)}
                          className="text-[#F3EDE6]/20 hover:text-red-400 transition-colors p-1">
                          <X size={15}/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PRICING TAB ── */}
        {tab === "pricing" && (
          <div>
            <p className="font-['Cormorant_Garamond'] text-[28px] text-[#F3EDE6] font-normal mb-8">Условия консультаций</p>
            {condLoading ? <Spinner /> : (
              <div className="space-y-8">
                {PRICING.map(plan => {
                  const planItems = conditions.filter(c => c.plan_id === plan.planId);
                  return (
                    <div key={plan.planId} className="bg-[#3D3830] border border-[#F3EDE6]/8 p-6">
                      <p className="font-['Bebas_Neue'] text-[16px] tracking-[0.15em] text-[#C9A882]">{plan.title}</p>
                      <p className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/30 mt-0.5 mb-4">{plan.duration}</p>
                      {/* Редактирование цен */}
                      {(() => {
                        const pp = pricePlans.find(p => p.plan_id === plan.planId);
                        if (!pp) return null;
                        return (
                          <div className="flex gap-3 mb-4">
                            <div className="flex-1">
                              <label className="font-['DM_Sans'] text-[10px] tracking-[0.1em] uppercase text-[#F3EDE6]/25 block mb-1">Цена (₸)</label>
                              <input value={pp.price_kzt}
                                onChange={e => setPricePlans(prev => prev.map(p => p.plan_id === plan.planId ? { ...p, price_kzt: e.target.value } : p))}
                                onBlur={e => handleUpdatePrice(plan.planId, "price_kzt", e.target.value)}
                                className="w-full bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-3 py-2 focus:outline-none focus:border-[#C9A882]/40 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <label className="font-['DM_Sans'] text-[10px] tracking-[0.1em] uppercase text-[#F3EDE6]/25 block mb-1">Цена ($)</label>
                              <input value={pp.price_usd}
                                onChange={e => setPricePlans(prev => prev.map(p => p.plan_id === plan.planId ? { ...p, price_usd: e.target.value } : p))}
                                onBlur={e => handleUpdatePrice(plan.planId, "price_usd", e.target.value)}
                                className="w-full bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-3 py-2 focus:outline-none focus:border-[#C9A882]/40 transition-colors" />
                            </div>
                          </div>
                        );
                      })()}
                      <div className="w-8 h-px bg-[#C9A882]/30 mb-5"/>

                      <div className="space-y-2 mb-4">
                        {planItems.map((c, i) => (
                          <div key={c.id} className={`flex items-center gap-2 transition-opacity ${c.is_active ? "" : "opacity-40"}`}>
                            {/* Order */}
                            <div className="flex flex-col gap-0.5 shrink-0">
                              <button onClick={() => handleMoveCond(c.id, -1)} disabled={i === 0}
                                className="text-[#F3EDE6]/20 hover:text-[#C9A882] transition-colors disabled:opacity-20">
                                <ChevronUp size={12}/>
                              </button>
                              <button onClick={() => handleMoveCond(c.id, 1)} disabled={i === planItems.length - 1}
                                className="text-[#F3EDE6]/20 hover:text-[#C9A882] transition-colors disabled:opacity-20">
                                <ChevronDown size={12}/>
                              </button>
                            </div>
                            <span className="text-[#C9A882]/40 text-[10px] shrink-0">◈</span>
                            <input value={c.text}
                              onChange={e => setConditions(prev => prev.map(x => x.id === c.id ? { ...x, text: e.target.value } : x))}
                              onBlur={e => handleUpdateCond(c.id, e.target.value)}
                              className="flex-1 bg-[#2A2520] border border-[#F3EDE6]/10 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-3 py-2 focus:outline-none focus:border-[#C9A882]/40 transition-colors" />
                            <button onClick={() => handleToggleCond(c)} title={c.is_active ? "Скрыть" : "Показать"}
                              className={`w-8 h-4 rounded-full shrink-0 transition-colors ${c.is_active ? "bg-[#C9A882]" : "bg-[#F3EDE6]/10"}`}
                              style={{ position:"relative" }}>
                              <span style={{ position:"absolute", top:2, left: c.is_active ? "calc(100% - 14px)" : 2, width:12, height:12, background:"#F3EDE6", borderRadius:"50%", transition:"left 0.2s" }}/>
                            </button>
                            <button onClick={() => handleDeleteCond(c.id)}
                              className="shrink-0 text-[#F3EDE6]/20 hover:text-red-400 transition-colors">
                              <X size={14}/>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add condition */}
                      <div className="flex gap-2">
                        <input
                          value={newCond[plan.planId] ?? ""}
                          onChange={e => setNewCond(prev => ({ ...prev, [plan.planId]: e.target.value }))}
                          onKeyDown={e => { if (e.key === "Enter") handleAddCond(plan.planId); }}
                          placeholder="Новый пункт..."
                          className="flex-1 bg-[#2A2520] border border-dashed border-[#C9A882]/20 text-[#F3EDE6] font-['DM_Sans'] text-[13px] px-3 py-2 focus:outline-none focus:border-[#C9A882]/40 transition-colors placeholder-[#F3EDE6]/20" />
                        <button onClick={() => handleAddCond(plan.planId)}
                          className="font-['Bebas_Neue'] text-[13px] tracking-[0.12em] text-[#2A2520] bg-[#C9A882] px-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Admin() {
  const [session, setSession] = useState<any>(undefined);

  useEffect(() => {
    document.body.setAttribute("data-admin", "1");
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => {
      subscription.unsubscribe();
      document.body.removeAttribute("data-admin");
    };
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen bg-[#2A2520] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!session) return <AdminLogin onAuth={() => {}} />;
  return <AdminPanel />;
}

// ══════════════════════════════════════════════════════════════
//  APP — маршрутизатор
// ══════════════════════════════════════════════════════════════
const router = createBrowserRouter([
  { path: "/", Component: LandingPage },
  { path: "/admin", Component: Admin },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
