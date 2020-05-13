import React, { useState, createContext } from 'react';
import {
  UserType,
  DestType,
  ShiftUserType,
  ShiftUsersDestType,
  ShiftUsersUserType,
  active_shift_users_user,
  ShiftUsersDateUserType,
  ShiftUsersDateDestType, active_shift_users,
} from './tools';
import axios from "axios";
import moment from 'moment';
import env from '../../environment';


const AppContext = createContext({
  dates: [],
  users: new Map<number, UserType>(),
  dests: new Map<number, DestType>(),
  user_dated_values: {},
  dest_dated_values: {},
  shift_users: {},
  shift_users_dest: {},
  timestamps: {overall: {}, users: {}, dests: {}},
  cur_date: '',
  setCurDate: null,
  loadShiftUsers: null,
  changeShiftUsersUser: null,
  onDropShiftUser: null,
});


export const AppContextProvider: React.FC = ({children}) => {
  const [dates, setDates] = useState([]);
  const [users, setUsers] = useState(new Map<number, UserType>());
  const [dests, setDests] = useState(new Map<number, DestType>());
  const [user_dated_values, setUserDatedValues] = useState({});
  const [dest_dated_values, setDestDatedValues] = useState({});
  const [shift_users, setShiftUsers] = useState({});
  const [shift_users_dest, setShiftUsersDest] = useState({});
  const [cur_date, setCurDate] = useState('');
  const [timestamps, setTimestamps] = useState({overall: {}, users: {}, dests: {}});

  const loadShiftUsers = (params, setParams) => () => {
    setParams({...params, loading: true});
    const url = `${env.API_ORIGIN}/api/shift_users/get_shift_users.json`;
    axios.get(url, {params: {...params, dests: true, user_dated_values: true, dest_dated_values: true}}).then(({data}) => {
      const new_dates = [];
      const from = moment(params.start_date).toDate();
      const to = moment(params.end_date).toDate();
      for (let date = from; date <= to; date.setDate(date.getDate() + 1)) {
        new_dates.push(moment(date).format('YYYY-MM-DD'));
      }
      setDates(new_dates);
      setCurDate(params.start_date);
      setState(new_dates, data);
      setParams({...params, loading: false});
    }).catch(error => {
      setParams({...params, loading: false});
    })
  };

  const formed_by = (data :object[], key_name: string, sub_key_name, order_key_names: string[]): {} => {
    let result = {};
    data.forEach(elem => {
      const key = elem[key_name];
      const sub_key = elem[sub_key_name];
      result[key] = result[key] || {};
      result[key][sub_key] = elem;
    });
    return result;
  };

  const formed_shift_users = (dates: string[], data: {weekly: object, holiday: object, custom: object, rest_week: object, daily: object}): ShiftUsersDateUserType => {
    let date_of_weeks = new Map<number, string>();  // 順序は挿入順
    dates.forEach(s => {
      const date = moment(s).toDate();
      date_of_weeks.set(date.getDay(), moment(date).format('YYYY-MM-DD'));
    });

    let new_shift_users = {};
    for(let date of dates)
      new_shift_users[date] = {};

    // 基本設計(曜日別)
    for(const wday of Object.keys(data.weekly)) {
      const date = date_of_weeks.get(+wday);
      data.weekly[wday].forEach(shift_user => {
        new_shift_users[date][shift_user.user_id] = new_shift_users[date][shift_user.user_id] || {weekly: [], holiday: [], custom: [], rest_week: [], daily: []};
        new_shift_users[date][shift_user.user_id].weekly.push(shift_user)
      });
    }
    // TODO: 基本設計(祝日)
    // ...
    // 基本設計(祝日)
    ['custom', 'rest_week', 'daily'].forEach(proc_type => {
      if(data[proc_type]) {
        data[proc_type].forEach(shift_user => {
          const date = shift_user.dated_on;
          new_shift_users[date][shift_user.user_id] = new_shift_users[date][shift_user.user_id] || {weekly: [], holiday: [], custom: [], rest_week: [], daily: []};
          new_shift_users[date][shift_user.user_id][proc_type].push(shift_user)
        })
      }
    });

    return new_shift_users;
  };

  const formed_shift_users_dest_date = (shift_users_date: {[user_id: number]: ShiftUsersUserType}): ShiftUsersDestType => {
    const proc_types = ['daily', 'rest_week', 'custom', 'holiday', 'weekly'];
    let shift_users_dest_date = {};
    for(const user_id in shift_users_date) {
      for(const proc_type of proc_types) {
        const shift_users_user = shift_users_date[user_id][proc_type];
        if(!shift_users_user || shift_users_user.length === 0) continue;
        for(const shift_user of shift_users_user) {
          const dest_id = shift_user.dest_id;
          if(shift_user.dest_id && shift_user.roster_type == 'at_work') {
            shift_users_dest_date[dest_id] = shift_users_dest_date[dest_id] || [];
            shift_users_dest_date[dest_id].push(shift_user);
          }
        }
        break;
      }
    }
    return shift_users_dest_date;
  };

  const formed_shift_users_dest = (shift_users: ShiftUsersDateUserType): ShiftUsersDateDestType => {
    let shift_users_dest = {};
    for(const date in shift_users) {
      shift_users_dest[date] = formed_shift_users_dest_date(shift_users[date])
    }
    return shift_users_dest;
  };

  const setState = (dates, data) => {
    const new_shift_users = formed_shift_users(dates, data.shift_users);
    setShiftUsers(new_shift_users);

    const new_users: Map<number, UserType> = new Map(data.users.map(user => [user.id, user]));
    setUsers(new_users);

    const new_dests: Map<number, DestType> = new Map(data.dests.map(dest => [dest.id, dest]));
    setDests(new_dests);

    const new_user_dated_values = formed_by(data.user_dated_values, 'user_id', 'code', []);
    setUserDatedValues(new_user_dated_values);

    const new_dest_dated_values = formed_by(data.dest_dated_values, 'dest_id', 'code', []);
    setDestDatedValues(new_dest_dated_values);

    const new_shift_users_dest = formed_shift_users_dest(new_shift_users);
    setShiftUsersDest(new_shift_users_dest);

    let new_timestamps = {overall: {}, users: {}, dests: {}};
    for(const date of dates) {
      new_timestamps.overall[date] = new Date();
    }
    setTimestamps(new_timestamps);
  };

  const changeShiftUsersUser = async (date: string, user_id: number, new_shift_users: ShiftUserType[]) => {
    const post_url = `${env.API_ORIGIN}/api/shift_users/save_shift_users`;
    await axios.post(post_url, {shift_users: new_shift_users});
    const get_url = `${env.API_ORIGIN}/api/shift_users/get_shift_users.json`;
    const {data: {shift_users: result_shift_users}} = await axios.get(get_url, {params: {start_date: date, end_date: date, user_id}});
    const before_shift_users_user = {...shift_users[date][user_id]};
    const after_shift_users = formed_shift_users(dates, result_shift_users);
    shift_users[date][user_id] = after_shift_users[date][user_id];
    setShiftUsers(shift_users);
    setShiftUsersDest(shift_users_dest);
    shift_users_dest[date] = changeShiftUsersDests(date, before_shift_users_user, after_shift_users[date][user_id], shift_users_dest[date]);
    // update timestamps
    const now = new Date();
    const users_timestamps = {...timestamps.users[date], [user_id]: now};
    const dest_ids1 = active_shift_users_user(before_shift_users_user).map(s => s.dest_id);
    const dest_ids2 = active_shift_users_user(after_shift_users[date][user_id]).map(s => s.dest_id);
    const dest_ids = Array.from(new Set(dest_ids1.concat(dest_ids2)));
    const dests_timestamps = {...timestamps.dests[date]};
    dest_ids.forEach(dest_id => dests_timestamps[dest_id] = now);
    setTimestamps({...timestamps, users: {...timestamps.users, [date]: users_timestamps},
      dests: {...timestamps.dests, [date]: dests_timestamps}});
  };

  const changeShiftUsersDests = (date: string,
                                 before_shift_users_user: ShiftUsersUserType,
                                 after_shift_users_user: ShiftUsersUserType,
                                 shift_users_dest) => {
    const before_shift_users = active_shift_users_user(before_shift_users_user).filter(s => !!s.dest_id);
    const after_shift_users  = active_shift_users_user(after_shift_users_user).filter(s => !!s.dest_id);

    let disappeared_shift_users = [];
    let added_shift_users = [];
    let other_shift_users = [];

    before_shift_users.forEach(bs => {
      const as = after_shift_users.find(as => as.id === bs.id);
      if(as) {
        other_shift_users.push(as);
      } else {
        disappeared_shift_users.push(bs);
      }
    });
    after_shift_users.forEach(as => {
      const bs = before_shift_users.find(bs => as.id === bs.id);
      if(!bs) {
        added_shift_users.push(as);
      }
    });

    const before_dest_ids = before_shift_users.map(s => s.dest_id);
    const after_dest_ids = after_shift_users.map(s => s.dest_id);
    const dest_ids = Array.from(new Set(before_dest_ids.concat(after_dest_ids)));

    dest_ids.forEach(dest_id => {
      shift_users_dest[dest_id] = shift_users_dest[dest_id] || [];
      disappeared_shift_users.forEach(ds => {
        const i = shift_users_dest[dest_id].findIndex(s => s.id === ds.id);
        if(i >= 0) shift_users_dest[dest_id].splice(i, 1);
      });
      added_shift_users.forEach(as => {
        if(as.dest_id === dest_id && as.roster_type === 'at_work') {
          shift_users_dest[dest_id].push(as);
        }
      });
      other_shift_users.forEach(os => {
        // 行き先変更(当店舗から他店舗に移動)
        const i1 = shift_users_dest[dest_id].findIndex(s => s.id === os.id && (dest_id !== os.dest_id || os.roster_type !== 'at_work'));
        if(i1 >= 0) shift_users_dest[dest_id].splice(i1, 1);
        // 行き先変更(他店舗から当店舗に移動)
        if(os.dest_id === dest_id && os.roster_type === 'at_work') {
          const i2 = shift_users_dest[dest_id].findIndex(s => s.id === os.id);
          if(i2 === -1) shift_users_dest[dest_id].push(os);
        }
      });
    });
    return shift_users_dest;
  };

  const onDropShiftUser = (date: string, user: UserType, shift_user: ShiftUserType) => () => {
    const shift_users_drag_user = active_shift_users(date, user.id, shift_users);
    const shift_users_drop_user = active_shift_users(date, shift_user.user_id, shift_users);
    if(shift_users_drag_user && shift_users_drop_user) {
      let new_shift_drag_user = {
        ...shift_users_drag_user[0],
        dest_id: shift_user.dest_id,
        proc_type: 'daily',
        roster_type: 'at_work',
        _modify: true
      };
      let new_shift_drop_user = {
        ...shift_users_drop_user[0],
        dest_id: null,
        proc_type: 'daily',
        _modify: true
      };

      let new_shift_users = {...shift_users[date]};
      new_shift_users[user.id].daily = [new_shift_drag_user];
      new_shift_users[shift_user.user_id].daily = [new_shift_drop_user];

      setShiftUsers({...shift_users, [date]: new_shift_users});

      const new_shift_users_dest = formed_shift_users_dest_date(new_shift_users);
      setShiftUsersDest({...shift_users_dest, [date]: new_shift_users_dest});

      // update timestamps
      const now = new Date();
      const users_timestamps = {...timestamps.users[date], [user.id]: now, [shift_user.user_id]: now};
      const dest_ids1 = shift_users_drag_user.map(s => s.dest_id);
      const dest_ids2 = shift_users_drop_user.map(s => s.dest_id);
      const dest_ids = Array.from(new Set(dest_ids1.concat(dest_ids2)));
      const dests_timestamps = {...timestamps.dests[date]};
      dest_ids.forEach(dest_id => dests_timestamps[dest_id] = now);
      setTimestamps({...timestamps, users: {...timestamps.users, [date]: users_timestamps},
        dests: {...timestamps.dests, [date]: dests_timestamps}});
    }
  };

  return (
    <AppContext.Provider
      value={{
        dates,
        users,
        dests,
        user_dated_values,
        dest_dated_values,
        shift_users,
        shift_users_dest,
        cur_date,
        setCurDate,
        timestamps,
        loadShiftUsers,
        changeShiftUsersUser,
        onDropShiftUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
