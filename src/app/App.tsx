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

import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

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
  tagline:  "Глубинная психотерапия · Алматы",
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
  heading: ["Для тех, кто устал", "жить в тревоге", "и напряжении"],
  subtext:
    "Индивидуальная и семейная терапия по системе S.M.A.R.T. Lifestyle. Работаем не с симптомами — с причинами.",
  stats: [
    { number: "17+",    label: "лет практики" },
    { number: "10 000+", label: "улучшили качество жизни" },
  ],
};

// ─────────────────────────────────────────────────────────────
//  СТАТИСТИКА (отдельный блок)
// ─────────────────────────────────────────────────────────────
const STATS = [
  { number: "17+",    label: "лет практики",               desc: "Глубокая работа с психикой, поведением и внутренней структурой личности" },
  { number: "5 000+", label: "трансформаций личности",      desc: "Истории глубоких изменений и восстановления внутренней устойчивости" },
  { number: "10 000+",label: "улучшили качество жизни",    desc: "Больше ясности, осознанности и внутреннего баланса" },
  { number: "10+",    label: "стран",                       desc: "Кыргызстан, Россия, США, Нидерланды, Англия, ОАЭ, Германия, Китай, Канада" },
  { number: "1",      label: "семья Исламовых",             desc: "Доверие, честность и личная ответственность за результат" },
  { number: "1",      label: "глобальная цель",             desc: "Трансформация одного человека меняет реальность вокруг него" },
];

// ─────────────────────────────────────────────────────────────
//  ЦИТАТА (тёмный блок)
// ─────────────────────────────────────────────────────────────
const STATEMENT = {
  text:      "Сначала вы узнаёте себя в проблеме — затем видите обещанный результат, понимаете доступные форматы и только потом получаете объяснение метода.",
  highlight: "видите обещанный результат",
  caption:   "Принцип работы S.M.A.R.T. Lifestyle",
};

