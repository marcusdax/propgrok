-- PropertyInsight application schema
-- This file is auto-applied on startup (PGLite) and at build time (Neon).
-- Applied files are tracked in _migrations and never run again.
-- Put NEW ordered files (0002_*.sql, etc.) below.

-- Property pins and geofences
create table if not exists property_pins (
  id text not null primary key,
  label text not null,
  address text not null,
  city text not null,
  state text not null,
  postcode text not null,
  lat double precision not null,
  lng double precision not null,
  neighborhood text,
  county text,
  source text not null default 'search',
  created_at timestamptz default CURRENT_TIMESTAMP not null
);

create index if not exists property_pins_lat_lng_idx on property_pins (lat, lng);

-- Demographic heatmap overlay data
create table if not exists demographic_data (
  id text not null primary key,
  pin_id text references property_pins(id) on delete cascade,
  population_density integer not null,
  median_income integer not null,
  education_bachelor_plus integer not null,
  age_median integer not null,
  flood_risk integer not null default 0,
  wildfire_risk integer not null default 0,
  hail_risk integer not null default 0,
  wind_risk integer not null default 0,
  investment_score integer not null default 50,
  source text not null default 'synthetic',
  created_at timestamptz default CURRENT_TIMESTAMP not null
);

-- Geofence configurations
create table if not exists geofences (
  id text not null primary key,
  pin_id text references property_pins(id) on delete cascade,
  radius_meters integer not null default 1200,
  is_active boolean not null default true,
  created_at timestamptz default CURRENT_TIMESTAMP not null
);

-- Measurement data (distance between two points)
create table if not EXISTS measurements (
  id text not null primary key,
  from_lat double precision not null,
  from_lng double precision not null,
  to_lat double precision not null,
  to_lng double precision not null,
  distance_miles double precision not null,
  bearing_degrees double precision,
  created_at timestamptz default CURRENT_TIMESTAMP not null
);

-- Map layer preferences (user-specific)
create table if not exists map_layers (
  id text not null primary key,
  layer_type text not null,
  is_visible boolean not null default true,
  created_at timestamptz default CURRENT_TIMESTAMP not null
);

-- Tile layer preferences
create table if not exists tile_preferences (
  id text not null primary key,
  active_layer text not null default 'dark',
  show_heatmap boolean not null default false,
  created_at timestamptz default CURRENT_TIMESTAMP not null
);