import express from 'express';
import * as shell from 'shelljs';
import pug from 'pug';
import path from 'path';
import mockServer from './mockServer';
import mockData from './mockData/mockData';
import fs from 'fs';

/** init data **/
mockData.generateMockData();

var APP = express();

APP.set("port", process.env.PORT || 4500);
APP.set("view engine", "pug");

// mock images data
const dirs = ['./dist/mockData'];
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});
shell.cp('-R', 'mockData/images', 'dist/mockData');

APP.use(express.static('dist'));
APP.post('/api/doctor_login', (req, res) => mockServer.login(req, res));
APP.post('/api/calendar_time_area', (req, res) => mockServer.calendar_time_area(req, res));
APP.post('/api/reservation_list', (req, res) => mockServer.reservation_list(req, res)); 
APP.post('/api/reservation_confirm', (req, res) => mockServer.reservation_confirm(req, res));
APP.post('/api/scope', (req, res) => mockServer.get_date_scope(req, res));
APP.post('/api/wechat_report', (req, res) => mockServer.get_wechat_report(req, res));
APP.get('/api/transfer_reserve', (req, res)=> mockServer.transfer_reserve(req, res));
APP.post('/api/confirmed_count', (req, res) => mockServer.confirmed_count(req, res));

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;