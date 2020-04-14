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