import React, {FormEvent} from 'react';
import Select from '../Select';
import SelectDest from '../SelectDest';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../Dialog/index';
import { user_name_with_code } from '../../tools/name_with_code';


interface ShiftUserInputProps {
  date: string;
  shift_user: any;
  onChange: (date: string, name: string, shift_user: any) => (e: FormEvent) => void,
}

const ShiftUserInput: React.FC<ShiftUserInputProps> = ({date, shift_user, onChange}) => {
  const options = [ {label: '全', value: 'full'},
                    {label: '前', value: 'am'},
                    {label: '後', value: 'pm'},
                    {label: '夜', value: 'night'}];
  return (
    <tr>
      <td className="p-0">
        <Select options={options} value={shift_user.period_type} onChange={onChange(date, 'period_type', shift_user)} className="form-control" />
      </td>
      <td className="p-0">
        <SelectDest
          isClearable={true}
          value={{ label: shift_user.dest_name, value: shift_user.dest_id }}
          onChange={onChange(date, 'dest_id', shift_user)}
        />
      </td>
    </tr>
  );
};

interface ShiftUserFieldsProps {
  date: string;
  title: string;
  shift_users: any;
  onChange: (date: string, name: string, shift_user: any) => (e: FormEvent) => void,
}

const ShiftUserFields: React.FC<ShiftUserFieldsProps> = ({date, title, shift_users, onChange}) => {
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
            { shift_users.map(shift_user => <ShiftUserInput shift_user={shift_user} date={date} onChange={onChange} />) }
          </tbody>
        </table>
      </div>
    </div>
  );
};


interface Props {
  date: string;
  user: any;
  shift_users_user?: {weekly: any, holiday: any, custom: any, rest_week: any, daily: any};
  dests: Map<number, any>;
  onChange: (date: string, name: string, shift_user: any) => (e: FormEvent) => void,
  onClose: (e: FormEvent) => void;
}

const ShiftUserForm: React.FC<Props> = ({date, user, shift_users_user, dests, onChange, onClose}) => {
  const title = `${date} ${user_name_with_code(user)}`;

  const onSave = () => {

  };

  return (
    <Dialog title={title} onClose={onClose} >
      <DialogTitle onClose={onClose}>{ title }</DialogTitle>
      <DialogContent>
        <ShiftUserFields title="基本設計" shift_users={shift_users_user.weekly} date={date} onChange={onChange} />
        <ShiftUserFields title="カスタム" shift_users={shift_users_user.custom} date={date} onChange={onChange} />
        <ShiftUserFields title="祝日処理" shift_users={shift_users_user.rest_week} date={date} onChange={onChange} />
        <ShiftUserFields title="日別" shift_users={shift_users_user.daily} date={date} onChange={onChange} />
      </DialogContent>
      <DialogActions>
        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onClose}>ｷｬﾝｾﾙ</button>
        <button type="button" className="btn btn-primary" onClick={onSave}>保存</button>
      </DialogActions>
    </Dialog>
  );
};

export default ShiftUserForm;
