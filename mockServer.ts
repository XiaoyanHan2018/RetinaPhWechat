import { Response, Request } from "express";
import fs from 'fs';
import path from 'path';

interface LOGIN_PARAMS {
    username: string;
    openid: string;
    password?: string;
}

interface REQ_CALENDAR_AREA {
    user_id: string;
}

interface UD {
    pid: string;
    openid: string;
    mobile: string;
    pwd: string;
    name: string;
    status: number;
}

interface ORG_ITEM {
    name: string;
    address: string;
    examID: string;
}

interface VALID_APPT_PARAM {
    openid: string,
    exam_id: number
}

interface APPT_INFO {
    id: number,
    exam_id: string,
    status: string,
    select_time: Array<APPT_TIME>,
    confirm_time: APPT_TIME
}

interface APPT_TIME {
    year: number,
    month: number,
    day: number,
    weekday: string,
    available: string
}

interface PHOTO {
    examID: string;
    tag: string;
    image_link: string;
    image_size: number;
    thumb_link: string;
    thumb_size: number;
    quality: string;
    lesion: Array<string>;
}

interface LIST_PARAMS {
    user_id: string;
    status: number;
    page_size?: number;
    page_num?: number;
    date?: string
}

interface RPT_PARAMS {
    exam_id: string;
}

interface USER_BASE_DATA {
    pid: string;
    mobile: string;
    name: string;
    pwd: string;
    openid: string;
    status: number;
    birthday: string;
    age: string
};

interface USER {
    pid: string,
    openid: string,
    mobile: string,
    pwd: string,
    name: string,
    status: number
}

interface EXAM {
    id: string;
    pid: string;
    examTime: string;
    dr_diagnosis: string;
    disease: string;
    transfer_reexam: string,
    comment: string,
    uploader: {
        name: string,
        org: string
    },
    viewer: {
        name: string,
        org: string
    },
    checkTime: string
}

interface APPT {
    id: number,
    name: string,
    mobile: string,
    contact_mobile: string,
    status: number,
    exam_id: string,
    select_time?: Array<DAY_INFO>,
    confirm_time?: DAY_INFO,
    has_prev: number,
    prev_time?: DAY_INFO
}

interface DAY_INFO {
    year?: number,
    month?: number,
    day?: number,
    weekday?: string,
    available?: string
}

interface CONFIRM_APPT_PARAMS {
    id: string,
    confirm_time: DAY_INFO
}

interface SCOPE_ITEM {
    examID: string;
    range: Array<SCOPE_YEAR>;
}
interface SCOPE_YEAR {
    [key: string]: SCOPE_MONTH
}
interface SCOPE_MONTH {
    [key: string]: Array<SCOPE_DAY>
}
interface SCOPE_DAY {
    day: number;
    weekday: string;
    available: Array<string>;
}
interface CONFIRM_COUNT_PARAMS {
    user_id: string,
    date: string
}
interface CALENDAR_DAY {
    year: number,
    month: number,
    day: number,
    weekday: string,
    morning: number,
    afternoon: number,
    sum: number,
}


