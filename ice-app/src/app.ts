import { defineAppConfig, history, defineDataLoader } from 'ice';
import { fetchUserInfo } from './services/user';
import { defineAuthConfig } from '@ice/plugin-auth/types';
import { defineStoreConfig } from '@ice/plugin-store/types';
import { defineRequestConfig } from '@ice/plugin-request/types';

// App config, see https://v3.ice.work/docs/guide/basic/app
export default defineAppConfig(() => ({
}));

export const authConfig = defineAuthConfig(async (appData) => {
  const { userInfo = {} } = appData;

  return {
    initialAuth: {
      admin: userInfo.userType === 'admin',
      user: userInfo.userType === 'user',
    },
  };
});

export const storeConfig = defineStoreConfig(async (appData) => {
  const { userInfo = {} } = appData;
  return {
    initialStates: {
      user: {
        currentUser: userInfo,
      },
    },
  };
});

export const dataLoader = defineDataLoader(async () => {
  const userInfo = await getUserInfo();
  return {
    userInfo,
  };
});

async function getUserInfo() {
  try {
    const userInfo = await fetchUserInfo();
    return userInfo;
  } catch (error) {
    return {
      error,
    };
  }
}

export const requestConfig = defineRequestConfig({
  withFullResponse: true,
  baseURL: 'http://127.0.0.1:3007',
  timeout: 60000, // 请求超时时间 n
  headers: {
    "Content-Type": "application/json",
  },
  interceptors: {
    response: {
      onConfig: (response) => {
       return response.data
      },
      onError: (error: any) => {
        return Promise.reject(error.data);
      },
    },
  },
});
