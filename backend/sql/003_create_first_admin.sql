-- Create the first NexoraMart admin profile and role.
-- Replace the email below with the real admin email created in Supabase Auth.

begin;

with admin_auth_user as (
  select id, email
  from auth.users
  where email = 'smartai6119@gmail.com'
  limit 1
)
insert into public.profiles (id, full_name, phone, status)
select
  id,
  'NexoraMart Admin',
  null,
  'active'
from admin_auth_user
on conflict (id) do update
set
  full_name = excluded.full_name,
  status = excluded.status,
  updated_at = now();

with admin_auth_user as (
  select id
  from auth.users
  where email = 'smartai6119@gmail.com'
  limit 1
)
insert into public.app_roles (user_id, role)
select id, 'admin'
from admin_auth_user
on conflict (user_id, role) do nothing;

commit;