export default {
    login: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: LOGIN_PARAMS = JSON.parse(str);
            if (!reqData.username) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the required params username/openid',
                    status: 400
                })
            }
            const _UserData = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/doctor.json'), 'utf8'));
            const [fUser] = _UserData.filter((u: UD) => u.mobile === reqData.username);
            if (fUser) {
                if (reqData.password) {
                    if (fUser.pwd === reqData.password) {
                        // console.info(fUser);
                        return res.json({
                            error_message: '',
                            status: 200,
                            user_id: fUser.pid,
                            active_url: fUser.pid === '00002' ? 'http://www.google.com' : '',
                            doctor_url: 'https://www.bing.com/'
                        })
                    } else {
                        res.statusCode = 400;
                        return res.json({
                            error_message: 'Invalid User password',
                            status: 400
                        })
                    }
                } else {
                    return res.json({
                        error_message: '',
                        status: 200
                    });
                }
            } else {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Invalid User ID',
                    status: 400
                })
            }
        });
    },

    calendar_time_area: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: REQ_CALENDAR_AREA = JSON.parse(str);
            if (!reqData.user_id) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the required params user_id',
                    status: 400
                })
            }
            const calendarJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/calendar.json'), 'utf8'));
            return res.json({
                error_message: '',
                status: 200,
                time_area: calendarJSON
            })
        });
    },

    reservation_list: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: LIST_PARAMS = JSON.parse(str);
            if (!reqData.user_id || !reqData.status) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the required params user_id/status',
                    status: 400
                })
            }

            const apptJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/appt.json'), 'utf8'));
            const page_size = reqData.page_size || 15;
            const page_index = reqData.page_num || 1;
            const status = reqData.status;
            const date = reqData.date;

            const resList = apptJSON.filter((APPT: APPT) => APPT.status === status).filter((APPT: APPT) => {
                if (date) {
                    if (APPT.select_time.length > 0) {
                        if (APPT.select_time.filter((DAY: DAY_INFO) => date === `${DAY.year}-${`${DAY.month}`.padStart(2, '0')}-${`${DAY.day}`.padStart(2, '0')}`).length > 0) {
                            return true;
                        }
                    } else if (Object.keys(APPT.confirm_time).length > 0) {
                        if (date === `${APPT.confirm_time.year}-${`${APPT.confirm_time.month}`.padStart(2, '0')}-${`${APPT.confirm_time.day}`.padStart(2, '0')}`) {
                            return true;
                        }
                    }
                } else {
                    return true;
                }
            });
            // console.info(resList);
            const total = resList.length;

            return res.json({
                error_message: '',
                status: 200,
                data_list: resList.slice((page_index - 1) * page_size, (page_index - 1) * page_size + page_size),
                total_len: total
            })
        });
    },

    confirmed_count: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: CONFIRM_COUNT_PARAMS = JSON.parse(str);
            if (!reqData.user_id || !reqData.date) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the required params user_id/date',
                    status: 400
                })
            }

            const calenderJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/calendar.json'), 'utf8'));
            const [year, month, day] = reqData.date.split('-');
            const [tgt_date] = calenderJSON.filter((date: CALENDAR_DAY) => date.year === parseInt(year) && date.month === parseInt(month) && date.day === parseInt(day));
            if (!tgt_date) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the related data about input date!',
                    status: 400
                })
            }

            return res.json({
                error_message: '',
                status: 200,
                morning: tgt_date.morning,
                afternoon: tgt_date.afternoon,
            })
        });
    },


    reservation_confirm: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: CONFIRM_APPT_PARAMS = JSON.parse(str);
            if (!reqData.id || !reqData.confirm_time || Object.keys(reqData.confirm_time).length <= 0) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Could not found the required params id/confirm_time',
                    status: 400
                });
            }
            const apptJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/appt.json'), 'utf8'));
            const calenderJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/calendar.json'), 'utf8'));
            let _name: string;
            const finAPPT: boolean = apptJSON.some((item: APPT, index: number) => {
                if (item.id === parseInt(reqData.id) && item.status > 0) {
                    const originTime: DAY_INFO = Object.assign({}, item.confirm_time);
                    let finish: number = 0;
                    calenderJSON.some((date: CALENDAR_DAY) => {
                        if (date.year === originTime.year && date.month === originTime.month && date.day === originTime.day) {
                            if (originTime.available === 'morning') {
                                date.morning--;
                            }
                            if (originTime.available === 'afternoon') {
                                date.afternoon--;
                            }
                            finish++;
                        }
                        if (date.year === reqData.confirm_time.year && date.month === reqData.confirm_time.month && date.day === reqData.confirm_time.day) {
                            if (reqData.confirm_time.available === 'morning') {
                                date.morning++;
                            }
                            if (reqData.confirm_time.available === 'afternoon') {
                                date.afternoon++;
                            }
                            finish++;
                        }
                        if (finish >= 2) {
                            return true;
                        }
                    });
                    // item.select_time = [];
                    item.confirm_time = reqData.confirm_time;
                    item.status = 2;
                    item.has_prev = 0;
                    item.prev_time = {};
                    _name = item.name;
                    return true;
                }
            });
            apptJSON.forEach((element: APPT) => {
                if (element.status === 1 && _name && element.name === _name) {
                    element.has_prev = 1;
                    element.prev_time = reqData.confirm_time;
                }
            });

            if (finAPPT) {
                fs.writeFile(path.join(__dirname, 'mockData/calendar.json'), JSON.stringify(calenderJSON), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    return console.info('Has initial the data of calendar.json');
                });
                fs.writeFile(path.join(__dirname, 'mockData/appt.json'), JSON.stringify(apptJSON), (err) => {
                    if (err) {
                        return console.error(err);
                    }
                    return console.info('Has initial the data of appt.json');
                });
                return res.json({
                    error_message: '',
                    status: 200
                });
            } else {
                res.statusCode = 400;
                return res.json({
                    error_message: `Could not found reservation with id ${reqData.id}`,
                    status: 400
                });
            }
        });
    },

    get_date_scope: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: RPT_PARAMS = JSON.parse(str);
            if (!reqData.exam_id) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Missing the value of exam_id which is required.'
                });
            }
            const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/scopes.json'), 'utf8'));
            const [scope] = scopes.filter((s: SCOPE_ITEM) => s.examID === reqData.exam_id);
            return res.json({
                error_mesage: '',
                status: 200,
                scope: scope ? scope.range : {}
            });
        });
    },

    validate_appt: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: VALID_APPT_PARAM = JSON.parse(str);
            if (!reqData.openid || !reqData.exam_id) {
                return res.json({
                    error_message: 'the openid and exam_id is required',
                    status: 500
                });
            } else {
                return res.json({
                    error_message: '',
                    status: 200
                });
            }
        });
    },

    get_wechat_report: (req: Request, res: Response) => {
        let str = "";
        req.on("data", function (chunk: string) {
            str += chunk
        });
        req.on("end", function () {
            const reqData: RPT_PARAMS = JSON.parse(str);
            if (!reqData.exam_id) {
                res.statusCode = 400;
                return res.json({
                    error_message: 'Missing the value of exam_id which is required.'
                });
            }
            const _exams = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/exams.json'), 'utf8'));
            const _photos = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/photos.json'), 'utf8'));
            const patients = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/user.json'), 'utf8'));
            const [cur_exam] = _exams.filter((exam: EXAM) => exam.id === reqData.exam_id);
            const cur_records = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/records.json'), 'utf8'));
            const appts = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/appt.json'), 'utf8'));
            const [userInfo] = cur_exam ? cur_records.filter((ud: USER_BASE_DATA) => ud.pid === cur_exam.pid) : [];
            const [user] = cur_exam ? patients.filter((u: USER) => u.pid === cur_exam.pid) : [];
            const left_eye_photo = cur_exam ? _photos.left_eye.filter((photo: PHOTO) => photo.examID === cur_exam.id) : [];
            const right_eye_photo = cur_exam ? _photos.right_eye.filter((photo: PHOTO) => photo.examID === cur_exam.id) : [];
            const photos: Array<PHOTO> = left_eye_photo.concat(right_eye_photo);
            let lesions: Array<string> = [];
            photos.forEach((photo: PHOTO) => {
                lesions = lesions.concat(photo.lesion);
            });
            return res.json({
                status: cur_exam ? 200 : 500,
                error_message: !cur_exam ? `Coluld not found the record by ID:${reqData.exam_id}` : '',
                patient: {
                    pid: cur_exam ? userInfo ? userInfo.pid : '' : '',
                    mobile: cur_exam ? userInfo ? user.mobile : '' : '',
                    name: cur_exam ? userInfo ? userInfo.name : '' : '',
                    gender: cur_exam ? userInfo ? userInfo.gender : '' : '',
                    birthday: cur_exam ? userInfo ? userInfo.birthday : '' : '',
                    history: cur_exam ? userInfo ? userInfo.history : '' : '',
                },
                exam: cur_exam,
                photo: {
                    photo_list: photos,
                    quality: "双眼质量合格",
                    lesion: lesions
                },
                reservation: cur_exam ? appts.filter((item: APPT_INFO) => item.exam_id === cur_exam.id)[0] || {
                    "id": "",
                    "status": "",
                    "select_time": [],
                    "confirm_time": {}
                } : {
                        "id": "",
                        "status": "",
                        "select_time": [],
                        "confirm_time": {}
                    }
            });
        });
    },

    transfer_reserve: (req: Request, res: Response) => {
        const _id = req.param('id');
        const user_id = req.param('user_id');
        if (!_id) {
            res.statusCode = 400;
            return res.json({
                error_message: 'Could not found the value of id in request data.'
            });
        }
        const appts = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/appt.json'), 'utf8'));
        const exams = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/exams.json'), 'utf8'));
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/user.json'), 'utf8'));
        const orgs = JSON.parse(fs.readFileSync(path.join(__dirname, 'mockData/orgs.json'), 'utf8'));
        const [appt] = appts.filter((item: APPT_INFO) => item.id === parseInt(_id, 10));
        let curExam: EXAM = null;
        let user: USER_BASE_DATA = null;
        let org: ORG_ITEM = null;
        if (appt) {
            [curExam] = exams.filter((exam: EXAM) => exam.id === appt.exam_id);
            if (curExam) {
                [user] = users.filter((u: USER_BASE_DATA) => u.pid === curExam.pid);
                [org] = orgs.filter((o: ORG_ITEM) => o.examID === curExam.id);
            }
        }
        if (appt && appt.status < 0) {
            res.statusCode = 400;
            return res.json({
                error_mesage: 'the appointment has been canceled!',
                status: 400
            });
        }
        return res.json({
            error_message: '',
            status: 200,
            "patient": user ? {
                "pid": user.pid,
                "name": appt.name || user.name,
                "mobile": appt.mobile || user.mobile,
                "contact_mobile": appt.mobile || appt.contact_mobile,
            } : {
                    "pid": "00000",
                    "name": "DEFAULT_USER",
                    "mobile": "DEFAULT_PHONE_NUMER",
                    "contact_mobile": "DEFAULT_CONTACT_PHONE_NUMER",
                },
            "org": org || {
                "name": "DEFAULT_HOSPITAL_NAME",
                "address": appt.org_address || "DEFAULT_HOSPITAL_ADDRESS",
            },
            "reservation": appt || {
                "id": "",
                "status": "",
                "select_time": [],
                "confirm_time": {}
            }
        });
    }

};