import { definePageConfig } from 'ice';
import { Row, Col } from 'antd';

export default function Dashboard() {
  return (
    <p>欢迎来到预约系统</p>
  );
}

export const pageConfig = definePageConfig(() => {
  return {
    auth: ['admin', 'user'],
  };
});
