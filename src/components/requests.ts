interface APPT_TIME {
    year: number,
    month: number,
    day: number,
    weekday: string,
    available: string
}

interface GET_DATING_PARAMS {
    user_id: string,
    status: number,
    page_size?: number,
    page_num?: number,
    date?: string
}

interface PHOTO_ITEM {
    image_link: string;
    image_size: string;
    tag: string;
    thumb_link: string;
    thumb_size: string;
}

interface SCOPE_DAY {
    day: number;
    weekday: string;
    available: Array<string>;
}


interface R_APPT_INFO {
    id?: string,
    // pid: string,
    exam_id: string,
    select_time: Array<APPT_TIME>,
    contact_mobile: string
}

interface SCOPE_RES {
    scope: SCOPE_YEAR;
}

interface SCOPE_YEAR {
    [key: string]: SCOPE_MONTH
}

interface SCOPE_MONTH {
    [key: string]: Array<SCOPE_DAY>
}

interface CONFIRM_DATE {
    id: number;
    confirm_time: APPT_TIME
}

type HeadersInit_ = Headers | string[][] | { [key: string]: string };

const KEYS = {
    LOGIN: 'TE9HSU4',
    NAME: 'TkFNRQ',
    PWD: 'UFdE',
}


const generateAuthorization = (): string => {
    const loginUser = JSON.parse(voxelcloudRouter.getCacheData(KEYS.LOGIN) || '{}');
    if (Object.keys(loginUser).length > 0) {
        const { [KEYS.NAME]: name, [KEYS.PWD]: pwd } = loginUser;
        return `Basic ${btoa(name + ':' + pwd)}`;
    } else {
        return '';
    }
}

const prepareReq = (req: XMLHttpRequest) => {
    req.setRequestHeader('Content-Type', 'application/json');
    req.setRequestHeader('Accept', 'application/json');
    req.setRequestHeader('Authorization', 'Basic ' + generateAuthorization());
}

const callAPI = (endpoint: string, method: string, reqParams: { [key: string]: any }) => {
    const baseHeaders: HeadersInit_ = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: generateAuthorization(),
    }
    const config: RequestInit = {
        method,
        // credentials: 'include',
        headers: baseHeaders,
    }
    if (method !== 'GET' && method !== 'DELETE') {
        config.body = JSON.stringify(reqParams);
    } else {
        const paramsStr = new URLSearchParams(Object.entries(reqParams));
        endpoint += '?' + paramsStr;
    }
    // set cros options for dev/tune;
    // config.mode = 'cors';
    config.headers = {
        ...baseHeaders,
        // 'Access-Control-Allow-Methods': 'GET,DELETE,POST,PATCH,OPTIONS',
        // 'Access-Control-Allow-Headers': 'Accept,Content-Type,x-requested-with,Authorization',
    };

    return fetch(endpoint || endpoint, config).then(response =>
        response.json().then(json => {
            if (!response.ok) {
                return Promise.reject(json)
            }
            return Object.assign({}, json);
        })
    );
}


