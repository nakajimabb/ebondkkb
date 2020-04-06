import React, { useState } from 'react';
import { str } from '../../tools/str';
import { user_name_with_code, name_with_code } from '../../tools/name_with_code';


const styles = {
  weekly: {
    display: 'flex',
    backgroundColor: 'floralwhite'
  },
  holiday: {
    display: 'flex',
    backgroundColor: 'floralwhite'
  },
  custom: {
    display: 'flex',
    backgroundColor: 'gold'
  },
  rest_week: {
    display: 'flex',
    backgroundColor: 'pink'
  },
  daily: {
    display: 'flex',
    backgroundColor: 'yellow'
  },
  td: {
    padding: 0,
    fontSize: '75%',
  },
  roster_type: {
    flex: '0 1 20px',
    padding: 2,
    lineHeight: 'initial',
  },
  period_type: {
    flex: '0 1 20px',
    padding: 2,
    lineHeight: 'initial',
  },
  dest: {
    flex: '1 0',
    paddingLeft: 2,
  }
};


interface ShiftUserProps {
  shift_user: any;
  dests: Map<number, any>;
}

const ShiftUser: React.FC<ShiftUserProps> = ({shift_user, dests}) => {
  const dest = dests.get(shift_user.dest_id);
  const texts = {at_work: '○', legal_holiday: '☓', paid_holiday: '有', full: '全', am: '前', pm: '後', night: '夜'};

  if(!dest) return null;
  return (
    <div style={styles[shift_user.proc_type]}>
      <div className="badge badge-success" style={styles.roster_type}>{ texts[shift_user.roster_type] }</div>
      <div className="badge badge-info" style={styles.period_type}>{ texts[shift_user.period_type] }</div>
      <div style={styles.dest}>{ dest.name }</div>
    </div>
  );
};


interface UserFrameProps {
  date: string;
  user: any;
  shift_users_user?: {weekly: any, holiday: any, custom: any, rest_week: any, daily: any};
  dests: Map<number, any>;
}

const UserFrame: React.FC<UserFrameProps> = ({date, user, shift_users_user, dests}) => {
  let shift_users = null;
  if(shift_users_user) {
    if(shift_users_user.daily.length > 0)           shift_users = shift_users_user.daily;
    else if(shift_users_user.rest_week.length > 0)  shift_users = shift_users_user.rest_week;
    else if(shift_users_user.custom.length > 0)     shift_users = shift_users_user.custom;
    else if(shift_users_user.holiday.length > 0)    shift_users = shift_users_user.holiday;
    else if(shift_users_user.weekly.length > 0)     shift_users = shift_users_user.weekly;
  }
  if(!shift_users) return <td></td>;

  return (
    <td className="shift_frame" style={styles.td}>
      {
        shift_users.map((shift_user, index) => <ShiftUser key={index} shift_user={shift_user} dests={dests} /> )
      }
    </td>
  );
};


interface Props {
  dates: string[];
  shift_users: {};
  users: Map<number, any>;
  dests: Map<number, any>;
  user_dated_values: {};
  dest_dated_values: {};
  area_ids: number[];
}

const ShiftUserWeek: React.FC<Props> = (props) => {
  const {dates, shift_users, users, dests, user_dated_values, dest_dated_values, area_ids} = props;

  const visibleUser = (dest: {id: number}, area_ids: number[]): boolean => {
    const dated_value = user_dated_values[dest.id] && user_dated_values[dest.id]['area_id'];
    if(dated_value && area_ids.indexOf(dated_value.value) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <table className="table table-sm table-bordered">
      <thead>
      <tr>
        <th>社員</th>
        { dates.map((date,index) => (<th key={index}>{date}</th>)) }
      </tr>
      </thead>
      <tbody>
      { Array.from(users.values()).map((user, index) => {
        const class_name: string = visibleUser(user, area_ids) ? '' : 'd-none';
        return (
          <tr key={index} className={class_name} >
            <td className="shift_frame" style={styles.td}>{user_name_with_code(user)}</td>
            {
              dates.map((date, index) => (
                    <UserFrame key={index}
                               date={date}
                               user={user}
                               dests={dests}
                               shift_users_user={shift_users[date][user.id]}
                    />
              ))
            }
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default ShiftUserWeek;
