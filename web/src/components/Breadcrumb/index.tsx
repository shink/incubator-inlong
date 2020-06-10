import React from 'react';
import { MenuDataItem } from '@ant-design/pro-layout';
import { Link } from 'react-router-dom';
import { useLocation } from '@/hooks';
import './index.less';
import { Breadcrumb } from 'antd';

export interface BreadcrumbProps {
  breadcrumbMap?: Map<string, import('@umijs/route-utils').MenuDataItem>;
}

const BasicLayout: React.FC<BreadcrumbProps> = props => {
  const location = useLocation();
  const { breadcrumbMap } = props;

  const pathSnippets = location.pathname.split('/').filter(i => i);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const breadcrumbNameMap = {} as any;
    breadcrumbMap &&
      breadcrumbMap.forEach((t: MenuDataItem) => {
        breadcrumbNameMap[t.pro_layout_parentKeys.join('/') + t.key] = t.name;
      });
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });

  return (
    <>
      <Breadcrumb className="breadcrumb-wrapper">{breadcrumbItems}</Breadcrumb>
    </>
  );
};

export default BasicLayout;
