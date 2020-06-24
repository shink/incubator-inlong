import * as React from 'react';
import './index.less';
import {OKProps} from "@/components/Modalx";
import {useRequest} from "@/hooks";
import {useContext, useEffect} from "react";
import GlobalContext from "@/context/globalContext";

interface ComProps {
  fire: string;
  params: any;
  type: string;
}

let newObjectTemp: string = '';
const Comp = (props: ComProps) => {
  const {fire} = props;
  const { userInfo } = useContext(GlobalContext);
  useEffect(() => {
    const {params, type} = props;
    dispatchAction(type, params);
  }, [fire]);

  const dispatchAction = (type: string, p: OKProps) => {
    if(!fire) return null;
    let promise;
    switch (type) {
      case 'newTopic':
        promise = newTopic(p);
        break;
      case 'endChooseBroker':
        promise = endChooseBroker(p);
        break;
      case 'editTopic':
        promise = editTopic(p);
        break;
      case 'topicStateChange':
        promise = topicStateChange(type, p);
        break;
      case 'authorizeControl':
        promise = authorizeControl(type, p);
        break;
      case 'deleteTopic':
        promise = deleteTopic(type, p);
        break;
    }

    promise && promise.then(t => {
      const {callback} = p.params;
      if(t.statusCode !== 0 && callback) callback(t);
    })
  };

  const newTopicQuery = useRequest<any, any>(
    data => ({ url: '/api/op_query/admin_query_broker_topic_config_info', ...data }),
    { manual: true }
  );
  const newTopic = (p: OKProps) => {
    newObjectTemp = JSON.stringify(p.params);
    return newTopicQuery.run({
      data: {
        topicName: '',
        brokerId: ''
      },
    });
  };

  const endChooseBrokerQuery = useRequest<any, any>(
    data => ({ url: '/api/op_modify/admin_add_new_topic_record', ...data }),
    { manual: true }
  );
  const endChooseBroker = (p: OKProps) => {
    const topicParams = JSON.parse(newObjectTemp);
    const {params} = p;
    return endChooseBrokerQuery.run({
      data: {
        borkerId: params.selectBroker.join(','),
        confModAuthToken: p.psw,
        ...topicParams
      },
    });
  };

  const updateTopicQuery = useRequest<any, any>(
    data => ({ url: '/api/op_modify/admin_update_broker_configure', ...data }),
    { manual: true }
  );
  const editTopic = (p: OKProps) => {
    const {params} = p;
    return updateTopicQuery.run({
      data: {
        ...params,
        confModAuthToken: p.psw,
        createUser: userInfo.userName,
      },
    });
  };

  const deleteTopicQuery = useRequest<any, any>(
    (url, data) => ({ url, ...data }),
    { manual: true }
  );
  const deleteTopic = (type: string, p: OKProps) => {
    const { params } = p;
    return deleteTopicQuery.run(`/api/op_modify/admin_delete_topic_info`, {
      data: {
        brokerId: params.selectBroker.join(','),
        confModAuthToken: p.psw,
        modifyUser: userInfo.userName,
        topicName: params.topicName
      },
    });
  };

  const topicStateChangeQuery = useRequest<any, any>(
    (url, data) => ({ url, ...data }),
    { manual: true }
  );
  const topicStateChange = (type: string, p: OKProps) => {
    const { params } = p;
    let data: {
      [key: string]: any;
    };

    data = {
      brokerId: params.selectBroker.join([',']),
      confModAuthToken: p.psw,
      modifyUser: userInfo.userName,
      topicName: params.topicName
    }
    if(params.type === 'isSrvAcceptPublish') {
      data.acceptPublish = params.value;
    }
    if(params.type === 'isSrvAcceptSubscribe') {
      data.acceptSubscribe = params.value;
    }

    return topicStateChangeQuery.run(`/api/op_modify/admin_modify_topic_info`, {
      data,
    });
  };

  const authorizeControlQuery = useRequest<any, any>(
    (url, data) => ({ url, ...data }),
    { manual: true }
  );
  const authorizeControl = (type: string, p: OKProps) => {
    const { params } = p;
    let data: {
      [key: string]: any;
    };

    data = {
      confModAuthToken: p.psw,
      topicName: params.topicName,
      isEnable: params.value,
      modifyUser: userInfo.userName,
    }

    return authorizeControlQuery.run(`/api/op_modify/admin_set_topic_authorize_control`, {
      data,
    });
  };

  return (
    <></>
  );
};

export default Comp;
