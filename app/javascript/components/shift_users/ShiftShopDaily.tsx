import React, {useState, useEffect} from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import clsx from "clsx";
import { user_name_with_code, name_with_code, full_name } from '../../tools/name_with_code';
import Select from '../Select';
import './styles.css';


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
  user: any;
  shift_user: any;
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
  let style: any = {borderColor: '#dee2e6', borderWidth: 1, boxSizing: 'border-box'};
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
  dest: any;
  users: Map<number, any>;
  shift_users_dest: any;
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


interface UnassignedProps {
  date: string;
  user: any;
  shift_users: any;
  dests: Map<number, any>;
  onDropped: (date: string, user: any, shift_user: any) => () => void;
  hidden: boolean;
}

const Unassigned: React.FC<UnassignedProps> = ({date, user, shift_users, dests, onDropped, hidden}) => {

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

  const [{ isDragging }, drag] = useDrag({
    item: { name: user, type: 'unassigned' },
    canDrag: !hidden,
    end: (item: {name: string}, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        onDropped(date, item.name, dropResult.name)();
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [proc_type, text] = shift_users_user_text(shift_users, dests);
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


interface UnassignedUsersProps {
  date: string;
  shift_users: {};
  users: Map<number, any>;
  dests: Map<number, any>;
  user_dated_values: {};
  regions: any;
  onFormSelected: (date: string, user_id: number) => () => void;
  onDropped: (date: string, user: any, shift_user: any) => () => void;
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
                <Unassigned date={date} user={user} shift_users={shift_users[user.id]} dests={dests} onDropped={onDropped} hidden={hidden} />
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
  shift_users: {};
  shift_users_dest: {};
  users: Map<number, any>;
  dests: Map<number, any>;
  user_dated_values: {};
  dest_dated_values: {};
  area_ids: number[];
  regions: any;
  onFormSelected: (date: string, user_id: number) => () => void;
  onDropped: (date: string, user: any, shift_user: any) => () => void;
}

const ShiftShopDaily: React.FC<Props> = (props) => {
  const {date, shift_users, shift_users_dest, users, dests, user_dated_values, dest_dated_values, regions, area_ids, onFormSelected, onDropped} = props;

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
                                   shift_users_dest={shift_users_dest[dest.id]}
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
                           shift_users={shift_users}
                           users={users}
                           dests={dests}
                           user_dated_values={user_dated_values}
                           regions={regions}
                           onFormSelected={onFormSelected}
                           onDropped={onDropped}
          />

        </div>
      </DndProvider>
    </div>
  );
};

export default ShiftShopDaily;
