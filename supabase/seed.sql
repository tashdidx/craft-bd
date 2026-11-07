-- =============================================================================
-- Craft BD — Seed data
-- =============================================================================
-- Intended for `supabase db reset` (local) or a fresh hosted project.
-- Every record below is demo data. The artisan names, workshops, and customer
-- accounts are fictional; the craft descriptions reference real Bangladeshi
-- traditions.
--
-- Demo password for every seeded account: CraftBD@2026
--   admin@craftbd.test
--   rahima.begum@artisan.craftbd.test  (and the other artisan addresses)
--   nusrat.jahan@example.com           (and the other customer addresses)
--
-- All UUIDs are fixed so reviews, orders, and certificates can reference each
-- other deterministically across resets.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- Auth accounts (Supabase Auth)
-- -----------------------------------------------------------------------------
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-4111-8111-111111111111',
    'authenticated',
    'authenticated',
    'admin@craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-11-01 09:00:00+06',
    '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
    '{"full_name":"Craft BD Admin"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222201',
    'authenticated',
    'authenticated',
    'rahima.begum@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-28 18:20:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Rahima Begum"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222202',
    'authenticated',
    'authenticated',
    'shafiqul.islam@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-22 11:05:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Shafiqul Islam"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222203',
    'authenticated',
    'authenticated',
    'gouranga.pal@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-30 08:45:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Gouranga Chandra Pal"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222204',
    'authenticated',
    'authenticated',
    'momena.khatun@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-26 19:10:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Momena Khatun"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222205',
    'authenticated',
    'authenticated',
    'abdul.karim@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-19 16:30:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Abdul Karim Miah"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222206',
    'authenticated',
    'authenticated',
    'sufia.akter@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-25 10:15:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Sufia Akter"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222207',
    'authenticated',
    'authenticated',
    'nirmal.das@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-21 14:40:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Nirmal Chandra Das"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222208',
    'authenticated',
    'authenticated',
    'jamal.uddin@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-18 12:00:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Jamal Uddin"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '22222222-2222-4222-8222-222222222209',
    'authenticated',
    'authenticated',
    'anwara.begum@artisan.craftbd.test',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-01-05 09:00:00+06',
    null,
    timestamptz '2026-10-27 17:50:00+06',
    '{"provider":"email","providers":["email"],"role":"artisan"}'::jsonb,
    '{"full_name":"Anwara Begum"}'::jsonb,
    timestamptz '2026-01-05 09:00:00+06',
    timestamptz '2026-01-05 09:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333301',
    'authenticated',
    'authenticated',
    'nusrat.jahan@example.com',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-02-11 10:00:00+06',
    null,
    timestamptz '2026-10-30 20:10:00+06',
    '{"provider":"email","providers":["email"],"role":"customer"}'::jsonb,
    '{"full_name":"Nusrat Jahan"}'::jsonb,
    timestamptz '2026-02-11 10:00:00+06',
    timestamptz '2026-02-11 10:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333302',
    'authenticated',
    'authenticated',
    'arif.hossain@example.com',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-03-02 10:00:00+06',
    null,
    timestamptz '2026-10-29 13:25:00+06',
    '{"provider":"email","providers":["email"],"role":"customer"}'::jsonb,
    '{"full_name":"Arif Hossain"}'::jsonb,
    timestamptz '2026-03-02 10:00:00+06',
    timestamptz '2026-03-02 10:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333303',
    'authenticated',
    'authenticated',
    'farhana.akter@example.com',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-04-19 10:00:00+06',
    null,
    timestamptz '2026-11-02 09:40:00+06',
    '{"provider":"email","providers":["email"],"role":"customer"}'::jsonb,
    '{"full_name":"Farhana Akter"}'::jsonb,
    timestamptz '2026-04-19 10:00:00+06',
    timestamptz '2026-04-19 10:00:00+06',
    '', '', '', ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '33333333-3333-4333-8333-333333333304',
    'authenticated',
    'authenticated',
    'tanvir.ahmed@example.com',
    '$2b$10$D2mNCDb8SIgNiie6Ayk0feT8UNQwPk77RVE0Yw3WqhooPNgdQ3sA.',
    timestamptz '2026-05-07 10:00:00+06',
    null,
    timestamptz '2026-11-03 22:05:00+06',
    '{"provider":"email","providers":["email"],"role":"customer"}'::jsonb,
    '{"full_name":"Tanvir Ahmed"}'::jsonb,
    timestamptz '2026-05-07 10:00:00+06',
    timestamptz '2026-05-07 10:00:00+06',
    '', '', '', ''
  )
on conflict (id) do nothing;

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  u.id,
  u.id,
  u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email),
  'email',
  u.last_sign_in_at,
  u.created_at,
  u.updated_at
from auth.users u
where u.id in (
  '11111111-1111-4111-8111-111111111111',
  '22222222-2222-4222-8222-222222222201',
  '22222222-2222-4222-8222-222222222202',
  '22222222-2222-4222-8222-222222222203',
  '22222222-2222-4222-8222-222222222204',
  '22222222-2222-4222-8222-222222222205',
  '22222222-2222-4222-8222-222222222206',
  '22222222-2222-4222-8222-222222222207',
  '22222222-2222-4222-8222-222222222208',
  '22222222-2222-4222-8222-222222222209',
  '33333333-3333-4333-8333-333333333301',
  '33333333-3333-4333-8333-333333333302',
  '33333333-3333-4333-8333-333333333303',
  '33333333-3333-4333-8333-333333333304'
)
on conflict do nothing;

-- The auth trigger creates profiles. Give them their public details and role.
update public.profiles as p
set
  full_name = v.full_name,
  email = v.email,
  phone = v.phone,
  role = v.role::public.user_role
from (
  values
    ('11111111-1111-4111-8111-111111111111', 'admin@craftbd.test', 'Craft BD Admin', '+8801700000000', 'admin'),
    ('22222222-2222-4222-8222-222222222201', 'rahima.begum@artisan.craftbd.test', 'Rahima Begum', '+8801711000001', 'artisan'),
    ('22222222-2222-4222-8222-222222222202', 'shafiqul.islam@artisan.craftbd.test', 'Shafiqul Islam', '+8801711000002', 'artisan'),
    ('22222222-2222-4222-8222-222222222203', 'gouranga.pal@artisan.craftbd.test', 'Gouranga Chandra Pal', '+8801711000003', 'artisan'),
    ('22222222-2222-4222-8222-222222222204', 'momena.khatun@artisan.craftbd.test', 'Momena Khatun', '+8801711000004', 'artisan'),
    ('22222222-2222-4222-8222-222222222205', 'abdul.karim@artisan.craftbd.test', 'Abdul Karim Miah', '+8801711000005', 'artisan'),
    ('22222222-2222-4222-8222-222222222206', 'sufia.akter@artisan.craftbd.test', 'Sufia Akter', '+8801711000006', 'artisan'),
    ('22222222-2222-4222-8222-222222222207', 'nirmal.das@artisan.craftbd.test', 'Nirmal Chandra Das', '+8801711000007', 'artisan'),
    ('22222222-2222-4222-8222-222222222208', 'jamal.uddin@artisan.craftbd.test', 'Jamal Uddin', '+8801711000008', 'artisan'),
    ('22222222-2222-4222-8222-222222222209', 'anwara.begum@artisan.craftbd.test', 'Anwara Begum', '+8801711000009', 'artisan'),
    ('33333333-3333-4333-8333-333333333301', 'nusrat.jahan@example.com', 'Nusrat Jahan', '+8801812000001', 'customer'),
    ('33333333-3333-4333-8333-333333333302', 'arif.hossain@example.com', 'Arif Hossain', '+8801812000002', 'customer'),
    ('33333333-3333-4333-8333-333333333303', 'farhana.akter@example.com', 'Farhana Akter', '+8801812000003', 'customer'),
    ('33333333-3333-4333-8333-333333333304', 'tanvir.ahmed@example.com', 'Tanvir Ahmed', '+8801812000004', 'customer')
) as v(id, email, full_name, phone, role)
where p.id = v.id::uuid;

