import React, { useContext } from 'react';
import GlobalContext from '@/context/globalContext';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Tablex';
import { Form, Input, Button, Spin } from 'antd';
import { useImmer } from 'use-immer';
import './index.less';
import { useRequest } from '@/hooks';
import { useParams } from 'react-router-dom';

declare type ConsumeGroupData = any[];
interface ConsumeGroupQueryData {
  consumeGroup: string;
}

// column config
const columns = [
  {
    title: '消费者ID',
    dataIndex: 'consumerId',
  },
  {
    title: '消费Topic',
    dataIndex: 'topicName',
  },
  {
    title: 'broker地址',
    dataIndex: 'brokerAddr',
  },
  {
    title: '分区ID',
    dataIndex: 'partId',
  },
];

const queryUser = (data: ConsumeGroupQueryData) => ({
  url: '/api/op_query/admin_query_consume_group_detail',
  data: data,
});

const ConsumeGroupDetail: React.FC = () => {
  const { id } = useParams();
  const { breadMap } = useContext(GlobalContext);
  const [form] = Form.useForm();
  const [formValues, updateFormValues] = useImmer<any>({});
  const { data, loading, run } = useRequest<any, ConsumeGroupData>(
    () =>
      queryUser({
        consumeGroup: id,
      }),
    {
      formatResult: data => {
        const d = data[0];
        return {
          list: d.parInfo.map((t: any) => ({
            consumerId: d.consumerId,
            ...t,
          })),
        };
      },
    }
  );

  const onValuesChange = (p: any) => {
    updateFormValues(d => {
      Object.assign(d, p);
    });
  };
  const onSearch = () => {
    run(formValues);
  };

  const onReset = () => {
    form.resetFields();
    run({});
  };

  return (
    <Spin spinning={loading}>
      <Breadcrumb
        breadcrumbMap={breadMap}
        appendParams={`消费组详情（${id}）`}
      ></Breadcrumb>
      <div className="main-container">
        <Table
          columns={columns}
          dataSource={data?.list}
          rowKey="brokerAddr"
        ></Table>
      </div>
    </Spin>
  );
};

export default ConsumeGroupDetail;
