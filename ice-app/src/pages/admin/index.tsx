import React, { useRef } from 'react';
import Calendar from './../../components/Calendar/index';
import store from '@/store';

const Admin: React.FC = () => {
    const [userState] = store.useModel("user");
    const { username } = userState.currentUser
    return (
    <div>
        <div>您好，尊敬的合伙人 {username} </div>
        <div>
            <p>请安排您的日程</p>
            <Calendar />
        </div>
    </div>
  );
};

export default Admin;
