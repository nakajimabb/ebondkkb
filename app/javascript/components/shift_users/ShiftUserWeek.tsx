import React from 'react';
import clsx from 'clsx';
import { active_shift_users_user, UserType, DestType, ShiftUserType, ShiftUsersUserType, ShiftUsersDateUserType, getUserTimestamp } from './tools';
import { user_name_with_code } from '../../tools/name_with_code';
import './styles.css';


const styles = {
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
  shift_user: ShiftUserType;
  dests: Map<number, DestType>;
}

const ShiftUser: React.FC<ShiftUserProps> = ({shift_user, dests}) => {
  const dest = dests.get(shift_user.dest_id);
  const texts = {at_work: '○', legal_holiday: '☓', paid_holiday: '有', full: '全', am: '前', pm: '後', night: '夜'};

  return (
    <div className={clsx('shift-user', shift_user.proc_type)}>
      <div className="badge badge-success" style={styles.roster_type}>{ texts[shift_user.roster_type] }</div>
      <div className="badge badge-info" style={styles.period_type}>{ texts[shift_user.period_type] }</div>
      <div className="text-nowrap"  style={styles.dest}>{ dest && dest.name }</div>
    </div>
  );
};


interface UserFrameProps {
  date: string;
  user: UserType;
  shift_users_user?: ShiftUsersUserType;
  dests: Map<number, DestType>;
  onFormSelected: (date: string, user_id: number) => () => void;
  timestamps: {}
}

const MuiUserFrame: React.FC<UserFrameProps> = ({date, user, shift_users_user, dests, onFormSelected, timestamps}) => {
  let shift_users = active_shift_users_user(shift_users_user);
  if(!shift_users) return <td></td>;

  return (
    <td style={styles.td} onDoubleClick={onFormSelected(date, user.id)}>
      {
        shift_users.map((shift_user, index) => <ShiftUser key={index} shift_user={shift_user} dests={dests} />)
      }
    </td>
  );
};

const UserFrame = React.memo(MuiUserFrame, ({timestamps: prev_timestamps, date: prev_date, user: prev_user},
                                                        {timestamps: next_timestamps, date: next_date, user: next_user}) => {
  if(prev_date !== next_date || prev_user.id !== next_user.id) {
    return false;
  } else {
    const prev_timestamp = getUserTimestamp(prev_timestamps, prev_date, prev_user.id);
    const next_timestamp = getUserTimestamp(next_timestamps, next_date, next_user.id);
    return prev_timestamp === next_timestamp;
  }
});

interface Props {
  dates: string[];
  shift_users: ShiftUsersDateUserType;
  users: Map<number, UserType>;
  dests: Map<number, DestType>;
  user_dated_values: {};
  dest_dated_values: {};
  area_ids: number[];
  onFormSelected: (date: string, user_id: number) => () => void;
  timestamps: {}
}

const ShiftUserWeek: React.FC<Props> = (props) => {
  const {dates, shift_users, users, dests, user_dated_values, dest_dated_values, area_ids, onFormSelected, timestamps} = props;

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
                               shift_users_user={shift_users[date][user.id]}
                               onFormSelected={onFormSelected}
                               timestamps={timestamps}
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
