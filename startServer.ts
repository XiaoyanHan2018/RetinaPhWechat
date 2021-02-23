import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

var APP = express();
APP.set("port", process.env.PORT || 4500);
APP.set("view engine", "pug");
const BACK_HOST = process.env.HOST_NAME.replace(/^\s*|\s*$/g, "") || 'http://127.0.0.1:7000';
APP.use(express.static('dist'));

APP.use('/api/**', createProxyMiddleware({
  target: BACK_HOST,
  changeOrigin: true
}));

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;