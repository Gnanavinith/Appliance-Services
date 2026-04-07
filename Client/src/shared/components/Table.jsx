import { Table as AntTable } from 'antd';

const Table = ({ columns, data, loading, pagination, onChange, ...props }) => {
  return (
    <AntTable
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={pagination !== false ? { pageSize: 10, ...pagination } : false}
      onChange={onChange}
      rowKey={(record) => record.id || record._id}
      {...props}
    />
  );
};

export default Table;
