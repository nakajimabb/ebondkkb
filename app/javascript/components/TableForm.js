import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SelectUser from './SelectUser';
import Pager from './Pager';

const TableForm = ({ title, data, per_page = 10 }) => {
  const [array, setArray] = useState(data);
  const [editIndex, setEditIndex] = useState(null);
  const page_count = Math.ceil(array.length / per_page);
  const [page, setPage] = useState(page_count);
  const [i1, i2] = [(page - 1) * per_page, page * per_page - 1];

  const deleteStyles = {
    textDecoration: 'line-through',
  };

  const addElem = (e) => {
    e.preventDefault();
    setArray([...array, { user_id: '', user_name: '' }]);
    setEditIndex(array.length);

    const page_count2 = Math.ceil((array.length + 1) / per_page);
    setPage(page_count2);
  };

  const changeEditIndex = (index) => (e) => {
    if (editIndex === index) {
      setEditIndex(-1);
    } else {
      setEditIndex(index);
    }
    e.preventDefault();
  };

  const onDelete = (index) => (e) => {
    if (array[index].id) {
      const new_data = { ...array[index], _destroy: !array[index]._destroy };
      setArray([...array.slice(0, index), new_data, ...array.slice(index + 1)]);
    } else {
      let new_array = [...array];
      new_array.splice(index, 1);
      setArray(new_array);
    }
    e.preventDefault();
  };

  const onSelectChange = (index) => (e) => {
    const new_data = { ...array[index], user_id: e.value, user_name: e.label };
    setArray([...array.slice(0, index), new_data, ...array.slice(index + 1)]);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-tools">
          <ul className="pagination pagination-sm float-left mx-3">
            <li className="page-item">
              <button
                onClick={addElem}
                className="btn btn-sm btn-outline-primary m-0"
              >
                追加
              </button>
            </li>
          </ul>

          <Pager count={page_count} page={page} setPage={setPage} />
        </div>
      </div>
      <div className="card-body p-0">
        <table className="table">
          <tbody>
            {array.map((elem, index) => (
              <tr
                key={index}
                className={index < i1 || index > i2 ? 'd-none' : ''}
                style={elem._destroy ? deleteStyles : null}
              >
                <td className={elem.error ? 'pt-2 pb-0' : ''}>
                  <input
                    type="hidden"
                    name={`group[group_users_attributes][${index}][id]`}
                    value={elem.id ? elem.id : ''}
                  />
                  <input
                    type="hidden"
                    name={`group[group_users_attributes][${index}][user_id]`}
                    value={elem.user_id ? elem.user_id : ''}
                  />
                  {elem._destroy ? (
                    <input
                      type="hidden"
                      name={`group[group_users_attributes][${index}][_destroy]`}
                      value={1}
                    />
                  ) : null}
                  {index == editIndex ? (
                    <SelectUser
                      value={{ label: elem.user_name, value: elem.user_id }}
                      onChange={onSelectChange(index)}
                    />
                  ) : (
                    <div style={{ height: 18 }}>{elem.user_name}</div>
                  )}
                  {elem.error && (
                    <div
                      className="text-danger m-0"
                      style={{ fontSize: '50%' }}
                    >
                      {elem.error}
                    </div>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={changeEditIndex(index)}
                    className="btn btn-sm btn-outline-primary mx-1"
                  >
                    編集
                  </button>
                  <button
                    onClick={onDelete(index)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableForm;