/**
* validate whether the user ID is correct/exist in back-end;/validate whether the user ID and password is match
* @Sujun 
* **/
const login = (userID: string, openid?: string, pwd?: string, successFn?: Function, errorFn?: Function): any => {
    if (!userID) {
        return errorFn ? errorFn() : false;
    }
    callAPI('/api/reserve_login', 'POST', { username: userID, password: pwd, openid: openid }).then((res) => {
        if (userID && pwd) {
            voxelcloudRouter.setCacheData(KEYS.LOGIN, JSON.stringify({
                [KEYS.NAME]: userID,
                [KEYS.PWD]: pwd
            }));
        }
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/reserve_login', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
* get the dating list from back-end with filter operations
* @Sujun 
* **/
const getDatingList = (params: GET_DATING_PARAMS, successFn?: Function, errorFn?: Function) => {
    if (!params.user_id || !params.status) {
        return errorFn ? errorFn() : false;
    }
    callAPI('/api/reservation_list', 'POST', { user_id: params.user_id, status: params.status }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/reservation_list', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${err.status}: ${err.error_message}`);
    });
};

/**
 * confirm the reservation in withe one confirmed date time;
 * @Sujun
 * **/
const confirmAPPT = (params: CONFIRM_DATE, successFn?: Function, errorFn?: Function) => {
    if (!params.id || !params.confirm_time || Object.keys(params.confirm_time).length <= 0) {
        return errorFn ? errorFn() : false;
    }

    callAPI('/api/reservation_confirm', 'POST', params).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/reservation_confirm', res: err });
        loadAppointmentInfo(params.id.toString(), null, () => {
            const $msgBox = document.querySelector('div.msg-box-con') as HTMLElement;
            $msgBox.setAttribute('show', 'true');
        });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

const reqCalendarDays = (userID: string, successFn?: Function, errorFn?: Function): any => {
    if (!userID) {
        return errorFn ? errorFn() : false;
    }

    callAPI('/api/calendar_time_area', 'POST', { user_id: userID }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/calendar_time_area', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
 * Request Report detail
 * @Sujun 
 * **/
const loadRPT = (examID: string, successFn?: Function, errorFn?: Function): any => {
    if (!examID) {
        return errorFn ? errorFn() : false;
    }

    callAPI('/api/wechat_report', 'POST', { exam_id: examID }).then((res) => {
        res.photo.photo_list = res.photo.photo_list.sort((photoA: PHOTO_ITEM, photoB: PHOTO_ITEM) => photoA.tag.localeCompare(photoB.tag));
        // let statusCode;
        // switch (res.reservation.status) {
        //     case 'confirming':
        //         statusCode = 5;
        //         break;
        //     case 'confirmed':
        //         statusCode = 2;
        //         break;
        //     case 'finished':
        //         statusCode = 3;
        //         break;
        //     case 'expired':
        //         statusCode = 4;
        //         break;
        //     default:
        //         statusCode = 1;
        //         break;
        // }
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/wechat_report', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
* Request cancle the appointment; 
* @Sujun 
* **/
const cancelAppointmentInfo = (_id: number, successFn?: Function, errorFn?: Function): any => {
    callAPI('/api/transfer_reserve', 'DELETE', { id: _id }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/transfer_reserve', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};
/**
* Request get appointment according to the ID 
* @Sujun 
* **/
const loadAppointmentInfo = (ID: string, successFn?: Function, errorFn?: Function): any => {
    if (!ID) {
        return errorFn ? errorFn() : false;
    }
    callAPI('/api/get_reserve', 'GET', { id: ID }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/get_reserve', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};
/**
 * Request get scope of the date according to the examID 
 * @Sujun 
 * **/
const loadScope = (examID: string, successFn?: Function, errorFn?: Function): any => {
    if (!examID) {
        return errorFn ? errorFn() : false;
    }
    callAPI('/api/scope', 'POST', { exam_id: examID }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/scope', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
 * Request get Organization info according to the examID 
 * @Sujun 
 * **/
const loadOrgInfo = (examID: string, successFn?: Function, errorFn?: Function): any => {
    if (!examID) {
        return errorFn ? errorFn() : false;
    }
    callAPI('/api/transfer_org', 'POST', { exam_id: examID }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/transfer_org', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
 * Request to get the detial info of  one appointment
 * @Sujun
 * **/
const get_transfer_reserve = (apptID: string, user_id: string, successFn?: Function, errorFn?: Function): any => {
    if (!apptID || !user_id) {
        return errorFn ? errorFn() : false;
    }

    callAPI('/api/get_reserve', 'GET', { id: apptID, user_id: user_id }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/get_reserve', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
};

/**
 * Request to get the count of the confrimed appointments
 * @Sujun
 * **/
const confirmed_count = (user_id: string, date: string, successFn?: Function, errorFn?: Function) => {
    if (!user_id || !date) {
        return errorFn ? errorFn() : false;
    }

    callAPI('/api/confirmed_count', 'POST', { date, user_id, }).then((res) => {
        if (successFn) successFn(res);
    }).catch((err) => {
        if (errorFn) errorFn({ reqURL: '/api/confirmed_count', res: err });
        // TODO should has error handler for them, to popup message box?
        throw new Error(`${this.status}: ${err.error_message}`);
    });
}
