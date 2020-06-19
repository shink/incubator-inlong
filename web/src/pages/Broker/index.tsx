import React, { useContext, useState } from 'react';
import GlobalContext from '@/context/globalContext';
import Breadcrumb from '@/components/Breadcrumb';
import Table from '@/components/Tablex';
import Modal, { OKProps } from '@/components/Modalx';
import {
  Form,
  Select,
  Button,
  Spin,
  Switch,
  Input,
  Row,
  Col,
  message,
} from 'antd';
import { useImmer } from 'use-immer';
import { useRequest } from '@/hooks';
import tableFilterHelper from '@/components/Tablex/tableFilterHelper';
import { boolean2Chinese } from '@/utils';
import './index.less';

declare type BrokerData = any[];
interface BrokerResultData {
  acceptPublish: string;
  acceptSubscribe: string;
  brokerId: number;
  brokerIp: string;
  brokerPort: number;
  brokerTLSPort: number;
  brokerVersion: string;
  enableTLS: boolean;
  isAutoForbidden: boolean;
  isBrokerOnline: string;
  isConfChanged: string;
  isConfLoaded: string;
  isRepAbnormal: boolean;
  manageStatus: string;
  runStatus: string;
  subStatus: string;
  [key: string]: any;
}

const { Option } = Select;
const OPTIONS = [
  {
    value: 'online',
    name: '上线',
  },
  {
    value: 'offline',
    name: '下线',
  },
  {
    value: 'reload',
    name: '重载',
  },
  {
    value: 'delete',
    name: '删除',
  },
];
const OPTIONS_VALUES = OPTIONS.map(t => t.value);
const queryBroker = (data: BrokerResultData) => ({
  url: '/api/op_query/admin_query_broker_run_status',
  data: data,
});

