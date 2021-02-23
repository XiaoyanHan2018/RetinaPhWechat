import fs from 'fs';
import path from 'path';


interface DAY_INFO {
    year?: number,
    month?: number,
    day?: number,
    weekday?: string,
    available?: string
}

interface APPT_ITEM {
    id: number,
    name: string,
    mobile: string,
    contact_mobile: string,
    status: number,
    exam_id: string,
    select_time: Array<DAY_INFO>,
    confirm_time: DAY_INFO,
    has_prev: number,
    prev_time: DAY_INFO
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
interface CALENDAR_CONFIG {
    minYear: number,
    maxYear: number,
    minMonth: number,
    maxMonth: number,
    days: {
        [key: number]: {
            minDay: number,
            maxDay: number
        }
    }
}
interface USER {
    pid: string,
    openid: string,
    mobile: string,
    pwd: string,
    name: string,
    status: number
}
interface USER_RECORD {
    pid: string,
    name: string,
    gender: string,
    birthday: string,
    height: number,
    weight: number,
    bg_empty: number,
    bg_full: number,
    bg_low: number,
    bp_high: number,
    bp_low: number,
    is_smoke: number,
    smoke_years: number,
    history: string
}
interface EXAM {
    id: string,
    pid: string,
    examTime: string,
    dr_diagnosis: string,
    disease: string,
    transfer_reexam: string,
    comment: string,
    uploader: {
        name: string,
        org: string
    },
    viewer: {
        name: string,
        org: string,
    },
    checkTime: string
}

const userNames: Array<string> = ['张启灵', '吴邪', '张角', '袁绍', '张郃', '张辽', '夏侯惇', '典韦', '郭嘉', '程吴', '荀彧', '精卫', '卫青', '陈浩南', '陈三元', '陈三好', '石敢当', '李三', '布成龙', '梅超风', '里母露', '维鲁多拉', '黑崎一护', '露琪亚', '奇玉', '缪兰', '黄飞鸿', '李元芳', '李沧海', '陈靖楠', '洪熙官', '方世玉', '元始天尊', '程咬金', '鬼谷子', '孙武', '曹爽', '魏延', '霍去病', '木村拓', '织田信长', '李广', '赵信', '秦叔宝', '李元霸', '周芷若', '赵敏', '虚竹', '慕容复', '穆念慈', '杨过', '龙傲天', '贾维斯', '一辉', '臧马', '青乌子', '幺妹', '胡八一', '王凯旋', '铁木真', '凯撒', '凯索', '格奈乌斯', '路飞', '乔巴', '娜美', '罗兵', '路西法', '普布利乌斯', '昆图斯', '提贝里乌斯', '阿庇乌斯', '奥卢斯', '凯卢斯', '迪基姆斯', '迪基乌斯', '刘邦', '河神', '刑天', '弗拉维乌斯', '海伦', '曹操', '项羽', '秦始皇', '李元霸', '维正', '乾隆', '成吉思汗', '李世民', '曹植', '曹彰', '刘玄德', '黄忠', '张飞', '赵子龙', '朱元璋', '多尔衮', '臧马', '孙权', '周瑜', '赵炎', '樊哙', '范宴', '晴天', '皇帝', '刑天', '宙斯', '维纳斯', '霍去病', '可云', '袁华'];
const weekdays: Array<string> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const APPT_LEN: number = 100;
const EXAM_LEN: number = 100;
const PATIENT_LEN: number = 80;
const availables: Array<string> = ['morning', 'afternoon'];
const addresses: Array<string> = ['上海市闸北区中山北路805弄11号同济附属医院', '上海虹口区四川北路第一人民医院(分院)', '上海市杨浦区复旦附属中山医院', '上海市浦东新区拱为路2800号 浦东医院', '上海市武进路85号 上海市第一人民医院'];
const GENDER: Array<string> = ['M', 'F', 'O']
const history: Array<string> = ['糖尿病', '青光眼', '高血压', '白内障', '低血糖'];
const diagnosis: Array<string> = ['轻度, 有临床意义', '无糖尿病视网膜病变, 无临床意义黄斑水肿', '青光眼', '白内障', '床意义黄斑水肿'];
const disease: Array<string> = [];
const user_init_data: Array<USER> = [];
const _exams: Array<EXAM> = [];
const dr_init_data = [{
    "pid": "00001",
    "openid": "wechat_01",
    "mobile": "13516202944",
    "pwd": "test1",
    "name": "Adam Yao",
    "status": 0
},
{
    "pid": "00002",
    "openid": "wechat_02",
    "mobile": "15021156654",
    "pwd": "test2",
    "name": "Queeine Yan",
    "status": 0
},
{
    "pid": "00003",
    "openid": "wechat_03",
    "mobile": "18516245488",
    "pwd": "test3",
    "name": "Angens Yao",
    "status": 0
}];
const generatePatientsInfoData = () => {
    let len = Math.floor(Math.random() * 22) + 28;
    const userNameArea = Object.assign([], userNames);
    const ids: Array<string> = [];
    do {
        const _index = Math.floor(Math.random() * userNameArea.length);
        let _pid = `${Math.floor(Math.random() * 99998) + 1}`;
        do {
            _pid = `${Math.floor(Math.random() * 99998) + 1}`;
        } while (ids.indexOf(_pid) >= 0)
        user_init_data.push({
            pid: `${Math.floor(Math.random() * 99998) + 1}`,
            openid: `wechat_${len}`,
            mobile: `${Math.floor(Math.random() * 5499999998) + 13500000000}`,
            pwd: `test${len}`,
            name: userNameArea[_index],
            status: 0
        });
        userNameArea.splice(_index, 1);
        len--;
    } while (len > 0);
    fs.writeFile(path.join(__dirname, './user.json'), JSON.stringify(user_init_data), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of user.json');
    });

}