// ─────────────────────────────────────────────────────────────
//  ЗАПРОСЫ
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
//  ФОРМАТЫ РАБОТЫ
// ─────────────────────────────────────────────────────────────
const FORMATS = [
  {
    num:     "01",
    title:   "Индивидуальная терапия",
    tagline: "Личная работа в своём темпе",
    desc:    "Глубокая работа один на один с терапевтом. Вы работаете в своём темпе, без сравнений и группового давления. Каждая сессия выстраивается под ваш конкретный запрос — будь то тревога, отношения, выгорание или самооценка.",
    items:   [
      "Индивидуальный маршрут и темп",
      "Полная конфиденциальность",
      "Очно в Алматы или онлайн",
    ],
    formats: ["Очно", "Онлайн"],
    dark:    false,
  },
  {
    num:     "02",
    title:   "Семейная / Парная терапия",
    tagline: "Работа с отношениями",
    desc:    "Для пар и семей, которые застряли в одном и том же конфликте. Мы работаем с тем, что происходит между людьми: паттерны взаимодействия, роли, непроговорённые ожидания. Цель — не «сохранить отношения любой ценой», а сделать их живыми.",
    items:   [
      "Совместные сессии для пары или семьи",
      "Работа с динамикой и ролями",
      "Инструменты для диалога вне сессий",
      "Очно в Алматы или онлайн",
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
    specialty:      "Психотерапевт · Клинический психолог · Аддиктолог",
    experience:     "10 лет практики",
    bio:            "Глубинная работа с личностью, эмоциональными травмами, семейными системами и внутренними конфликтами. Специализация — реконструкция личности и системная трансформация жизни. Индивидуальные консультации — только с мужчинами.",
    qualifications: [
      "Психотерапевт (немедицинский)",
      "Клинический психолог",
      "Семейный психолог, конфликтолог",
      "Аддиктолог · Автор метода S.M.A.R.T.",
    ],
    methods: [
      "НЛП, КПТ, ТОТ — системная перестройка мышления, эмоциональных реакций и поведенческих стратегий",
      "Эриксоновский гипноз и провокационная психотерапия — работа с глубинными подсознательными процессами",
      "Работа с внутренним ребёнком и эмоциональными травмами — восстановление целостности и ресурсов",
      "Транзактный анализ и эмоционально-образная терапия — осознание и трансформация внутренних сценариев",
      "Экзистенциальная психотерапия — поиск смысла, восстановление жизненной энергии и опоры",
      "Исламская психология — духовная гармония, внутренняя устойчивость и спокойствие",
    ],
    tagline: "Каждый процесс индивидуален и адаптирован под личную архитектуру личности.",
    formats: ["Очно · Алматы", "Онлайн"],
    tags:    ["Зависимости", "Семья и пары", "Травмы", "Кризисные состояния"],
    photoLeft: false,
  },
  {
    photo:          photoRinata,
    name:           "Исламова Рината Адхамовна",
    specialty:      "Психотерапевт · Клинический психолог · Женский сексолог",
    experience:     "7 лет практики",
    bio:            "Тонкая и экологичная работа с психикой, направленная на восстановление внутренней гармонии, опоры и уверенности. Индивидуальная и глубинная работа с личностью, эмоциональными травмами и внутренними конфликтами. Помогает услышать себя и раскрыть внутренний потенциал.",
    qualifications: [
      "Психотерапевт (немедицинский)",
      "Клинический психолог",
      "Женский сексолог",
      "Член международной ассоциации психологов",
    ],
    methods: [
      "НЛП и КПТ — перестройка мышления, эмоциональных реакций и поведенческих стратегий",
      "ТОТ (телесно-ориентированная терапия) — освобождение телесных блоков и напряжений",
      "Эриксоновский гипноз, трансовые и медитативные практики — работа с глубинными подсознательными процессами",
      "Работа с внутренним ребёнком и эмоциональными травмами — восстановление целостности, мягкости и ресурсности",
      "Аналитическая работа с внутренними конфликтами и установками",
    ],
    tagline: "Каждый процесс индивидуален и адаптирован под личную архитектуру личности.",
    formats: ["Очно · Алматы", "Онлайн"],
    tags:    ["Женская психология", "Самооценка", "Тревога", "Травмы"],
    photoLeft: true,
  },
];

// ─────────────────────────────────────────────────────────────
//  ОТЗЫВЫ
// ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name:       "Марина",
    specialist: "Рината Исламова",
    text:       "Обратилась к Ринате в сложный период жизни. Она создала настолько безопасное пространство, что я смогла открыться и проработать глубокие переживания, которые несла годами. Рината помогает мягко, но точно — каждое слово попадает в цель. Благодарна за изменения, которые произошли в моей жизни.",
  },
  {
    name:       "Анастасия",
    specialist: "Рината Исламова",
    text:       "Хочу выразить благодарность Ринате за бережный и профессиональный подход. Обратилась с сильной тревожностью, которая мешала нормально жить. Рината помогла разобраться в причинах, найти внутреннюю опору и научиться управлять своим состоянием. Уже после нескольких сессий почувствовала значительное облегчение.",
  },
  {
    name:       "Усман",
    specialist: "Антон Исламов",
    text:       "Огромная благодарность Антону — убрали тараканов, разложили всё по полочкам. Помог встать на ноги. Научил прислушиваться к себе и трезво оценивать эмоциональное состояние. Рекомендую.",
  },
  {
    name:       "Диана",
    specialist: "Рината Исламова",
    text:       "Хочу выразить огромную благодарность своему психотерапевту. Это специалист, который действительно слышит, чувствует и понимает. Благодаря нашей работе я стала лучше разбираться в себе, спокойнее реагировать на сложные ситуации и увереннее принимать решения.",
  },
  {
    name:       "Олжас",
    specialist: "Антон Исламов",
    text:       "Пришёл с паническими атаками — сделали разбор. За пару сеансов убрали все атаки. Понял что и как, откуда и почему. После каждого посещения приходят только позитивные эмоции. Антон — профессионал своего дела. Всем настоятельно рекомендую!",
  },
  {
    name:       "Никита",
    specialist: "Рината Исламова",
    text:       "У меня была мощная паническая атака — было страшно. Благодаря Ринате я плавно вышел из этого состояния, без медикаментов, только работа над собой. Сейчас мне гораздо легче. Сейчас я снова кайфую от жизни. Очень рекомендую!",
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
    title:     "Индивидуальная сессия",
    duration:  "50 мин",
    desc:      "Глубинная работа с ключевыми запросами и точками роста",
    kzt:       "50 000 ₸",
    usd:       "100$",
    formats:   ["Очно", "Онлайн"],
    who:       "Антон Исламов · Рината Исламова",
    details: [
      "Глубокий разбор запроса с первых минут — без затяжного знакомства",
      "Диагностика структуры личности и ключевых точек напряжения",
      "Работа с причинами, а не симптомами",
      "Индивидуальный маршрут под ваш запрос и темп",
      "Полная конфиденциальность",
      "Доступно очно в Алматы или онлайн",
    ],
  },
  {
    title:     "Семейная / Парная сессия",
    duration:  "80 мин",
    desc:      "Работа с динамикой отношений, конфликтами и восстановлением связи",
    kzt:       "75 000 ₸",
    usd:       "150$",
    formats:   ["Очно", "Онлайн"],
    who:       "Антон Исламов",
    details: [
      "Совместная работа пары или семьи с системным терапевтом",
      "Разбор паттернов взаимодействия и ролей",
      "Работа с повторяющимися конфликтами и непроговорёнными ожиданиями",
      "Инструменты для диалога между сессиями",
      "Доступно очно в Алматы или онлайн",
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
    desc:   "Выявляем убеждения, которые управляют жизнью незаметно. «Я не достоин», «нельзя просить о помощи», «всё должно быть идеально» — такие установки формируются в детстве и мешают жить во взрослом возрасте.",
  },
  {
    letter: "A",
    abbr:   "Awareness",
    ru:     "Осознанность",
    desc:   "Учимся замечать себя: свои реакции, потребности, триггеры. Осознанность — это не медитация, а способность остановиться перед автоматическим действием и выбрать другое.",
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
    desc:   "Закрепляем изменения. На этом этапе новое поведение становится привычным, а не требует усилий. Жизнь меняется не потому что вы «стараетесь», а потому что вы стали другим.",
  },
];

