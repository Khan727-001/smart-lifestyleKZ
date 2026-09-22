# S.M.A.R.T. Lifestyle — лиды → Supabase → Telegram → GA4

В проект уже добавлена цепочка:

1. Посетитель отправляет форму.
2. Supabase Edge Function сохраняет лид в `public.leads`.
3. Edge Function отправляет лид в Telegram.
4. Только после успешного ответа Telegram фронтенд показывает «Заявка отправлена» и отправляет событие GA4 `generate_lead`.
5. Повторная отправка одного и того же запроса не создает дубль лида/Telegram-сообщения.

## 1. Создать таблицу leads

В Supabase Dashboard → SQL Editor выполните файл:

`supabase/migrations/003_create_leads.sql`

## 2. Создать Telegram-бота

Через `@BotFather` создайте бота и получите токен.

Добавьте бота в чат/группу, куда должны приходить лиды, и получите `CHAT_ID`.

В Supabase добавьте Edge Function secrets:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Если используете Supabase CLI:

```bash
supabase secrets set TELEGRAM_BOT_TOKEN="ВАШ_ТОКЕН" TELEGRAM_CHAT_ID="ВАШ_CHAT_ID" --project-ref yexyyvttcazqmqhzjrcd
```

## 3. Развернуть Edge Function

Нужно задеплоить обновленную функцию:

`supabase/functions/server/index.tsx`

Через CLI:

```bash
supabase functions deploy server --project-ref yexyyvttcazqmqhzjrcd
```

## 4. Подключить GA4

Создайте `.env` в корне проекта или добавьте переменную в окружение сборки:

```env
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
```

Supabase URL/anon key уже имеют fallback из существующей конфигурации проекта. При необходимости их также можно задать:

```env
VITE_SUPABASE_URL=https://yexyyvttcazqmqhzjrcd.supabase.co
VITE_SUPABASE_ANON_KEY=...
```

После изменения `.env` нужно заново выполнить production build.

## 5. Сделать событие конверсией в GA4

Фронтенд отправляет стандартное событие:

`generate_lead`

После первой тестовой заявки убедитесь, что оно появилось в GA4 Realtime/DebugView, затем в GA4 отметьте `generate_lead` как Key event (ключевое событие).

## Что сохраняется в Supabase

- имя
- телефон
- запрос
- дата создания
- URL страницы
- source
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- статус отправки в Telegram
- Telegram message ID

## Логика успеха

GA4 `generate_lead` НЕ отправляется по клику на кнопку.

Событие отправляется только когда:

`lead сохранен в Supabase → Telegram API вернул успех → Edge Function вернула ok:true`

Если Supabase сохранил лид, но Telegram временно недоступен, пользователь увидит ошибку повторной отправки, а сам лид останется в базе. За счет `request_id` повтор не создаст дубликат.
