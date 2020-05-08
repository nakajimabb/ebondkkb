import React, { useState, useEffect, useContext } from 'react';
import env from '../../environment';
import Select from '../Select';
import ShiftUserWeek from './ShiftUserWeek';
import ShiftShopWeek from './ShiftShopWeek';
import ShiftShopDaily from './ShiftShopDaily';
import ShiftUserForm from '../shift_users/ShiftUserForm';
import CircularProgress from '../CircularProgress'
import AppContext from './AppContext';
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


const ShiftMain: React.FC = () => {
  const {dates, cur_date, setCurDate, loadShiftUsers} = useContext(AppContext);
  const [params, setParams] = useState({start_date: '2020-03-03',
                                        end_date: '2020-03-03',
                                        job_type: 'pharmacist',
                                        shift_type: 'user_week',
                                        loading: false});
  const [regions, setRegions] = useState([]);
  const [area_ids, setAreaIds] = useState([]);
  const [selected, setSelected] = useState({date: null, user_id: null});

  const job_type_options = [{label: '薬剤師', value: 'pharmacist'}, {label: '事務員', value: 'office_worker'}];
  const shift_type_options = [{label: '人別', value: 'user_week'}, {label: '店別', value: 'shop_week'}, {label: '日別', value: 'shop_daily'}];
  const region_options = regions.map(region => ({label: region.name, value: region.area_ids}));


  useEffect(() => {
    const url = `${env.API_ORIGIN}/regions.json`;
    axios.get(url).then(({data}) => {
      setRegions(data);
    });
  }, []);

  const onChange = (e) => {
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;
    setParams({...params, [e.target.name]: value});
  };

  const onChangeRegion = (e) => {
    const new_area_ids = e.target.value.split(',').map(area_id => +area_id);
    setAreaIds(new_area_ids);
  };

  const onChangeDate = (e) => {
    setCurDate(e.target.value);
  };

  const onFormSelected = (date, user_id) => () => {
    setSelected({date, user_id});
  };

  const onFormClose = () => {
    setSelected({date: null, user_id: null});
  };

  return (
    <>
      <div className="input-group input-group-sm mb-1">
        <input className="form-control mr-1" type="date" name="start_date" style={styles.w140} value={params.start_date} onChange={onChange} />
        <input className="form-control mr-1" type="date" name="end_date" style={styles.w140} value={params.end_date} onChange={onChange} />
        <Select className="form-control mr-1" style={styles.w100} name="job_type" options={job_type_options} value={params.job_type} onChange={onChange} />
        <button className="btn btn-sm btn-outline-primary" onClick={loadShiftUsers(params, setParams)} >読込</button>
      </div>
      <div className="input-group input-group-sm mb-2">
        <Select className="form-control mr-1" style={styles.w100} name="shift_type" options={shift_type_options} value={params.shift_type} onChange={onChange} />
        <Select className="form-control mr-1" style={styles.w100} name="area_ids" options={region_options} prompt={"-ｴﾘｱ-"} value={area_ids.join(',')} onChange={onChangeRegion} />
        {
          (params.shift_type === 'shop_daily') && (
            <Select className="form-control mr-1"
                    style={styles.w100}
                    name="cur_date"
                    options={ dates.map(date => ({label: date, value: date})) }
                    value={cur_date}
                    onChange={onChangeDate}
            />
          )
        }
      </div>
      {
        params.loading && <CircularProgress />
      }
      {
        (!params.loading && params.shift_type === 'user_week') && (
            <ShiftUserWeek area_ids={area_ids}
                           onFormSelected={onFormSelected}
            />
        )
      }
      {
        (!params.loading && params.shift_type === 'shop_week') && (
          <ShiftShopWeek area_ids={area_ids}
          />
        )
      }
      {
        (!params.loading && params.shift_type === 'shop_daily') && cur_date && (
          <ShiftShopDaily  date={cur_date}
                           regions={regions}
                           area_ids={area_ids}
                           onFormSelected={onFormSelected}
          />
        )
      }
      {
        (selected.date && selected.user_id) && (
          <ShiftUserForm date={selected.date}
                         user_id={selected.user_id}
                         onClose={onFormClose}
          />
        )
      }
    </>
  );
};

export default ShiftMain;