// ─────────────────────────────────────────────────────────────
//  FAQ
// ─────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Чем вы отличаетесь от обычных психологов?",
    a: "Мы не работаем с поверхностными симптомами. Наша задача — реконструкция внутренней архитектуры личности. Мы работаем с причинами, сценариями, идентичностью и глубинными структурами психики, создавая устойчивые изменения, а не временное облегчение. Если вы ищете поддержку и разговор — вам подойдёт классическая психология. Если ищете настоящую трансформацию — вам к нам.",
  },
  {
    q: "Как проходит первая сессия?",
    a: "Мы не тратим время на знакомство ради знакомства. Первая сессия — это глубокая диагностика: выявляем корневые причины запроса, структуру личности, ключевые точки напряжения. Если вы готовы — мы начинаем работать сразу. Это не вводная беседа, это уже терапия.",
  },
  {
    q: "Сколько сессий нужно, чтобы увидеть результат?",
    a: "Первые изменения большинство людей ощущают уже после 1 сессии. Глубинная и устойчивая трансформация формируется в процессе системной работы — обычно от 10 сессий, в зависимости от запроса, глубины травм и личной готовности к изменениям. Мы не обещаем быстрых чудес. Мы создаём реальные и стабильные результаты.",
  },
  {
    q: "Можно ли прийти без чёткого запроса?",
    a: "Да. Очень часто человек чувствует боль, тревогу, пустоту или внутренний конфликт, но не может это сформулировать. Мы помогаем найти истинный запрос и работать с первопричиной, а не с внешними проявлениями.",
  },
  {
    q: "Можно ли работать онлайн так же эффективно, как очно?",
    a: "Да. Онлайн-формат позволяет сохранять глубину, контакт и результативность. Для многих клиентов он даже более эффективен — за счёт безопасности, комфорта и открытости. Наш опыт показывает, что глубинная трансформация не зависит от расстояния.",
  },
  {
    q: "Гарантируете ли вы результат?",
    a: "Мы гарантируем честную работу, глубину, профессионализм и максимальную вовлечённость. Но результат всегда рождается во взаимодействии. Мы создаём пространство и структуру изменений — вы делаете внутреннюю работу.",
  },
  {
    q: "Почему ваши сессии стоят дороже среднего?",
    a: "Потому что вы платите не за время, не за разговор и не за советы. Вы инвестируете в глубинную реконструкцию личности и системные изменения. Это работа уровня архитектуры жизни, а не стандартной психотерапии.",
  },
  {
    q: "Как записаться на консультацию?",
    a: "Оставьте заявку на сайте или напишите нам напрямую в WhatsApp или Telegram. Мы свяжемся с вами, уточним запрос и подберём оптимальный формат работы.",
  },
];

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
    document.title = "Глубинная психотерапия в Алматы — S.M.A.R.T. Lifestyle | Исламов Антон, Исламова Рината";

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
    meta("description", "Глубинная психотерапия в Алматы. Индивидуальная и семейная терапия по методу S.M.A.R.T. Lifestyle. Работаем с тревогой, выгоранием, зависимостями, отношениями. Антон и Рината Исламовы. Очно и онлайн.");
    meta("keywords", "глубинная психотерапия Алматы, психолог в Алматы, семейная терапия Алматы, индивидуальная терапия, метод SMART lifestyle, консультация психолога цена, как избавиться от тревоги, психотерапевт Алматы, онлайн психолог, лечение зависимостей Алматы, Исламов психолог, психотерапия онлайн Казахстан");
    meta("robots", "index, follow, max-snippet:-1, max-image-preview:large");
    meta("author", "S.M.A.R.T. Lifestyle");
    meta("geo.region", "KZ-ALA");
    meta("geo.placename", "Алматы");

    // ── Open Graph ────────────────────────────────────────────
    meta("og:title", "Глубинная психотерапия в Алматы — S.M.A.R.T. Lifestyle", true);
    meta("og:description", "Индивидуальная и семейная терапия. Работаем с тревогой, выгоранием, зависимостями, отношениями. Антон и Рината Исламовы. Очно и онлайн.", true);
    meta("og:type", "website", true);
    meta("og:locale", "ru_RU", true);
    meta("og:url", window.location.origin, true);
    meta("og:site_name", "S.M.A.R.T. Lifestyle", true);

    // ── Twitter Card ──────────────────────────────────────────
    meta("twitter:card", "summary_large_image");
    meta("twitter:title", "Глубинная психотерапия в Алматы — S.M.A.R.T. Lifestyle");
    meta("twitter:description", "Индивидуальная и семейная терапия по методу S.M.A.R.T. Работаем с тревогой, выгоранием, зависимостями.");

    // ── JSON-LD: LocalBusiness ────────────────────────────────
    jsonLd("ld-local", {
      "@context": "https://schema.org",
      "@type": "PsychologicalService",
      "name": "S.M.A.R.T. Lifestyle",
      "description": "Глубинная психотерапия в Алматы. Индивидуальная и семейная терапия по методу S.M.A.R.T. Lifestyle.",
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
        "name": "Услуги психотерапии",
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
          "jobTitle": "Психотерапевт, клинический психолог, аддиктолог",
          "description": "Автор метода S.M.A.R.T. Lifestyle. 10 лет практики. Глубинная работа с личностью, эмоциональными травмами и семейными системами.",
          "worksFor": { "@type": "Organization", "name": "S.M.A.R.T. Lifestyle" },
          "knowsAbout": ["психотерапия", "НЛП", "КПТ", "зависимости", "семейная психология"],
        },
        {
          "@type": "Person",
          "name": "Исламова Рината Адхамовна",
          "jobTitle": "Психотерапевт, клинический психолог, сексолог",
          "description": "Член международной ассоциации психологов. 7 лет практики. Тонкая работа с психикой, восстановление внутренней гармонии и уверенности.",
          "worksFor": { "@type": "Organization", "name": "S.M.A.R.T. Lifestyle" },
          "knowsAbout": ["психотерапия", "телесно-ориентированная терапия", "эриксоновский гипноз", "травмы", "самооценка"],
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
          <a href={WA()} target="_blank" rel="noreferrer" className="hidden lg:inline-flex items-center gap-2 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-5 py-2.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
            Записаться
          </a>
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
          <ImageWithFallback src={photoHero} alt="Психотерапевты S.M.A.R.T. Lifestyle Алматы — Антон и Рината Исламовы" className="w-full h-full object-cover object-top" />
        </div>
        <div className="px-6 pt-8 pb-16">
          <Label>{SITE.tagline}</Label>
          <h1 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[0.95] mb-7" style={{ fontSize:"clamp(38px,10vw,52px)" }}>
            {HERO.heading.map((l,i)=><span key={i}>{i===HERO.heading.length-1?<em>{l}</em>:l}<br/></span>)}
          </h1>
          <div className="w-10 h-px bg-[#C9A882] mb-6" />
          <p className="font-['DM_Sans'] text-[14px] text-[#5C5248]/60 leading-relaxed mb-9">{HERO.subtext}</p>
          <a href={WA()} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.15em] px-6 py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
            Записаться на консультацию <ArrowRight size={14}/>
          </a>
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
              <a href={WA()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.15em] px-8 py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                Записаться <ArrowRight size={14}/>
              </a>
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
        <p className="font-['Cormorant_Garamond'] italic text-[#F3EDE6] leading-snug" style={{ fontSize: "clamp(20px, 2.5vw, 32px)" }}>
          Работаем с причинами — не с симптомами
        </p>
        <a href={WA()} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-2 border border-[#C9A882]/40 text-[#C9A882] font-['Bebas_Neue'] text-[14px] tracking-[0.18em] px-6 py-3 hover:bg-[#C9A882] hover:text-[#5C5248] transition-colors whitespace-nowrap self-start lg:self-auto">
          Записаться <ArrowRight size={13}/>
        </a>
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
      <a href={WA()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-8 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.15em] px-6 py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
        Записаться <ArrowRight size={12}/>
      </a>
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
              <a href={WA(`Здравствуйте! Хочу записаться на ${f.title.toLowerCase()}.`)} target="_blank" rel="noreferrer" className={`inline-flex items-center gap-3 font-['Bebas_Neue'] text-[15px] tracking-[0.15em] px-7 py-4 transition-colors ${f.dark ? "border border-[#C9A882] text-[#C9A882] hover:bg-[#C9A882] hover:text-[#5C5248]" : "bg-[#C9A882] text-[#5C5248] hover:bg-[#8A7B6C] hover:text-[#F3EDE6]"}`}>
                Записаться <ArrowRight size={12}/>
              </a>
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

          {/* Фото — на десктопе фиксированная высота, на мобиле натуральная */}
          <div className="w-full lg:h-64 overflow-hidden">
            <ImageWithFallback
              src={expert.photo}
              alt={expert.name}
              className="w-full h-full object-cover object-top"
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
            <a href={WA(`Здравствуйте! Хочу записаться к ${expert.name}.`)} target="_blank" rel="noreferrer"
              className="hidden lg:flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] py-4 w-full hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
              Записаться <ArrowRight size={13}/>
            </a>
          </div>

          {/* Фиксированная панель снизу — только мобиль */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F3EDE6] border-t border-[#E8DDD4] p-4 flex gap-3">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center border border-[#5C5248]/20 text-[#5C5248] shrink-0 hover:bg-[#E8DDD4] transition-colors"
            >
              <X size={18}/>
            </button>
            <a href={WA(`Здравствуйте! Хочу записаться к ${expert.name}.`)} target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
              Записаться <ArrowRight size={13}/>
            </a>
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
                <ImageWithFallback src={e.photo} alt={`${e.name} — психотерапевт S.M.A.R.T. Lifestyle Алматы`} className="w-full h-[320px] lg:h-full object-cover object-top lg:min-h-[460px] transition-transform duration-700 group-hover:scale-105" />
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
                  <a href={WA(`Здравствуйте! Хочу записаться к ${e.name}.`)} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[14px] tracking-[0.15em] px-6 py-3.5 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                    Записаться <ArrowRight size={12}/>
                  </a>
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
  const { idx, prev, next } = useSlider(REVIEWS.length);
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
            <span className="font-['DM_Sans'] text-[12px] text-[#5C5248]/40">{idx+1} / {REVIEWS.length}</span>
            <button onClick={next} className="w-10 h-10 border border-[#C9A882]/40 flex items-center justify-center text-[#5C5248] hover:bg-[#C9A882]/20 transition-colors"><ChevronRight size={18}/></button>
          </div>
        </FadeIn>

        <MechanicalSlider idx={idx} onNext={next} onPrev={prev}>
          {REVIEWS.map((r,i)=>(
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
function PricingModal({ item, onClose }: { item: typeof PRICING[0]; onClose: () => void }) {
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
          {item.details.map((d, i) => (
            <li key={i} className="flex items-start gap-3 font-['DM_Sans'] text-[13px] text-[#5C5248]/70 leading-relaxed">
              <span className="text-[#C9A882] shrink-0 mt-0.5">◈</span>{d}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between mb-6 pt-6 border-t border-[#E8DDD4]">
          <div>
            <p className="font-['Cormorant_Garamond'] text-[28px] font-normal text-[#5C5248]">{item.kzt}</p>
            <p className="font-['DM_Sans'] text-[12px] text-[#8A7B6C]/60">{item.usd}</p>
          </div>
          <div className="flex gap-2">
            {item.formats.map(f => (
              <span key={f} className="font-['Bebas_Neue'] text-[12px] tracking-[0.12em] text-[#8A7B6C] border border-[#C9A882]/30 px-3 py-1.5">{f}</span>
            ))}
          </div>
        </div>

        <a href={WA(`Здравствуйте! Хочу записаться: ${item.title}.`)} target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-3 bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[15px] tracking-[0.18em] py-4 w-full hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
          Записаться в WhatsApp <ArrowRight size={14}/>
        </a>
      </div>
    </div>
  );
}

function Pricing() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section id="pricing" className="bg-[#F3EDE6] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <FadeIn className="mb-14 lg:mb-20">
          <Label>Стоимость</Label>
          <div className="relative">
            <GhostNum n="05" />
            <h2 className="font-['Cormorant_Garamond'] font-normal text-[#5C5248] leading-[1.05] relative" style={{ fontSize:"clamp(32px,4vw,52px)" }}>Понятные условия</h2>
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
                  <p className="font-['Cormorant_Garamond'] text-[22px] font-normal text-[#5C5248]">{p.kzt}</p>
                  <p className="font-['DM_Sans'] text-[11px] text-[#8A7B6C]/60">{p.usd}</p>
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

      {active !== null && <PricingModal item={PRICING[active]} onClose={() => setActive(null)} />}
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

// ══════════════════════════════════════════════════════════════
//  CONTACTS
// ══════════════════════════════════════════════════════════════
function Contacts() {
  const [form, setForm] = useState({ name:"", phone:"", message:"" });
  const [sent, setSent] = useState(false);
  return (
    <section id="contacts" className="bg-[#5C5248]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[600px]">
        <div className="relative hidden lg:block">
          <ImageWithFallback src={photoContacts} alt="Записаться на консультацию к психотерапевту в Алматы — S.M.A.R.T. Lifestyle" className="w-full h-full object-cover object-top min-h-[600px]" />
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
            <form onSubmit={e => {
              e.preventDefault();
              const msg = `Здравствуйте! Меня зовут ${form.name}. Телефон: ${form.phone}.${form.message ? ` Запрос: ${form.message}` : ""} Хочу записаться на консультацию.`;
              window.open(`https://wa.me/77028779911?text=${encodeURIComponent(msg)}`, "_blank");
              setSent(true);
            }} className="space-y-5">
              {[
                { id:"name", label:"Имя", type:"text", ph:"Как к вам обращаться", val:form.name, k:"name" },
                { id:"phone", label:"Телефон", type:"tel", ph:SITE.phone, val:form.phone, k:"phone" },
              ].map(({ id, label, type, ph, val, k })=>(
                <div key={id}>
                  <label className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/60 block mb-2">{label}</label>
                  <input type={type} required value={val} placeholder={ph} onChange={e => setForm(f=>({...f,[k]:e.target.value}))}
                    className="w-full bg-transparent border-b border-[#F3EDE6]/15 text-[#F3EDE6] placeholder-[#F3EDE6]/20 font-['DM_Sans'] text-[14px] py-3 focus:outline-none focus:border-[#C9A882]/50 transition-colors"/>
                </div>
              ))}
              <div>
                <label className="font-['Bebas_Neue'] text-[13px] tracking-[0.18em] text-[#C9A882]/60 block mb-2">Запрос (необязательно)</label>
                <textarea rows={3} value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))}
                  placeholder="Коротко — с чем хотите разобраться..."
                  className="w-full bg-transparent border-b border-[#F3EDE6]/15 text-[#F3EDE6] placeholder-[#F3EDE6]/20 font-['DM_Sans'] text-[14px] py-3 focus:outline-none focus:border-[#C9A882]/50 transition-colors resize-none"/>
              </div>
              <div className="pt-3">
                <button type="submit" className="w-full bg-[#C9A882] text-[#5C5248] font-['Bebas_Neue'] text-[16px] tracking-[0.18em] py-4 hover:bg-[#8A7B6C] hover:text-[#F3EDE6] transition-colors">
                  Отправить заявку в WhatsApp
                </button>
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
        <p className="font-['DM_Sans'] text-[11px] text-[#F3EDE6]/25">© 2024 · {SITE.city}</p>
        <div className="flex gap-6">
          {[["Метод","#method"],["Специалисты","#experts"],["FAQ","#faq"]].map(([l,h])=>(
            <a key={h} href={h} className="font-['DM_Sans'] text-[11px] tracking-[0.1em] uppercase text-[#F3EDE6]/30 hover:text-[#F3EDE6]/60 transition-colors">{l}</a>
          ))}
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
//  APP
// ══════════════════════════════════════════════════════════════
export default function App() {
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
    </div>
  );
}
