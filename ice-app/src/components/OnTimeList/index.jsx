import React, { useEffect, useState } from 'react';
import { Modal, Select, Space, Table, Tag } from 'antd';
import './index.css';

const OnTimeList = (props) => {
  const [calendarList, setCalendarList] = useState([]);
  const [allDate, setAllDate] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [curStatus, setCurStatus] = useState(0);

  const columns = [
    {
      title: '时间段',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        let color = val > 1 ? 'geekblue' : 'green';
        if (val === 2) {
          color = 'volcano';
        }
        return (
          <Tag color={color} key={val}>
            {val === 0 ? '空闲' : val === 1 ? '已安排' : '忙碌'}
          </Tag>
        );
      },
    },
    {
      title: '合伙人',
      dataIndex: 'partner',
      key: 'partner',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              setIsShow(true);
              setCurStatus(record.status);
            }}
          >
            {true ? '选择预约' : '取消预约'}
          </a>
        </Space>
      ),
    },
  ];

  function createTimeSlots() {
    const slots = [];
    const startTime = 9; // 开始时间为上午9点
    const endTime = 17; // 结束时间为下午5点

    // 遍历每一个小时
    for (let hour = startTime; hour < endTime; hour++) {
      // 每个小时的固定开始时间
      ['00', '15', '30', '45'].forEach((minute) => {
        // 格式化小时以确保时间是两位数（例如 "09"）
        const formattedHour = hour.toString().padStart(2, '0');
        // 创建时间字符串
        const timeSlot = `${formattedHour}:${minute}`;
        // 添加到数组
        slots.push({
          time: timeSlot,
          status: 0,
          entrepreneur: '',
        });
      });
    }
    console.log(slots);
    setCalendarList(slots);
  }

  const closeModal = () => {
    setIsShow(false);
  };

  const getAllDate = () => {
    const today = new Date(); // 获取当前日期
    const dateArray = [];

    for (let i = 0; i < 8; i++) {
      // 生成今天和未来7天的日期
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      // 将日期格式化为 YYYY-MM-DD 格式
      dateArray.push(futureDate.toISOString().slice(0, 10));
    }

    setAllDate(dateArray);
  };

  useEffect(() => {
    createTimeSlots();
    getAllDate();
  }, []);
  return (
    <>
      <div>
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
      <Table columns={columns} dataSource={calendarList} />
      <Modal open={isShow} className="groupModal" onCancel={closeModal}>
        {curStatus === 1 ? (
          <div>
            <p>已安排日程</p>
            <p>合伙人{}</p>
            <p>更改状态</p>
            <Select className="selectBox" defaultValue={curStatus}>
              <Select.Option value={1}>已安排</Select.Option>
              <Select.Option value={0}>取消</Select.Option>
              <Select.Option value={2}>取消并忙碌</Select.Option>
            </Select>
          </div>
        ) : (
          <div>
            <p>请选择您要预约的合伙人</p>
            {[1, 2, 3, 4, 5].map((item, idx) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <p>合伙人：xxxx</p>
                  {true ? <a>预约</a> : <a>取消预约</a>}
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
};
export default OnTimeList;
