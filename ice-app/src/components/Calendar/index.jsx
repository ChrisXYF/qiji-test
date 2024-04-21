import React, { useEffect, useState } from 'react';
import { Modal, Select, Space, Table, Tag } from 'antd';
import { fetchPartnerList, updatePartnerStatus } from '../../services/list';
import './index.css';
import store from '@/store';

const Calendar = (props) => {
  const [userState] = store.useModel('user');
  const { currentUser } = userState;
  const [calendarList, setCalendarList] = useState([]);
  const [allDate, setAllDate] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [curStatus, setCurStatus] = useState('0');
  const [curDate, setCurDate] = useState('');
  const [curTime, setCurTime] = useState('');

  const columns = [
    {
      title: '时间段',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        let color = val > '0' ? 'geekblue' : 'green';
        if (val === '2') {
          color = 'red';
        }
        return (
          <Tag color={color} key={val}>
            {val === '0' ? '空闲' : val === 1 ? '已安排' : '忙碌'}
          </Tag>
        );
      },
      filters: [
        {
          text: '空闲',
          value: '0',
        },
        {
          text: '已安排',
          value: '1',
        },
        {
          text: '忙碌',
          value: '2',
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '创业者',
      dataIndex: 'entrepreneur',
      key: 'entrepreneur',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsShow(true);
              setCurTime(record.start_time);
            }}
          >
            更改状态
          </a>
          <a>查看</a>
        </Space>
      ),
    },
  ];

  function createTimeSlots() {
    fetchPartnerList({
      partner_id: currentUser.partner_id,
      date: curDate,
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
                slots.push({ ...item });
                temp = true;
              }
            });
            if (!temp) {
              slots.push({
                datetime: curDate,
                start_time: timeSlot,
                status: '0',
                entrepreneur: '',
              });
            }
          });
        }
        setCalendarList(slots);
      }
    });
  }

  const closeModal = () => {
    setIsShow(false);
  };

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

  const confirmStatus = () => {
    updatePartnerStatus({
      partner_id: currentUser.partner_id,
      datetime: curDate,
      start_time: curTime,
      status: curStatus,
    }).then((res) => {
      if (res.status === 0) {
        closeModal();
        createTimeSlots();
      }
    });
  };

  useEffect(() => {
    if (curDate) {
      createTimeSlots();
    }
  }, [curDate]);

  useEffect(() => {
    getAllDate();
  }, []);

  return (
    <>
      <div>
        日期：
        <Select
          value={allDate[0]}
          className="selectBox"
          onChange={(value) => {
            setCurDate(value);
          }}
        >
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
      <Modal
        open={isShow}
        className="groupModal"
        onCancel={closeModal}
        onOk={confirmStatus}
      >
        {curStatus === 1 ? (
          <div>
            <p>已安排日程</p>
            <p>创业者：{}</p>
            <p>更改状态</p>
            <Select className="selectBox" defaultValue={curStatus}>
              <Select.Option value="1">已安排</Select.Option>
              <Select.Option value="0">取消</Select.Option>
              <Select.Option value="2">取消并忙碌</Select.Option>
            </Select>
          </div>
        ) : (
          <div>
            <p>请更改您的状态</p>
            <Select
              className="selectBox"
              value={curStatus}
              onChange={(status) => {
                setCurStatus(status);
              }}
            >
              <Select.Option value="0">空闲</Select.Option>
              <Select.Option value="2">忙碌</Select.Option>
            </Select>
          </div>
        )}
      </Modal>
    </>
  );
};
export default Calendar;
