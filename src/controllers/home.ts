enum HOME_CLASSES {
}

enum HOME_KEYS {
    LOGIN_KEY = 'TE9HSU5fSU5GTw'
}

enum HOME_I18N {
    SELECTED_STATE_TITLE = 'i18n.home.selected.state',
    DEFAULT_FILTER_STATE = 'i18n.state.new',
    MSG_CONFIRMED_APPT = 'i18n.appt.list.msg.confirm.appt',
    TITLE_SEL_ANOTHRE_TIEM = 'i18n.date.sel.title.sel.another.time',
    TITLE_RESET_TIME = 'i18n.date.sel.title.reset.time',
    DESC_BEFORE_CONFIRM = 'i18n.date.sel.desc.warn'
}

interface APPT_RES {
    data_list: Array<APPT>,
    total_len: number
}

interface CALENDAR_RES {
    time_area: Array<{
        year: number,
        month: number,
        day: number,
        weekday: string,
        morning: number,
        afternoon: number,
        sum: number
    }>
}

interface DAY_INFO {
    year?: number,
    month?: number,
    day?: number,
    weekday?: string,
    available?: string
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
    prev_time?: DAY_INFO,
}

const DEFAULT_FILTER_STATE = 1;

const dateSel = new voxelcloudMobileDateSel({ id: 'home-appt-dateSel' });
const $listMaskLayer = document.querySelector('.home-con>.home-list-con>.mask-layer') as HTMLElement;
if ($listMaskLayer) {
    $listMaskLayer.addEventListener('touchend', () => {
        const $con = document.getElementById('home-con') as HTMLElement;
        clearScreenPopup($con);
        $con.setAttribute('popup', 'false');
        event.stopPropagation();
    });
}