const generaterDR = () => {
    fs.writeFile(path.join(__dirname, './doctor.json'), JSON.stringify(dr_init_data), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of doctor.json');
    });
};

const generatePatientsRecordsData = () => {
    // const users = JSON.parse(fs.readFileSync(path.join(__dirname, './user.json'), 'utf8') || '[]');
    const result: Array<USER_RECORD> = [];
    user_init_data.forEach((element: USER) => {
        const age: number = Math.floor(Math.random() * 30) + 20;
        const _month: number = Math.floor(Math.random() * 11) + 1;
        const _day: number = Math.floor(Math.random() * 28) + 1;
        const cYear: number = new Date().getFullYear();
        const _year: number = cYear - age;
        const is_smoke: number = Math.floor(Math.random() * 1);
        const has_history: number = Math.floor(Math.random() * 1);
        const _history: Array<string> = [];
        if (has_history >= 1) {
            let length: number = Math.floor(Math.random() * (history.length - 1)) + 1;
            let _array: Array<string> = Object.assign([], history);
            do {
                const _index = Math.floor(Math.random() * _array.length);
                _history.push(_array[_index]);
                _array.splice(_index, 1);
                length--;
            } while (length >= 0);
        }
        result.push({
            pid: element.pid,
            name: element.name,
            gender: GENDER[Math.floor(Math.random() * 2)],
            birthday: `${_year}-${_month.toString().padStart(2, '0')}-${_day.toString().padStart(2, '0')}`,
            height: Math.floor(Math.random() * 90) + 100,
            weight: Math.floor(Math.random() * 60) + 100,
            bg_empty: parseFloat(((Math.random() * 7) + 3).toFixed(1)),
            bg_full: parseFloat(((Math.random() * 7) + 3).toFixed(1)),
            bg_low: parseFloat(((Math.random() * 4) + 2).toFixed(2)),
            bp_high: parseFloat(((Math.random() * 4) + 4).toFixed(2)),
            bp_low: parseFloat(((Math.random() * 3) + 1).toFixed(2)),
            is_smoke: is_smoke,
            smoke_years: is_smoke >= 1 ? Math.floor(Math.random() * 29) + 1 : 0,
            history: _history.join(', ')
        });
    });
    fs.writeFile(path.join(__dirname, './records.json'), JSON.stringify(result), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of records.json');
    });
};

