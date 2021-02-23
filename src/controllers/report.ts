enum RPT_CLASSES {
    NO_VALUE = 'del-field-con empty-value',
    DEF_CON = 'del-field-con',
}
enum RPT_I18N {
    PGE_TITLE = 'i18n.report.page.main.title',
    MSG_CONFIRMED_APPT = 'i18n.appt.list.msg.confirm.appt',
    TITLE_SEL_ANOTHRE_TIEM = 'i18n.date.sel.title.sel.another.time',
    TITLE_RENEW_APPT = 'i18n.date.sel.title.reset.time',
    DESC_BEFORE_CONFIRM = 'i18n.date.sel.desc.warn'
}
enum RPT_KEYS {
    LOGIN_KEY = 'TE9HSU5fSU5GTw'
}
interface PHOTO {
    image_link: string;
    image_size: number;
    thumb_link: string;
    thumb_size: number;
    tag: string;
}

const rptDateSel = new voxelcloudMobileDateSel({ id: 'report-appt-dateSel' });
const rpt_init = () => {
    const $con = document.getElementById('rpt-del-con');
    const $shellHeader = document.getElementById('shell-header-title') as HTMLElement;
    $shellHeader.setAttribute('data-bind', RPT_I18N.PGE_TITLE);
    $shellHeader.innerText = voxelcloudI18n.getText(RPT_I18N.PGE_TITLE);

    load_rpt($con);
    rptDateSel.setTitleDesc(RPT_I18N.TITLE_SEL_ANOTHRE_TIEM, RPT_I18N.DESC_BEFORE_CONFIRM);
    rptDateSel.attachEvent('confirm', confirmSelTime);

    const $msgToastCon = document.getElementById('msg-toast');
    const $btn = $con.querySelector('.rpt-del-dating-state-btn') as HTMLElement;
    if (voxelcloudRouter.getRedirect()) {
        $btn.setAttribute('style', 'display: none');
    } else if ($msgToastCon.getAttribute('class').indexOf('show') >= 0) {
        $btn.setAttribute('style', 'bottom: 3.5rem');
    }

    const $headerMask = document.getElementById('header-shadow-mask');
    const $bg = document.getElementById('bg');
    const bgClasses = $bg.getAttribute('class');
    $headerMask.setAttribute('style', 'background-color:rgba(221, 235, 240, 1)');

    window.addEventListener('datingSavedComplete', (event: CustomEvent) => {
        load_rpt($con);
    });
    window.addEventListener('datingRemoved', (event: CustomEvent) => {
        load_rpt($con);
    });

    if (bgClasses.indexOf('hide') < 0) {
        $bg.setAttribute('class', bgClasses + 'hide');
    }
};


const load_rpt = ($con: HTMLElement) => {
    if (document.getElementById('rpt-del-dating')) {
        const $body = document.getElementsByTagName('body') as HTMLCollection;
        $body[0].removeChild(document.getElementById('rpt-del-dating'));
    }
    // const datingController = new voxelcloudMobileDating({ id: 'rpt-del-dating' });
    const $rptDatingBtn = $con.querySelector('.rpt-del-dating-state-btn') as HTMLElement;
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    const examID = voxelcloudRouter.getParamFormURL('id', routerInfo.URL.ORIG_URL);
    $rptDatingBtn.addEventListener('touchend', (event) => {
        openApptDetail('/CUR_RPT/APPT', -1, setAPPTDate, resetAPPTDate, confirmSelTime);
        // datingController.show(examID, '/CUR_RPT/APPT', voxelcloudDataModel.getPropertyContext('/CUR_RPT/APPT/id'));
        event.stopPropagation();
    });
    new Promise(reslove => loadRPT(examID, reslove))
        .then((resData: any) => {
            voxelcloudDataModel.setPropertyContext('/CUR_RPT', resData, true, $con);
            loadAPPTInfo(resData.reservation.id)
        });
};

const confirmSelTime = (confirmDate: APPT_TIME, APPID: number) => {
    const APPT_INFO = voxelcloudDataModel.getPropertyContext('/CUR_RPT/APPT');
    closeApptDetail();
    confirmAPPT({ id: APPID, confirm_time: confirmDate }, () => {
        voxelcloudMsgToast.setIcon('ic_check_circle_px');
        voxelcloudMsgToast.setDes(voxelcloudI18n.getText(RPT_I18N.MSG_CONFIRMED_APPT, [`${APPT_INFO ? APPT_INFO.name : ''}`, `${confirmDate.month}/${confirmDate.day}${formatAvailable(confirmDate.available)}, ${confirmDate.year}`]));
        voxelcloudMsgToast.show('dr-confirm-time', 3000);
        loadAPPTInfo(APPID.toString());
    }, () => { });
};

