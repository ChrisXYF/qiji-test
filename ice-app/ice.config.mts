import { defineConfig } from '@ice/app';
import request from '@ice/plugin-request';
import store from '@ice/plugin-store';
import auth from '@ice/plugin-auth';

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === 'production' ? 'swc' : false;
export default defineConfig(() => ({
  ssg: false,
  minify,
  proxy: {
    "/api": {
      target: "http://127.0.0.1:3007",
      changeOrigin: true,
      enable: true,
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader("referer"); //移除请求头
        proxyReq.removeHeader("origin"); //移除请求头
        proxyReq.setHeader("host", "127.0.0.1:3007"); //添加请求头
      },
    },
  },
  plugins: [
    request(),
    store(),
    auth(),
      ],
  compileDependencies: false,
}));