const gererateExams = () => {
    const _ids: Array<string> = [];
    const orgs = JSON.parse(fs.readFileSync(path.join(__dirname, 'orgs.json'), 'utf8'));
    for (let i = 0; i < EXAM_LEN; i++) {
        let _id = `${Math.floor(Math.random() * 999998) + 1}`;
        do {
            _id = `${Math.floor(Math.random() * 999998) + 1}`;
        } while (_ids.indexOf(_id) >= 0)
        let diagnosis_len = Math.floor(Math.random() * (diagnosis.length - 1)) + 1;
        const dr_diagnosis: Array<string> = [];
        const has_diagnosis = Math.floor(Math.random() * 1);
        if (has_diagnosis >= 1) {
            const _diagnosis = Object.assign([], diagnosis);
            do {
                const _index = Math.floor(Math.random() * _diagnosis.length);
                dr_diagnosis.push(_diagnosis[_index]);
                _diagnosis.splice(_index, 1);
                diagnosis_len--;
            } while (diagnosis_len > 0)
        }
        const has_disease = Math.floor(Math.random() * 1);
        const disease: Array<string> = [];
        let disease_len = Math.floor(Math.random() * (disease.length - 1)) + 1
        if (has_disease >= 1) {
            const _disease = Object.assign([], disease);
            do {
                const _index = Math.floor(Math.random() * _disease.length);
                disease.push(_disease[_index]);
                _disease.splice(_index, 1);
                disease_len--;
            } while (disease_len > 0)
        }

        _exams.push({
            id: _id,
            pid: user_init_data[Math.floor(Math.random() * user_init_data.length)].pid,
            examTime: `${Math.floor(Math.random() * 2) + new Date().getFullYear()}-${(Math.floor(Math.random() * 11) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
            dr_diagnosis: dr_diagnosis.join('; '),
            disease: disease.join('; '),
            transfer_reexam: "",
            comment: "",
            uploader: {
                name: dr_init_data[Math.floor(Math.random() * dr_init_data.length)].name,
                org: orgs[Math.floor(Math.random() * orgs.length)].name
            },
            viewer: {
                name: dr_init_data[Math.floor(Math.random() * dr_init_data.length)].name,
                org: orgs[Math.floor(Math.random() * orgs.length)].name
            },
            checkTime: `${Math.floor(Math.random() * 2) + (new Date().getFullYear() - 2)}-${(Math.floor(Math.random() * 11) + 1).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')} ${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`
        })
    }
    fs.writeFile(path.join(__dirname, './exams.json'), JSON.stringify(_exams), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of exams.json');
    });

};

const getMonthDays = (month: number, year: number): number => {
    const months30 = [4, 6, 9, 11];   // the months which has 30 days
    const leapYear = year % 4 === 0;  // whether leap year?

    return month === 2
        ? leapYear
            ? 29
            : 28
        : months30.includes(month)
            ? 30
            : 31;
}

const generateDefaultCalendarDays = (): Array<CALENDAR_DAY> => {
    const res: Array<CALENDAR_DAY> = [];
    const curDay = new Date();
    const year = curDay.getFullYear();
    const month = curDay.getMonth() + 1;
    const day = curDay.getDate();
    let weekday = curDay.getDay() - 1;
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const curMonthDaylen = getMonthDays(month, year);
    let needFixWithNext = 0;
    if (curMonthDaylen - day < 30) {
        needFixWithNext = 30 - (curMonthDaylen - day);
    }
    for (let i = day; i <= curMonthDaylen; i++) {
        res.push({
            year: year,
            month: month,
            day: i,
            weekday: weekdays[weekday],
            morning: 0,
            afternoon: 0,
            sum: 0,
        });
        weekday++;
        if (weekday > 6) weekday = 1;
    }
    if (needFixWithNext > 0) {
        for (let i = 1; i <= needFixWithNext; i++) {
            res.push({
                year: month === 12 ? (year + 1) : year,
                month: month === 12 ? 1 : (month + 1),
                day: i,
                weekday: weekdays[weekday],
                morning: 0,
                afternoon: 0,
                sum: 0,
            });
            weekday++;
            if (weekday > 6) weekday = 1;
        }
    }
    return res;
};

