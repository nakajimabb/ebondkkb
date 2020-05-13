import React, {useState, useEffect, useContext} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import {
  RegionType,
  UserType,
  DestType,
  ShiftUserType,
  ShiftUsersUserType,
  active_shift_users_user,
  shift_users_user_text,
  unchangedFromWeekly,
  assignablePeriodType,
  getUserTimestamp,
  getDestTimestamp,
} from './tools';
import Backend from 'react-dnd-html5-backend'
import clsx from "clsx";
import { str } from '../../tools/str';
import { user_name_with_code, name_with_code, full_name } from '../../tools/name_with_code';
import Select from '../Select';
import './styles.css';
import AppContext from "./AppContext";


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


interface DestFrameUserProps {
  user: UserType;
  shift_user: ShiftUserType;
  hidden: boolean;
}

const DestFrameUser: React.FC<DestFrameUserProps> = ({user, shift_user, hidden}) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'unassigned',
    drop: () => ({ name: shift_user }),
    canDrop: () => !hidden,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let style = {borderColor: '#dee2e6', borderWidth: 1};
  if (isActive) {
    style.borderColor = 'magenta';
    style.borderWidth = 3;

  } else if (canDrop) {
  }

  return (
    <div ref={drop} className={clsx('user-frame', shift_user.proc_type)} style={style} >
      { full_name(user) }
    </div>
  );
};


interface DestFrameProps {
  shift_users_dest: ShiftUserType[];
  users: Map<number, UserType>;
  hidden: boolean;
  timestamp: Date;
}

const MuiDestFrame: React.FC<DestFrameProps> = ({shift_users_dest, users, hidden, timestamp}) => {
  if(!shift_users_dest) return null;

  return (
    <>
      { shift_users_dest.map((shift_user, index) => (
        <div key={index}>
          <DestFrameUser user={users.get(shift_user.user_id)} shift_user={shift_user} hidden={hidden} />
        </div>
      ))
      }
    </>
  )
};

const DestFrame = React.memo(MuiDestFrame, ({timestamp: prev_timestamp},
                                            {timestamp: next_timestamp}) => {
  return prev_timestamp === next_timestamp;
});

interface UserFrameContentProps {
  user: UserType;
  shift_users_user: ShiftUsersUserType;
  dests: Map<number, DestType>;
  isDragging: boolean,
  drag?: any,
}

const UserFrameContent: React.FC<UserFrameContentProps> = ({user, shift_users_user, dests, isDragging, drag}) => {
  const shift_users = active_shift_users_user(shift_users_user);
  if(!shift_users) return null;

  const text  = shift_users_user_text(shift_users, dests, false);
  const proc_type = shift_users[0].proc_type;
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div className={clsx('row', proc_type)}>
      <div ref={drag} className="border user-frame col" style={{ opacity }}>
        { user_name_with_code(user) }
      </div>
      <div className="border user-frame-full col">
        { text }
      </div>
    </div>
  );
};

interface UserFrameProps {
  date: string;
  user: UserType;
  shift_users_user?: ShiftUsersUserType;
  dests: Map<number, DestType>;
  hidden: boolean;
  timestamp: Date;
  onDrop: (date: string, user: UserType, shift_user: ShiftUserType) => () => void;
}