window.addEventListener('voxelcloudMobileGoRefresh', () => {
    const $con = document.getElementById('home-con');
    if ($con) {
        const $listCon = $con.querySelector('div.home-list-con') as HTMLElement;
        const LOGIN_INFO = voxelcloudRouter.getCacheData(HOME_KEYS.LOGIN_KEY);
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext('/filter/state/home/key')
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
            tpl_appt_list('/appt_list/home/data', res.data_list, $con, false, selTime, resetTime, homeConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
});


const home_init = () => {
    const $con = document.getElementById('home-con');

    dateSel.setTitleDesc(HOME_I18N.TITLE_SEL_ANOTHRE_TIEM, HOME_I18N.DESC_BEFORE_CONFIRM);
    dateSel.attachEvent('confirm', homeConfirmSelTime);

    const calendar = new voxelcloudMobileCalendar({
        $mainCon: $con.querySelector('.home-calendar-con'),
        $con: $con,
        id: "dating-calendar",
        selectDay: (dayInfo: CALENDAR_DAY) => {
            if (dayInfo && Object.keys(dayInfo).length > 0) {
                voxelcloudRouter.load(`/day?key=${dayInfo.year}-${format_pad(dayInfo.month)}-${format_pad(dayInfo.day)}`);
            }
        }
    });
    loadCalendarDays(calendar);
    voxelcloudDataModel.setPropertyContext('/filter/state/home', { key: DEFAULT_FILTER_STATE, value: voxelcloudI18n.getText(HOME_I18N.DEFAULT_FILTER_STATE) }, true, $con);

    const LOGIN_INFO = voxelcloudRouter.getCacheData(HOME_KEYS.LOGIN_KEY);
    scrollToLoadInit($con.querySelector('div.list-main-con'), (resFn: Function) => {
        if (voxelcloudDataModel.getPropertyContext('/appt_list/home/total') > voxelcloudDataModel.getPropertyContext('/appt_list/home/data').length) {
            getDatingList({
                user_id: LOGIN_INFO.userid,
                status: voxelcloudDataModel.getPropertyContext('/filter/state/home/key'),
                page_num: (voxelcloudDataModel.getPropertyContext('/appt_list/home/data').length / 15) + 1
            }, (res: APPT_RES) => {
                voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
                tpl_appt_list('/appt_list/home/data', res.data_list, $con, true, selTime, resetTime, homeConfirmSelTime);
                resFn();
            }, () => { });
        } else {
            resFn();
        }

    });

    tpl_list_header_event($con, '/filter/state/home/key', () => {
        const $listCon = $con.querySelector('div.home-list-con') as HTMLElement;
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext('/filter/state/home/key')
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
            tpl_appt_list('/appt_list/home/data', res.data_list, $con, false, selTime, resetTime, homeConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    });

    if (LOGIN_INFO.userid) {
        const $listCon = $con.querySelector('div.home-list-con') as HTMLElement;
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: 1
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false')
            voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
            tpl_appt_list('/appt_list/home/data', res.data_list, $con, false, selTime, resetTime, homeConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
};

const homeConfirmSelTime = (confirmDate: APPT_TIME, APPID: number) => {
    const $con = document.getElementById('home-con');
    const [APPT_INFO] = voxelcloudDataModel.getPropertyContext('/appt_list/home/data').filter((appt: any) => appt.id === APPID);
    const LOGIN_INFO = voxelcloudRouter.getCacheData(HOME_KEYS.LOGIN_KEY);
    closeApptDetail();
    const $listCon = $con.querySelector('div.home-list-con') as HTMLElement;
    confirmAPPT({ id: APPID, confirm_time: confirmDate }, () => {
        clearScreenPopup($con);
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext('/filter/state/home/key')
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
            tpl_appt_list('/appt_list/home/data', res.data_list, document.getElementById('home-con'), false, selTime, resetTime, homeConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
        voxelcloudMsgToast.setIcon('ic_check_circle_px');
        voxelcloudMsgToast.setDes(voxelcloudI18n.getText(HOME_I18N.MSG_CONFIRMED_APPT, [`${APPT_INFO ? APPT_INFO.name : ''}`, `${confirmDate.month}/${confirmDate.day}${formatAvailable(confirmDate.available)}, ${confirmDate.year}`]));
        voxelcloudMsgToast.show('dr-confirm-time', 3000);
    }, () => $listCon.setAttribute('loading', 'false'));
}

const selTime = (apptIndex: string, timeIndex: string) => {
    const _bindPath = `/appt_list/home/data/${apptIndex}/select_time/${timeIndex}`;
    const selDateTime = voxelcloudDataModel.getPropertyContext(_bindPath);
    const apptID: string = voxelcloudDataModel.getPropertyContext(`/appt_list/home/data/${apptIndex}/id`);
    if (selDateTime && apptID && Object.keys(selDateTime).length > 0) {
        const LOGIN_INFO = voxelcloudRouter.getCacheData(HOME_KEYS.LOGIN_KEY);
        const $con = document.getElementById('home-con');
        const $listCon = $con.querySelector('div.home-list-con') as HTMLElement;
        confirmAPPT({ id: parseInt(apptID), confirm_time: selDateTime }, () => {
            clearScreenPopup($con);
            $listCon.setAttribute('loading', 'true');
            getDatingList({
                user_id: LOGIN_INFO.userid,
                status: voxelcloudDataModel.getPropertyContext('/filter/state/home/key')
            }, (res: APPT_RES) => {
                $listCon.setAttribute('loading', 'false');
                voxelcloudDataModel.setPropertyContext('/appt_list/home/total', res.total_len);
                tpl_appt_list('/appt_list/home/data', res.data_list, document.getElementById('home-con'), false, selTime, resetTime, homeConfirmSelTime);
            }, () => $listCon.setAttribute('loading', 'false'));
            voxelcloudMsgToast.setIcon('ic_check_circle_px');
            voxelcloudMsgToast.setDes(voxelcloudI18n.getText(HOME_I18N.MSG_CONFIRMED_APPT, [voxelcloudDataModel.getPropertyContext(`/appt_list/home/data/${apptIndex}/name`), `${selDateTime.month}/${selDateTime.day}${formatAvailable(selDateTime.available)}, ${selDateTime.year}`]));
            voxelcloudMsgToast.show('home-confirm-appt', 3000);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
};

const resetTime = (apptIndex: string, reNew?: boolean) => {
    const exam_id = voxelcloudDataModel.getPropertyContext(`/appt_list/home/data/${apptIndex}/exam_id`);
    const APPID = voxelcloudDataModel.getPropertyContext(`/appt_list/home/data/${apptIndex}/id`);
    if (exam_id) {
        if (reNew) {
            dateSel.setTitleDesc(HOME_I18N.TITLE_RESET_TIME, HOME_I18N.DESC_BEFORE_CONFIRM);
        }
        loadScope(exam_id, (resData: any) => {
            voxelcloudDataModel.setPropertyContext(`/scope/${exam_id}`, resData.scope);
            dateSel.setBindingPath(`/scope/${exam_id}`, APPID);
            dateSel.open();
        }, () => { });
    }
};


const loadCalendarDays = (calendar: voxelcloudMobileCalendar) => {
    const LOGIN_INFO = voxelcloudRouter.getCacheData(HOME_KEYS.LOGIN_KEY);
    if (LOGIN_INFO.userid) {
        reqCalendarDays(LOGIN_INFO.userid, (res: CALENDAR_RES) => {
            const bindPath = '/calendar/days'
            voxelcloudDataModel.setPropertyContext(bindPath, res.time_area);
            calendar.bindDayList(bindPath);
        }, () => { });
    }
};




home_init();

/** add event listener for the router complete (url: '/home')
 * @Sujun **/
window.addEventListener('pageLoadComplete', () => {
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    if (routerInfo && routerInfo.URL && routerInfo.URL.BASE_URL === '/home') {
        if (!voxelcloudRouter.getCacheData("USER_ID")) {
            voxelcloudRouter.load('/login');
        } else {
            home_init();
        }
    }
});