const generateCalendarConfig = (): CALENDAR_CONFIG => {
    const config: CALENDAR_CONFIG = {
        minYear: 0,
        maxYear: 0,
        minMonth: 0,
        maxMonth: 0,
        days: {}
    }
    const curDay = new Date();
    const year = curDay.getFullYear();
    const month = curDay.getMonth() + 1;
    const day = curDay.getDate();
    config.minYear = year;
    config.minMonth = month
    const curMonthDaylen = getMonthDays(month, year);
    config.days[month] = {
        minDay: day,
        maxDay: curMonthDaylen
    };
    config.maxMonth = month;
    config.maxYear = year;
    if (curMonthDaylen - day < 31) {
        config.days[month + 1] = {
            minDay: 1,
            maxDay: 30 - (curMonthDaylen - day)
        };
        config.maxMonth = month + 1
        if (month === 12) {
            config.maxYear = year + 1;
        }
    }
    return config;
};

const generateAPPTData = () => {
    const LEN = 30;
    const initData = [];
    const hasUsedName: Array<string> = [];
    const calendar: Array<CALENDAR_DAY> = generateDefaultCalendarDays();
    const config: CALENDAR_CONFIG = generateCalendarConfig();
    for (let i = 0; i < APPT_LEN; i++) {
        // const name = userNames[Math.floor(Math.random() * Math.floor(userNames.length))];
        const status = Math.floor(Math.random() * (4)) + 1;
        const select_time: Array<DAY_INFO> = [];
        const confirm_time: DAY_INFO = {};
        const [patient] = user_init_data.filter((_patient: USER) => _patient.pid === _exams[i].pid);
        if (status === 1) {
            for (let n = 0; n < 3; n++) {
                const _year = Math.floor(Math.random() * (config.maxYear - config.minYear)) + config.minYear;
                const _month = Math.floor(Math.random() * (config.maxMonth - config.minMonth + 1)) + config.minMonth;
                const _day = Math.floor(Math.random() * (config.days[_month].maxDay - config.days[_month].minDay)) + config.days[_month].minDay;
                select_time.push({
                    year: _year,
                    month: _month,
                    day: _day,
                    weekday: weekdays[new Date(`${_year}-${_month}-${_day}`).getDay() - 1],
                    available: availables[Math.floor(Math.random() * 2)]
                });
            }
        } else {
            if (status === 2) {
                const _year = Math.floor(Math.random() * (config.maxYear - config.minYear)) + config.minYear;
                const _month = Math.floor(Math.random() * (config.maxMonth - config.minMonth + 1)) + config.minMonth;
                const _day = Math.floor(Math.random() * (config.days[_month].maxDay - config.days[_month].minDay)) + config.days[_month].minDay;
                confirm_time.year = _year;
                confirm_time.month = _month;
                confirm_time.day = _day;
                confirm_time.weekday = weekdays[new Date(`${_year}-${_month}-${_day}`).getDay() - 1];
                confirm_time.available = availables[Math.floor(Math.random() * 2)]
            } else if (status === 3) {
                confirm_time.year = config.minYear - Math.floor(Math.random() * 1);
                if (confirm_time.year < config.minYear) {
                    confirm_time.month = Math.floor(Math.random() * (12 - 1)) + 1;
                } else {
                    confirm_time.month = Math.floor(Math.random() * (config.minMonth - 1)) + 1;
                }
                confirm_time.day = Math.floor(Math.random() * (getMonthDays(confirm_time.month, confirm_time.year) - 1)) + 1;
                confirm_time.weekday = weekdays[new Date(`${confirm_time.year}-${confirm_time.month}-${confirm_time.day}`).getDay() - 1];
                confirm_time.available = availables[Math.floor(Math.random() * 2)]
            } else if (status === 4) {
                for (var k = 0; k < 3; k++) {
                    const year = config.minYear - Math.floor(Math.random() * 1);
                    let month = 0;
                    if (year < config.minYear) {
                        month = Math.floor(Math.random() * (12 - 1)) + 1;
                    } else {
                        month = Math.floor(Math.random() * (config.minMonth - 1)) + 1;
                    }
                    const day = Math.floor(Math.random() * (getMonthDays(month, year) - 1)) + 1;
                    const weekday = weekdays[new Date(`${year}-${month}-${day}`).getDay() - 1];
                    const available = availables[Math.floor(Math.random() * 2)]
                    select_time.push({
                        year,
                        month,
                        day,
                        weekday,
                        available
                    });
                }
            }

        }
        if (status === 2) {
            hasUsedName.push(patient.name);
            calendar.filter((day: CALENDAR_DAY) => {
                if (day.year === confirm_time.year && day.month === confirm_time.month && day.day === confirm_time.day) {
                    day.sum++;
                    if (confirm_time.available === 'morning') day.morning++;
                    if (confirm_time.available === 'afternoon') day.afternoon++;
                    return true;
                } else {
                    return false;
                }
            });
        }
        const duplicateItem: APPT_ITEM = initData.filter(item => item.name === patient.name && item.status === 2)[0];

        initData.push({
            "id": i + 1,
            "name": patient.name,
            "mobile": patient.mobile, //`${Math.floor(Math.random() * (18999999999 - 13000000000)) + 13000000000}`,
            "contact_mobile": `${Math.floor(Math.random() * 2) < 2 ? "" : (Math.floor(Math.random() * (18999999999 - 13000000000)) + 13000000000)}`,
            "status": status,
            'org_address': addresses[Math.floor(Math.random() * 4)],
            "exam_id": _exams[i].id,
            "select_time": select_time,
            "confirm_time": confirm_time,
            "has_prev": status < 2 && hasUsedName.indexOf(patient.name) >= 0 && duplicateItem ? 1 : 0,
            "prev_time": status < 2 && hasUsedName.indexOf(patient.name) >= 0 && duplicateItem ? duplicateItem.confirm_time : {}
        });
    }

    fs.writeFile(path.join(__dirname, './calendar.json'), JSON.stringify(calendar), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of calendar.json');
    });

    fs.writeFile(path.join(__dirname, './appt.json'), JSON.stringify(initData), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of appt.json');
    });
};

