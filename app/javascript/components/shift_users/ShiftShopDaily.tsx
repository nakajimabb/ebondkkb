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
  assignablePeriodType,
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
  date: string;
  dest: DestType;
  users: Map<number, UserType>;
  shift_users_dest: ShiftUserType[];
  hidden: boolean;
}

const DestFrame: React.FC<DestFrameProps> = ({date, dest, users, shift_users_dest, hidden}) => {
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


interface UnassignedContentProps {
  user: UserType;
  shift_users_user: ShiftUsersUserType;
  dests: Map<number, DestType>;
  isDragging: boolean,
  drag?: any,
}

const UnassignedContent: React.FC<UnassignedContentProps> = ({user, shift_users_user, dests, isDragging, drag}) => {
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

interface UnassignedProps {
  date: string;
  user: UserType;
  shift_users_user: ShiftUsersUserType;
  dests: Map<number, DestType>;
  onDropped: (date: string, user: UserType, shift_user: ShiftUserType) => () => void;
  hidden: boolean;
}

const Unassigned: React.FC<UnassignedProps> = ({date, user, shift_users_user, dests, onDropped, hidden}) => {
  const assignable = assignablePeriodType(shift_users_user, false);
  if(!assignable) {
    return <UnassignedContent user={user} shift_users_user={shift_users_user} dests={dests} isDragging={false} />
  }

  const [{ isDragging }, drag] = useDrag({
    item: { name: user, type: 'unassigned' },
    canDrag: !hidden || !!assignablePeriodType(shift_users_user, false),
    end: (item: {name: UserType}, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDropped(date, item.name, dropResult.name)();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return <UnassignedContent user={user} shift_users_user={shift_users_user} dests={dests} isDragging={isDragging} drag={drag} />
};


interface UnassignedUsersProps {
  date: string;
  shift_users: ShiftUsersUserType;
  users: Map<number, UserType>;
  dests: Map<number, DestType>;
  user_dated_values: {};
  regions: RegionType[];
  onFormSelected: (date: string, user_id: number) => () => void;
  onDropped: (date: string, user: UserType, shift_user: ShiftUserType) => () => void;
}

const UnassignedUsers: React.FC<UnassignedUsersProps> = ({date,
                                                           shift_users,
                                                           users,
                                                           dests,
                                                           user_dated_values,
                                                           regions,
                                                           onFormSelected,
                                                           onDropped
                                                         }) => {
  const [area_ids, setAreaIds] = useState([]);
  const region_options = regions.map(region => ({label: region.name, value: str(region.area_ids)}));

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

  return (
    <>
      <div className="input-group input-group-sm mb-2">
        <Select className="form-control mr-1" style={styles.w100} name="area_ids" options={region_options} value={area_ids.join(',')} onChange={onChangeRegion} />
      </div>
      <div>
          { Array.from(users.values()).map((user, index) => {
            const hidden = !visibleUser(user, area_ids);
            const class_name: string = hidden ? 'd-none' : '';
            return (
              <div key={index} className={class_name} onDoubleClick={onFormSelected(date, user.id)}>
                <Unassigned date={date} user={user} shift_users_user={shift_users[user.id]} dests={dests} onDropped={onDropped} hidden={hidden} />
              </div>
            );
            })
          }
      </div>
    </>
  )
};

interface Props {
  date: string;
  regions: RegionType[];
  area_ids: number[];
  onFormSelected: (date: string, user_id: number) => () => void;
}

const ShiftShopDaily: React.FC<Props> = (props) => {
  const {date, regions, area_ids, onFormSelected} = props;
  const {shift_users, shift_users_dest, users, dests, user_dated_values, dest_dated_values, timestamps, onDropShiftUser} = useContext(AppContext);

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
            return (
              <div key={index} className={class_name}>
                <div className="border dest-frame">{ name_with_code(dest) }</div>
                {
                        <DestFrame date={date}
                                   dest={dest}
                                   users={users}
                                   shift_users_dest={shift_users_dest[date][dest.id]}
                                   hidden={hidden}
                        />
                }
              </div>
            );
            })
          }
        </div>
        <div className="shift-unassigned">
          <UnassignedUsers date={date}
                           shift_users={shift_users[date]}
                           users={users}
                           dests={dests}
                           user_dated_values={user_dated_values}
                           regions={regions}
                           onFormSelected={onFormSelected}
                           onDropped={onDropShiftUser}
          />

        </div>
      </DndProvider>
    </div>
  );
};

export default ShiftShopDaily;
