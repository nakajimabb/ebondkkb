export type RegionType = {
  id: number,
  code: string,
  name: string,
  hidden: boolean,
  rank: number,
  area_ids: number[]
};

export type UserType = {
  id: number,
  code: string,
  email: string,
  first_name: string,
  last_name: string,
  first_name_kana: string,
  last_name_kana: string,
  sex: 'male' | 'female',
};

export type DestType = {
  id: number,
  company_id: number,
  code: string,
  name: string,
  kana: string,
  dest_type: string,
  provisional: boolean,
  opened_on: string,
  closed_on: string,
  started_on: string,
  finished_on: string,
  shift_number1: string,
  shift_number2: string,
};

export type ShiftUserType = {
  id: number,
  dated_on: string,
  user_id: number,
  dest_id: number,
  roster_type: string,
  period_type: string,
  proc_type: string,
  updated_at: string,
};

export type ShiftUsersUserType = {
  weekly: ShiftUserType[],
  holiday: ShiftUserType[],
  custom: ShiftUserType[],
  rest_week: ShiftUserType[],
  daily: ShiftUserType[]
};

export type ShiftUsersDestType = {
  [dest_id: number]: ShiftUserType[]
};

export type ShiftUsersDateUserType = {
  [date: string]: {[user_id: number]: ShiftUsersUserType}
};

export type ShiftUsersDateDestType = {
  [date: string]: ShiftUsersDestType
};

export const active_shift_users_user = (shift_users_user: ShiftUsersUserType): ShiftUserType[] | null => {
  if(shift_users_user) {
    if(shift_users_user.daily.length > 0)           return shift_users_user.daily;
    else if(shift_users_user.rest_week.length > 0)  return shift_users_user.rest_week;
    else if(shift_users_user.custom.length > 0)     return shift_users_user.custom;
    else if(shift_users_user.holiday.length > 0)    return shift_users_user.holiday;
    else if(shift_users_user.weekly.length > 0)     return shift_users_user.weekly;
  }
};

export const active_shift_users = (date: string,
                                   user_id: number,
                                   shift_users: ShiftUsersDateUserType
                                   ): ShiftUserType[] | null => {
  const shift_users_user = shift_users[date][user_id];
  if(shift_users_user) {
    return active_shift_users_user(shift_users_user);
  }
};

export const shift_users_user_text = (shift_users: ShiftUserType[],
                                      dests: Map<number, DestType>,
                                      night: boolean = false): string => {
  let texts = {am: '', pm: '', full: '', night: ''};
  for(const shift_user of shift_users) {
    if (shift_user.roster_type == 'at_work') {
      if (shift_user.dest_id) {
        const dest = dests.get(shift_user.dest_id);
        texts[shift_user.period_type] = dest ? dest.name : `?:${shift_user.dest_id}`;
      } else {
        texts[shift_user.period_type] = '○';
      }
    } else if (shift_user.roster_type == 'legal_holiday') {
      texts[shift_user.period_type] = '公休';
    } else if (shift_user.roster_type == 'paid_holiday') {
      texts[shift_user.period_type] = '有休';
    }
  }

  if(texts.full) {
    delete texts.am;
    delete texts.pm;
  } else {
    delete texts.full;
  }
  if(!night) {
    delete texts.night;
  }
  return Object.values(texts).join('/');
};

export const assignablePeriodType = (shift_users_user: ShiftUsersUserType, night): string | null => {
  const shift_users = active_shift_users_user(shift_users_user);
  if(shift_users) {
    const result = vacantPeriodType(shift_users, night);
    if(result) return result;

    const shift_user = shift_users.find(s => s.roster_type === 'at_work' && !s.dest_id);
    if(shift_user) {
      if(night || shift_user.period_type !== 'night') {
        return shift_user.period_type;
      }
    }
  }
};

export const vacantPeriodType = (shift_users: ShiftUserType[], night): string | null => {
  if(shift_users) {
    const period_types = shift_users.map(s => s.period_type);
    if(period_types.includes('full')) {
      if(night && !period_types.includes('night')) return 'night';
    } else {
      if(!period_types.includes('am') && !period_types.includes('pm')) return 'full';
      if(!period_types.includes('am')) return 'am';
      if(!period_types.includes('pm')) return 'pm';
      if(night && !period_types.includes('night')) return 'night';
    }
  }
};

export const sortByPeriodType = (shift_users: ShiftUserType[]): ShiftUserType[] => {
  const orders = {full: 0, am: 1, pm: 2, night: 3};
  return shift_users.sort((s1, s2) => {
    const p1 = orders[s1.period_type];
    const p2 = orders[s2.period_type];
    if(p1 < p2) return -1;
    else if(p2 > p1) return 1;
    return 0;
  });
};

export const collect_shift_users = (shift_users_user: ShiftUsersUserType): ShiftUserType[] => {
  let new_shift_users = [];
  Object.keys(shift_users_user).forEach(proc_type => {
    new_shift_users = new_shift_users.concat(shift_users_user[proc_type]);
  });
  return new_shift_users;
};

export const setObject = (obj, value, ...keys) => {
  let current = obj;
  for(let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if( i === keys.length - 1) {
      current[key] = value;
    } else {
      if(!current.hasOwnProperty(key)) {
        current[key] = {};
      }
    }
    current = current[key];
  }
};

export const getUserTimestamp = (timestamps, date, user_id) => {
  if(timestamps.users.hasOwnProperty(date) && timestamps.users[date].hasOwnProperty(user_id)) {
    return timestamps.users[date][user_id];
  } else if(timestamps.overall.hasOwnProperty(date)) {
    return timestamps.overall[date];
  }
};
