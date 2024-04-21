import { definePageConfig } from 'ice';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tabs } from 'antd';
import React, { useRef } from 'react';
import Calendar from './../../components/Calendar/index';
import store from '@/store';
import OnPartner from '../../components/OnPartner';
import OnTimeList from '../../components/OnTimeList';

const User = () => {
  const [userState] = store.useModel('user');
  const { username } = userState.currentUser;
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: '1',
      label: '按合伙人预约',
      children: <OnPartner />,
    },
    {
      key: '2',
      label: '按时间预约',
      children: <OnTimeList />,
    },
  ];
  return (
    <div>
      <div>您好，尊敬的创业者 {username} </div>
      <div>
        <p>请安排您的日程</p>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  );
};

export default User;
