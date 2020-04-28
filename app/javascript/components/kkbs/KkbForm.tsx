import React, {FormEvent, useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../Dialog/index';
import SelectUser from "../SelectUser";
import {str} from '../../tools/str';
import { csrfToken } from '@rails/ujs';
import axios from 'axios';
import env from '../../environment';

interface KkbUserProps {
  data: { id: number, user_id: number, user_name: string, permission: number, error: string, _destroy: boolean, _modify: boolean },
  index: number,
  onChange: (e: FormEvent) => void,
  onDelete: (e: FormEvent) => void,
  editIndex: number,
}

const KkbUser: React.FC<KkbUserProps> = ({
  data,
  index,
  onChange,
  onDelete,
  editIndex,
}) => {
  return (
    <>
      <td className={data.error && 'pt-2 pb-0'}>
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
          <div className="text-danger m-0" style={{fontSize: '50%'}}>
            {data.error}
          </div>
        )}
      </td>
      <td style={{width: 80}}>
        <button onClick={onDelete} className="btn btn-sm btn-outline-danger">
          削除
        </button>
      </td>
    </>
  );
};

interface Props {
  kkb_category_id: string;
}

const KkbForm: React.FC<Props> = ({kkb_category_id}) => {
  const [showDialog, setShowDialog] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryName, setCategoryName] = useState('');
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const url = `${env.API_ORIGIN}kkb_categories/${kkb_category_id}.json`;
    axios.get(url).then(({data}) => {
      setCategoryName(data.name);
    });
  }, []);

  const onClose = () => {
    setShowDialog(false);
  };

  const onSave = () => {
    const url = `${env.API_ORIGIN}kkbs.json`;
    const params = {
      'kkb' : {
        title,
        content,
        kkb_category_id,
        'kkb_users_attributes' : users
      }
    };
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken();
    axios.post(url, params).then((response) => {
      onClose();
      location.href = `${env.API_ORIGIN}kkbs?kkb_category_id=${kkb_category_id}`
    });
  };

  const newData = () => ({user_id: '', user_name: '', permission: 1});

  const changeData = (e: any, prev_data: object): object => {
    return {
      ...prev_data,
      user_id: e.value,
      user_name: e.label,
    };
  };

  const addData = (e: FormEvent) => {
    setUsers([...users, { ...newData(), _modify: true }]);
    setEditIndex(users.length);
    e.preventDefault();
  };

  const onChange = (index: number) => (e: FormEvent) => {
    const new_data = { ...changeData(e, users[index]), _modify: true };
    setUsers([...users.slice(0, index), new_data, ...users.slice(index + 1)]);
  };

  const onDelete = (index: number) => (e: FormEvent) => {
    if (users[index].id) {
      const new_data = {
        ...users[index],
        _destroy: !users[index]._destroy,
        _modify: true,
      };
      setUsers([...users.slice(0, index), new_data, ...users.slice(index + 1)]);
    } else {
      let new_array = [...users];
      new_array.splice(index, 1);
      setUsers(new_array);
    }
    e.preventDefault();
  };

  return (
    <>
      { showDialog && (
        <Dialog title={title} onClose={onClose} >
          <DialogTitle onClose={onClose}>KKB板作成</DialogTitle>
          <DialogContent>
            <div className="form-group">
              <label>カテゴリ</label>
              <p>{categoryName}</p>
              <input type='hidden' value={kkb_category_id}/>
            </div>
            <div className="form-group">
              <label htmlFor="formKkbTitle">タイトル</label>
              <input
                  className="form-control"
                  id="formKkbTitle"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="formKkbContent">メンバー</label>
              <button
                  onClick={addData}
                  className="btn btn-sm btn-outline-primary"
              >
                追加
              </button>
              <table className="table">
                <tbody>
                {users.map((elem, index) => (
                  <tr
                    key={index}
                    style={elem._destroy ? {textDecoration: 'line-through'} : null }
                  >
                    <KkbUser
                      data={elem}
                      index={index}
                      editIndex={editIndex}
                      onChange={onChange(index)}
                      onDelete={onDelete(index)}
                    />
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
            <div className="form-group">
              <label htmlFor="formKkbContent">内容</label>
              <textarea
                className="form-control"
                id="formKkbContent"
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions>
            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={onClose}>ｷｬﾝｾﾙ</button>
            <button type="button" className="btn btn-primary" onClick={onSave}>保存</button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default KkbForm;