-- users
insert into ebondkkb_development.users(id, email, encrypted_password, code, first_name, last_name, first_name_kana, last_name_kana, sex, birthday, created_at, updated_at, entered_on, retired_on, started_on, finished_on, shift_number1, shift_number2, expense_section, sekisyo) select id, email, encrypted_password, code, ifnull(name2, ''), ifnull(name1, ''), ifnull(kana2, ''), ifnull(kana1, ''), sex, birthday, created_at, updated_at, entry_date, retire_date, start_date, final_date, ifnull(shift_number1, ''), ifnull(shift_number2, ''), expense_section, sekisyo from kkb_rails.users;

-- groups
insert into ebondkkb_development.groups(id, code, name, hidden, created_at, updated_at) select id, case when code is null or code = '' then id + 9999 else code end, ifnull(name, id), secret, created_at, updated_at from kkb_rails.groups;

-- group_users
insert into ebondkkb_development.group_users(id, group_id, user_id, created_at, updated_at) select id, group_id, user_id, created_at, updated_at from kkb_rails.group_users group by group_id, user_id;

update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.parent_id = u2.parent_id;
update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.section = u2.section where u2.section < 100;
update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.shop = true where u2.section = 100;
update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.prefecture = case when u2.address_prefecture = '' then null else cast(u2.address_prefecture as signed) end;


-- companies
insert into ebondkkb_development.companies(id, code, name, hidden, section, created_at, updated_at) select id, code, name, hidden, section, created_at, updated_at from kkb_rails.companies;
insert into ebondkkb_development.companies(code, name, section, created_at, updated_at) values('unknown', 'unknown', 1, now(), now());

-- dests
insert into ebondkkb_development.dests(id, company_id, code, name, kana, opened_on, closed_on, started_on, finished_on, shift_number1, shift_number2, zip, city, street, building, created_at, updated_at) select dest.id, ifnull(company_id, 1), dest.code, ifnull(dest.name, ''), ifnull(kana, ''), opening_date, closing_date, start_day_count, finish_day_count, ifnull(shift_number1, ''), ifnull(shift_number2, ''), ifnull(zip, ''), ifnull(address1, ''), ifnull(address2, ''), ifnull(address3, ''), dest.created_at, dest.updated_at from kkb_rails.destinations dest left outer join kkb_rails.departments dep on dest.id = dep.destination_id;
-- modify codes(S001, S002, K002, 1, h2029, h2099, h2238)
-- update kkb_rails.destinations set code = concat('1-', id) where code='1';

update ebondkkb_development.dests d1 join kkb_rails.departments d2 on d1.id = d2.id set d1.provisional = true where d2.data_type = 13;
update ebondkkb_development.dests d1 join kkb_rails.departments d2 on d1.id = d2.id set d1.prefecture = case when d2.prefecture = '' then null else cast(d2.prefecture as signed) end;

-- areas
insert into ebondkkb_development.areas(id, code, name, short_name, hidden, created_at, updated_at) select id, code, ifnull(name, ''), ifnull(short_name, ''), hidden, created_at, updated_at from kkb_rails.areas;

-- regions
insert into ebondkkb_development.regions(id, code, name, hidden, rank, created_at, updated_at) select id, code, ifnull(name, ''), hidden, rank, created_at, updated_at from kkb_rails.regions;

-- region_areas
insert into ebondkkb_development.region_areas(region_id, area_id, created_at, updated_at) select region_id, area_id, created_at, updated_at from kkb_rails.areas_regions;


-- user_dated_values
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 1, day, job_type, created_at, updated_at from kkb_rails.user_roster_infos;
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 2, day, table_type, created_at, updated_at from kkb_rails.user_roster_infos;
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 3, day, employment, created_at, updated_at from kkb_rails.user_roster_infos;
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 4, day, hidden, created_at, updated_at from kkb_rails.user_roster_infos;
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 6, day, area_id, created_at, updated_at from kkb_rails.user_roster_infos;
insert into ebondkkb_development.user_dated_values(user_id, code, dated_on, value, created_at, updated_at) select user_id, 7, day, company_id, created_at, updated_at from kkb_rails.user_roster_infos;

-- dest_dated_values
insert into ebondkkb_development.dest_dated_values(dest_id, code, dated_on, value, created_at, updated_at) select d.destination_id, 1, day, a.area_id, a.created_at, a.updated_at from kkb_rails.department_area_infos a join kkb_rails.departments d on d.id = a.department_id;
insert into ebondkkb_development.dest_dated_values(dest_id, code, dated_on, value, created_at, updated_at) select d.destination_id, 2, day, s.user_id, s.created_at, s.updated_at from kkb_rails.supervisor_infos s join kkb_rails.departments d on d.id = s.department_id;

-- shift_users
insert into ebondkkb_development.shift_users(dated_on, user_id, dest_id, period_type, proc_type, roster_type, frame_type, created_at, updated_at) select day, user_id, destination_id, period_type, 1, roster_type, frame_type, created_at, updated_at from kkb_rails.shift_user_designs where holiday = false;
insert into ebondkkb_development.shift_users(dated_on, user_id, dest_id, period_type, proc_type, roster_type, frame_type, created_at, updated_at) select day, user_id, destination_id, period_type, 2, roster_type, frame_type, created_at, updated_at from kkb_rails.shift_user_designs where holiday = true;
insert into ebondkkb_development.shift_users(dated_on, user_id, dest_id, period_type, proc_type, roster_type, frame_type, created_at, updated_at) select day, user_id, destination_id, 0,           4, 1, 1, created_at, updated_at from kkb_rails.shift_user_holidays;
insert into ebondkkb_development.shift_users(dated_on, user_id, dest_id, period_type, proc_type, roster_type, frame_type, created_at, updated_at) select day, user_id, destination_id, period_type, 5, roster_type, frame_type, created_at, updated_at from kkb_rails.shift_users where status = 1;
insert into ebondkkb_development.shift_users(dated_on, user_id, dest_id, period_type, proc_type, roster_type, frame_type, created_at, updated_at) select day, user_id, destination_id, period_type, 6, roster_type, frame_type, created_at, updated_at from kkb_rails.shift_users where status = 2;
