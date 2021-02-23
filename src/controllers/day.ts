enum DAY_I18NS {
    MSG_CONFIRMED_APPT = 'i18n.appt.list.msg.confirm.appt',
    TITLE_SEL_ANOTHRE_TIEM = 'i18n.date.sel.title.sel.another.time',
    TITLE_RESET_TIME = 'i18n.date.sel.title.reset.time',
    DESC_BEFORE_CONFIRM = 'i18n.date.sel.desc.warn',
    DEFAULT_FILTER_STATE = 'i18n.state.confirmed',
}
enum DAY_KEYS {
    LOGIN_KEY = 'TE9HSU5fSU5GTw'
}
const dayDateSel = new voxelcloudMobileDateSel({ id: 'day-appt-dateSel' });
const $listML = document.querySelector('.day-con>.day-list-con>.mask-layer') as HTMLElement;
if ($listML) {
    $listML.addEventListener('touchend', () => {
        const $con = document.getElementById('day-con') as HTMLElement;
        clearScreenPopup($con);
        $con.setAttribute('popup', 'false');
        event.stopPropagation();
    });
}


window.addEventListener('voxelcloudMobileGoRefresh', () => {
    const $con = document.getElementById('day-con');
    if ($con) {
        const $listCon = $con.querySelector('div.day-list-con') as HTMLElement;
        const LOGIN_INFO = voxelcloudRouter.getCacheData(DAY_KEYS.LOGIN_KEY);
        const curDayInfo = voxelcloudDataModel.getPropertyContext('/sel_day');
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext(`/filter/state/${curDayInfo.key}/key`),
            date: curDayInfo.key
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
            tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, $con, false, daySelTime, dayResetTime, dayConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
});



const day_init = () => {

    const $con = document.getElementById('day-con');
    const $listCon = $con.querySelector('div.day-list-con') as HTMLElement;

    loadDayInfo($con);

    const curDayInfo = voxelcloudDataModel.getPropertyContext('/sel_day');
    dayDateSel.setTitleDesc(DAY_I18NS.TITLE_SEL_ANOTHRE_TIEM, DAY_I18NS.DESC_BEFORE_CONFIRM);
    dayDateSel.attachEvent('confirm', dayConfirmSelTime);

    const DEFAULT_FILTER_STATE = 2;
    voxelcloudDataModel.setPropertyContext(`/filter/state/${curDayInfo.key}`, { key: DEFAULT_FILTER_STATE, value: voxelcloudI18n.getText(DAY_I18NS.DEFAULT_FILTER_STATE) }, true, $con);

    const LOGIN_INFO = voxelcloudRouter.getCacheData(DAY_KEYS.LOGIN_KEY);
    scrollToLoadInit($con.querySelector('div.list-main-con'), (resFn: Function) => {
        if (voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/total`) > voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data`).length) {
            getDatingList({
                user_id: LOGIN_INFO.userid,
                status: voxelcloudDataModel.getPropertyContext(`/filter/state/${curDayInfo.key}/key`),
                page_num: (voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data`).length / 15) + 1,
                date: curDayInfo.key
            }, (res: APPT_RES) => {
                if (res.data_list.length > 0) {
                    voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
                    tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, $con, true, daySelTime, dayResetTime, dayConfirmSelTime);
                    resFn();
                }
            }, () => { });
        } else {
            resFn();
        }
    });

    tpl_list_header_event($con, `/filter/state/${curDayInfo.key}/key`, () => {
        $listCon.setAttribute('loading', 'true');
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext(`/filter/state/${curDayInfo.key}/key`),
            date: curDayInfo.key
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
            tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, $con, false, daySelTime, dayResetTime, dayConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    }, { 1: false, 2: false, 3: true, 4: true });

    if (LOGIN_INFO.userid) {
        $listCon.setAttribute('loading', 'true')
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: DEFAULT_FILTER_STATE,
            date: curDayInfo.key
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false')
            voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
            tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, $con, false, daySelTime, dayResetTime, dayConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
};

const dayConfirmSelTime = (confirmDate: APPT_TIME, APPID: number) => {
    const $con = document.getElementById('day-con');
    const $listCon = $con.querySelector('div.day-list-con') as HTMLElement;
    const curDayInfo = voxelcloudDataModel.getPropertyContext('/sel_day');
    const [APPT_INFO] = voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data`).filter((appt: any) => appt.id === APPID);
    const LOGIN_INFO = voxelcloudRouter.getCacheData(DAY_KEYS.LOGIN_KEY);
    closeApptDetail();
    confirmAPPT({ id: APPID, confirm_time: confirmDate }, () => {
        $listCon.setAttribute('loading', 'true');
        clearScreenPopup($con);
        confirmed_count(LOGIN_INFO.userid, voxelcloudDataModel.getPropertyContext('/sel_day/key'), (res: any) => {
            voxelcloudDataModel.setPropertyContext(`/sel_day`, { ...voxelcloudDataModel.getPropertyContext('/sel_day'), am: res.morning, pm: res.afternoon }, true, $con.querySelector('div.day-info-card'))
        }, () => { });
        getDatingList({
            user_id: LOGIN_INFO.userid,
            status: voxelcloudDataModel.getPropertyContext(`/filter/state/${curDayInfo.key}/key`),
            date: curDayInfo.key
        }, (res: APPT_RES) => {
            $listCon.setAttribute('loading', 'false');
            voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
            tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, document.getElementById('day-con'), false, daySelTime, dayResetTime, dayConfirmSelTime);
        }, () => $listCon.setAttribute('loading', 'false'));
        voxelcloudMsgToast.setIcon('ic_check_circle_px');
        voxelcloudMsgToast.setDes(voxelcloudI18n.getText(DAY_I18NS.MSG_CONFIRMED_APPT, [`${APPT_INFO ? APPT_INFO.name : ''}`, `${confirmDate.month}/${confirmDate.day}${formatAvailable(confirmDate.available)}, ${confirmDate.year}`]));
        voxelcloudMsgToast.show('dr-confirm-time', 3000);
    }, () => $listCon.setAttribute('loading', 'false'));
}

const loadDayInfo = ($con: HTMLElement) => {
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    const dateKey = voxelcloudRouter.getParamFormURL('key', routerInfo.URL.ORIG_URL);
    const [year, month, day] = dateKey.split('-');
    const LOGIN_INFO = voxelcloudRouter.getCacheData(DAY_KEYS.LOGIN_KEY);
    voxelcloudDataModel.setPropertyContext('/sel_day/key', dateKey);
    confirmed_count(LOGIN_INFO.userid, dateKey, (res: any) => {
        voxelcloudDataModel.setPropertyContext(`/sel_day`, { key: dateKey, year: parseInt(year), month: parseInt(month), day: parseInt(day), am: res.morning, pm: res.afternoon }, true, $con.querySelector('div.day-info-card'))
    }, () => { });
}

const daySelTime = (apptIndex: string, timeIndex: string) => {
    const curDayInfo = voxelcloudDataModel.getPropertyContext('/sel_day');
    const _bindPath = `/appt_list/${curDayInfo.key}/data/${apptIndex}/select_time/${timeIndex}`;
    const selDateTime = voxelcloudDataModel.getPropertyContext(_bindPath);
    const apptID: string = voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data/${apptIndex}/id`);
    if (selDateTime && apptID && Object.keys(selDateTime).length > 0) {
        const LOGIN_INFO = voxelcloudRouter.getCacheData(DAY_KEYS.LOGIN_KEY);
        const $con = document.getElementById('day-con');
        const $listCon = $con.querySelector('div.day-list-con') as HTMLElement;
        confirmAPPT({ id: parseInt(apptID), confirm_time: selDateTime }, () => {
            clearScreenPopup($con);
            $listCon.setAttribute('loading', 'true');
            confirmed_count(LOGIN_INFO.userid, voxelcloudDataModel.getPropertyContext('/sel_day/key'), (res: any) => {
                voxelcloudDataModel.setPropertyContext(`/sel_day`, { ...voxelcloudDataModel.getPropertyContext('/sel_day'), am: res.morning, pm: res.afternoon }, true, $con.querySelector('div.day-info-card'))
            }, () => { });
            getDatingList({
                user_id: LOGIN_INFO.userid,
                status: voxelcloudDataModel.getPropertyContext(`/filter/state/${curDayInfo.key}/key`),
                date: curDayInfo.key
            }, (res: APPT_RES) => {
                $listCon.setAttribute('loading', 'false');
                voxelcloudDataModel.setPropertyContext(`/appt_list/${curDayInfo.key}/total`, res.total_len);
                tpl_appt_list(`/appt_list/${curDayInfo.key}/data`, res.data_list, document.getElementById('day-con'), false, daySelTime, dayResetTime, dayConfirmSelTime);
            }, () => $listCon.setAttribute('loading', 'false'));

            voxelcloudMsgToast.setIcon('ic_check_circle_px');
            voxelcloudMsgToast.setDes(voxelcloudI18n.getText(DAY_I18NS.MSG_CONFIRMED_APPT, [voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data/${apptIndex}/name`), `${selDateTime.month}/${selDateTime.day}${formatAvailable(selDateTime.available)}, ${selDateTime.year}`]));
            voxelcloudMsgToast.show('day-confirm-appt', 3000);
        }, () => $listCon.setAttribute('loading', 'false'));
    }
};
const dayResetTime = (apptIndex: string, reNew?: boolean) => {
    const curDayInfo = voxelcloudDataModel.getPropertyContext('/sel_day');
    const exam_id = voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data/${apptIndex}/exam_id`);
    const APPID = voxelcloudDataModel.getPropertyContext(`/appt_list/${curDayInfo.key}/data/${apptIndex}/id`);
    if (exam_id) {
        loadScope(exam_id, (resData: any) => {
            voxelcloudDataModel.setPropertyContext(`/scope/${exam_id}`, resData.scope);
            dayDateSel.setBindingPath(`/scope/${exam_id}`, APPID);
            dayDateSel.open();
        }, () => { });
    }
};

day_init();


/** add event listener for the router complete (url: '/day')
 * @Sujun **/
window.addEventListener('pageLoadComplete', () => {
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    if (routerInfo && routerInfo.URL && routerInfo.URL.BASE_URL === '/day') {
        if (!voxelcloudRouter.getCacheData("USER_ID")) {
            voxelcloudRouter.load('/login');
        } else {
            day_init();
        }
    }
});