import React, {FormEvent, useState} from 'react';
import clsx from 'clsx';
import ShiftUserForm from '../shift_users/ShiftUserForm';
import { user_name_with_code, name_with_code } from '../../tools/name_with_code';


const styles = {
  weekly: {
    backgroundColor: 'floralwhite',
  },
  holiday: {
    backgroundColor: 'floralwhite',
  },
  custom: {
    backgroundColor: 'gold',
  },
  rest_week: {
    backgroundColor: 'pink',
  },
  daily: {
    backgroundColor: 'yellow',
  },
  td: {
    padding: '0 2px',
    fontSize: '85%',
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
  },
  user: {
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

  return (
    <div className="shift-user" style={styles[shift_user.proc_type]}>
      <div className="badge badge-success" style={styles.roster_type}>{ texts[shift_user.roster_type] }</div>
      <div className="badge badge-info" style={styles.period_type}>{ texts[shift_user.period_type] }</div>
      <div className="text-nowrap"  style={styles.dest}>{ dest && dest.name }</div>
    </div>
  );
};


interface UserFrameProps {
  date: string;
  user: any;
  shift_users_user?: {weekly: any, holiday: any, custom: any, rest_week: any, daily: any};
  dests: Map<number, any>;
  selected: {date: string, user_id: null | number};
  setSelected: any;
  onChange: (date: string, name: string, shift_user: any) => (e: FormEvent) => void,
}

const UserFrame: React.FC<UserFrameProps> = ({date, user, shift_users_user, dests, selected, setSelected, onChange}) => {
  const is_selected = ((selected.date === date) && (selected.user_id === user.id));
  let shift_users = null;
  if(shift_users_user) {
    if(shift_users_user.daily.length > 0)           shift_users = shift_users_user.daily;
    else if(shift_users_user.rest_week.length > 0)  shift_users = shift_users_user.rest_week;
    else if(shift_users_user.custom.length > 0)     shift_users = shift_users_user.custom;
    else if(shift_users_user.holiday.length > 0)    shift_users = shift_users_user.holiday;
    else if(shift_users_user.weekly.length > 0)     shift_users = shift_users_user.weekly;
  }
  if(!shift_users) return <td></td>;

  const onClose = () => {
    setSelected({user_id: null, date: null});
  };

  const onSave = () => {

  };

  return (
    <td className={clsx(is_selected && 'font-weight-bold')} style={styles.td} onDoubleClick={() => setSelected({date: date, user_id: user.id})}>
      {
        shift_users.map((shift_user, index) => <ShiftUser key={index} shift_user={shift_user} dests={dests} />)
      }
      {
        is_selected && <ShiftUserForm date={date} user={user} shift_users_user={shift_users_user} dests={dests} onChange={onChange} onClose={onClose} />
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
  onChange: (date: string, name: string, shift_user: any) => (e: FormEvent) => void,
}

const ShiftUserWeek: React.FC<Props> = (props) => {
  const {dates, shift_users, users, dests, user_dated_values, dest_dated_values, area_ids, onChange} = props;
  const [selected, setSelected] = useState({date: null, user_id: null});

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
            <td className="text-nowrap" style={styles.td}>{user_name_with_code(user)}</td>
            {
              dates.map((date, index) => (
                    <UserFrame key={index}
                               date={date}
                               user={user}
                               dests={dests}
                               selected={selected}
                               setSelected={setSelected}
                               shift_users_user={shift_users[date][user.id]}
                               onChange={onChange}
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
