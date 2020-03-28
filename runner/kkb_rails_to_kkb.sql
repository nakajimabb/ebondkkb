-- -- users
-- insert into ebondkkb_development.users(id, email, encrypted_password, code, first_name, last_name, first_name_kana, last_name_kana, sex, birthday, created_at, updated_at, entered_on, retired_on, started_on, finished_on, shift_number1, shift_number2, expense_section, sekisyo) select id, email, encrypted_password, code, ifnull(name2, ''), ifnull(name1, ''), ifnull(kana2, ''), ifnull(kana1, ''), sex, birthday, created_at, updated_at, entry_date, retire_date, start_date, final_date, ifnull(shift_number1, ''), ifnull(shift_number2, ''), expense_section, sekisyo from kkb_rails.users;
--
-- -- groups
-- insert into ebondkkb_development.groups(id, code, name, hidden, created_at, updated_at) select id, case when code is null or code = '' then id + 9999 else code end, ifnull(name, id), secret, created_at, updated_at from kkb_rails.groups;
--
-- -- group_users
-- insert into ebondkkb_development.group_users(id, group_id, user_id, created_at, updated_at) select id, group_id, user_id, created_at, updated_at from kkb_rails.group_users group by group_id, user_id;
--
-- update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.parent_id = u2.parent_id;
-- update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.section = u2.section where u2.section < 100;
-- update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.shop = true where u2.section = 100;
-- update ebondkkb_development.users u1 join kkb_rails.users u2 on u1.id = u2.id set u1.prefecture = case when u2.address_prefecture = '' then null else cast(u2.address_prefecture as signed) end;


-- -- -- companies
-- insert into ebondkkb_development.companies(id, code, name, hidden, section, created_at, updated_at) select id, code, name, hidden, section, created_at, updated_at from kkb_rails.companies;
-- -- select id, name, code from companies where section is null;
--
-- -- -- dests
-- insert into ebondkkb_development.dests(id, company_id, code, name, kana, opened_on, closed_on, started_on, finished_on, shift_number1, shift_number2, zip, city, street, building, created_at, updated_at) select id, company_id, code, ifnull(name, ''), ifnull(kana, ''), opening_date, closing_date, start_day_count, finish_day_count, ifnull(shift_number1, ''), ifnull(shift_number2, ''), ifnull(zip, ''), ifnull(address1, ''), ifnull(address2, ''), ifnull(address3, ''), created_at, updated_at from kkb_rails.departments where kkb_rails.departments.company_id is not null;
-- -- select code, name, count(code) cnt from departments group by code having  cnt > 2;
-- -- select code, name, count(*) cnt from departments group by company_id, code having  cnt > 2;

update ebondkkb_development.dests d1 join kkb_rails.departments d2 on d1.id = d2.id set d1.provisional = true where d2.data_type = 13;
update ebondkkb_development.dests d1 join kkb_rails.departments d2 on d1.id = d2.id set d1.prefecture = case when d2.prefecture = '' then null else cast(d2.prefecture as signed) end;



-- kkb_categories
-- insert into kkb_development.kkb_categories(id, code, name, parent_id, rank, created_by_id) select id, code, name, parent_id, rank, user_id from kkb_rails.kkb_categories where kkb_rails.kkb_categories.parent_id is null;
-- insert into kkb_development.kkb_categories(id, code, name, parent_id, rank, created_by_id) select id, code, name, parent_id, rank, user_id from kkb_rails.kkb_categories where kkb_rails.kkb_categories.parent_id is not null;

-- kkbs
-- insert into kkb_development.kkbs(id, title, tmp_content, status, user_id, group_id, openness, kkb_category_id, created_by_id) select id, title, comment, status, user_id, group_id, openness, kkb_category_id, case when owner_id is null then user_id else owner_id end from kkb_rails.kkbs where kkb_rails.kkbs.parent_id is null and kkb_rails.kkbs.kkb_category_id is not null;

-- Kkb.all.each do |kkb|
--     kkb.update(content: ApplicationController.helpers.simple_format(kkb.content))
-- end    

-- kkb_member_users
-- insert into kkb_development.kkb_member_users(id, kkb_id, user_id, member_type) select km.id, km.kkb_id, km.user_id, member_type from kkb_rails.kkb_members km join kkb_rails.kkbs k on k.id = km.kkb_id where k.parent_id is null and k.kkb_category_id is not null group by kkb_id, user_id;

-- kkb_member_groups
-- insert into kkb_development.kkb_member_groups(id, kkb_id, group_id, member_type) select kg.id, kg.kkb_id, kg.group_id, member_type from kkb_rails.kkb_groups kg join kkb_rails.kkbs k on k.id = kg.kkb_id where k.parent_id is null and k.kkb_category_id is not null group by kkb_id, group_id;

