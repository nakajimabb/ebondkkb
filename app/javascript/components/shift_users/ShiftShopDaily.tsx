import React, {useState, useEffect} from 'react';
import { user_name_with_code, name_with_code, full_name } from '../../tools/name_with_code';
import Select from "../Select";
import './styles.css';
import clsx from "clsx";


const styles = {
  w100: {
    flexGrow: 0,
    width: 100,
  },
  w140: {
    flexGrow: 0,
    width: 140,
  },
};

interface DestFrameProps {
  date: string;
  dest: any;
  users: Map<number, any>;
  shift_users_dest: any;
}

const DestFrame: React.FC<DestFrameProps> = ({date, dest, users, shift_users_dest}) => {
  if(!shift_users_dest) return null;

  return (
    <>
      { shift_users_dest.map((shift_user, index) => (
        <div key={index} className={clsx('border', 'user-frame', shift_user.proc_type)}>
          { full_name(users.get(shift_user.user_id)) }
        </div>
      ))
      }
    </>
  )
};


interface UnassignedUsersProps {
  date: string;
  shift_users: {};
  users: Map<number, any>;
  dests: Map<number, any>;
  user_dated_values: {};
  regions: any;
  onFormSelected: (date: string, user_id: number) => () => void;
}

const UnassignedUsers: React.FC<UnassignedUsersProps> = ({date,
                                                           shift_users,
                                                           users,
                                                           dests,
                                                           user_dated_values,
                                                           regions,
                                                           onFormSelected}) => {
  const [area_ids, setAreaIds] = useState([]);
  const region_options = regions.map(region => ({label: region.name, value: region.area_ids}));

  useEffect(() => {
    if(regions.length > 0) {
      setAreaIds(regions[0].area_ids)
    } else {
      setAreaIds([]);
    }
  }, [regions]);

  const onChangeRegion = (e) => {
    const new_area_ids = e.target.value.split(',').map(area_id => +area_id);
    setAreaIds(new_area_ids);
  };

  const visibleUser = (dest: {id: number}, area_ids: number[]): boolean => {
    const dated_value = user_dated_values[dest.id] && user_dated_values[dest.id]['area_id'];
    if(dated_value && area_ids.indexOf(dated_value.value) !== -1) {
      return true;
    }
    return false;
  };

  const shift_users_user_text = (shift_users_user: any, dests: Map<number, any>): [string, string] => {
    if(!shift_users_user) return [null, ''];

    let valid_proc_type = null;
    const proc_types = ['daily', 'rest_week', 'custom', 'holiday', 'weekly'];
    let texts = {am: '', pm: '', full: '', night: ''};
    for(const proc_type of proc_types) {
      const shift_users_user2 = shift_users_user[proc_type];
      if(!shift_users_user2 || shift_users_user2.length === 0) continue;
      for(const shift_user of shift_users_user2) {
        if(shift_user.roster_type == 'at_work') {
          if (shift_user.dest_id) {
            const dest = dests.get(shift_user.dest_id);
            texts[shift_user.period_type] = dest ? dest.name : '?';
          } else {
            texts[shift_user.period_type] = '○';
          }
        } else if(shift_user.roster_type == 'legal_holiday') {
          texts[shift_user.period_type] = '公休';
        } else if(shift_user.roster_type == 'paid_holiday') {
          texts[shift_user.period_type] = '有休';
        }
      }
      valid_proc_type = proc_type;
      break;
    }
    if(texts.full) {
      delete texts.am;
      delete texts.pm;
    } else {
      delete texts.full;
    }
    delete texts.night;
    return [valid_proc_type, Object.values(texts).join('/')];
  };

  return (
    <>
      <div className="input-group input-group-sm mb-2">
        <Select className="form-control mr-1" style={styles.w100} name="area_ids" options={region_options} value={area_ids.join(',')} onChange={onChangeRegion} />
      </div>
      <table>
        <tbody>
          { Array.from(users.values()).map((user, index) => {
            const class_name: string = visibleUser(user, area_ids) ? '' : 'd-none';
            const [proc_type, text] = shift_users_user_text(shift_users[user.id], dests);
            return (
              <tr key={index} className={clsx(class_name, proc_type)} onDoubleClick={onFormSelected(date, user.id)}>
                <td className="border user-frame">{ user_name_with_code(user) }</td>
                <td className="border user-frame-full">{ text }</td>
              </tr>
            );
            })
          }
        </tbody>
      </table>
    </>
  )
};

interface Props {
  date: string;
  shift_users: {};
  shift_users_dest: {};
  users: Map<number, any>;
  dests: Map<number, any>;
  user_dated_values: {};
  dest_dated_values: {};
  area_ids: number[];
  regions: any;
  onFormSelected: (date: string, user_id: number) => () => void;
}

const ShiftShopDaily: React.FC<Props> = (props) => {
  const {date, shift_users, shift_users_dest, users, dests, user_dated_values, dest_dated_values, regions, area_ids, onFormSelected} = props;

  const visibleDest = (dest: {id: number}, area_ids: number[]): boolean => {
    const dated_value = dest_dated_values[dest.id] && dest_dated_values[dest.id]['area_id'];
    if(dated_value && area_ids.indexOf(dated_value.value) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <div className="shift-daily">
      <div className="shift-assigned">
        { Array.from(dests.values()).map((dest, index) => {
          const class_name: string = visibleDest(dest, area_ids) ? 'dest-row' : 'd-none';
          return (
            <div className={class_name}>
              <div className="border dest-frame">{ name_with_code(dest) }</div>
              {
                      <DestFrame date={date}
                                 dest={dest}
                                 users={users}
                                 shift_users_dest={shift_users_dest[dest.id]}
                      />
              }
            </div>
          );
          })
        }
      </div>
      <div className="shift-unassigned">
        <UnassignedUsers date={date} shift_users={shift_users} users={users} dests={dests} user_dated_values={user_dated_values} regions={regions} onFormSelected={onFormSelected} />
      </div>
    </div>
  );
};

export default ShiftShopDaily;