const generateScopeMonthsForYear = (rang: { [key: number]: any }, year: number): { [key: number]: any } => {
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // const res: { [key: number]: any } = {};
    const monthRandom = Math.floor(Math.random() * (12 - (new Date().getMonth() + 1))) + 1;
    rang[year] = {};
    for (let k = monthRandom; k <= 12; k++) {
        rang[year][k] = [];
        const dayRandom = Math.floor(Math.random() * (28)) + 1;
        const hasNewedDay: Array<number> = [];
        for (let n = 1; n <= dayRandom; n++) {
            let d = Math.floor(Math.random() * (28)) + 1;
            do {
                d = Math.floor(Math.random() * (28)) + 1;
            } while (hasNewedDay.indexOf(d) >= 0)
            rang[year][k].push({
                "day": d,
                "weekday": weekdays[new Date(`${year}-${k}-${d}`).getDay()],
                "available": (Math.floor(Math.random() * (2)) + 1) > 1 ? ["morning", "afternoon"] : ((Math.floor(Math.random() * (2)) + 1) > 1 ? ["morning"] : ["afternoon"])
            });
        }
        rang[year][k] = rang[year][k].sort((itemA: { day: number, weekday: string, available: Array<string> }, itemB: { day: number, weekday: string, available: Array<string> }) => itemA.day - itemB.day);
    }
    return rang;
}

const gererateScopeData = () => {
    const range = _exams.length;
    const scopeData = [];
    for (let i = 1; i <= range; i++) {
        const yearRandom = Math.floor(Math.random() * (2)) + 1;
        const range: { [key: number]: any } = {};
        if (yearRandom === 1) {
            generateScopeMonthsForYear(range, new Date().getFullYear());
        };
        if (yearRandom === 2) {
            generateScopeMonthsForYear(range, new Date().getFullYear());
            generateScopeMonthsForYear(range, new Date().getFullYear() + 1);
        }
        scopeData.push({
            "examID": _exams[i - 1].id,
            "range": range
        });
    }
    fs.writeFile(path.join(__dirname, './scopes.json'), JSON.stringify(scopeData), (err) => {
        if (err) {
            return console.error(err);
        }
        return console.info('Has initial the data of scope.json');
    });
};

export default {
    generateMockData: () => {
        generaterDR();
        generatePatientsInfoData();
        generatePatientsRecordsData();
        gererateExams();
        generateAPPTData();
        gererateScopeData();
    },
};