import { TableOutlined, WarningOutlined, FormOutlined, DashboardOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-layout';

const adminMenuConfig: MenuDataItem[] = [
  {
    name: '工作台',
    path: '/admin',
    icon: <DashboardOutlined />,
  },
  {
    name: '我的日程',
    path: '/list',
    icon: <TableOutlined />,
  }
];

const asideMenuConfig: MenuDataItem[] = [
  {
    name: '预约',
    path: '/user',
    icon: <DashboardOutlined />,
  },
  {
    name: '我的日程',
    path: '/list',
    icon: <TableOutlined />,
  }
];

export { asideMenuConfig, adminMenuConfig };
