import React, {FormEvent, useEffect, useState} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '../Dialog/index';
import { csrfToken } from '@rails/ujs';
import axios from 'axios';
import env from '../../environment';

interface Props {
  kkb_category_id: string;
}

const KkbForm: React.FC<Props> = ({kkb_category_id}) => {
  const [showDialog, setShowDialog] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryName, setCategoryName] = useState([]);

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
    const params = {'kkb' : {title, content, kkb_category_id}};
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken();
    axios.post(url, params).then((response) => {
      onClose();
      location.href = `${env.API_ORIGIN}kkbs?kkb_category_id=${kkb_category_id}`
    });
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