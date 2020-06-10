import React, { useContext } from 'react';
import './index.less';
import GlobalContext from '@/context/globalContext';
import Breadcrumb from '@/components/Breadcrumb';

const Issue: React.FC = () => {
  const { breadMap } = useContext(GlobalContext);
  return (
    <div className="home__container">
      <Breadcrumb breadcrumbMap={breadMap}></Breadcrumb>
      <div>我打野的</div>
    </div>
  );
};

export default Issue;
