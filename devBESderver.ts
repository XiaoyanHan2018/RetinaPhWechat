import express, { response } from 'express';
var APP = express();
const backednServerURL = 'http://retina.voxelcloud.net.cn';

APP.set("port", process.env.PORT || 4500);
APP.set("view engine", "pug");

APP.use(express.static('dist'));

APP.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
APP.post('/api/doctor_login', (req, res) => res.redirect(307, `${backednServerURL}/api/doctor_login`));
APP.post('/api/calendar_time_area', (req, res) => res.redirect(307, `${backednServerURL}/api/calendar_time_area`));
APP.post('/api/reservation_list', (req, res) => res.redirect(307, `${backednServerURL}/api/reservation_list`));
APP.post('/api/reservation_confirm', (req, res) => res.redirect(307, `${backednServerURL}/api/reservation_confirm`));
APP.post('/api/scope', (req, res) => res.redirect(307, `${backednServerURL}/api/scope`));
APP.post('/api/wechat_report', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_report`));
APP.get('/api/transfer_reserve', (req, res) => {
    const _apptid = req.param('id');
    const user_id = req.param('user_id');
    res.redirect(307, `${backednServerURL}/api/transfer_reserve?id=${_apptid}&user_id=${user_id}`);
});
APP.post('/api/confirmed_count', (req, res) => res.redirect(307, `${backednServerURL}/api/confirmed_count`));


// APP.post('/api/wechat_mobile', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_mobile`));
// APP.post('/api/send_auth', (req, res) => res.redirect(307, `${backednServerURL}/api/send_auth`));
// APP.post('/api/wechat_bind', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_bind`));
// APP.post('/api/verify_code', (req, res) => res.redirect(307, `${backednServerURL}/api/verify_code`));
// APP.post('/api/patient_pwd', (req, res) => res.redirect(307, `${backednServerURL}/api/patient_pwd`));
// APP.post('/api/wechat_pid', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_pid`));
// APP.post('/api/wechat_report', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_report`));
// APP.post('/api/wechat_unbind', (req, res) => res.redirect(307, `${backednServerURL}/api/wechat_unbind`));
// APP.post('/api/transfer_org', (req, res) => res.redirect(307, `${backednServerURL}/api/transfer_org`));
// APP.post('/api/scope', (req, res) => res.redirect(307, `${backednServerURL}/api/scope`))
// APP.post('/api/report_validation', (req, res) => res.redirect(307, `${backednServerURL}/api/report_validation`))
// APP.post('/api/health_record', (req, res) => {
//     // res.header("Origin", 'http://192.168.1.8');
//     res.header("Origin", 'http://192.168.1.79');
//     res.redirect(307, `${backednServerURL}/api/health_record`);
// });
// APP.get('/api/health_record', (req, res) => {
//     const _pid = req.param('pid');
//     res.redirect(307, `${backednServerURL}/api/health_record?pid=${_pid}`);
// });
// APP.get('/api/wechat_last_exam', (req, res) => {
//     const _pid = req.param('pid');
//     res.redirect(307, `${backednServerURL}/api/wechat_last_exam?pid=${_pid}`);
// });
// APP.get('/api/wechat_records', (req, res) => {
//     const _pid = req.param('pid');
//     res.redirect(307, `${backednServerURL}/api/wechat_records?pid=${_pid}`);
// });
// APP.get('/api/transfer_reserve', (req, res) => {
//     const _id = req.param('id');
//     res.redirect(307, `${backednServerURL}/api/transfer_reserve?id=${_id}`);
// });

// APP.post('/api/transfer_reserve', (req, res) => res.redirect(307, `${backednServerURL}/api/transfer_reserve`));
// APP.delete('/api/transfer_reserve', (req, res) => {
//     request.delete(`${backednServerURL}/api/transfer_reserve?id=${req.param('id')}`, (error: string, reponse: Response) => {
//         return res.json(reponse.body);
//     });
// });

APP.listen(APP.get('port'), () => console.info(`App is running at http://localhost:${APP.get('port')} in ${APP.get('env')} mode`));

export default APP;