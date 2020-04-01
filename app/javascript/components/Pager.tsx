import React from 'react';
import clsx from 'clsx';

interface Props {
  count: number;
  page: number;
  setPage: (page: number) => void;
}

const Pager: React.FC<Props> = (props) => {
  const { count , page, setPage } = props;

  if (count <= 1) return null;
  const sibling = 1;
  const min_page = page - sibling >= 1 ? page - sibling : 1;
  const max_page = page + sibling <= count ? page + sibling : count;

  let sequence = [];
  for(let i = min_page; i <= max_page; i++) sequence.push(i);

  return (
    <ul className="pagination pagination-sm">
      {page !== 1 && (
        <li className="page-item">
          <a className="page-link" onClick={() => setPage(1)}>
            «
          </a>
        </li>
      )}
      {sequence.map((p, index) => (
        <li className={clsx('page-item', p === page && 'active')} key={index}>
          <a className="page-link" href="#" onClick={() => setPage(p)}>
            {p}
          </a>
        </li>
      ))}
      {page !== count && (
        <li className="page-item">
          <a className="page-link" onClick={() => setPage(count)}>
            »
          </a>
        </li>
      )}
    </ul>
  );
};

export default Pager;
