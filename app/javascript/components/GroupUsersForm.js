import React from 'react';
import clsx from 'clsx';
import SelectUser from './SelectUser';
import NestedAttributesForm from './NestedAttributesForm';
import { str } from '../tools/str';

const GroupUser = ({
  data,
  index,
  onChange,
  onDelete,
  editIndex,
  changeEditIndex,
}) => {
  return (
    <>
      <td className={clsx(data.error && 'pt-2 pb-0', 'w-75')}>
        {data._modify && (
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
      <td className="p-2 w-25">
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

const GroupUsersForm = ({ title, data }) => {
  const newData = () => ({ user_id: '', user_name: '' });

  const changeData = (e, prev_data) => {
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