const MuiUserFrame: React.FC<UserFrameProps> = ({date, user, shift_users_user, dests, hidden, onDrop, timestamp}) => {

  const assignable = assignablePeriodType(shift_users_user, false);
  if(!assignable) {
    return <UserFrameContent user={user} shift_users_user={shift_users_user} dests={dests} isDragging={false} />
  }

  const [{ isDragging }, drag] = useDrag({
    item: { name: user, type: 'unassigned' },
    canDrag: !hidden || !!assignablePeriodType(shift_users_user, false),
    end: (item: {name: UserType}, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDrop(date, item.name, dropResult.name)();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return <UserFrameContent user={user} shift_users_user={shift_users_user} dests={dests} isDragging={isDragging} drag={drag} />
};

const UserFrame = React.memo(MuiUserFrame, ({timestamp: prev_timestamp},
                                            {timestamp: next_timestamp}) => {
  return prev_timestamp === next_timestamp;
});

interface UserFramesProps {
  date: string;
  regions: RegionType[];
  area_ids: number[];
  attend_type: string;
  onFormSelected: (date: string, user_id: number) => () => void;
}

const UserFrames: React.FC<UserFramesProps> = ({date, area_ids, attend_type, onFormSelected}) => {
  const {shift_users, users, dests, user_dated_values, onDropShiftUser, timestamps} = useContext(AppContext);

  const visibleUser = (user: {id: number}): boolean => {
    const area_dated_value = user_dated_values[user.id] && user_dated_values[user.id]['area_id'];
    if(area_dated_value && area_ids.indexOf(area_dated_value.value) !== -1) {
      const shift_users_user = active_shift_users_user(shift_users[date][user.id]);
      if(shift_users_user) {
        if(attend_type === 'at_work') {
          const table_type = user_dated_values[user.id].table_type?.to_enum;
          console.log({table_type});
          return (shift_users_user.some(s => s.roster_type === 'at_work') && (
              table_type === 'table_b' || !unchangedFromWeekly(shift_users[date][user.id])
          )
          );
        } else if(attend_type === 'unassigned') {
          return shift_users_user.some(s => s.roster_type === 'at_work' && !s.dest_id);
        } else if(attend_type === 'at_work_all') {
          return shift_users_user.some(s => s.roster_type === 'at_work');
        } else if(attend_type === 'holiday') {
          return shift_users_user.some(s => s.roster_type === 'legal_holiday' || s.roster_type === 'paid_holiday');
        }
      }
    }
    return false;
  };

  return (
    <div>
        { Array.from(users.values()).map((user, index) => {
          const hidden = !visibleUser(user);
          const class_name: string = hidden ? 'd-none' : '';
          const timestamp = getUserTimestamp(timestamps, date, user.id);
          return (
            <div key={index} className={class_name} onDoubleClick={onFormSelected(date, user.id)}>
              <UserFrame date={date}
                          user={user}
                          shift_users_user={shift_users[date][user.id]}
                          dests={dests}
                          hidden={hidden}
                          timestamp={timestamp}
                          onDrop={onDropShiftUser}
              />
            </div>
          );
          })
        }
    </div>
  )
};

interface Props {
  date: string;
  regions: RegionType[];
  area_ids: number[];
  onFormSelected: (date: string, user_id: number) => () => void;
}

const ShiftShopDaily: React.FC<Props> = (props) => {
  const [attend_type, setAttendType] = useState('at_work');
  const {date, regions, area_ids, onFormSelected} = props;
  const {shift_users_dest, users, dests, dest_dated_values, timestamps} = useContext(AppContext);
  const [user_area_ids, setUserAreaIds] = useState([]);
  const region_options = regions.map(region => ({label: region.name, value: str(region.area_ids)}));
  const attend_type_options = [{label: '出勤', value: 'at_work'},
                               {label: '出勤(空)', value: 'unassigned'},
                               {label: '出勤(全)', value: 'at_work_all'},
                               {label: '休日', value: 'holiday'}];

  const onChangeRegion = (e) => {
    const new_area_ids = e.target.value.split(',').map(area_id => +area_id);
    setUserAreaIds(new_area_ids);
  };

  const onChangeAttendType = (e) => {
    setAttendType(e.target.value);
  };

  useEffect(() => {
    if(regions.length > 0) {
      setUserAreaIds(regions[0].area_ids)
    } else {
      setUserAreaIds([]);
    }
  }, [regions]);


  const visibleDest = (dest: {id: number}, area_ids: number[]): boolean => {
    const dated_value = dest_dated_values[dest.id] && dest_dated_values[dest.id]['area_id'];
    if(dated_value && area_ids.indexOf(dated_value.value) !== -1) {
      return true;
    }
    return false;
  };

  return (
    <div className="shift-daily">
      <DndProvider backend={Backend}>
        <div className="shift-assigned">
          { Array.from(dests.values()).map((dest, index) => {
            const hidden = !visibleDest(dest, area_ids);
            const class_name: string = hidden ? 'd-none' : 'dest-row';
            const timestamp = getDestTimestamp(timestamps, date, dest.id);
            return (
              <div key={index} className={class_name}>
                <div className="border dest-frame">{ name_with_code(dest) }</div>
                {
                  <DestFrame shift_users_dest={shift_users_dest[date][dest.id]}
                             users={users}
                             hidden={hidden}
                             timestamp={timestamp}
                  />
                }
              </div>
            );
            })
          }
        </div>
        <div>
          <div className="input-group input-group-sm mb-2">
            <Select className="form-control mr-1"
                    style={styles.w100}
                    name="area_ids"
                    options={region_options}
                    value={user_area_ids.join(',')}
                    onChange={onChangeRegion}
            />
            <Select className="form-control mr-1"
                    style={styles.w100}
                    name="attend_type"
                    options={attend_type_options}
                    value={attend_type}
                    onChange={onChangeAttendType}
            />
          </div>
          <div className="shift-unassigned">
            <UserFrames date={date}
                        regions={regions}
                        attend_type={attend_type}
                        area_ids={user_area_ids}
                        onFormSelected={onFormSelected}
            />
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default ShiftShopDaily;
