-- Só a conta "admin" (admin@santosalto.admin) pode ter acesso à gestão.

-- 1) Nenhum outro perfil pode ter o papel admin
update public.profiles set role = 'customer' where role = 'admin' and lower(email) <> 'admin@santosalto.admin';
alter table public.profiles drop constraint if exists profiles_single_admin;
alter table public.profiles add constraint profiles_single_admin
  check (role <> 'admin' or lower(email) = 'admin@santosalto.admin');

-- 2) is_admin() exige o papel E o utilizador admin (verificado em auth.users)
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
      from public.profiles p
      join auth.users u on u.id = p.id
     where p.id = auth.uid()
       and p.role = 'admin'
       and lower(u.email) = 'admin@santosalto.admin'
  );
$$;

-- 3) Ninguém pode trocar o e-mail de um perfil para o do admin
create or replace function public.protect_profile_identity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.email is distinct from old.email then
    new.email := old.email;
  end if;
  return new;
end;
$$;
drop trigger if exists profiles_protect_identity on public.profiles;
create trigger profiles_protect_identity before update on public.profiles
  for each row execute function public.protect_profile_identity();
