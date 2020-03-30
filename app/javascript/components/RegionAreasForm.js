import React from 'react';
import Select from 'react-select';
import NestedAttributesForm from './NestedAttributesForm';
import { str } from '../tools/str';

const RegionArea = ({
  data,
  index,
  onChange,
  onDelete,
  editIndex,
  changeEditIndex,
  other,
}) => {
  const { select_options } = other;
  return (
    <>
      <td className={data.error && 'pt-2 pb-0'}>
        {(data._modify || !data.id) && (
          <>
            <input
              type="hidden"
              name={`region[region_areas_attributes][${index}][id]`}
              value={str(data.id)}
            />
            <input
              type="hidden"
              name={`region[region_areas_attributes][${index}][area_id]`}
              value={str(data.area_id)}
            />
            {data._destroy && (
              <input
                type="hidden"
                name={`region[region_areas_attributes][${index}][_destroy]`}
                value={1}
              />
            )}
          </>
        )}
        {index === editIndex ? (
          <Select
            value={{ label: data.area_name, value: data.area_id }}
            onChange={onChange}
            options={select_options}
          />
        ) : (
          <div style={{ height: 18 }}>{data.area_name}</div>
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

const RegionAreasForm = ({ title, data, component_props }) => {
  const newData = () => ({ area_id: '', area_name: '' });

  const changeData = (e, prev_data) => {
    return {
      ...prev_data,
      area_id: e.value,
      area_name: e.label,
    };
  };

  return (
    <NestedAttributesForm
      title={title}
      data={data}
      newData={newData}
      changeData={changeData}
      component={RegionArea}
      component_props={component_props}
    />
  );
};

export default RegionAreasForm;
