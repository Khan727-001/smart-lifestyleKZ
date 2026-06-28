/**
 * ============================================================
 *  SMART LIFESTYLE — Landing Page
 * ============================================================
 *
 *  КАК РЕДАКТИРОВАТЬ САЙТ
 *  ──────────────────────
 *  Весь контент сосредоточен в константах в самом начале файла
 *  (до строки ~120). Ниже идут компоненты — их трогать не нужно.
 *
 *  ФОТОГРАФИИ
 *  ──────────
 *  Замените файлы в папке src/imports/ на новые с теми же именами,
 *  либо измените строки импорта ниже (import photo... from "...").
 *  Поддерживаются форматы: .jpg, .jpeg, .png, .webp
 *
 *  ЦВЕТА
 *  ─────
 *  Палитра задана в src/styles/theme.css
 *  Основные цвета сайта (используются напрямую в коде):
 *    #3A2D28  — тёмно-коричневый (фон тёмных блоков, текст)
 *    #A48374  — средний коричневый (акценты, лейблы)
 *    #CBAD8D  — золотистый (кнопки)
 *    #EBE3DB  — светло-бежевый (фон некоторых секций)
 *    #F1EDE6  — молочно-белый (основной фон)
 */

import { useState, useEffect } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

// ─────────────────────────────────────────────────────────────
//  ФОТОГРАФИИ
//  Чтобы заменить фото — положите новый файл в src/imports/
//  и поменяйте путь в строке импорта.
// ─────────────────────────────────────────────────────────────
import photoHero       from "@/imports/653E131D-F5CD-48E2-8824-1B859AF4BDF1.png"; // Главный баннер
import photoContacts   from "@/imports/DDACD5E0-059E-4203-A62E-81DE7BE47B21.png"; // Фото в блоке контактов
import photoAnton      from "@/imports/FF84E886-799A-4F5E-9C49-49F8F497113B.png"; // Фото Антона
import photoRinata     from "@/imports/A4172E07-B57A-49B9-9BC2-FE4877F1E425.png"; // Фото Рината

import { Menu, X, ArrowRight, ChevronDown, ChevronUp, Phone, MessageCircle, Check } from "lucide-react";

// ─────────────────────────────────────────────────────────────
//  ОБЩАЯ ИНФОРМАЦИЯ О КОМПАНИИ
// ─────────────────────────────────────────────────────────────
const SITE = {
  name:       "SMART Lifestyle",
  tagline:    "Глубинная психотерапия · Алматы",
  phone:      "+7 (___) ___-__-__",       // ← вставьте номер телефона
  whatsapp:   "https://wa.me/77001234567", // ← вставьте ссылку на WhatsApp
  city:       "Алматы",
};

// ─────────────────────────────────────────────────────────────
//  ГЛАВНЫЙ БАННЕР (Hero)
// ─────────────────────────────────────────────────────────────
const HERO = {
  heading:  ["Для тех, кто устал", "жить в тревоге", "и напряжении"], // каждая строка — отдельный элемент
  subtext:  "Индивидуальная и групповая терапия по системе SMART Lifestyle. Работаем не с симптомами — с причинами.",
  stats: [
    { number: "17+",   label: "лет практики" },
    { number: "2000+", label: "клиентов"      },
  ],
};

// ─────────────────────────────────────────────────────────────
//  БЛОК «ТЁМНАЯ ЦИТАТА» под главным баннером
// ─────────────────────────────────────────────────────────────
const STATEMENT = {
  text:      "Сначала вы узнаёте себя в проблеме — затем видите результат, выбираете формат и только потом получаете объяснение метода.",
  highlight: "видите результат", // этот кусок текста выделится золотым цветом
  caption:   "Принцип работы SMART Lifestyle",
};

// ─────────────────────────────────────────────────────────────
//  СПИСОК ПРОБЛЕМ (секция «С чем обращаются»)
//  Добавьте или уберите строки по необходимости.
// ─────────────────────────────────────────────────────────────
const PROBLEMS = [
  "Тревога и постоянное внутреннее напряжение",
  "Выгорание — нет сил ни на работу, ни на близких",
  "Конфликты в отношениях, которые повторяются по кругу",
  "Зависимости и саморазрушающее поведение",
  "Низкая самооценка, чужое мнение важнее своего",
  "Семейные конфликты и сложности с родителями или детьми",
  "Финансовые ограничения и самосаботаж",
  "Ощущение тупика — всё правильно, а жизнь не меняется",
];

