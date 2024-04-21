/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { UserInfo } from '@/interfaces/user';
import { createModel } from 'ice';

export default createModel({
  state: {
    currentUser: {
      username: 'xxx',
      email: 'xxx@gmail.com',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      admin: 'true',
    },
  },
  reducers: {
    updateCurrentUser(prevState, payload) {
      prevState.currentUser = payload;
    },
  },
});