-- -----------------------------------------------------------------------------
-- Categories
-- -----------------------------------------------------------------------------
insert into public.categories (id, name, slug, description, image_url, icon, sort_order)
values
  (
    'c1000000-0000-4000-8000-000000000001',
    'Jamdani Weaving',
    'jamdani',
    'Handwoven muslin and cotton textiles from the Shitalakshya river belt, known for floating floral motifs.',
    '/crafts/jamdani.svg',
    'Shirt',
    1
  ),
  (
    'c1000000-0000-4000-8000-000000000002',
    'Clay Pottery & Terracotta',
    'clay-pottery',
    'Wheel-thrown vessels and hand-modelled terracotta from Dhamrai and across Bengal.',
    '/crafts/clay-pottery.svg',
    'Flame',
    2
  ),
  (
    'c1000000-0000-4000-8000-000000000003',
    'Jute Crafts',
    'jute-crafts',
    'Woven and stitched goods made from the delta''s golden fibre.',
    '/crafts/jute-crafts.svg',
    'ShoppingBag',
    3
  ),
  (
    'c1000000-0000-4000-8000-000000000004',
    'Nakshi Kantha',
    'nakshi-kantha',
    'Story quilts and embroidered textiles worked in thousands of running stitches.',
    '/crafts/nakshi-kantha.svg',
    'Scissors',
    4
  ),
  (
    'c1000000-0000-4000-8000-000000000005',
    'Brass & Bell Metal',
    'brass-ware',
    'Cast, hammered, and chased metalware from the workshops of Dhamrai.',
    '/crafts/brass-ware.svg',
    'Bell',
    5
  ),
  (
    'c1000000-0000-4000-8000-000000000006',
    'Bamboo & Cane',
    'bamboo-cane',
    'Basketry, furniture, and lighting woven from Sylhet''s bamboo and cane.',
    '/crafts/bamboo-cane.svg',
    'TreePine',
    6
  ),
  (
    'c1000000-0000-4000-8000-000000000007',
    'Woodcraft',
    'woodcraft',
    'Carved and joined objects in mango, teak, and other locally grown timber.',
    '/crafts/woodcraft.svg',
    'Hammer',
    7
  ),
  (
    'c1000000-0000-4000-8000-000000000008',
    'Shital Pati',
    'shital-pati',
    'Cooling mats woven from murta cane, a UNESCO-recognised craft of Sylhet.',
    '/crafts/shital-pati.svg',
    'Grid3x3',
    8
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Artisan studios
-- -----------------------------------------------------------------------------
insert into public.artisans (
  id,
  profile_id,
  display_name,
  slug,
  workshop_name,
  craft_specialization,
  primary_category_id,
  region,
  district,
  years_of_experience,
  biography,
  story_video_url,
  avatar_url,
  cover_image_url,
  languages,
  status,
  is_featured
)
values
  (
    'a1000000-0000-4000-8000-000000000001',
    '22222222-2222-4222-8222-222222222201',
    'Rahima Begum',
    'rahima-begum',
    'Shitalakshya Jamdani Studio',
    'Jamdani weaving',
    'c1000000-0000-4000-8000-000000000001',
    'dhaka',
    'Narayanganj',
    28,
    $bio$Rahima Begum learned jamdani from her mother on a pit loom in Rupganj. She now leads a small workshop of six weavers, specialising in indigo-ground sarees with lotus and fish motifs. Her work has been shown at district handloom exhibitions, and she trains younger women in the supplementary-weft technique.$bio$,
    'https://www.youtube.com/watch?v=jamdani-demo',
    '/artisans/rahima-begum.svg',
    '/crafts/jamdani.svg',
    array['Bangla', 'English'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000002',
    '22222222-2222-4222-8222-222222222202',
    'Shafiqul Islam',
    'shafiqul-islam',
    'Sonargaon Loom House',
    'Jamdani and fine cotton',
    'c1000000-0000-4000-8000-000000000001',
    'dhaka',
    'Narayanganj',
    21,
    $bio$Shafiqul Islam grew up beside the looms of Sonargaon. He designs lighter jamdani stoles and yardage for everyday wear, translating historic motif books into contemporary colourways. He works with natural dyes wherever the material allows.$bio$,
    null,
    '/artisans/shafiqul-islam.svg',
    '/crafts/jamdani-detail.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000003',
    '22222222-2222-4222-8222-222222222203',
    'Gouranga Chandra Pal',
    'gouranga-chandra-pal',
    'Dhamrai Clay Collective',
    'Pottery and terracotta',
    'c1000000-0000-4000-8000-000000000002',
    'dhaka',
    'Dhaka',
    34,
    $bio$Gouranga Chandra Pal is a third-generation potter from Dhamrai. His workshop throws everyday water vessels, ritual pots, and narrative wall panels. He favours unglazed terracotta because it lets the clay breathe, and he fires in a traditional wood-fired kiln shared by several families.$bio$,
    null,
    '/artisans/gouranga-chandra-pal.svg',
    '/crafts/clay-pottery.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000004',
    '22222222-2222-4222-8222-222222222204',
    'Momena Khatun',
    'momena-khatun',
    'Jamalpur Kantha Mahila Sangha',
    'Nakshi kantha embroidery',
    'c1000000-0000-4000-8000-000000000004',
    'mymensingh',
    'Jamalpur',
    23,
    $bio$Momena Khatun stitches kantha quilts in the village of Bhabki, Jamalpur. She works with a collective of twelve women who layer old saris and share motif drawings. Her quilts often depict river life, boats, and the birds that return to the Brahmaputra each winter.$bio$,
    'https://www.youtube.com/watch?v=kantha-demo',
    '/artisans/momena-khatun.svg',
    '/crafts/nakshi-kantha.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000005',
    '22222222-2222-4222-8222-222222222205',
    'Abdul Karim Miah',
    'abdul-karim-miah',
    'Dhamrai Brass Works',
    'Brass and bell-metal casting',
    'c1000000-0000-4000-8000-000000000005',
    'dhaka',
    'Dhaka',
    31,
    $bio$Abdul Karim Miah belongs to a family of Dhamrai metalworkers. He casts brass lamps and ritual vessels using clay moulds, then hammers and chases each piece by hand. He is known for leaving a soft, unlacquered patina that deepens with use.$bio$,
    null,
    '/artisans/abdul-karim-miah.svg',
    '/crafts/brass-ware.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000006',
    '22222222-2222-4222-8222-222222222206',
    'Sufia Akter',
    'sufia-akter',
    'Faridpur Golden Fibre Co-op',
    'Jute weaving and accessories',
    'c1000000-0000-4000-8000-000000000003',
    'dhaka',
    'Faridpur',
    17,
    $bio$Sufia Akter coordinates a women-led jute workshop in Faridpur. The co-op weaves totes, runners, and home textiles from locally retted fibre, paying weavers per piece and funding a shared childcare room. Sufia designs the patterns and handles quality checks herself.$bio$,
    null,
    '/artisans/sufia-akter.svg',
    '/crafts/jute-crafts.svg',
    array['Bangla', 'English'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000007',
    '22222222-2222-4222-8222-222222222207',
    'Nirmal Chandra Das',
    'nirmal-chandra-das',
    'Sylhet Bansh Kuthir',
    'Bamboo and cane basketry',
    'c1000000-0000-4000-8000-000000000006',
    'sylhet',
    'Sylhet',
    26,
    $bio$Nirmal Chandra Das learned cane weaving from his father in Sylhet. His workshop makes trays, baskets, and lighting from bamboo and cane harvested in the surrounding hills. He is experimenting with flat-pack lampshades that can be shipped without losing their shape.$bio$,
    null,
    '/artisans/nirmal-chandra-das.svg',
    '/crafts/bamboo-cane.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000008',
    '22222222-2222-4222-8222-222222222208',
    'Jamal Uddin',
    'jamal-uddin',
    'Rajshahi Woodcraft Studio',
    'Woodcarving and joinery',
    'c1000000-0000-4000-8000-000000000007',
    'rajshahi',
    'Rajshahi',
    19,
    $bio$Jamal Uddin works with mango and teak offcuts from Rajshahi''s orchards and furniture workshops. He makes kitchen boards, jewelry boxes, and small furniture using joinery rather than nails. His jali panels are inspired by the screens of old zamindar houses.$bio$,
    null,
    '/artisans/jamal-uddin.svg',
    '/crafts/woodcraft.svg',
    array['Bangla'],
    'approved',
    true
  ),
  (
    'a1000000-0000-4000-8000-000000000009',
    '22222222-2222-4222-8222-222222222209',
    'Anwara Begum',
    'anwara-begum',
    'Golapganj Pati Studio',
    'Shital pati weaving',
    'c1000000-0000-4000-8000-000000000008',
    'sylhet',
    'Sylhet',
    24,
    $bio$Anwara Begum weaves shital pati in Golapganj, Sylhet, where murta cane grows in the wetland edges. She dyes the splints with indigo and natural greens before weaving, and has begun adapting mat panels into cushion covers for urban customers.$bio$,
    'https://www.youtube.com/watch?v=shital-pati-demo',
    '/artisans/anwara-begum.svg',
    '/crafts/shital-pati.svg',
    array['Bangla'],
    'approved',
    true
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Products
-- -----------------------------------------------------------------------------
insert into public.products (
  id,
  artisan_id,
  category_id,
  title,
  slug,
  short_description,
  description,
  price_bdt,
  compare_at_price_bdt,
  stock_quantity,
  materials,
  dimensions,
  weight_grams,
  care_instructions,
  region,
  occasion_tags,
  gift_wrap_available,
  status,
  is_featured,
  published_at
)
values
  (
    'b1000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    'c1000000-0000-4000-8000-000000000001',
    'Midnight Lotus Jamdani Saree',
    'midnight-lotus-jamdani-saree',
    'Handwoven in Rupganj, this cotton-silk jamdani carries lotus motifs across a deep indigo ground.',
    $txt$A heirloom-weight jamdani worked on a traditional pit loom. The lotus motif is placed by hand in the supplementary weft, giving each flower a soft, uneven edge that machine weaving cannot reproduce. Finished with a fine cotton border and a subtle silk sheen.$txt$,
    18500.00,
    21500.00,
    2,
    array['fine cotton', 'mulberry silk', 'natural indigo dye'],
    '5.5 m saree with 1 m blouse piece',
    650,
    'Dry clean only. Store folded in muslin away from direct sunlight.',
    'dhaka',
    array['wedding', 'festival', 'heirloom'],
    true,
    'published',
    true,
    timestamptz '2026-08-15 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'a1000000-0000-4000-8000-000000000002',
    'c1000000-0000-4000-8000-000000000001',
    'Padma Motif Jamdani Stole',
    'padma-motif-jamdani-stole',
    'A light cotton stole with a repeating Padma river motif, woven in Sonargaon.',
    $txt$Soft enough for everyday wear, this stole uses a single-colour supplementary weft to trace the Padma's current. The ends are hand-finished with a short twisted fringe, and the cloth softens further with each wash.$txt$,
    2450.00,
    2900.00,
    12,
    array['fine cotton', 'cotton thread'],
    '200 cm × 70 cm',
    180,
    'Gentle hand wash in cold water; line dry in shade.',
    'dhaka',
    array['everyday', 'gift', 'festival'],
    true,
    'published',
    false,
    timestamptz '2026-08-20 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000003',
    'a1000000-0000-4000-8000-000000000003',
    'c1000000-0000-4000-8000-000000000002',
    'Dhamrai Terracotta Water Pitcher',
    'dhamrai-terracotta-water-pitcher',
    'A wheel-thrown clay pitcher that keeps drinking water cool through the Bangladeshi summer.',
    $txt$Thrown by hand in Dhamrai from river clay, this pitcher is fired without a chemical glaze so the clay can breathe. The porous walls cool water naturally, while a matching clay lid keeps dust out.$txt$,
    1850.00,
    null,
    8,
    array['river clay', 'natural slip'],
    '24 cm height × 16 cm diameter; 1.5 L',
    1500,
    'Rinse before first use. Do not use soap; air-dry fully between uses.',
    'dhaka',
    array['housewarming', 'everyday', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-08-18 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000004',
    'a1000000-0000-4000-8000-000000000003',
    'c1000000-0000-4000-8000-000000000002',
    'Baul Singer Terracotta Wall Panel',
    'baul-singer-terracotta-wall-panel',
    'A hand-modelled terracotta panel of a Baul singer, inspired by Bengal''s wandering minstrels.',
    $txt$Each panel is shaped from local clay, incised with a bamboo stylus, and slowly fired. The figure holds a one-stringed ektara, a recurring image in Bengal's Baul tradition. The natural earth pigments are left unsealed so the surface can age gently.$txt$,
    4500.00,
    null,
    3,
    array['terracotta clay', 'natural pigments'],
    '38 cm × 28 cm',
    2600,
    'Indoor use. Dust with a dry cloth.',
    'dhaka',
    array['housewarming', 'art', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-08-22 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000005',
    'a1000000-0000-4000-8000-000000000006',
    'c1000000-0000-4000-8000-000000000003',
    'Golden Weave Jute Tote',
    'golden-weave-jute-tote',
    'A roomy everyday tote woven from golden jute, lined with handloom cotton.',
    $txt$The body is woven on a handloom from fine jute yarn, then lined with undyed cotton and finished with padded handles. It holds a laptop, a market shop, or a day's errands with equal ease. Brass rivets reinforce the stress points.$txt$,
    1450.00,
    null,
    25,
    array['golden jute', 'handloom cotton', 'brass rivets'],
    '40 cm × 34 cm × 12 cm',
    620,
    'Spot clean with a damp cloth; air-dry away from direct sun.',
    'dhaka',
    array['everyday', 'gift', 'work'],
    true,
    'published',
    true,
    timestamptz '2026-08-25 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000006',
    'a1000000-0000-4000-8000-000000000006',
    'c1000000-0000-4000-8000-000000000003',
    'Jute Table Runner Set',
    'jute-table-runner-set',
    'Two handwoven jute runners that bring the texture of the delta to the table.',
    $txt$Woven in Faridpur from retted jute fibre, these runners are finished with hand-turned fringes. The natural variation in the fibre makes each set slightly different, and the neutral tone sits well with both wood and white linen.$txt$,
    1900.00,
    null,
    14,
    array['jute fibre', 'cotton warp'],
    'Each 180 cm × 35 cm',
    700,
    'Shake out crumbs; spot clean only.',
    'dhaka',
    array['housewarming', 'dining', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-08-27 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000007',
    'a1000000-0000-4000-8000-000000000004',
    'c1000000-0000-4000-8000-000000000004',
    'Monpura Tales Nakshi Kantha Quilt',
    'monpura-tales-nakshi-kantha-quilt',
    'A queen-size kantha quilt stitched with a river-island story in thousands of running stitches.',
    $txt$Three layers of softened cotton are joined with running stitches that trace boats, fish, and the everyday life of Monpura. The quilt is worked over several months and signed with a small stitch motif in one corner. It is warm in winter and light enough to use as a bedspread in the monsoon.$txt$,
    12500.00,
    14500.00,
    2,
    array['recycled cotton sari', 'cotton thread', 'silk thread'],
    '220 cm × 180 cm',
    1800,
    'Gentle hand wash separately in cold water; dry flat in shade.',
    'mymensingh',
    array['wedding', 'housewarming', 'heirloom', 'gift'],
    true,
    'published',
    true,
    timestamptz '2026-09-01 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000008',
    'a1000000-0000-4000-8000-000000000004',
    'c1000000-0000-4000-8000-000000000004',
    'Padma Cushion Cover Pair',
    'padma-cushion-cover-pair',
    'A pair of kantha cushion covers with a flowing Padma motif in indigo and madder.',
    $txt$Each cover is stitched from layered cotton and finished with a concealed envelope back. The running-stitch river pattern is worked freehand, so the two covers are sisters rather than twins. Natural indigo and madder root give the cloth a soft, living colour.$txt$,
    1650.00,
    null,
    18,
    array['cotton', 'natural indigo dye', 'madder root dye'],
    '45 cm × 45 cm each',
    380,
    'Hand wash cold; line dry in shade.',
    'mymensingh',
    array['housewarming', 'gift', 'everyday'],
    true,
    'published',
    false,
    timestamptz '2026-09-03 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000009',
    'a1000000-0000-4000-8000-000000000005',
    'c1000000-0000-4000-8000-000000000005',
    'Dhamrai Brass Kalash',
    'dhamrai-brass-kalash',
    'A hand-hammered brass water vessel, cast and finished by a Dhamrai metalsmith.',
    $txt$The kalash is cast in a traditional two-part mould, then hammered and chased by hand. Its weight and warm patina make it a centrepiece for puja, weddings, or a quiet shelf. The lid sits snugly and the rim is smoothed by hand.$txt$,
    6800.00,
    7500.00,
    4,
    array['brass', 'bell metal'],
    '26 cm height; 2.2 L',
    2100,
    'Polish with tamarind paste or a brass cleaner; dry immediately.',
    'dhaka',
    array['wedding', 'festival', 'housewarming', 'gift'],
    true,
    'published',
    true,
    timestamptz '2026-09-05 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000010',
    'a1000000-0000-4000-8000-000000000005',
    'c1000000-0000-4000-8000-000000000005',
    'Five-Wick Brass Pradip',
    'five-wick-brass-pradip',
    'A five-wick brass pradip for festivals, hand-finished with a soft antique patina.',
    $txt$Cast in Dhamrai and finished on a hand lathe, this pradip holds five cotton wicks in a shallow oil bowl. The antique patina is left unlacquered so it deepens with use. The base is weighted to stay steady on a table or altar.$txt$,
    2200.00,
    null,
    10,
    array['brass'],
    '18 cm × 18 cm × 12 cm',
    850,
    'Wipe with a soft dry cloth. Avoid abrasive polish on the patina.',
    'dhaka',
    array['festival', 'housewarming', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-09-07 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000011',
    'a1000000-0000-4000-8000-000000000007',
    'c1000000-0000-4000-8000-000000000006',
    'Sylhet Cane Serving Tray',
    'sylhet-cane-serving-tray',
    'A handwoven cane tray with a raised rim and cut-out handles, made in Sylhet.',
    $txt$Cane is split, shaved, and woven over a hand-bent frame. The open weave lets air circulate beneath glasses and makes the tray light enough to carry with one hand. The rim is bound with a fine cane strip for a smooth edge.$txt$,
    1900.00,
    null,
    12,
    array['cane', 'bamboo frame'],
    '45 cm × 30 cm × 6 cm',
    540,
    'Wipe with a slightly damp cloth; keep away from prolonged moisture.',
    'sylhet',
    array['housewarming', 'dining', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-09-09 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000012',
    'a1000000-0000-4000-8000-000000000007',
    'c1000000-0000-4000-8000-000000000006',
    'Bansh Bamboo Lamp Shade',
    'bansh-bamboo-lamp-shade',
    'A sculptural bamboo lampshade that casts a warm, patterned light.',
    $txt$Thin bamboo splints are bent and tied into a tapered shade. The gaps between splints throw a soft lattice of light across the room, and the shade fits a standard pendant fitting. It is light enough to hang from a single hook.$txt$,
    2600.00,
    2900.00,
    6,
    array['bamboo', 'cotton cord'],
    '40 cm diameter × 32 cm height',
    480,
    'Dust with a soft brush. Indoor use only.',
    'sylhet',
    array['housewarming', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-09-11 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000013',
    'a1000000-0000-4000-8000-000000000008',
    'c1000000-0000-4000-8000-000000000007',
    'Mango Wood Serving Board',
    'mango-wood-serving-board',
    'A food-safe mango wood board with a live edge and a hand-rubbed oil finish.',
    $txt$Cut from a single piece of mango wood, this board keeps the natural edge of the timber. It is sanded through three grits and finished with food-safe mineral oil. The grain runs lengthwise for strength, and a small hole lets it hang within reach.$txt$,
    1750.00,
    2100.00,
    15,
    array['mango wood', 'food-safe mineral oil'],
    '45 cm × 22 cm × 2 cm',
    900,
    'Hand wash and dry immediately; re-oil monthly.',
    'rajshahi',
    array['housewarming', 'wedding', 'everyday', 'gift'],
    true,
    'published',
    false,
    timestamptz '2026-09-13 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000014',
    'a1000000-0000-4000-8000-000000000008',
    'c1000000-0000-4000-8000-000000000007',
    'Carved Teak Jewelry Box',
    'carved-teak-jewelry-box',
    'A small teak box with hand-carved jali panels and a brass latch.',
    $txt$The box is joined without nails, then carved with a geometric jali pattern inspired by village screens. Inside, a soft cotton lining protects rings and small keepsakes. The brass latch is hand-fitted so the lid closes with a quiet click.$txt$,
    3400.00,
    null,
    5,
    array['teak wood', 'brass fittings', 'cotton lining'],
    '22 cm × 15 cm × 10 cm',
    750,
    'Keep away from direct heat; dust with a dry cloth.',
    'rajshahi',
    array['wedding', 'gift', 'heirloom'],
    true,
    'published',
    false,
    timestamptz '2026-09-15 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000015',
    'a1000000-0000-4000-8000-000000000009',
    'c1000000-0000-4000-8000-000000000008',
    'Sylhet Shital Pati Floor Mat',
    'sylhet-shital-pati-floor-mat',
    'A cooling floor mat woven from murta cane, a craft recognised by UNESCO.',
    $txt$Murta cane is harvested, boiled, and split into fine ribbons, then woven face-down so the smooth side meets the skin. Natural green and indigo bands are dyed before weaving. The mat rolls away for storage and stays cool through the hottest afternoon.$txt$,
    4200.00,
    null,
    7,
    array['murta cane', 'natural dyes'],
    '180 cm × 90 cm',
    1200,
    'Wipe with a damp cloth; roll loosely for storage; avoid soaking.',
    'sylhet',
    array['housewarming', 'everyday', 'summer', 'gift'],
    true,
    'published',
    true,
    timestamptz '2026-09-17 10:00:00+06'
  ),
  (
    'b1000000-0000-4000-8000-000000000016',
    'a1000000-0000-4000-8000-000000000009',
    'c1000000-0000-4000-8000-000000000008',
    'Shital Pati Cushion Cover',
    'shital-pati-cushion-cover',
    'A cushion cover with a shital pati front and a soft cotton back.',
    $txt$A panel of fine murta weave is bordered with cotton and finished with a hidden zip. The cane surface stays cool and brings a subtle shine to a sofa or reading chair. The cotton back is dyed to match the natural cane tone.$txt$,
    1800.00,
    null,
    10,
    array['murta cane', 'cotton'],
    '45 cm × 45 cm',
    280,
    'Spot clean the cane panel; remove the insert before washing the cotton back.',
    'sylhet',
    array['housewarming', 'gift', 'everyday'],
    true,
    'published',
    false,
    timestamptz '2026-09-19 10:00:00+06'
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Product images
-- -----------------------------------------------------------------------------
insert into public.product_images (product_id, url, alt_text, sort_order, is_primary)
select
  p.id,
  '/crafts/' || c.slug || '.svg',
  p.title || ' — main view',
  0,
  true
from public.products p
join public.categories c on c.id = p.category_id
on conflict do nothing;

insert into public.product_images (product_id, url, alt_text, sort_order, is_primary)
select
  p.id,
  '/crafts/' || c.slug || '-detail.svg',
  p.title || ' — material detail',
  1,
  false
from public.products p
join public.categories c on c.id = p.category_id
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Craft stories
-- -----------------------------------------------------------------------------
insert into public.craft_stories (
  product_id,
  title,
  origin,
  history,
  traditional_uses,
  materials_description,
  cultural_meaning,
  did_you_know
)
values
  (
    'b1000000-0000-4000-8000-000000000001',
    'The lotus that floats on indigo',
    'Rupganj, Narayanganj — the historic jamdani belt along the Shitalakshya river.',
    $txt$Jamdani grew from the muslin tradition of the Dhaka region, where 17th-century weavers supplied courts across South Asia. The supplementary-weft technique passed down through weaving families, and UNESCO inscribed jamdani weaving on its Representative List of the Intangible Cultural Heritage of Humanity in 2013.$txt$,
    $txt$Worn at weddings, Eid gatherings, and formal family occasions; prized as a bridal gift and an heirloom passed between generations.$txt$,
    $txt$Fine cotton yarn is dyed in small batches, with mulberry silk added for the motifs. The weaver works from a punch-card design beside a pit loom, placing each motif thread by hand.$txt$,
    $txt$The lotus stands for purity and renewal in Bengali poetry and temple art. An indigo ground recalls the river at dusk, a favourite image in Bengali song.$txt$,
    $txt$A single saree can take two weavers six to twelve weeks, depending on the density of the motif.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000002',
    'A river carried across the shoulder',
    'Sonargaon, Narayanganj.',
    $txt$Sonargaon was the medieval capital of the Bengal Sultanate and a centre of fine cotton weaving. Today's jamdani stoles adapt the same supplementary-weft grammar to lighter, everyday cloth.$txt$,
    $txt$Draped over a kurta, paired with a saree, or given as a compact gift that carries a long history.$txt$,
    $txt$Fine cotton, dyed before weaving; the Padma motif repeats across the width. The fringe is twisted by hand.$txt$,
    $txt$The Padma is Bengal's lifeline, and its current is a common metaphor for continuity and belonging.$txt$,
    $txt$The stole's fringe is often twisted by the whole workshop, with younger apprentices learning the rhythm first.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000003',
    'Water kept cool by clay',
    'Dhamrai, Dhaka.',
    $txt$Dhamrai's potters have worked the clay of the Dhaleshwari river for generations, shaping both ritual vessels and household ware. Terracotta traditions across Bengal reach back to the Paharpur and Mahasthangarh archaeological sites.$txt$,
    $txt$Used for drinking water, storing curd, and cooling rooms; clay pitchers are traditional summer gifts.$txt$,
    $txt$River clay is aged, wedged with fine sand, thrown on a kick wheel, and fired without a chemical glaze so the walls stay porous.$txt$,
    $txt$The pitcher is a symbol of hospitality in Bengali households; offering water to a guest is a basic act of care.$txt$,
    $txt$A well-seasoned pitcher is said to make water taste sweeter after a few weeks of use.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000004',
    'The singer in the clay',
    'Dhamrai, Dhaka.',
    $txt$Bengal's terracotta temple panels of Bishnupur and Paharpur used clay to tell stories. Dhamrai's contemporary artisans carry that narrative instinct into wall pieces.$txt$,
    $txt$Displayed in homes and community spaces; often given at housewarmings.$txt$,
    $txt$Local terracotta clay is hand-modelled and incised, then coloured with natural earth pigments.$txt$,
    $txt$The Baul singer represents Bengal's syncretic musical tradition, where devotion is expressed through song and travel.$txt$,
    $txt$The ektara has one string and a resonator made from a dried gourd.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000005',
    'The golden fibre',
    'Faridpur, Dhaka division.',
    $txt$Jute was once called Bengal's golden fibre; the delta's climate made it a major export crop. After synthetics displaced much of the trade, a new generation of designers began using jute for durable, low-impact goods.$txt$,
    $txt$Daily shopping, work bags, and conference gifts; jute is naturally biodegradable.$txt$,
    $txt$Retted jute fibre is spun and handwoven, then lined with handloom cotton; brass rivets reinforce the handles.$txt$,
    $txt$Jute connects the rural economy of the delta with everyday urban life, supporting farming and weaving households.$txt$,
    $txt$Jute plants are harvested in about 100 days and need far less water than cotton.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000006',
    'Texture from the riverbank',
    'Faridpur, Dhaka division.',
    $txt$Jute weaving grew alongside the river trade, with families producing sacking, rope, and finer household cloth. Today's runners use the same fibre at a much finer sett.$txt$,
    $txt$Table settings, sideboards, and festive dining; the neutral texture suits both modern and traditional interiors.$txt$,
    $txt$Jute yarn is woven with a cotton warp; fringes are hand-turned and knotted.$txt$,
    $txt$The runner brings the texture of the delta into the home, a quiet reminder of the fields that produced it.$txt$,
    $txt$Jute fibre is naturally golden; no dye is needed for the warm natural colour.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000007',
    'A quilt that remembers',
    'Jamalpur, Mymensingh.',
    $txt$Nakshi kantha began as a way of recycling worn saris in rural Bengal. Women layered old cloth and stitched it into quilts, using running stitches to draw stories, flowers, and everyday life. The craft remains a village-based art practised by women's collectives.$txt$,
    $txt$Used as a winter quilt, a wedding gift, and a decorative heirloom; smaller kanthas serve as wraps and prayer mats.$txt$,
    $txt$Softened cotton saris are layered with cotton and silk thread. The stitches are worked from the centre outward.$txt$,
    $txt$The word kantha means 'patched cloth'; each quilt is a record of family life, with motifs chosen by the maker.$txt$,
    $txt$Some antique kanthas contain hundreds of thousands of stitches and can take a year to complete.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000008',
    'Indigo, madder, and a river',
    'Jamalpur, Mymensingh.',
    $txt$The kantha stitch travelled from quilt to cushion as rural craft collectives adapted the technique for urban homes. The Padma motif is a contemporary nod to the river that shapes the region.$txt$,
    $txt$Living-room cushions, wedding gifts, and housewarming presents.$txt$,
    $txt$Layered cotton, natural indigo, and madder root dye; the back is a plain cotton envelope closure.$txt$,
    $txt$Indigo and madder are among Bengal's oldest natural dyes, used for both cloth and manuscript illustration.$txt$,
    $txt$The two covers are cut from the same cloth but never match exactly — a signature of handwork.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000009',
    'The vessel of auspicious beginnings',
    'Dhamrai, Dhaka.',
    $txt$Dhamrai has been a centre of metal casting for centuries, producing bells, lamps, and ritual vessels. Families of karmakars still use lost-wax and mould-casting methods.$txt$,
    $txt$Used in puja, weddings, and the reception of guests; also collected as a sculptural object.$txt$,
    $txt$Brass and bell metal are melted and poured into a two-part clay mould, then hammered, chased, and polished.$txt$,
    $txt$The kalash is a symbol of abundance and auspicious beginnings; mango leaves and water are often placed in it during rituals.$txt$,
    $txt$The alloy's ring is tested by tapping the rim after casting — a clear tone means a sound vessel.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000010',
    'Five small flames',
    'Dhamrai, Dhaka.',
    $txt$Oil lamps have lit Bengali homes and temples for centuries. The five-wick pradip is a classic form, associated with Lakshmi puja and wedding rituals.$txt$,
    $txt$Festival lighting, puja rooms, and table centrepieces.$txt$,
    $txt$Cast brass, hand-finished on a lathe with a soft antique patina.$txt$,
    $txt$Light represents knowledge and welcome; lighting a pradip at dusk is a daily act in many households.$txt$,
    $txt$The five wicks are often arranged to represent the five elements.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000011',
    'Air and light through cane',
    'Sylhet.',
    $txt$Sylhet's cane and bamboo crafts grew from the region's forest economy. Baskets, trays, and furniture were made for household use and river trade.$txt$,
    $txt$Serving tea and snacks, organising a table, or holding keys and letters.$txt$,
    $txt$Cane is split and shaved by hand, then woven over a bamboo frame.$txt$,
    $txt$The open weave is both practical and symbolic: it lets air and light pass, a quality valued in humid Bengal.$txt$,
    $txt$Cane can be bent after soaking and holds its shape when dried.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000012',
    'A lattice of light',
    'Sylhet.',
    $txt$Bamboo is one of Bengal's most versatile building materials. Contemporary artisans are adapting basketry techniques to lighting and interior objects.$txt$,
    $txt$Pendant lighting over a dining table or reading corner.$txt$,
    $txt$Thin bamboo splints, tied with cotton cord around a lightweight frame.$txt$,
    $txt$The lattice pattern echoes the jali screens found in Bengal's historic architecture.$txt$,
    $txt$The shade is shipped flat and opens into shape — a small piece of origami.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000013',
    'From orchard to table',
    'Rajshahi.',
    $txt$Rajshahi's mango orchards produce timber as a by-product of fruit farming. Woodworkers have long used the close-grained wood for furniture and kitchenware.$txt$,
    $txt$Serving cheese, fruit, or bread; also a display board for a kitchen shelf.$txt$,
    $txt$Single-piece mango wood, sanded and finished with food-safe mineral oil.$txt$,
    $txt$Using orchard offcuts turns a by-product into a durable household object.$txt$,
    $txt$Mango wood darkens beautifully with age and oil.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000014',
    'A box for small heirlooms',
    'Rajshahi.',
    $txt$Teak was planted across northern Bangladesh for furniture and railway sleepers. Local carvers adapted the wood for small boxes, chests, and decorative panels.$txt$,
    $txt$Storing jewelry, keepsakes, and small heirlooms.$txt$,
    $txt$Teak offcuts, a brass latch and hinges, and a cotton lining.$txt$,
    $txt$The jali pattern is drawn from the screens and windows of Bengal's old houses.$txt$,
    $txt$The box is assembled with joinery, not nails, so it can be repaired rather than replaced.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000015',
    'The cool mat of Sylhet',
    'Golapganj, Sylhet.',
    $txt$Shital pati weaving is centred in Sylhet and neighbouring districts. Murta cane is harvested, boiled, and split; UNESCO added the craft to its Intangible Cultural Heritage list in 2017.$txt$,
    $txt$Floor seating, prayer, summer sleeping, and gifts; the mat stays cool in humid weather.$txt$,
    $txt$Murta cane is dyed in natural green and indigo before weaving. The smooth face is woven outward.$txt$,
    $txt$The mat's name means 'cool mat'; it is associated with hospitality and rest in rural homes.$txt$,
    $txt$A fine mat can have more than 1,000 splints across its width.$txt$
  ),
  (
    'b1000000-0000-4000-8000-000000000016',
    'A mat for the living room',
    'Golapganj, Sylhet.',
    $txt$Shital pati weavers are adapting traditional mat panels into contemporary home textiles, creating a market for younger artisans.$txt$,
    $txt$Cushion covers, table runners, and wall panels.$txt$,
    $txt$A shital pati panel bordered with cotton and finished with a hidden zip.$txt$,
    $txt$The weave brings a piece of Sylhet's wetland economy into the living room.$txt$,
    $txt$Murta cane is a wetland cane, not a tree, and regrows after harvesting.$txt$
  )
on conflict (product_id) do nothing;

-- -----------------------------------------------------------------------------
-- Craft journeys — six stages for every product, tailored by category
-- -----------------------------------------------------------------------------
with stages (
  category_slug,
  stage,
  title,
  description,
  duration_label,
  sort_order
) as (
  values
    ('jamdani', 'raw_materials', 'Raw materials', 'Fine cotton yarn is selected and dyed in small batches; mulberry silk is added only for heirloom pieces.', '2–4 days', 1),
    ('jamdani', 'design', 'Design', 'The motif is charted on graph paper, then translated into a punch card for the pit loom.', '3–7 days', 2),
    ('jamdani', 'making', 'Making', 'Two weavers work the supplementary weft by hand, placing each motif thread by thread.', '4–10 weeks', 3),
    ('jamdani', 'finishing', 'Finishing', 'The woven panel is washed, sun-dried, and gently pressed to bring out its drape.', '2–3 days', 4),
    ('jamdani', 'quality_check', 'Quality check', 'Motif alignment, thread density, and colour fastness are checked under daylight.', '1 day', 5),
    ('jamdani', 'final_product', 'Final product', 'The piece is folded with a hand-numbered certificate and wrapped in muslin.', '1 day', 6),

    ('clay-pottery', 'raw_materials', 'Raw materials', 'Silty clay from riverbanks is aged, wedged, and mixed with fine sand for strength.', '1–2 weeks', 1),
    ('clay-pottery', 'design', 'Design', 'The potter sketches the form and prepares the wheel and shaping tools.', '1–2 days', 2),
    ('clay-pottery', 'making', 'Making', 'The vessel is thrown on a kick wheel, then hand-painted or incised with a bamboo stylus.', '3–5 days', 3),
    ('clay-pottery', 'finishing', 'Finishing', 'After slow drying, pieces are burnished and fired in a traditional wood-fired kiln.', '2–4 days', 4),
    ('clay-pottery', 'quality_check', 'Quality check', 'Each piece is tapped for soundness and checked for hairline cracks.', '1 day', 5),
    ('clay-pottery', 'final_product', 'Final product', 'A food-safe sealant is applied where needed and the piece is packed in straw.', '1 day', 6),

    ('jute-crafts', 'raw_materials', 'Raw materials', 'Golden jute fibre is harvested, retted in river water, and sun-dried.', '2–3 weeks', 1),
    ('jute-crafts', 'design', 'Design', 'Artisans draft a pattern that makes the most of the fibre''s natural sheen.', '2–3 days', 2),
    ('jute-crafts', 'making', 'Making', 'Fibres are woven on handlooms or braided and stitched into shape.', '2–4 days', 3),
    ('jute-crafts', 'finishing', 'Finishing', 'Edges are bound with cotton tape and brass fittings are added by hand.', '1–2 days', 4),
    ('jute-crafts', 'quality_check', 'Quality check', 'Seams, handles, and weave density are pull-tested.', '1 day', 5),
    ('jute-crafts', 'final_product', 'Final product', 'The piece is brushed, labelled, and packed with recycled paper.', '1 day', 6),

    ('nakshi-kantha', 'raw_materials', 'Raw materials', 'Old cotton saris are layered; cotton and silk threads are sorted by colour.', '2–3 days', 1),
    ('nakshi-kantha', 'design', 'Design', 'The kantha story is drawn freehand with chalk, often from memory and folklore.', '2–5 days', 2),
    ('nakshi-kantha', 'making', 'Making', 'Thousands of running stitches are worked from the centre outward.', '4–12 weeks', 3),
    ('nakshi-kantha', 'finishing', 'Finishing', 'The border is reinforced and the quilt is washed to soften the layers.', '2–3 days', 4),
    ('nakshi-kantha', 'quality_check', 'Quality check', 'Stitch density, knot security, and colour bleeding are checked.', '1 day', 5),
    ('nakshi-kantha', 'final_product', 'Final product', 'The maker signs the corner with a stitch motif and the piece is folded with care.', '1 day', 6),

    ('brass-ware', 'raw_materials', 'Raw materials', 'Brass and bell-metal ingots are sourced from local recyclers and tested for purity.', '2–3 days', 1),
    ('brass-ware', 'design', 'Design', 'The shape is modelled in wax or clay before casting.', '2–4 days', 2),
    ('brass-ware', 'making', 'Making', 'Molten metal is poured into the mould, then hammered and chased by hand.', '4–7 days', 3),
    ('brass-ware', 'finishing', 'Finishing', 'The surface is filed, polished with tamarind paste, and buffed.', '2–3 days', 4),
    ('brass-ware', 'quality_check', 'Quality check', 'Walls are checked for thickness and joints for leaks.', '1 day', 5),
    ('brass-ware', 'final_product', 'Final product', 'The piece is weighed, stamped with the workshop mark, and wrapped.', '1 day', 6),

    ('bamboo-cane', 'raw_materials', 'Raw materials', 'Mature bamboo and cane are cut in the dry season and cured for weeks.', '2–4 weeks', 1),
    ('bamboo-cane', 'design', 'Design', 'The frame is planned around the natural curve of each culm.', '1–2 days', 2),
    ('bamboo-cane', 'making', 'Making', 'Splints are split, shaved, and woven over a hand-formed frame.', '2–5 days', 3),
    ('bamboo-cane', 'finishing', 'Finishing', 'The surface is sanded and treated with a food-safe natural oil.', '1–2 days', 4),
    ('bamboo-cane', 'quality_check', 'Quality check', 'Load-bearing joints and weave tension are tested.', '1 day', 5),
    ('bamboo-cane', 'final_product', 'Final product', 'The piece is dried, tagged, and packed to avoid moisture.', '1 day', 6),

    ('woodcraft', 'raw_materials', 'Raw materials', 'Mango and teak offcuts are selected, kiln-dried, and checked for grain.', '1–2 weeks', 1),
    ('woodcraft', 'design', 'Design', 'The maker sketches the form directly on the timber.', '1–2 days', 2),
    ('woodcraft', 'making', 'Making', 'Pieces are cut, joined, and carved with hand chisels.', '2–5 days', 3),
    ('woodcraft', 'finishing', 'Finishing', 'The wood is sanded through three grits and oiled.', '1–2 days', 4),
    ('woodcraft', 'quality_check', 'Quality check', 'Joints, cracks, and food-safe finish are inspected.', '1 day', 5),
    ('woodcraft', 'final_product', 'Final product', 'The piece is wrapped in cloth and packed with a care card.', '1 day', 6),

    ('shital-pati', 'raw_materials', 'Raw materials', 'Murta cane is harvested, boiled, and stripped into fine splints.', '1–2 weeks', 1),
    ('shital-pati', 'design', 'Design', 'Colours are planned in bands that follow Sylhet''s traditional motifs.', '1–2 days', 2),
    ('shital-pati', 'making', 'Making', 'Splints are woven on a floor loom, faces outward for a cool finish.', '3–7 days', 3),
    ('shital-pati', 'finishing', 'Finishing', 'The mat is beaten, trimmed, and sun-cured.', '2–3 days', 4),
    ('shital-pati', 'quality_check', 'Quality check', 'Weave tightness and colourfastness are checked.', '1 day', 5),
    ('shital-pati', 'final_product', 'Final product', 'The mat is rolled, tied with cane, and labelled.', '1 day', 6)
)
insert into public.craft_journeys (
  product_id,
  stage,
  title,
  description,
  duration_label,
  image_url,
  sort_order
)
select
  p.id,
  s.stage::public.journey_stage,
  s.title,
  s.description,
  s.duration_label,
  '/crafts/' || c.slug || '-detail.svg',
  s.sort_order
from public.products p
join public.categories c on c.id = p.category_id
join stages s on s.category_slug = c.slug
on conflict (product_id, stage) do nothing;

-- -----------------------------------------------------------------------------
-- Provenance certificates (one per product)
-- -----------------------------------------------------------------------------
with certificate_rows as (
  select
    p.id as product_id,
    p.artisan_id,
    p.title,
    p.materials,
    p.region,
    a.display_name,
    a.district,
    c.name as craft_name,
    c.slug as category_slug,
    'CBD-' || upper(left(c.slug, 3)) || '-2026-' ||
      lpad(row_number() over (order by p.slug)::text, 4, '0') as certificate_code
  from public.products p
  join public.artisans a on a.id = p.artisan_id
  join public.categories c on c.id = p.category_id
),
payload_rows as (
  select
    certificate_rows.*,
    jsonb_build_object(
      'certificate_code', certificate_code,
      'product_id', product_id,
      'product_title', title,
      'artisan_id', artisan_id,
      'artisan_name', display_name,
      'craft', craft_name,
      'origin', district || ', ' || initcap(region::text) || ', Bangladesh',
      'materials', to_jsonb(materials),
      'issued_at', '2026-01-15'
    ) as certificate_payload
  from certificate_rows
)
insert into public.certificates (
  certificate_code,
  product_id,
  artisan_id,
  issued_at,
  certificate_payload,
  certificate_hash,
  status
)
select
  certificate_code,
  product_id,
  artisan_id,
  date '2026-01-15',
  certificate_payload,
  encode(sha256(convert_to(certificate_payload::text, 'UTF8')), 'hex'),
  'active'
from payload_rows
on conflict (product_id) do nothing;

-- -----------------------------------------------------------------------------
-- Customer addresses
-- -----------------------------------------------------------------------------
insert into public.addresses (
  id,
  profile_id,
  label,
  recipient_name,
  phone,
  address_line1,
  address_line2,
  city,
  district,
  division,
  postal_code,
  is_default
)
values
  (
    'f1000000-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333301',
    'Home',
    'Nusrat Jahan',
    '+8801812000001',
    'House 42, Road 7, Dhanmondi',
    'Flat 4B',
    'Dhaka',
    'Dhaka',
    'dhaka',
    '1205',
    true
  ),
  (
    'f1000000-0000-4000-8000-000000000002',
    '33333333-3333-4333-8333-333333333302',
    'Home',
    'Arif Hossain',
    '+8801812000002',
    '18 Nasirabad Housing Society',
    'Block B',
    'Chattogram',
    'Chattogram',
    'chattogram',
    '4210',
    true
  ),
  (
    'f1000000-0000-4000-8000-000000000003',
    '33333333-3333-4333-8333-333333333303',
    'Home',
    'Farhana Akter',
    '+8801812000003',
    '25 Zindabazar, Level 3',
    null,
    'Sylhet',
    'Sylhet',
    'sylhet',
    '3100',
    true
  ),
  (
    'f1000000-0000-4000-8000-000000000004',
    '33333333-3333-4333-8333-333333333304',
    'Home',
    'Tanvir Ahmed',
    '+8801812000004',
    '71 Boalia Main Road',
    null,
    'Rajshahi',
    'Rajshahi',
    'rajshahi',
    '6100',
    true
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Orders
-- -----------------------------------------------------------------------------
insert into public.orders (
  id,
  order_number,
  customer_id,
  status,
  payment_status,
  subtotal_bdt,
  shipping_bdt,
  gift_wrap_bdt,
  shipping_address,
  gift_message,
  gift_wrap,
  placed_at
)
values
  (
    'd1000000-0000-4000-8000-000000000001',
    'CBD-2026-1001',
    '33333333-3333-4333-8333-333333333301',
    'delivered',
    'paid',
    19950.00,
    120.00,
    0.00,
    '{"recipient_name":"Nusrat Jahan","phone":"+8801812000001","address_line1":"House 42, Road 7, Dhanmondi","address_line2":"Flat 4B","city":"Dhaka","district":"Dhaka","division":"dhaka","postal_code":"1205"}'::jsonb,
    null,
    false,
    timestamptz '2026-09-18 11:30:00+06'
  ),
  (
    'd1000000-0000-4000-8000-000000000002',
    'CBD-2026-1002',
    '33333333-3333-4333-8333-333333333302',
    'delivered',
    'paid',
    12500.00,
    0.00,
    150.00,
    '{"recipient_name":"Arif Hossain","phone":"+8801812000002","address_line1":"18 Nasirabad Housing Society","address_line2":"Block B","city":"Chattogram","district":"Chattogram","division":"chattogram","postal_code":"4210"}'::jsonb,
    'For Ma, with love — may this quilt keep her warm through winter.',
    true,
    timestamptz '2026-10-02 16:45:00+06'
  ),
  (
    'd1000000-0000-4000-8000-000000000003',
    'CBD-2026-1003',
    '33333333-3333-4333-8333-333333333303',
    'shipped',
    'paid',
    6800.00,
    150.00,
    0.00,
    '{"recipient_name":"Farhana Akter","phone":"+8801812000003","address_line1":"25 Zindabazar, Level 3","address_line2":null,"city":"Sylhet","district":"Sylhet","division":"sylhet","postal_code":"3100"}'::jsonb,
    null,
    false,
    timestamptz '2026-10-24 10:15:00+06'
  ),
  (
    'd1000000-0000-4000-8000-000000000004',
    'CBD-2026-1004',
    '33333333-3333-4333-8333-333333333304',
    'pending',
    'unpaid',
    1750.00,
    80.00,
    0.00,
    '{"recipient_name":"Tanvir Ahmed","phone":"+8801812000004","address_line1":"71 Boalia Main Road","address_line2":null,"city":"Rajshahi","district":"Rajshahi","division":"rajshahi","postal_code":"6100"}'::jsonb,
    null,
    false,
    timestamptz '2026-11-02 21:10:00+06'
  )
on conflict (id) do nothing;

insert into public.order_items (
  id,
  order_id,
  product_id,
  artisan_id,
  product_title,
  product_image_url,
  unit_price_bdt,
  quantity,
  gift_wrap
)
values
  (
    'e1000000-0000-4000-8000-000000000001',
    'd1000000-0000-4000-8000-000000000001',
    'b1000000-0000-4000-8000-000000000001',
    'a1000000-0000-4000-8000-000000000001',
    'Midnight Lotus Jamdani Saree',
    '/crafts/jamdani.svg',
    18500.00,
    1,
    false
  ),
  (
    'e1000000-0000-4000-8000-000000000002',
    'd1000000-0000-4000-8000-000000000001',
    'b1000000-0000-4000-8000-000000000005',
    'a1000000-0000-4000-8000-000000000006',
    'Golden Weave Jute Tote',
    '/crafts/jute-crafts.svg',
    1450.00,
    1,
    false
  ),
  (
    'e1000000-0000-4000-8000-000000000003',
    'd1000000-0000-4000-8000-000000000002',
    'b1000000-0000-4000-8000-000000000007',
    'a1000000-0000-4000-8000-000000000004',
    'Monpura Tales Nakshi Kantha Quilt',
    '/crafts/nakshi-kantha.svg',
    12500.00,
    1,
    true
  ),
  (
    'e1000000-0000-4000-8000-000000000004',
    'd1000000-0000-4000-8000-000000000003',
    'b1000000-0000-4000-8000-000000000009',
    'a1000000-0000-4000-8000-000000000005',
    'Dhamrai Brass Kalash',
    '/crafts/brass-ware.svg',
    6800.00,
    1,
    false
  ),
  (
    'e1000000-0000-4000-8000-000000000005',
    'd1000000-0000-4000-8000-000000000004',
    'b1000000-0000-4000-8000-000000000013',
    'a1000000-0000-4000-8000-000000000008',
    'Mango Wood Serving Board',
    '/crafts/woodcraft.svg',
    1750.00,
    1,
    false
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Reviews (including one flagged item for the moderation dashboard)
-- -----------------------------------------------------------------------------
insert into public.reviews (
  id,
  product_id,
  customer_id,
  order_item_id,
  rating,
  title,
  comment,
  status,
  is_verified_purchase,
  flagged_reason,
  admin_note,
  created_at
)
values
  (
    'a2000000-0000-4000-8000-000000000001',
    'b1000000-0000-4000-8000-000000000001',
    '33333333-3333-4333-8333-333333333301',
    'e1000000-0000-4000-8000-000000000001',
    5,
    'Worth every month of waiting',
    $txt$The saree is even more beautiful in person. The lotus motifs have a soft, hand-drawn quality, and the indigo is deep without being flat. The blouse piece is generous and the weave feels substantial without being heavy.$txt$,
    'published',
    true,
    null,
    null,
    timestamptz '2026-09-26 20:15:00+06'
  ),
  (
    'a2000000-0000-4000-8000-000000000002',
    'b1000000-0000-4000-8000-000000000005',
    '33333333-3333-4333-8333-333333333301',
    'e1000000-0000-4000-8000-000000000002',
    4,
    'My everyday bag now',
    $txt$Roomy, sturdy, and lighter than I expected. The cotton lining is a nice touch and the handles are comfortable on the shoulder. I would have liked one more interior pocket, but the quality is excellent.$txt$,
    'published',
    true,
    null,
    null,
    timestamptz '2026-09-28 09:40:00+06'
  ),
  (
    'a2000000-0000-4000-8000-000000000003',
    'b1000000-0000-4000-8000-000000000007',
    '33333333-3333-4333-8333-333333333302',
    'e1000000-0000-4000-8000-000000000003',
    5,
    'A family heirloom already',
    $txt$I bought this for my mother and she has not stopped talking about the stitching. The boats and fish are full of small details, and the quilt is warm without being heavy. The gift wrapping was simple and beautiful.$txt$,
    'published',
    true,
    null,
    null,
    timestamptz '2026-10-12 18:05:00+06'
  ),
  (
    'a2000000-0000-4000-8000-000000000004',
    'b1000000-0000-4000-8000-000000000007',
    '33333333-3333-4333-8333-333333333303',
    null,
    5,
    'Best price!!!',
    $txt$Amazing quality and the best price on the internet. Contact me for a discount code on the same product. This is a must-buy for everyone!!!$txt$,
    'flagged',
    false,
    'Promotional language and an off-platform contact request were reported by two customers.',
    'Queued for manual review by the moderation team.',
    timestamptz '2026-10-30 13:20:00+06'
  )
on conflict (id) do nothing;

-- -----------------------------------------------------------------------------
-- Custom orders
-- -----------------------------------------------------------------------------
insert into public.custom_orders (
  id,
  request_code,
  customer_id,
  artisan_id,
  category_id,
  product_type,
  design_description,
  color,
  size,
  material,
  quantity,
  reference_image_url,
  custom_notes,
  budget_min_bdt,
  budget_max_bdt,
  status,
  price_estimate_bdt,
  estimated_days,
  artisan_note,
  customer_response_note,
  responded_at,
  created_at
)
values
  (
    'a3000000-0000-4000-8000-000000000001',
    'CUS-2026-0001',
    '33333333-3333-4333-8333-333333333301',
    'a1000000-0000-4000-8000-000000000001',
    'c1000000-0000-4000-8000-000000000001',
    'Bridal Jamdani saree',
    $txt$A deep indigo saree with a large lotus border and a finer lotus repeat across the body. I would like a copper-coloured silk border and the motifs to stay traditional rather than geometric.$txt$,
    'Deep indigo with copper border',
    'Saree, 12 haat, with blouse piece',
    'Fine cotton body with mulberry silk border',
    1,
    '/crafts/jamdani-detail.svg',
    'The wedding is in late January. Please leave enough time for a fitting in Dhaka.',
    18000.00,
    25000.00,
    'quoted',
    22000.00,
    35,
    $txt$I can weave this on the pit loom with the lotus border you described. The copper silk will need to be sourced from Narayanganj, which adds a few days. The quote includes the blouse piece and a certificate.$txt$,
    null,
    timestamptz '2026-10-20 17:30:00+06',
    timestamptz '2026-10-15 12:10:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000002',
    'CUS-2026-0002',
    '33333333-3333-4333-8333-333333333302',
    'a1000000-0000-4000-8000-000000000003',
    'c1000000-0000-4000-8000-000000000002',
    'Set of six clay tea cups',
    $txt$Six handleless tea cups for daily use, with a terracotta body and a white slip band near the rim. Please make them stackable and slightly larger than a standard bhar.$txt$,
    'Terracotta with white slip',
    '180 ml each, 7 cm height',
    'Local river clay, food-safe finish',
    6,
    null,
    'We will use them every day, so durability matters more than decoration.',
    4000.00,
    6500.00,
    'in_production',
    5500.00,
    21,
    $txt$The cups are thrown and drying now. I will fire them together so the colour matches across the set. The white band will be applied before the final firing.$txt$,
    $txt$Approved — please go ahead.$txt$,
    timestamptz '2026-10-03 10:20:00+06',
    timestamptz '2026-09-30 15:45:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000003',
    'CUS-2026-0003',
    '33333333-3333-4333-8333-333333333303',
    'a1000000-0000-4000-8000-000000000009',
    'c1000000-0000-4000-8000-000000000008',
    'Custom shital pati floor mat',
    $txt$A large floor mat for a reading corner, with wide natural bands and a narrow indigo stripe at each end. I would like a slightly thicker weave for comfort.$txt$,
    'Natural cane with indigo stripes',
    '6 ft × 4 ft',
    'Murta cane and natural indigo',
    1,
    '/crafts/shital-pati-detail.svg',
    'Please confirm whether the indigo can be matched to a sample I can send by courier.',
    3500.00,
    5000.00,
    'submitted',
    null,
    null,
    null,
    null,
    null,
    timestamptz '2026-11-01 09:25:00+06'
  )
on conflict (id) do nothing;

insert into public.custom_order_events (
  custom_order_id,
  status,
  note,
  actor_id,
  created_at
)
values
  (
    'a3000000-0000-4000-8000-000000000001',
    'submitted',
    'Customer submitted a bridal saree request with a January deadline.',
    '33333333-3333-4333-8333-333333333301',
    timestamptz '2026-10-15 12:10:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000001',
    'quoted',
    'Artisan quoted BDT 22,000 with an estimated 35 days.',
    '22222222-2222-4222-8222-222222222201',
    timestamptz '2026-10-20 17:30:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000002',
    'submitted',
    'Customer requested six stackable tea cups.',
    '33333333-3333-4333-8333-333333333302',
    timestamptz '2026-09-30 15:45:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000002',
    'quoted',
    'Artisan quoted BDT 5,500 for the set.',
    '22222222-2222-4222-8222-222222222203',
    timestamptz '2026-10-03 10:20:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000002',
    'approved',
    'Customer approved the estimate.',
    '33333333-3333-4333-8333-333333333302',
    timestamptz '2026-10-04 08:15:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000002',
    'in_production',
    'Cups are thrown and drying before firing.',
    '22222222-2222-4222-8222-222222222203',
    timestamptz '2026-10-05 14:00:00+06'
  ),
  (
    'a3000000-0000-4000-8000-000000000003',
    'submitted',
    'Customer submitted a large shital pati mat request.',
    '33333333-3333-4333-8333-333333333303',
    timestamptz '2026-11-01 09:25:00+06'
  );

-- -----------------------------------------------------------------------------
-- Cart & wishlist
-- -----------------------------------------------------------------------------
insert into public.carts (id, profile_id)
values (
  'a4000000-0000-4000-8000-000000000001',
  '33333333-3333-4333-8333-333333333304'
)
on conflict (id) do nothing;

insert into public.cart_items (cart_id, product_id, quantity, gift_wrap)
values (
  'a4000000-0000-4000-8000-000000000001',
  'b1000000-0000-4000-8000-000000000013',
  1,
  true
)
on conflict (cart_id, product_id) do nothing;

insert into public.wishlists (profile_id, product_id)
values
  ('33333333-3333-4333-8333-333333333304', 'b1000000-0000-4000-8000-000000000001'),
  ('33333333-3333-4333-8333-333333333304', 'b1000000-0000-4000-8000-000000000007'),
  ('33333333-3333-4333-8333-333333333304', 'b1000000-0000-4000-8000-000000000009')
on conflict do nothing;

-- -----------------------------------------------------------------------------
-- Admin audit sample
-- -----------------------------------------------------------------------------
insert into public.admin_actions (
  id,
  admin_id,
  action,
  entity_type,
  entity_id,
  details,
  created_at
)
values (
  'a5000000-0000-4000-8000-000000000001',
  '11111111-1111-4111-8111-111111111111',
  'review.flagged',
  'review',
  'a2000000-0000-4000-8000-000000000004',
  '{"reason":"Promotional language and off-platform contact request","source":"customer report"}'::jsonb,
  timestamptz '2026-10-30 14:00:00+06'
)
on conflict (id) do nothing;

commit;
