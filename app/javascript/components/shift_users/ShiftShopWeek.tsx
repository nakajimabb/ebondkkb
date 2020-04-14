import React from 'react';
import { UserType, DestType, ShiftUserType, ShiftUsersDestType, ShiftUsersDateDestType } from './tools';
import { full_name, name_with_code } from '../../tools/name_with_code';
import './styles.css';


interface DestFrameProps {
  date: string;
  dest: DestType;
  users: Map<number, UserType>;
  shift_users_dest: ShiftUserType[];
}

const FrameDate: React.FC<DestFrameProps> = ({date, dest, users, shift_users_dest}) => {
  if(!shift_users_dest) return null;

  return (
    <>
      { shift_users_dest.map((shift_user, index) => (
        <div key={index} className={shift_user.proc_type}>{ full_name(users.get(shift_user.user_id)) }</div>
      ))
      }
    </>
  )
};


interface Props {
  dates: string[];
  shift_users_dest: ShiftUsersDateDestType;
  users: Map<number, UserType>;
  dests: Map<number, DestType>;
  user_dated_values: {};
  dest_dated_values: {};
  area_ids: number[];
}

const ShiftShopWeek: React.FC<Props> = (props) => {
  const {dates, shift_users_dest, users, dests, user_dated_values, dest_dated_values, area_ids} = props;

  const visibleDest = (dest: {id: number}, area_ids: number[]): boolean => {
    const dated_value = dest_dated_values[dest.id] && dest_dated_values[dest.id]['area_id'];
    if(dated_value && area_ids.indexOf(dated_value.value) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <table className="table table-sm">
      <thead>
      <tr>
        <th>店舗</th>
        { dates.map((date,index) => (<th key={index}>{date}</th>)) }
      </tr>
      </thead>
      <tbody>
      { Array.from(dests.values()).map((dest, index) => {
        const class_name: string = visibleDest(dest, area_ids) ? '' : 'd-none';
        return (
            <tr key={index} className={class_name} >
              <td className="dest-frame">{ name_with_code(dest) }</td>
              {
                dates.map((date, index) => (
                  <td key={index} className="user-frame">
                    {
                      <FrameDate date={date}
                                 dest={dest}
                                 users={users}
                                 shift_users_dest={shift_users_dest[date][dest.id]}
                      />
                    }
                  </td>
                ))
              }
            </tr>
          );
        })
      }
      </tbody>
    </table>
  );
};

export default ShiftShopWeek;
