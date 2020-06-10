import React from 'react';
import { Route } from '@/typings/router';
import {
  NodeExpandOutlined,
  ClusterOutlined,
  SettingOutlined,
} from '@ant-design/icons';
/*
 * Note:
 * Menu items with children need to set a key starting with "/"
 * @see https://github.com/umijs/route-utils/blob/master/src/transformRoute/transformRoute.ts#L219
 */

const menus: Route[] = [
  {
    path: '/issue',
    name: '分发查询',
    icon: <NodeExpandOutlined />,
  },
  {
    name: '配置管理',
    key: '/other',
    icon: <SettingOutlined />,
    children: [
      {
        path: '/hello',
        name: 'Broker列表',
      },
      {
        path: '/user',
        name: 'topic列表',
      },
    ],
  },
  {
    path: '/cluster',
    name: '集群管理',
    icon: <ClusterOutlined />,
  },
];

export default menus;