const Broker: React.FC = () => {
  // column config
  const columns = [
    {
      title: 'BrokerID',
      dataIndex: 'brokerId',
      fixed: 'left',
    },
    {
      title: 'BrokerIP',
      dataIndex: 'brokerIp',
    },
    {
      title: 'BrokerPort',
      dataIndex: 'brokerPort',
    },
    {
      title: '管理状态',
      dataIndex: 'manageStatus',
    },
    {
      title: '运行状态',
      dataIndex: 'runStatus',
    },
    {
      title: '运行子状态',
      dataIndex: 'subStatus',
    },
    {
      title: '可发布',
      dataIndex: 'acceptPublish',
      render: (t: string, r: BrokerResultData) => {
        return (
          <Switch
            checked={t === 'true'}
            onChange={e => onSwitchChange(e, r, 'acceptPublish')}
          />
        );
      },
    },
    {
      title: '可订阅',
      dataIndex: 'acceptSubscribe',
      render: (t: string, r: BrokerResultData) => {
        return (
          <Switch
            checked={t === 'true'}
            onChange={e => onSwitchChange(e, r, 'acceptSubscribe')}
          />
        );
      },
    },
    {
      title: '配置变更',
      dataIndex: 'isConfChanged',
      render: (t: string) => boolean2Chinese(t),
    },
    {
      title: '变更加载',
      dataIndex: 'isConfLoaded',
      render: (t: string) => boolean2Chinese(t),
    },
    {
      title: 'broker注册',
      dataIndex: 'isBrokerOnline',
      render: (t: string) => boolean2Chinese(t),
    },
    {
      title: '上线',
      dataIndex: 'isBrokerOnline',
      render: (t: string) => boolean2Chinese(t),
    },
    {
      title: 'TLS端口',
      dataIndex: 'brokerTLSPort',
      render: (t: string) => boolean2Chinese(t),
    },
    {
      title: '启用TLS',
      dataIndex: 'enableTLS',
      render: (t: boolean) => boolean2Chinese(t),
    },
    {
      title: '上报异常',
      dataIndex: 'isRepAbnormal',
      render: (t: boolean) => boolean2Chinese(t),
    },
    {
      title: '自动屏蔽',
      dataIndex: 'isAutoForbidden',
      render: (t: boolean) => boolean2Chinese(t),
    },
    {
      title: '操作',
      dataIndex: 'brokerIp',
      fixed: 'right',
      width: 180,
      render: (t: string, r: any) => {
        return (
          <span className="options-wrapper">
            {OPTIONS.map(t => (
              <a key={t.value} onClick={() => onOptionsChange(t.value, r)}>
                {t.name}
              </a>
            ))}
          </span>
        );
      },
    },
  ];
  const { breadMap, userInfo } = useContext(GlobalContext);
  const [modalParams, updateModelParams] = useImmer<any>({});
  const [filterData, updateFilterData] = useImmer<any>({});
  const [selectBroker, setSelectBroker] = useState<any>([]);
  const [brokerList, updateBrokerList] = useImmer<BrokerData>([]);
  const [form] = Form.useForm();
  const [newBrokerForm] = Form.useForm();
  // init query
  const { data, loading, run } = useRequest<any, BrokerData>(queryBroker, {
    onSuccess: data => {
      updateBrokerList(d => {
        Object.assign(d, data);
      });
    },
  });
  // render funcs
  const renderBrokerOptions = () => {
    const columns = [
      {
        title: 'Broker',
        render: (t: string, r: BrokerResultData) => {
          return `${r.brokerId}#${r.brokerIp}:${r.brokerPort}`;
        },
      },
      {
        title: 'BrokerIP',
        dataIndex: 'brokerIp',
      },
      {
        title: '管理状态',
        dataIndex: 'manageStatus',
      },
      {
        title: '运行状态',
        dataIndex: 'runStatus',
      },
      {
        title: '运行子状态',
        dataIndex: 'subStatus',
      },
      {
        title: '可发布',
        render: (t: string) => boolean2Chinese(t),
      },
      {
        title: '可订阅',
        render: (t: string) => boolean2Chinese(t),
      },
    ];
    const dataSource = data.filter((t: BrokerResultData) =>
      modalParams.params.includes(t.brokerId)
    );
    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="brokerId"
      ></Table>
    );
  };
  const renderNewBroker = () => {
    const brokerFormArr = [
      {
        name: 'brokerId',
        defaultValue: '0',
      },
      {
        name: 'numPartitions',
        defaultValue: '3',
      },
      {
        name: 'brokerIP',
        defaultValue: '',
      },
      {
        name: 'brokerPort',
        defaultValue: '8123',
      },
      {
        name: 'deleteWhen',
        defaultValue: '0 0 6,18 * * ?',
      },
      {
        name: 'deletePolicy',
        defaultValue: 'delete,168h',
      },
      {
        name: 'unflushThreshold',
        defaultValue: '1000',
      },
      {
        name: 'unflushInterval',
        defaultValue: '10000',
      },
      {
        name: 'acceptPublish',
        defaultValue: 'true',
      },
      {
        name: 'acceptSubscribe',
        defaultValue: 'true',
      },
    ];

    return (
      <Form form={newBrokerForm}>
        <Row gutter={24}>
          {brokerFormArr.map((t, index) => (
            <Col span={12} key={'brokerFormArr' + index}>
              <Form.Item
                labelCol={{ span: 12 }}
                label={t.name}
                name={t.name}
                initialValue={t.defaultValue}
              >
                <Input />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Form>
    );
  };
  const renderBrokerStateChange = () => {
    const { params } = modalParams;

    return (
      <div>
        请确认<span className="enhance">{params.option}</span> ID:{' '}
        <span className="enhance">{params.id}</span> 的 Broker?
      </div>
    );
  };

  // events
  const onOpenModal = (type: string, title: string, params?: any) => {
    updateModelParams(m => {
      m.type = type;
      m.params = params;
      Object.assign(m, {
        params,
        visible: type,
        title,
        onOk: (p: OKProps) => onModelOk(type, p),
        onCancel: () =>
          updateModelParams(m => {
            m.visible = false;
          }),
      });
    });
  };
  // table event
  const onSwitchChange = (e: boolean, r: BrokerResultData, type: string) => {
    const index = data.findIndex(
      (t: BrokerResultData) => t.brokerId === r.brokerId
    );
    updateBrokerList(d => {
      d[index][type] = e + '';
    });
    let option = '';
    if (type === 'acceptPublish') {
      option = e ? '发布' : '禁止发布';
    } else if (type === 'acceptSubscribe') {
      option = e ? '订阅' : '禁止订阅';
    }

    onOpenModal('brokerStateChange', `请确认操作`, { option, id: r.brokerId });
  };
  const onBrokerTableSelectChange = (p: any[], rows: any[]) => {
    setSelectBroker(p);
  };

  // modal event
  const onOptionsChange = (type: string, r?: BrokerResultData) => {
    if (!r && !selectBroker.length) {
      form.resetFields();
      return message.error('批量操作至少选择一列！');
    }
    onOpenModal(
      type,
      `确认进行【${OPTIONS.find(t => t.value === type)?.name}】操作？`,
      [r?.brokerId]
    );
  };
  const onModelOk = (type: string, p: OKProps) => {
    switch (type) {
      case 'newBroker':
        return newBroker(p);
      default:
        return brokerOptions(type, p);
    }
  };

  const newBrokerQuery = useRequest<any, any>(
    data => ({ url: '/api/op_modify/admin_add_broker_configure', ...data }),
    { manual: true }
  );
  const newBroker = (p: OKProps) => {
    const values = newBrokerForm.getFieldsValue();
    newBrokerQuery.run({
      data: {
        ...values,
        confModAuthToken: p.psw,
        createUser: userInfo.userName,
      },
    });
  };

  const brokerOptionsQuery = useRequest<any, any>(
    (url, data) => ({ url, ...data }),
    { manual: true }
  );
  const brokerOptions = (type: string, p: OKProps) => {
    const { params } = p;
    brokerOptionsQuery.run(`/api/op_modify/admin_${type}_broker_configure`, {
      data: {
        brokerId: params ? params?.join(',') : selectBroker.join(','),
        confModAuthToken: p.psw,
        createUser: userInfo.userName,
      },
    });
  };

  return (
    <Spin spinning={loading}>
      <Breadcrumb breadcrumbMap={breadMap}></Breadcrumb>
      <div className="main-container">
        <div
          className="search-wrapper"
          style={{ float: 'right', marginRight: '-16px' }}
        >
          <Form form={form} layout={'inline'}>
            <Form.Item label="批量操作" name="optionType">
              <Select
                style={{ width: 120 }}
                onChange={(v: string) => onOptionsChange(v)}
                placeholder="请选择操作"
              >
                {OPTIONS.map(t => (
                  <Option value={t.value} key={t.value}>
                    {t.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                onClick={() => onOpenModal('newBroker', '新建Broker')}
                style={{ margin: '0 10px 0 10px' }}
              >
                新增
              </Button>
              <Button type="primary" onClick={() => run()}>
                刷新
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          rowSelection={{ onChange: onBrokerTableSelectChange }}
          columns={columns}
          dataSource={brokerList}
          rowKey="brokerId"
          searchPlaceholder="请输入关键字搜索"
          searchWidth={12}
          dataSourceX={filterData.list}
          scroll={{ x: 2500 }}
          filterFnX={value =>
            tableFilterHelper({
              key: value,
              srcArray: data,
              targetArray: filterData.list,
              updateFunction: res =>
                updateFilterData(filterData => {
                  filterData.list = res;
                }),
              filterList: [
                'brokerId',
                'brokerIp',
                'brokerPort',
                'runStatus',
                'subStatus',
                'manageStatus',
              ],
            })
          }
        ></Table>
      </div>
      <Modal {...modalParams}>
        <div>
          {modalParams.type &&
            OPTIONS_VALUES.includes(modalParams.type) &&
            renderBrokerOptions()}
          {modalParams.type === 'newBroker' && renderNewBroker()}
          {modalParams.type === 'brokerStateChange' &&
            renderBrokerStateChange()}
        </div>
      </Modal>
    </Spin>
  );
};

export default Broker;
