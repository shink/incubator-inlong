import { isObject, isEmpty } from 'lodash';

export const isDevelopEnv = () => {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  return false;
};

export const isEmptyParam = (value: any): boolean => {
  if (Array.isArray(value)) {
    // value为数组
    return !value.length;
  }
  if (isObject(value)) {
    // value为对象
    return isEmpty(value);
  }
  if (typeof value === 'undefined') {
    // value为undefinded
    return true;
  }
  if (Number.isFinite(value)) {
    // value为数值
    return false;
  }
  // value为默认值
  return !value;
};

export const boolean2Chinese = (value: boolean | string): string => {
  let v = false;
  if (value === 'false') {
    v = false;
  } else if (value === 'true') {
    v = true;
  } else {
    v = value as boolean;
  }
  return v === false ? '否' : '是';
};
