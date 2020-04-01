import React, { FormEvent, useState } from 'react';
import Pager from './Pager';

interface Props {
  title: string;
  data: any[];
  newData: any;
  changeData: (e: FormEvent, prev_data: object) => object;
  component: React.FC<any>;
  component_props?: object;
  per_page?: number;
}

const NestedAttributesForm: React.FC<Props> = ({
  title,
  data,
  newData,
  changeData,
  component: Component,
  component_props: component_props = {},
  per_page = 10,
}) => {
  const [array, setArray] = useState(data);
  const [editIndex, setEditIndex] = useState(null);
  const page_count = Math.ceil(array.length / per_page);
  const [page, setPage] = useState(page_count);
  const [i1, i2] = [(page - 1) * per_page, page * per_page - 1];

  const deleteStyles = {
    textDecoration: 'line-through',
  };

  const addData = (e: FormEvent) => {
    setArray([...array, { ...newData(), _modify: true }]);
    setEditIndex(array.length);

    const page_count2 = Math.ceil((array.length + 1) / per_page);
    setPage(page_count2);
    e.preventDefault();
  };

  const changeEditIndex = (index) => (e: FormEvent) => {
    if (editIndex === index) {
      setEditIndex(-1);
    } else {
      setEditIndex(index);
    }
    e.preventDefault();
  };

  const onChange = (index: number) => (e: FormEvent) => {
    const new_data = { ...changeData(e, array[index]), _modify: true };
    setArray([...array.slice(0, index), new_data, ...array.slice(index + 1)]);
  };

  const onDelete = (index: number) => (e: FormEvent) => {
    if (array[index].id) {
      const new_data = {
        ...array[index],
        _destroy: !array[index]._destroy,
        _modify: true,
      };
      setArray([...array.slice(0, index), new_data, ...array.slice(index + 1)]);
    } else {
      let new_array = [...array];
      new_array.splice(index, 1);
      setArray(new_array);
    }
    e.preventDefault();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-tools">
          <ul className="pagination pagination-sm float-left mx-3">
            <li className="page-item">
              <button
                onClick={addData}
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
                <Component
                  data={elem}
                  index={index}
                  editIndex={editIndex}
                  onChange={onChange(index)}
                  onDelete={onDelete(index)}
                  changeEditIndex={changeEditIndex(index)}
                  other={component_props}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NestedAttributesForm;
