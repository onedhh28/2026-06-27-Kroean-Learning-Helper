create extension if not exists "pgcrypto";

create table if not exists public.user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  learning_start_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  korean text not null,
  meaning text not null,
  part_of_speech text,
  origin text,
  example_sentence text,
  related_words text,
  chapters text[] not null default '{}',
  source text,
  quiz_count integer not null default 0,
  correct_streak integer not null default 0,
  familiarity text not null default 'no' check (familiarity in ('yes', 'no')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, korean)
);

create table if not exists public.grammar (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pattern text not null,
  meaning_zh text not null,
  meaning_en text,
  example_sentence text,
  cloze_question text,
  cloze_answer text,
  translation_question text,
  translation_reference_answer text,
  extra_vocab_explanation text,
  chapters text[] not null default '{}',
  source text,
  quiz_count integer not null default 0,
  correct_streak integer not null default 0,
  familiarity text not null default 'no' check (familiarity in ('yes', 'no')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, pattern)
);

create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null default current_date,
  score_correct integer not null default 0,
  score_total integer not null default 0,
  selected_chapters text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quiz_session_id uuid not null references public.quiz_sessions(id) on delete cascade,
  item_type text not null check (item_type in ('vocabulary', 'grammar')),
  item_id uuid not null,
  question_type text not null check (
    question_type in (
      'vocab_zh_to_ko',
      'vocab_ko_to_zh',
      'grammar_cloze',
      'grammar_choice',
      'grammar_translation'
    )
  ),
  question_text text not null,
  user_answer text not null default '',
  correct_answer text not null default '',
  is_correct boolean not null default false,
  error_reason text,
  ai_judgement jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null default 'manual',
  raw_text text,
  parsed_payload jsonb not null default '{}'::jsonb,
  status text not null default 'preview' check (status in ('preview', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_settings_updated_at on public.user_settings;
create trigger set_user_settings_updated_at before update on public.user_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_vocabulary_updated_at on public.vocabulary;
create trigger set_vocabulary_updated_at before update on public.vocabulary
for each row execute function public.set_updated_at();

drop trigger if exists set_grammar_updated_at on public.grammar;
create trigger set_grammar_updated_at before update on public.grammar
for each row execute function public.set_updated_at();

alter table public.user_settings enable row level security;
alter table public.vocabulary enable row level security;
alter table public.grammar enable row level security;
alter table public.quiz_sessions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.import_batches enable row level security;

create policy "Users can manage own settings" on public.user_settings
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own vocabulary" on public.vocabulary
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own grammar" on public.grammar
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own quiz sessions" on public.quiz_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own quiz answers" on public.quiz_answers
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own imports" on public.import_batches
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists vocabulary_user_chapters_idx on public.vocabulary using gin (chapters);
create index if not exists grammar_user_chapters_idx on public.grammar using gin (chapters);
create index if not exists quiz_sessions_user_date_idx on public.quiz_sessions (user_id, date desc);
