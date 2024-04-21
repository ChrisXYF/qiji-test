import React, { useEffect, useState } from 'react';
import { Select, Space, Table, Tag } from 'antd';
import './index.css';
import store from '@/store';
import {
  getAllPartner,
  toHaveAppointment,
  getAppointmentList,
} from '@/services/list';

const OnPartner = (props) => {
  const [userState] = store.useModel('user');
  const { currentUser } = userState;
  const [calendarList, setCalendarList] = useState([]);
  const [allDate, setAllDate] = useState([]);
  const [partnersList, setPartnersList] = useState([]);
  const [curDate, setCurDate] = useState('');
  const [curIdx, setCurIdx] = useState(0);

  const columns = [
    {
      title: '时间段',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '状态',
      dataIndex: 'availability_status',
      key: 'availability_status',
      render: (val, record) => {
        let color = val > '0' ? 'geekblue' : 'green';
        return (
          <Tag color={color} key={val}>
            {val === '0' ? '空闲' : '已预约'}
          </Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              handleAppointment(record.start_time);
            }}
          >
            {record.availability_status === '0' ? '预约' : '取消预约'}
          </a>
        </Space>
      ),
    },
  ];

  function handleAppointment(time) {
    toHaveAppointment({
      partner_id: curIdx,
      datetime: curDate,
      start_time: time,
      status: '1',
      entrepreneur_id: currentUser.entrepreneur_id,
    }).then((res) => {
      if (res.status === 0) {
        createTimeSlots();
      }
    });
  }

  function createTimeSlots() {
    getAppointmentList({
      partner_id: curIdx,
      entrepreneur_id: currentUser.entrepreneur_id,
      datetime: curDate,
    }).then((res) => {
      if (res.status === 0) {
        const slots = [];
        const startTime = 9;
        const endTime = 17;
        for (let hour = startTime; hour < endTime; hour++) {
          ['00', '15', '30', '45'].forEach((minute) => {
            const formattedHour = hour.toString().padStart(2, '0');
            const timeSlot = `${formattedHour}:${minute}`;
            let temp = false;
            res.data.forEach((item) => {
              if (item.start_time === timeSlot) {
                if (item.hasBook == 'Yes') slots.push({ ...item });
                temp = true;
              }
            });
            if (!temp) {
              slots.push({
                datetime: curDate,
                start_time: timeSlot,
                availability_status: '0',
              });
            }
          });
        }
        setCalendarList(slots);
      }
    });
  }

  const getAllDate = () => {
    const today = new Date();
    const dateArray = [];

    for (let i = 0; i < 8; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      dateArray.push(futureDate.toISOString().slice(0, 10));
    }

    setAllDate(dateArray);
    setCurDate(dateArray[0]);
  };

  const fetchAllPartners = () => {
    getAllPartner().then((res) => {
      if (res.status == 0) {
        setPartnersList(res.data);
        setCurIdx(res.data[0].partner_id);
      }
    });
  };

  useEffect(() => {
    if (curIdx && curDate) createTimeSlots();
  }, [curDate, curIdx]);

  useEffect(() => {
    fetchAllPartners();
    getAllDate();
  }, []);
  return (
    <>
      <div>
        <p>当前可约合伙人</p>
        <div className="partnerList">
          {partnersList.map((item, idx) => {
            return (
              <div
                className={`partnerList-item ${
                  item.partner_id === curIdx ? 'active' : ''
                }`}
                key={idx}
                onClick={() => {
                  setCurIdx(item.partner_id);
                }}
              >
                <p>名称：{item.name}</p>
                <p>
                  介绍：{item.description || `${item.name}是中国著名的投资人`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="partnerList-date">
        日期：
        <Select value={allDate[0]} className="selectBox">
          {allDate.map((item) => {
            return (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <Table columns={columns} dataSource={calendarList} rowKey="start_time" />
    </>
  );
};
export default OnPartner;
