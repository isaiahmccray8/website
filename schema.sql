create table if not exists orders (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  business text,
  website text,
  details text,
  contact_pref text,
  items jsonb not null,
  rush boolean not null default false,
  promo text,
  discount_cents integer not null default 0,
  total_cents integer not null,
  monthly_cents integer not null default 0,
  has_from boolean not null default false,
  final_total_cents integer,
  status text not null default 'new',
  amount_paid_cents integer not null default 0,
  customer_note text,
  admin_notes text
);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists payments (
  id serial primary key,
  order_id uuid not null references orders(id) on delete cascade,
  amount_cents integer not null,
  method text not null,
  stripe_session text unique,
  created_at timestamptz not null default now()
);
