import React, { useState, useEffect } from 'react';
import moment from 'moment';
import env from '../../environment';
import Select from '../Select';
import ShiftUserWeek from './ShiftUserWeek';
import axios from "axios";

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


interface Props {
}

const ShiftMain: React.FC<Props> = props => {
  const [params, setParams] = useState({start_date: '2020-03-03', end_date: '2020-03-03', job_type: 'pharmacist', shift_type: 'user_week', shop_region: ''});
  const [users, setUsers] = useState(new Map<number, any>());
  const [dests, setDests] = useState(new Map<number, any>());
  const [user_dated_values, setUserDatedValues] = useState({});
  const [dest_dated_values, setDestDatedValues] = useState({});
  const [shift_users, setShiftUsers] = useState({});
  const [regions, setRegions] = useState([]);
  const [area_ids, setAreaIds] = useState([]);
  const job_type_options = [{label: '薬剤師', value: 'pharmacist'}, {label: '事務員', value: 'office_worker'}];
  const shift_type_options = [{label: '人別', value: 'user_week'}, {label: '店別', value: 'shop_week'}, {label: 'ｼﾌﾄﾒｲﾝ', value: 'shop_daily'}];
  const region_options = regions.map(region => ({label: region.name, value: region.area_ids}));

  const from = moment(params.start_date).toDate();
  const to = moment(params.end_date).toDate();
  let date_of_weeks = new Map<number, string>();  // 順序は挿入順
  for (let date = from; date <= to; date.setDate(date.getDate() + 1)) {
    date_of_weeks.set(date.getDay(), moment(date).format('YYYY-MM-DD'));
  }
  const dates = Array.from(date_of_weeks.values());

  useEffect(() => {
    const url = `${env.API_ORIGIN}/regions.json`;
    axios.get(url).then(({data}) => {
      setRegions(data);
      // setAreaIds(data.area_ids);
    });
  }, []);

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

  const formed_shift_users = (data: {weekly: any, holiday: any, custom: any, rest_week: any, daily: any}): {} => {
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

  const setState = (data) => {
    setShiftUsers(formed_shift_users(data.shift_users));
    setUsers(new Map(data.users.map(user => [user.id, user])));
    setDests(new Map(data.dests.map(dest => [dest.id, dest])));
    const new_user_dated_values = formed_by(data.user_dated_values, 'user_id', 'code', []);
    setUserDatedValues(new_user_dated_values);

    const new_dest_dated_values = formed_by(data.dest_dated_values, 'dest_id', 'code', []);
    setDestDatedValues(new_dest_dated_values);
  };

  const loadShiftUser = (e) => {
    const url = `${env.API_ORIGIN}/api/shift_users/shift_table.json`;
    axios.get(url, {params}).then(({data}) => {
      setState(data);
    })
  };

  const onChange = (e) => {
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    setParams({...params, [e.target.name]: value});
  };

  const onChangeRegion = (e) => {
    const new_area_ids = e.target.value.split(',').map(area_id => +area_id);
    setAreaIds(new_area_ids);
  };


  const onShiftUserChange = (date, name, shift_user) => (e) => {
    let new_shift_user, new_shift_users;
    if(name === 'dest_id')  {
      new_shift_user = {...shift_user, dest_id: e.value, dest_name: e.label};
    } else {
      new_shift_user = {...shift_user, [name]: e.target.value};
    }
    new_shift_user._modify = true;

    new_shift_users = {...shift_users[date]};
    new_shift_users[shift_user.user_id][shift_user.proc_type] = [new_shift_user];

    setShiftUsers({...shift_users, [date]: new_shift_users});
  };

  return (
    <>
      <div className="input-group input-group-sm mb-1">
        <input className="form-control mr-1" type="date" name="start_date" style={styles.w140} value={params.start_date} onChange={onChange} />
        <input className="form-control mr-1" type="date" name="end_date" style={styles.w140} value={params.end_date} onChange={onChange} />
        <Select className="form-control mr-1" style={styles.w100} name="job_type" options={job_type_options} value={params.job_type} onChange={onChange} />
        <Select className="form-control mr-1" style={styles.w100} name="shop_area_ids" options={region_options} prompt={"-店舗ｴﾘｱ-"} value={area_ids.join(',')} onChange={onChange} />
        <button className="btn btn-sm btn-outline-primary" onClick={loadShiftUser} >読込</button>
      </div>
      <div className="input-group input-group-sm mb-2">
        <Select className="form-control mr-1" style={styles.w100} name="shift_type" options={shift_type_options} value={params.shift_type} onChange={onChange} />
        <Select className="form-control mr-1" style={styles.w100} name="area_ids" options={region_options} prompt={"-社員ｴﾘｱ-"} value={area_ids.join(',')} onChange={onChangeRegion} />
      </div>

      {
        (params.shift_type === 'user_week') && (
            <ShiftUserWeek dates={dates}
                           shift_users={shift_users}
                           users={users}
                           dests={dests}
                           user_dated_values={user_dated_values}
                           dest_dated_values={dest_dated_values}
                           area_ids={area_ids}
                           onChange={onShiftUserChange}
            />
        )
      }
    </>
  );
};

export default ShiftMain;
