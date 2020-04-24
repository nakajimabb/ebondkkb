import React, { useState, FormEvent } from 'react';
import { UserType, DestType, ShiftUserType, ShiftUsersUserType, vacantPeriodType, sortByPeriodType, collect_shift_users } from './tools';
import Select from '../Select';
import SelectDest from '../SelectDest';
import Alert from '../Alert';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../Dialog/index';
import { user_name_with_code } from '../../tools/name_with_code';


interface ShiftUserInputProps {
  index: number;
  shift_user: ShiftUserType;
  dests: Map<number, DestType>;
  onChange: (index: number, shift_user: ShiftUserType, name: string) => (e: FormEvent) => void,
}

const ShiftUserInput: React.FC<ShiftUserInputProps> = ({index, shift_user, dests, onChange}) => {
  const period_type_options = [ {label: '全', value: 'full'},
                                {label: '前', value: 'am'},
                                {label: '後', value: 'pm'},
                                {label: '夜', value: 'night'}];
  const roster_type_options = [ {label: '○', value: 'at_work'},
                                {label: '☓', value: 'legal_holiday'},
                                {label: '有', value: 'paid_holiday'}];
  const dest = dests.get(shift_user.dest_id);
  const dest_name = dest ? dest.name : '';

  return (
    <tr>
      <td className="p-0">
        <Select options={period_type_options}
                value={shift_user.period_type}
                onChange={onChange(index, shift_user, 'period_type')}
                className="form-control"
        />
      </td>
      <td className="p-0">
        <Select options={roster_type_options}
                value={shift_user.roster_type}
                onChange={onChange(index, shift_user, 'roster_type')}
                className="form-control"
        />
      </td>
      <td className="p-0">
        <SelectDest
          isClearable={true}
          value={{ label: dest_name, value: shift_user.dest_id }}
          onChange={onChange(index, shift_user, 'dest_id')}
        />
      </td>
    </tr>
  );
};

interface ShiftUserFieldsProps {
  title: string;
  shift_users: ShiftUserType[];
  dests: Map<number, DestType>;
  onNew?: (e: FormEvent) => void,
  onChange: (index: number, shift_user: ShiftUserType, name: string) => (e: FormEvent) => void,
}

const ShiftUserFields: React.FC<ShiftUserFieldsProps> = ({title, shift_users, dests, onNew, onChange}) => {
  return (
    <div className="card">
      <div className="card-header px-2 py-1">
        { title }
        {
          onNew && (
            <div className="card-tools">
              <button type="button" className="btn btn-xs btn-outline-primary mr-2" data-toggle="tooltip" onClick={onNew}>
                追加
              </button>
            </div>
          )
        }
      </div>
      <div className="card-body p-0">
        <table className="table">
          <tbody>
            { shift_users.map((shift_user, index) => (
              <ShiftUserInput key={index}
                              index={index}
                              shift_user={shift_user}
                              dests={dests}
                              onChange={onChange} />
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};


interface Props {
  date: string;
  user: UserType;
  shift_users_user?: ShiftUsersUserType;
  dests: Map<number, DestType>;
  onClose: (e?: FormEvent) => void;
  changeShiftUsersUser: (date: string, user_id: number, new_shift_users: ShiftUserType[]) => void;
}

const ShiftUserForm: React.FC<Props> = ({date, user, shift_users_user, dests, onClose, changeShiftUsersUser}) => {
  const title = `${date} ${user_name_with_code(user)}`;
  const [shift_users, setShiftUsers] = useState({...shift_users_user});
  const [errors, setErrors] = useState([]);

  const onChange = (index, shift_user, name) => (e) => {
    let new_shift_user;
    if(name === 'dest_id') {
      if(e) {
        new_shift_user = {...shift_user, dest_id: e.value};
      } else {
        new_shift_user = {...shift_user, dest_id: ''};
      }
    } else {
      new_shift_user = {...shift_user, [name]: e.target.value};
    }
    new_shift_user._modify = true;

    let shift_users_array = shift_users[shift_user.proc_type].map((s, i) => (i === index) ? new_shift_user : s);
    const new_shift_users = {...shift_users, [shift_user.proc_type]: shift_users_array };
    setShiftUsers(new_shift_users);
  };

  const onNew = (proc_type) => (e) => {
    const max_size = (proc_type === 'daily') ? 3 : 2;
    if(shift_users[proc_type].length >= max_size) return;

    const period_type = vacantPeriodType(shift_users[proc_type], proc_type === 'daily');
    if(!period_type) return;

    const new_shift_user = {dated_on: date, period_type, proc_type, user_id: user.id, roster_type: 'at_work', _modify: true};
    const new_shift_users = {...shift_users, [proc_type]: sortByPeriodType([...shift_users[proc_type], new_shift_user])};
    setShiftUsers(new_shift_users);
  };

  const onSave = async () => {
    try{
      const new_shift_users = collect_shift_users(shift_users);
      await changeShiftUsersUser(date, user.id, new_shift_users);
      onClose();
    } catch({response}) {
      console.log({response});
      const errors = response?.data?.errors || ['エラーが発生しました。'];
      setErrors(errors);
    }
  };

  return (
    <Dialog>
      <DialogTitle onClose={onClose}>{ title }</DialogTitle>
      <DialogContent>
        <Alert open={errors.length > 0} severity={"danger"} >
          { errors.map((error, index) => (
            <div key={index}>
              { error }
            </div>
          )) }
        </Alert>
        <ShiftUserFields title="基本設計" shift_users={shift_users.weekly} dests={dests} onNew={onNew('weekly')} onChange={onChange} />
        <ShiftUserFields title="カスタム" shift_users={shift_users.custom} dests={dests} onChange={onChange} />
        <ShiftUserFields title="祝日処理" shift_users={shift_users.rest_week} dests={dests} onChange={onChange} />
        <ShiftUserFields title="日別" shift_users={shift_users.daily} dests={dests} onNew={onNew('daily')} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onClose}>ｷｬﾝｾﾙ</button>
        <button type="button" className="btn btn-primary" onClick={onSave}>保存</button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftUserForm;
