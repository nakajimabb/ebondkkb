import React, {FormEvent} from 'react';
import { UserType, DestType, ShiftUserType, ShiftUsersUserType } from './tools';
import Select from '../Select';
import SelectDest from '../SelectDest';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../Dialog/index';
import { user_name_with_code } from '../../tools/name_with_code';


interface ShiftUserInputProps {
  date: string;
  shift_user: ShiftUserType;
  dests: Map<number, DestType>;
  onChange: (date: string, name: string, shift_user: ShiftUserType) => (e: FormEvent) => void,
}

const ShiftUserInput: React.FC<ShiftUserInputProps> = ({date, shift_user, dests, onChange}) => {
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
                onChange={onChange(date, 'period_type', shift_user)}
                className="form-control"
        />
      </td>
      <td className="p-0">
        <Select options={roster_type_options}
                value={shift_user.roster_type}
                onChange={onChange(date, 'roster_type', shift_user)}
                className="form-control"
        />
      </td>
      <td className="p-0">
        <SelectDest
          isClearable={true}
          value={{ label: dest_name, value: shift_user.dest_id }}
          onChange={onChange(date, 'dest_id', shift_user)}
        />
      </td>
    </tr>
  );
};

interface ShiftUserFieldsProps {
  date: string;
  title: string;
  shift_users: ShiftUserType[];
  dests: Map<number, DestType>;
  onChange: (date: string, name: string, shift_user: ShiftUserType) => (e: FormEvent) => void,
}

const ShiftUserFields: React.FC<ShiftUserFieldsProps> = ({date, title, shift_users, dests, onChange}) => {
  return (
    <div className="card">
      <div className="card-header px-2 py-1">
        { title }
        <div className="card-tools">
          <button type="button" className="btn btn-tool" data-card-widget="collapse" data-toggle="tooltip"
                  title="Collapse">
            <i className="fas fa-minus"></i></button>
          <button type="button" className="btn btn-tool" data-card-widget="remove" data-toggle="tooltip"
                  title="Remove">
            <i className="fas fa-times"></i></button>
        </div>
      </div>
      <div className="card-body p-0">
        <table className="table">
          <tbody>
            { shift_users.map((shift_user, index) => (
              <ShiftUserInput key={index}
                              shift_user={shift_user}
                              date={date}
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
  onChange: (date: string, name: string, shift_user: ShiftUserType) => (e: FormEvent) => void,
  onClose: (e: FormEvent) => void;
}

const ShiftUserForm: React.FC<Props> = ({date, user, shift_users_user, dests, onChange, onClose}) => {
  const title = `${date} ${user_name_with_code(user)}`;

  const onSave = () => {

  };

  return (
    <Dialog>
      <DialogTitle onClose={onClose}>{ title }</DialogTitle>
      <DialogContent>
        <ShiftUserFields title="基本設計" shift_users={shift_users_user.weekly} date={date} dests={dests} onChange={onChange} />
        <ShiftUserFields title="カスタム" shift_users={shift_users_user.custom} date={date} dests={dests} onChange={onChange} />
        <ShiftUserFields title="祝日処理" shift_users={shift_users_user.rest_week} date={date} dests={dests} onChange={onChange} />
        <ShiftUserFields title="日別" shift_users={shift_users_user.daily} date={date} dests={dests} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onClose}>ｷｬﾝｾﾙ</button>
        <button type="button" className="btn btn-primary" onClick={onSave}>保存</button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftUserForm;
