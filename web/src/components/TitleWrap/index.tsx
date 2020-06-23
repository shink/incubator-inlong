import * as React from 'react';
import './index.less';

interface ComProps {
  title: any;
  children?: any;
  wrapperStyle?: any;
}

const Comp = (props: ComProps) => {
  return (
    <div style={props.wrapperStyle}>
      <div className="title-wrap-title">{props.title}</div>
      {props.children}
    </div>
  );
};

export default Comp;