// ─────────────────────────────────────────────────────────────
//  МЕТОД SMART — 5 шагов
// ─────────────────────────────────────────────────────────────
const SMART_STEPS = [
  { letter: "S", ru: "Стабилизация",   desc: "Снижаем острое напряжение, создаём безопасное пространство" },
  { letter: "M", ru: "Мышление",       desc: "Выявляем и трансформируем ограничивающие убеждения" },
  { letter: "A", ru: "Осознанность",   desc: "Развиваем понимание себя, своих реакций и потребностей" },
  { letter: "R", ru: "Восстановление", desc: "Строим новые здоровые стратегии поведения" },
  { letter: "T", ru: "Трансформация",  desc: "Закрепляем изменения, интегрируем новый опыт в жизнь" },
];

// ─────────────────────────────────────────────────────────────
//  СПЕЦИАЛИСТЫ
//  photo — импортированная переменная фото (см. импорты выше)
//  tags  — теги специализации (до 4 штук)
// ─────────────────────────────────────────────────────────────
const EXPERTS = [
  {
    photo:        photoAnton,
    role:         "Основатель",
    name:         "Исламов Антон",
    specialty:    "Глубинная психотерапия · 17 лет практики",
    bio:          "Специализируется на тревожных расстройствах, зависимостях, мужской психологии и кризисных состояниях. Международный опыт практики. Автор системы SMART Lifestyle.",
    tags:         ["Тревога", "Зависимости", "Кризисные состояния", "Выгорание"],
    photoSide:    "right" as const, // фото справа, текст слева
  },
  {
    photo:        photoRinata,
    role:         "Со-основатель",
    name:         "Рината Исламова",
    specialty:    "Семейная и групповая терапия",
    bio:          "Специализируется на семейных конфликтах, отношениях, самооценке и женской психологии. Ведущий групповых программ.",
    tags:         ["Отношения", "Самооценка", "Семья", "Группы"],
    photoSide:    "left" as const, // фото слева, текст справа
  },
];

// ─────────────────────────────────────────────────────────────
//  ОТЗЫВЫ КЛИЕНТОВ
// ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name:       "Алина, 34 года",
    type:       "Индивидуальная терапия",
    before:     "Жила в постоянном страхе за будущее, не могла принять ни одного решения",
    after:      "Стало понятнее, откуда этот страх. Теперь я принимаю решения — пусть не идеально, но сама.",
  },
  {
    name:       "Дмитрий, 41 год",
    type:       "Индивидуальная терапия",
    before:     "Выгорел полностью. Работа, семья — всё раздражало, не было сил ни на что",
    after:      "Три месяца — и я снова чувствую себя собой. Научился замечать, когда нужно останавливаться.",
  },
  {
    name:       "Мария, 28 лет",
    type:       "Групповая терапия",
    before:     "Постоянные конфликты с партнёром, одно и то же по кругу",
    after:      "В группе увидела свои паттерны как будто со стороны. Это изменило всё.",
  },
  {
    name:       "Сергей, 38 лет",
    type:       "Индивидуальная терапия",
    before:     "Проблемы с самооценкой мешали во всём — в работе, в отношениях",
    after:      "Теперь понимаю, откуда это берётся. Стало легче, и отношения с собой изменились.",
  },
];

// ─────────────────────────────────────────────────────────────
//  СТОИМОСТЬ
//  Укажите реальные цены или оставьте "По запросу"
// ─────────────────────────────────────────────────────────────
const PRICING = [
  {
    title:    "Первичная консультация",
    duration: "60 мин",
    desc:     "Знакомство, определение запроса, выбор формата работы",
    badge:    "Стартовая точка",
  },
  {
    title:    "Индивидуальная сессия",
    duration: "50–60 мин",
    desc:     "Регулярная работа с запросом. Очно или онлайн.",
    badge:    "Популярно",
  },
  {
    title:    "Групповая программа",
    duration: "Группа 6–10 чел.",
    desc:     "Регулярные встречи, работа с групповой динамикой.",
    badge:    "",
  },
];