const setAPPTDate = (apptIndex: string, timeIndex: string) => {
    const _bindPath = `/CUR_RPT/APPT/select_time/${timeIndex}`;
    const selDateTime = voxelcloudDataModel.getPropertyContext(_bindPath);
    const apptID: string = voxelcloudDataModel.getPropertyContext(`/CUR_RPT/APPT/id`);
    if (selDateTime && apptID && Object.keys(selDateTime).length > 0) {
        confirmAPPT({ id: parseInt(apptID), confirm_time: selDateTime }, () => {
            voxelcloudMsgToast.setIcon('ic_check_circle_px');
            voxelcloudMsgToast.setDes(voxelcloudI18n.getText(RPT_I18N.MSG_CONFIRMED_APPT, [voxelcloudDataModel.getPropertyContext(`/CUR_RPT/APPT/name`), `${selDateTime.month}/${selDateTime.day}${formatAvailable(selDateTime.available)}, ${selDateTime.year}`]));
            voxelcloudMsgToast.show('rpt-confirm-appt', 3000);
            loadAPPTInfo(apptID);
        }, () => { });
    }
};

const resetAPPTDate = (apptIndex: number, reNew?: boolean) => {
    const exam_id = voxelcloudDataModel.getPropertyContext(`/CUR_RPT/APPT/exam_id`);
    if (exam_id) {
        if (reNew) {
            rptDateSel.setTitleDesc(RPT_I18N.TITLE_RENEW_APPT, RPT_I18N.DESC_BEFORE_CONFIRM);
        }
        const APPID = voxelcloudDataModel.getPropertyContext(`/CUR_RPT/APPT/id`);
        loadScope(exam_id, (resData: any) => {
            voxelcloudDataModel.setPropertyContext(`/scope/${exam_id}`, resData.scope);
            rptDateSel.setBindingPath(`/scope/${exam_id}`, APPID);
            rptDateSel.open();
        }, () => { });
    }
};

const loadAPPTInfo = (apptID: string) => {
    const LOGIN_INFO = voxelcloudRouter.getCacheData(RPT_KEYS.LOGIN_KEY);
    const $con = document.getElementById('rpt-del-con');
    get_transfer_reserve(apptID, LOGIN_INFO.userid, (res: any) => {
        let statusCode;
        switch (res.reservation.status) {
            case 'confirming':
                statusCode = 5;
                break;
            case 'confirmed':
                statusCode = 2;
                break;
            case 'finished':
                statusCode = 3;
                break;
            case 'expired':
                statusCode = 4;
                break;
            default:
                statusCode = 1;
                break;
        }
        voxelcloudDataModel.setPropertyContext('/CUR_RPT/APPT', {
            name: res.patient.name,
            mobile: res.patient.contact_mobile || res.patient.mobile,
            org_address: res.org.address,
            status: statusCode,
            exam_id: voxelcloudDataModel.getPropertyContext('/CUR_RPT/exam/id') || '',
            id: res.reservation.id,
            select_time: res.reservation.select_time,
            confirm_time: res.reservation.confirm_time
        }, true, $con);
    }, () => { });
}

const lesions = (strs: string, curDOM: HTMLElement) => {
    const _arr = JSON.parse(strs);
    const $fieldCon = curDOM.parentElement
    $fieldCon.setAttribute('class', _arr.length <= 0 ? RPT_CLASSES.NO_VALUE : RPT_CLASSES.DEF_CON)
    return _arr.join(', ');
};

const formatDatingState = (str: string) => {
    return str || 'new';
}

const fragmentPhoto = (strs: string, curDOM: HTMLElement) => {
    const _arr = JSON.parse(strs);
    const $fieldCon = curDOM.parentElement;
    const fragment = document.createDocumentFragment();
    _arr.forEach((photo: PHOTO) => {
        const $item = document.createElement('div');
        $item.setAttribute('class', 'photo-img-con');
        $item.innerHTML = `<span>${photo.tag}</span>` + `<img class="photo-img" del-src="${photo.thumb_link}" alt="${photo.tag}" src="${photo.image_link}")></img>`;
        fragment.appendChild($item);
    });
    $fieldCon.appendChild(fragment);
    voxelcloudPictureViewer.buildPicViewer($fieldCon);
    return '';
};

const empty_check = (val: string, curDOM: HTMLElement) => {
    const $fieldCon = curDOM.parentElement
    $fieldCon.setAttribute('class', !val ? RPT_CLASSES.NO_VALUE : RPT_CLASSES.DEF_CON)
    return val;
}

const routerInfo = voxelcloudRouter.getCurrentRouter();
const examID = voxelcloudRouter.getParamFormURL('id', routerInfo.URL.ORIG_URL);
// const openid = voxelcloudRouter.getCacheData('OPEN_ID');
rpt_init();

/** add event listener for the router complete (url: '/report')
 * @Sujun **/
window.addEventListener('pageLoadComplete', () => {
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    const $headerMask = document.getElementById('header-shadow-mask');
    if (routerInfo && routerInfo.URL && routerInfo.URL.BASE_URL === '/report') {
        const examID = voxelcloudRouter.getParamFormURL('id', routerInfo.URL.ORIG_URL);
        // const openid = voxelcloudRouter.getCacheData('OPEN_ID');
        rpt_init();
    } else {
        $headerMask.removeAttribute('style');
    }
});
