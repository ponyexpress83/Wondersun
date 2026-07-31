-- ─────────────────────────────────────────────────────────────────────────
-- Wondersun · Video di presentazione dell'esperienza
--
-- La galleria immagini (gallery_urls) esiste già nello schema: qui si aggiunge
-- solo il link a un video su YouTube/Vimeo, mostrato nella scheda esperienza.
-- Idempotente.
-- ─────────────────────────────────────────────────────────────────────────

alter table public.experiences
  add column if not exists video_url text;

comment on column public.experiences.video_url is
  'Link a un video di presentazione (YouTube/Vimeo) mostrato nella scheda esperienza.';