// ─────────────────────────────────────────────────────────────
//  FAQ — ЧАСТЫЕ ВОПРОСЫ
// ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  { q: "Сколько нужно сессий?",                            a: "Это зависит от запроса, глубины проблемы и выбранного формата. На первой встрече мы оценим стартовую ситуацию и предложим реалистичный план работы." },
  { q: "Что происходит на первой сессии?",                 a: "Первая встреча — это знакомство. Мы разберём ваш запрос, найдём ключевые точки напряжения и выберем подходящий формат. Никакого давления, только диалог." },
  { q: "Гарантируете ли вы результат?",                    a: "Итог зависит не только от метода, но и от вашей включённости. Мы гарантируем честный, прозрачный процесс — без пустых обещаний." },
  { q: "Чем индивидуальная терапия отличается от групповой?", a: "Индивидуально — личный темп, глубокая точечная работа. Группа — вы видите свои паттерны через других, изменения идут быстрее за счёт динамики." },
  { q: "Работаете ли вы онлайн?",                          a: "Да. Уточните доступность нужного формата при записи — специалист подскажет оптимальный вариант." },
  { q: "Нужно ли выполнять задания дома?",                 a: "Иногда да, если это поддерживает процесс. Это не нагрузка — это продолжение работы в жизни." },
  { q: "Как понять, подходит ли мне ваш формат?",          a: "Оставьте заявку, опишите запрос одной фразой — мы сами подскажем, с чего начать." },
];

// ══════════════════════════════════════════════════════════════
//  КОМПОНЕНТЫ (вёрстка — обычно не нужно трогать)
// ══════════════════════════════════════════════════════════════

