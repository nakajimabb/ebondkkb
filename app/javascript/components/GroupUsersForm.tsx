import React, {FormEvent} from 'react';
import SelectUser from './SelectUser';
import NestedAttributesForm from './NestedAttributesForm';
import { str } from '../tools/str';

interface GroupUserProps {
  data: {id: number, user_id: number, user_name: string, error: string, _destroy: boolean, _modify: boolean},
  index: number,
  onChange: (e: FormEvent) => void,
  onDelete: (e: FormEvent) => void,
  editIndex: number,
  changeEditIndex: (e: FormEvent) => void,
}

const GroupUser: React.FC<GroupUserProps> = ({
  data,
  index,
  onChange,
  onDelete,
  editIndex,
  changeEditIndex,
}) => {
  return (
    <>
      <td className={data.error && 'pt-2 pb-0'}>
        {(data._modify || !data.id) && (
          <>
            <input
              type="hidden"
              name={`group[group_users_attributes][${index}][id]`}
              value={str(data.id)}
            />
            <input
              type="hidden"
              name={`group[group_users_attributes][${index}][user_id]`}
              value={str(data.user_id)}
            />
            {data._destroy && (
              <input
                type="hidden"
                name={`group[group_users_attributes][${index}][_destroy]`}
                value={1}
              />
            )}
          </>
        )}
        {index === editIndex ? (
          <SelectUser
            isClearable={false}
            shop={true}
            value={{ label: data.user_name, value: data.user_id }}
            onChange={onChange}
          />
        ) : (
          <div style={{ height: 18 }}>{data.user_name}</div>
        )}
        {data.error && (
          <div className="text-danger m-0" style={{ fontSize: '50%' }}>
            {data.error}
          </div>
        )}
      </td>
      <td className="p-2" style={{ width: 120 }}>
        <button
          onClick={changeEditIndex}
          className="btn btn-sm btn-outline-primary mx-1"
        >
          編集
        </button>
        <button onClick={onDelete} className="btn btn-sm btn-outline-danger">
          削除
        </button>
      </td>
    </>
  );
};

interface Props {
    title: string,
    data: {id: number, user_id: number, user_name: string, error: string, _destroy: boolean, _modify: boolean}[],
}

const GroupUsersForm: React.FC<Props> = ({ title, data }) => {
  const newData = () => ({ user_id: '', user_name: '' });

  const changeData = (e: any, prev_data: object): object => {
    return {
      ...prev_data,
      user_id: e.value,
      user_name: e.label,
    };
  };

  return (
    <NestedAttributesForm
      title={title}
      data={data}
      newData={newData}
      changeData={changeData}
      component={GroupUser}
    />
  );
};

export default GroupUsersForm;