function useSEO() {
  useEffect(() => {
    document.title = `Глубинная психотерапия в ${SITE.city} — ${SITE.name}`;
    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };
    setMeta("description", `Индивидуальная и групповая психотерапия в ${SITE.city} по методу ${SITE.name}. Помогаем справиться с тревогой, выгоранием, конфликтами и повторяющимися сценариями.`);
    setMeta("keywords", `глубинная психотерапия ${SITE.city}, психолог в ${SITE.city}, индивидуальная терапия, групповая терапия, метод SMART lifestyle, консультация психолога, как избавиться от тревоги, семейная терапия ${SITE.city}`);
    setMeta("og:title", `Глубинная психотерапия в ${SITE.city} — ${SITE.name}`, true);
    setMeta("og:description", `Индивидуальная и групповая терапия по методу ${SITE.name}. Работаем с тревогой, выгоранием, зависимостями и отношениями.`, true);
    setMeta("og:type", "website", true);
    setMeta("og:locale", "ru_RU", true);
  }, []);
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F1EDE6]/97 backdrop-blur-sm border-b border-[#D1C7BD]/60" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <a href="#hero" className="font-['Cormorant_Garamond'] text-[18px] tracking-[0.12em] text-[#3A2D28] uppercase">
          Smart <span className="text-[#A48374]">Lifestyle</span>
        </a>
        <div className="hidden lg:flex items-center gap-10">
          {[["Метод", "#method"], ["Специалисты", "#experts"], ["Отзывы", "#reviews"], ["FAQ", "#faq"]].map(([label, href]) => (
            <a key={href} href={href} className="font-['Inter'] text-[12px] tracking-[0.15em] uppercase text-[#3A2D28]/55 hover:text-[#3A2D28] transition-colors">{label}</a>
          ))}
        </div>
        <a href="#contacts" className="hidden lg:inline-flex items-center gap-2 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[11px] tracking-[0.15em] uppercase px-5 py-2.5 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
          Записаться
        </a>
        <button onClick={() => setOpen(!open)} className="lg:hidden text-[#3A2D28] p-1">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden bg-[#F1EDE6] border-t border-[#D1C7BD] px-6 py-8 space-y-6">
          {[["Метод", "#method"], ["Специалисты", "#experts"], ["Отзывы", "#reviews"], ["FAQ", "#faq"], ["Контакты", "#contacts"]].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block font-['Inter'] text-[13px] tracking-[0.1em] uppercase text-[#3A2D28]/70">{label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section id="hero" className="bg-[#F1EDE6]">

      {/* ── Мобильная версия ── */}
      <div className="lg:hidden">
        <div className="relative w-full overflow-hidden" style={{ height: "58vmax" }}>
          <ImageWithFallback src={photoHero} alt={SITE.name} className="w-full h-full object-cover object-top" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#F1EDE6] to-transparent" />
        </div>
        <div className="px-6 pt-8 pb-20">
          <p className="font-['Inter'] text-[11px] tracking-[0.22em] uppercase text-[#A48374] mb-5">{SITE.tagline}</p>
          <h1 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.08] mb-7" style={{ fontSize: "clamp(38px, 10vw, 52px)" }}>
            {HERO.heading.map((line, i) => (
              <span key={i}>{i === HERO.heading.length - 1 ? <em>{line}</em> : line}<br /></span>
            ))}
          </h1>
          <div className="w-10 h-px bg-[#A48374] mb-6" />
          <p className="font-['Inter'] text-[14px] text-[#3A2D28]/60 leading-relaxed mb-9">{HERO.subtext}</p>
          <a href="#contacts" className="flex items-center justify-center gap-3 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[13px] tracking-[0.15em] uppercase px-6 py-5 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
            Записаться на консультацию <ArrowRight size={14} />
          </a>
          {/* Статистика — мобильная */}
          <div className="flex gap-10 mt-8 pt-8 border-t border-[#D1C7BD]">
            {HERO.stats.map((s) => (
              <div key={s.number}>
                <p className="font-['Cormorant_Garamond'] text-3xl font-light text-[#3A2D28]">{s.number}</p>
                <p className="font-['Inter'] text-[10px] tracking-[0.15em] uppercase text-[#A48374] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Десктопная версия ── */}
      <div className="hidden lg:block relative min-h-screen overflow-hidden">
        {/* Фото — правая половина */}
        <div className="absolute top-0 right-0 w-[52%] h-full">
          <ImageWithFallback src={photoHero} alt={SITE.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F1EDE6]/50 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F1EDE6] to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-12 pt-44 pb-32 min-h-screen flex flex-col justify-between">
          {/* Текст и кнопка */}
          <div className="max-w-xl mt-auto">
            <p className="font-['Inter'] text-[11px] tracking-[0.25em] uppercase text-[#A48374] mb-8">{SITE.tagline}</p>
            <h1 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[0.9] mb-10" style={{ fontSize: "clamp(52px, 6.5vw, 92px)" }}>
              {HERO.heading.map((line, i) => (
                <span className="text-[64px]" key={i}>{i === HERO.heading.length - 1 ? <em>{line}</em> : line}<br /></span>
              ))}
            </h1>
            <div className="w-12 h-px bg-[#A48374] mb-8" />
            <p className="font-['Inter'] text-[14px] text-[#3A2D28]/60 leading-relaxed max-w-md mb-12">{HERO.subtext}</p>
            <div className="flex items-center gap-8">
              <a href="#contacts" className="inline-flex items-center gap-3 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[12px] tracking-[0.15em] uppercase px-8 py-4 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
                Записаться <ArrowRight size={14} />
              </a>
              <a href="#method" className="font-['Inter'] text-[12px] tracking-[0.15em] uppercase text-[#3A2D28]/45 hover:text-[#3A2D28] transition-colors">
                О методе ↓
              </a>
            </div>
          </div>

          {/* Статистика — ЛЕВАЯ сторона, на бежевом фоне */}
          <div className="flex items-end gap-12 pb-2 mt-16">
            {HERO.stats.map((s) => (
              <div key={s.number}>
                <p className="font-['Cormorant_Garamond'] text-5xl font-light text-[#3A2D28]">{s.number}</p>
                <p className="font-['Inter'] text-[10px] tracking-[0.18em] uppercase text-[#A48374] mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Statement() {
  const parts = STATEMENT.text.split(STATEMENT.highlight);
  return (
    <section className="bg-[#3A2D28] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <p className="font-['Cormorant_Garamond'] font-light text-[#F1EDE6] leading-[1.1]" style={{ fontSize: "clamp(28px, 4vw, 58px)" }}>
          {parts[0]}<em className="text-[#CBAD8D] not-italic">{STATEMENT.highlight}</em>{parts[1]}
        </p>
        <div className="mt-10 flex items-center gap-5">
          <div className="w-8 h-px bg-[#CBAD8D]" />
          <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#CBAD8D]/60">{STATEMENT.caption}</p>
        </div>
      </div>
    </section>
  );
}

function Problems() {
  return (
    <section id="problems" className="bg-[#F1EDE6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 self-start">
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-6">С чем обращаются</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.1]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              Узнаёте<br />себя?
            </h2>
            <div className="w-8 h-px bg-[#A48374] mt-8 mb-6" />
            <p className="font-['Inter'] text-[13px] text-[#3A2D28]/55 leading-relaxed">Любой из этих запросов — достаточная причина, чтобы начать.</p>
            <a href="#contacts" className="inline-flex items-center gap-2 mt-10 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[12px] tracking-[0.15em] uppercase px-6 py-3.5 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
              Записаться <ArrowRight size={12} />
            </a>
          </div>
          <div>
            {PROBLEMS.map((p, i) => (
              <div key={i} className="flex items-baseline gap-6 py-5 border-b border-[#D1C7BD]/60 group hover:border-[#A48374]/40 transition-colors">
                <span className="font-['Inter'] text-[11px] text-[#A48374]/50 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-['Cormorant_Garamond'] text-[22px] font-light text-[#3A2D28] leading-snug group-hover:text-[#A48374] transition-colors">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Method() {
  return (
    <section id="method" className="bg-[#EBE3DB] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-5">Методология</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              Система<br /><em>SMART Lifestyle</em>
            </h2>
          </div>
          <p className="font-['Inter'] text-[13px] text-[#3A2D28]/55 max-w-sm leading-relaxed">
            Пять последовательных этапов — от стабилизации до устойчивой трансформации.
          </p>
        </div>
        <div className="relative grid lg:grid-cols-5 gap-px bg-[#D1C7BD] lg:bg-transparent lg:gap-0">
          {/* Соединительная линия — только на десктопе */}
          <div className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-[#D1C7BD]" style={{ top: "32px" }} />
          {SMART_STEPS.map((s, i) => (
            <div key={s.letter} className="bg-[#EBE3DB] lg:bg-transparent lg:pr-8 pt-8 pb-6 px-6 lg:px-0">
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-[#3A2D28] shrink-0">
                  <span className="font-['Cormorant_Garamond'] text-3xl font-light text-[#CBAD8D]">{s.letter}</span>
                </div>
              </div>
              <p className="font-['Inter'] text-[10px] tracking-[0.15em] uppercase text-[#A48374] mb-2">0{i + 1}</p>
              <h3 className="font-['Cormorant_Garamond'] text-[20px] font-medium text-[#3A2D28] mb-3">{s.ru}</h3>
              <p className="font-['Inter'] text-[12px] text-[#3A2D28]/55 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Formats() {
  return (
    <section id="formats" className="bg-[#F1EDE6]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          <div className="px-8 lg:px-14 py-20 lg:py-28 border-b lg:border-b-0 lg:border-r border-[#D1C7BD]">
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-8">Формат 01</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05] mb-8" style={{ fontSize: "clamp(30px, 3.5vw, 48px)" }}>
              Индивидуальная<br />терапия
            </h2>
            <div className="w-8 h-px bg-[#A48374] mb-8" />
            <p className="font-['Inter'] text-[14px] text-[#3A2D28]/60 leading-relaxed mb-10 max-w-sm">
              Личный темп, полная конфиденциальность, точечная работа с вашим запросом. Доступно очно и онлайн.
            </p>
            <ul className="space-y-4 mb-12">
              {["Работа один на один", "Индивидуальный маршрут", "Очно или онлайн"].map(t => (
                <li key={t} className="flex items-center gap-3 font-['Inter'] text-[13px] text-[#3A2D28]/70">
                  <span className="w-4 h-px bg-[#CBAD8D] shrink-0" />{t}
                </li>
              ))}
            </ul>
            <a href="#contacts" className="inline-flex items-center gap-3 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[12px] tracking-[0.15em] uppercase px-7 py-4 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
              Записаться <ArrowRight size={12} />
            </a>
          </div>
          <div className="bg-[#3A2D28] px-8 lg:px-14 py-20 lg:py-28">
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#CBAD8D]/60 mb-8">Формат 02</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#F1EDE6] leading-[1.05] mb-8" style={{ fontSize: "clamp(30px, 3.5vw, 48px)" }}>
              Групповая<br />терапия
            </h2>
            <div className="w-8 h-px bg-[#CBAD8D]/50 mb-8" />
            <p className="font-['Inter'] text-[14px] text-[#F1EDE6]/50 leading-relaxed mb-10 max-w-sm">
              Поддержка, инсайты через взаимодействие с другими, усиление изменений за счёт групповой динамики.
            </p>
            <ul className="space-y-4 mb-12">
              {["Группа 6–10 человек", "Поддержка участников и ведущего", "Ускоренные изменения через динамику"].map(t => (
                <li key={t} className="flex items-center gap-3 font-['Inter'] text-[13px] text-[#F1EDE6]/60">
                  <span className="w-4 h-px bg-[#CBAD8D]/50 shrink-0" />{t}
                </li>
              ))}
            </ul>
            <a href="#contacts" className="inline-flex items-center gap-3 border border-[#CBAD8D] text-[#CBAD8D] font-['Inter'] text-[12px] tracking-[0.15em] uppercase px-7 py-4 hover:bg-[#CBAD8D] hover:text-[#3A2D28] transition-colors duration-200">
              Узнать подробнее <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Experts() {
  return (
    <section id="experts" className="bg-[#F1EDE6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20">
          <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-5">Команда</p>
          <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>Специалисты</h2>
        </div>

        {EXPERTS.map((e, i) => {
          const isPhotoLeft = e.photoSide === "left";
          return (
            <div key={e.name} className={`grid lg:grid-cols-2 gap-0 border-t border-[#D1C7BD] ${i > 0 ? "" : ""}`}>
              {/* Фото */}
              <div className={`overflow-hidden ${isPhotoLeft ? "order-1 lg:order-1" : "order-1 lg:order-2"}`}>
                <ImageWithFallback src={e.photo} alt={e.name} className="w-full h-[420px] lg:h-full object-cover object-top lg:min-h-[480px]" />
              </div>
              {/* Текст */}
              <div className={`px-0 py-12 lg:py-16 flex flex-col justify-center border-t lg:border-t-0 order-2 ${isPhotoLeft ? "lg:order-2 lg:pl-16 lg:border-l" : "lg:order-1 lg:pr-16 lg:border-r"} border-[#D1C7BD]`}>
                <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-3">{e.role}</p>
                <h3 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05] mb-2" style={{ fontSize: "clamp(28px, 3vw, 44px)" }}>
                  {e.name}
                </h3>
                <p className="font-['Inter'] text-[12px] tracking-[0.1em] text-[#A48374] mb-5">{e.specialty}</p>
                <div className="w-8 h-px bg-[#A48374] mb-6" />
                <p className="font-['Inter'] text-[13px] text-[#3A2D28]/60 leading-relaxed mb-8 max-w-sm">{e.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {e.tags.map(t => (
                    <span key={t} className="font-['Inter'] text-[11px] tracking-[0.1em] uppercase text-[#A48374] border border-[#D1C7BD] px-3 py-1.5">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="bg-[#EBE3DB] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-5">Отзывы</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>Истории клиентов</h2>
          </div>
          <p className="font-['Inter'] text-[12px] tracking-[0.1em] uppercase text-[#3A2D28]/40 max-w-xs">Было трудно — стало понятнее и спокойнее</p>
        </div>
        <div className="space-y-0">
          {REVIEWS.map((r, i) => (
            <div key={i} className="grid lg:grid-cols-[auto_1fr_1fr] gap-0 border-t border-[#D1C7BD] py-8 lg:py-10 items-start">
              <div className="lg:w-48 lg:pr-10 mb-4 lg:mb-0">
                <p className="font-['Cormorant_Garamond'] text-[17px] text-[#3A2D28]">{r.name}</p>
                <p className="font-['Inter'] text-[11px] tracking-[0.1em] uppercase text-[#A48374] mt-1">{r.type}</p>
              </div>
              <div className="lg:px-10 lg:border-l border-[#D1C7BD] mb-4 lg:mb-0">
                <p className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase text-[#A48374]/60 mb-3">Было</p>
                <p className="font-['Cormorant_Garamond'] text-[19px] font-light text-[#3A2D28]/50 italic leading-snug">{r.before}</p>
              </div>
              <div className="lg:px-10 lg:border-l border-[#D1C7BD]">
                <p className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase text-[#A48374]/60 mb-3">Стало</p>
                <p className="font-['Cormorant_Garamond'] text-[19px] font-light text-[#3A2D28] leading-snug">{r.after}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-[#D1C7BD]" />
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="bg-[#F1EDE6] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-16 lg:mb-20">
          <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-5">Стоимость</p>
          <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>Понятные условия</h2>
        </div>
        <div className="space-y-0">
          {PRICING.map((p, i) => (
            <div key={i} className="grid lg:grid-cols-[auto_1fr_auto_auto] gap-4 lg:gap-10 border-t border-[#D1C7BD] py-7 items-center">
              <span className="font-['Inter'] text-[11px] text-[#A48374]/50 w-6 hidden lg:block">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-['Cormorant_Garamond'] text-[22px] font-light text-[#3A2D28]">{p.title}</h3>
                <p className="font-['Inter'] text-[12px] text-[#3A2D28]/50 mt-1">{p.desc}</p>
              </div>
              <div className="text-right lg:text-left">
                <p className="font-['Inter'] text-[11px] tracking-[0.12em] uppercase text-[#A48374]">{p.duration}</p>
                {p.badge && <p className="font-['Inter'] text-[10px] tracking-[0.12em] uppercase text-[#CBAD8D] mt-1">{p.badge}</p>}
              </div>
              <a href="#contacts" className="inline-flex items-center gap-2 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[11px] tracking-[0.15em] uppercase px-5 py-3 hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200 whitespace-nowrap">
                Записаться <ArrowRight size={11} />
              </a>
            </div>
          ))}
          <div className="border-t border-[#D1C7BD]" />
        </div>
        <p className="font-['Inter'] text-[12px] text-[#3A2D28]/40 mt-8">Точная стоимость уточняется на первичной консультации</p>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-[#EBE3DB] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-16 lg:gap-24">
          <div className="lg:sticky lg:top-32 self-start">
            <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#A48374] mb-5">FAQ</p>
            <h2 className="font-['Cormorant_Garamond'] font-light text-[#3A2D28] leading-[1.05]" style={{ fontSize: "clamp(36px, 4vw, 56px)" }}>
              Частые<br />вопросы
            </h2>
            <div className="w-8 h-px bg-[#A48374] mt-8 mb-6" />
            <a href={SITE.whatsapp} className="inline-flex items-center gap-2 font-['Inter'] text-[12px] tracking-[0.15em] uppercase text-[#3A2D28]/60 hover:text-[#3A2D28] transition-colors">
              <MessageCircle size={14} /> Задать вопрос
            </a>
          </div>
          <div>
            {FAQ_ITEMS.map((f, i) => (
              <div key={i} className="border-t border-[#D1C7BD]">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-start justify-between py-6 text-left gap-6 group">
                  <span className="font-['Cormorant_Garamond'] text-[20px] font-light text-[#3A2D28] leading-snug group-hover:text-[#A48374] transition-colors">{f.q}</span>
                  {open === i ? <ChevronUp size={16} className="text-[#A48374] shrink-0 mt-1" /> : <ChevronDown size={16} className="text-[#A48374] shrink-0 mt-1" />}
                </button>
                {open === i && (
                  <div className="pb-6">
                    <p className="font-['Inter'] text-[13px] text-[#3A2D28]/60 leading-relaxed max-w-lg">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[#D1C7BD]" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Contacts() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <section id="contacts" className="bg-[#3A2D28]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative hidden lg:block">
          <ImageWithFallback src={photoContacts} alt={SITE.name} className="w-full h-full object-cover object-top min-h-[600px]" />
          <div className="absolute inset-0 bg-[#3A2D28]/40" />
          <div className="absolute bottom-14 left-12 right-12">
            <p className="font-['Cormorant_Garamond'] font-light text-[#F1EDE6] leading-[1.1]" style={{ fontSize: "clamp(28px, 3vw, 42px)" }}>
              Начните изменения<br /><em>уже сегодня</em>
            </p>
            <div className="w-8 h-px bg-[#CBAD8D] mt-6" />
          </div>
        </div>
        <div className="px-8 lg:px-14 py-16 lg:py-20">
          <p className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase text-[#CBAD8D]/60 mb-6">Контакты</p>
          <h2 className="font-['Cormorant_Garamond'] font-light text-[#F1EDE6] leading-[1.05] mb-10" style={{ fontSize: "clamp(30px, 3.5vw, 46px)" }}>
            Сделайте<br />первый шаг
          </h2>
          {sent ? (
            <div className="py-12 border-t border-[#F1EDE6]/10">
              <Check size={28} className="text-[#CBAD8D] mb-5" />
              <p className="font-['Cormorant_Garamond'] text-[24px] font-light text-[#F1EDE6] mb-3">Заявка отправлена</p>
              <p className="font-['Inter'] text-[13px] text-[#F1EDE6]/50">Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5">
              {[
                { id: "name",  label: "Имя",      type: "text", placeholder: "Как к вам обращаться",   value: form.name,  key: "name"  },
                { id: "phone", label: "Телефон",   type: "tel",  placeholder: SITE.phone,               value: form.phone, key: "phone" },
              ].map(({ id, label, type, placeholder, value, key }) => (
                <div key={id}>
                  <label className="font-['Inter'] text-[10px] tracking-[0.18em] uppercase text-[#CBAD8D]/60 block mb-2">{label}</label>
                  <input
                    type={type} required value={value} placeholder={placeholder}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    className="w-full bg-transparent border-b border-[#F1EDE6]/15 text-[#F1EDE6] placeholder-[#F1EDE6]/20 font-['Inter'] text-[14px] py-3 focus:outline-none focus:border-[#CBAD8D]/50 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="font-['Inter'] text-[10px] tracking-[0.18em] uppercase text-[#CBAD8D]/60 block mb-2">Запрос (необязательно)</label>
                <textarea rows={3} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Коротко — с чем хотите разобраться..."
                  className="w-full bg-transparent border-b border-[#F1EDE6]/15 text-[#F1EDE6] placeholder-[#F1EDE6]/20 font-['Inter'] text-[14px] py-3 focus:outline-none focus:border-[#CBAD8D]/50 transition-colors resize-none" />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[12px] tracking-[0.18em] uppercase py-4 hover:bg-[#A48374] hover:text-[#F1EDE6] transition-colors">
                  Отправить заявку
                </button>
              </div>
            </form>
          )}
          <div className="mt-10 pt-8 border-t border-[#F1EDE6]/10 flex gap-8">
            <a href={SITE.whatsapp} className="flex items-center gap-3 group">
              <MessageCircle size={16} className="text-[#CBAD8D]" />
              <span className="font-['Inter'] text-[11px] tracking-[0.15em] uppercase text-[#F1EDE6]/50 group-hover:text-[#CBAD8D] transition-colors">WhatsApp</span>
            </a>
            <a href={`tel:${SITE.phone}`} className="flex items-center gap-3 group">
              <Phone size={16} className="text-[#CBAD8D]" />
              <span className="font-['Inter'] text-[11px] tracking-[0.15em] uppercase text-[#F1EDE6]/50 group-hover:text-[#CBAD8D] transition-colors">Позвонить</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#2A1F1B] border-t border-[#F1EDE6]/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-['Cormorant_Garamond'] text-[16px] tracking-[0.12em] uppercase text-[#F1EDE6]/50">
          Smart <span className="text-[#A48374]">Lifestyle</span>
        </span>
        <p className="font-['Inter'] text-[11px] tracking-[0.1em] text-[#F1EDE6]/25">
          © 2024 · Глубинная психотерапия в {SITE.city}
        </p>
        <div className="flex gap-8">
          {[["Метод", "#method"], ["Специалисты", "#experts"], ["FAQ", "#faq"]].map(([l, h]) => (
            <a key={h} href={h} className="font-['Inter'] text-[11px] tracking-[0.1em] uppercase text-[#F1EDE6]/30 hover:text-[#F1EDE6]/60 transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function MobileCTA() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#F1EDE6]/95 backdrop-blur-sm border-t border-[#D1C7BD]">
      <a href="#contacts" className="flex items-center justify-center gap-3 bg-[#CBAD8D] text-[#3A2D28] font-['Inter'] text-[13px] tracking-[0.15em] uppercase py-4 w-full hover:bg-[#3A2D28] hover:text-[#F1EDE6] transition-colors duration-200">
        Записаться на консультацию <ArrowRight size={14} />
      </a>
    </div>
  );
}

export default function App() {
  useSEO();
  return (
    <div className="min-h-screen bg-[#F1EDE6] pb-[72px] lg:pb-0">
      <Nav />
      <Hero />
      <Statement />
      <Problems />
      <Method />
      <Formats />
      <Experts />
      <Reviews />
      <Pricing />
      <FaqSection />
      <Contacts />
      <Footer />
      <MobileCTA />
    </div>
  );
}
