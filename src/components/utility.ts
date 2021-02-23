enum UTIL_I18NS {
    Monday = "i18n.calendar.dates.weekday.mon",
    Tuesday = "i18n.calendar.dates.weekday.tue",
    Wednesday = "i18n.calendar.dates.weekday.wed",
    Thursday = "i18n.calendar.dates.weekday.thu",
    Friday = "i18n.calendar.dates.weekday.fri",
    Saturday = "i18n.calendar.dates.weekday.sat",
    Sunday = "i18n.calendar.dates.weekday.sun",
    year = "i18n.calendar.dates.year",
    month_1 = "i18n.calendar.date.month.jan",
    month_2 = "i18n.calendar.date.month.feb",
    month_3 = "i18n.calendar.date.month.mar",
    month_4 = "i18n.calendar.date.month.apr",
    month_5 = "i18n.calendar.date.month.may",
    month_6 = "i18n.calendar.date.month.jun",
    month_7 = "i18n.calendar.date.month.jly",
    month_8 = "i18n.calendar.date.month.aug",
    month_9 = "i18n.calendar.date.month.sep",
    month_10 = "i18n.calendar.date.month.oct",
    month_11 = "i18n.calendar.date.month.nov",
    month_12 = "i18n.calendar.date.month.dec",
    APPT_DUP = 'i18n.appt.list.sate.dup',
    NO_DATA = 'i18n.appt.list.nodata',
    NO_DATA_DESC = 'i18n.appt.list.nodata.desc',
    DUP_TXT = 'i18n.appt.list.state.dup.desc',
    SEL_TIME_TITLE = 'i18n.appt.list.operation.sel.time.title',
    PHONE_CALL = 'i18n.appt.list.operation.phone.call',
    RESEL_TIME = 'i18n.appt.list.operation.reselect.time',
    UNIT = 'i18n.calendar.unit',
    SELECTED_STATE_TITLE = 'i18n.home.selected.state',
    TITLE_RESET_TIME = 'i18n.date.sel.title.reset.time',
    DESC_BEFORE_CONFIRM = 'i18n.date.sel.desc.warn',
    G_M = 'i18n.userInfo.det.sel.gender.m',
    G_F = 'i18n.userInfo.det.sel.gender.f',
    G_O = 'i18n.userInfo.det.sel.gender.o'
}

enum UTIL_CLASSES {
    NAV_SELECETED = 'nav-btn selected',
    NAV_DEF = 'nav-btn',
    MSG_TOAST_DEF = 'msg-toast',
    MSG_TOAST_SHOW = 'msg-toast show'
}

enum UTIL_EVENT {
    MSG_TOAST_TIMEOUT = 'voxelcloudMessageToastTiemout'
}

interface STATE_VISIBLE {
    [key: number]: boolean
    1: boolean,
    2: boolean,
    3: boolean,
    4: boolean
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
    status: number,
    exam_id: string,
    contact_mobile: string,
    select_time?: Array<DAY_INFO>,
    confirm_time?: DAY_INFO,
    has_prev: number,
    prev_time?: DAY_INFO,
}


const format_gender = (code: string): string => {
    let res = code;
    switch (code) {
        case 'M':
            res = voxelcloudI18n.getText(UTIL_I18NS.G_M);
            break;
        case 'F':
            res = voxelcloudI18n.getText(UTIL_I18NS.G_F);
            break;
        case 'O':
            res = voxelcloudI18n.getText(UTIL_I18NS.G_O);
            break;
    }
    return res;
}

const formatWeekDay = (weekDayCode: string): string => {
    let key = '';
    switch (weekDayCode) {
        case 'Monday':
            key = UTIL_I18NS.Monday;
            break;
        case 'Tuesday':
            key = UTIL_I18NS.Tuesday;
            break;
        case 'Wednesday':
            key = UTIL_I18NS.Wednesday;
            break;
        case 'Thursday':
            key = UTIL_I18NS.Thursday;
            break;
        case 'Friday':
            key = UTIL_I18NS.Friday;
            break;
        case 'Saturday':
            key = UTIL_I18NS.Saturday;
            break;
        case 'Sunday':
            key = UTIL_I18NS.Sunday;
            break;
    }
    return voxelcloudI18n.getText(key);
}

const formatSum = (sum: number): string => {
    return `${sum}${voxelcloudI18n.getText(UTIL_I18NS.UNIT)}`;
}

const formatYear = (year: number): string => {
    return voxelcloudI18n.getText(UTIL_I18NS.year, [year.toString()]);
};
const formatMonth = (month: number): string => {
    const months: { [key: number]: string } = {
        1: "i18n.calendar.date.month.jan",
        2: "i18n.calendar.date.month.feb",
        3: "i18n.calendar.date.month.mar",
        4: "i18n.calendar.date.month.apr",
        5: "i18n.calendar.date.month.may",
        6: "i18n.calendar.date.month.jun",
        7: "i18n.calendar.date.month.jly",
        8: "i18n.calendar.date.month.aug",
        9: "i18n.calendar.date.month.sep",
        10: "i18n.calendar.date.month.oct",
        11: "i18n.calendar.date.month.nov",
        12: "i18n.calendar.date.month.dec"
    }
    return month <= 0 ? "" : voxelcloudI18n.getText(months[month]);
};

const formatDay = (day: number): string => {
    return voxelcloudI18n.getText('i18n.sel.date.day', [format_pad(day)]);
}

const formatAPPTStatus = (statusCode: number): string => {
    const STATE: { [key: number]: string } = {
        1: 'i18n.state.new',
        2: 'i18n.state.confirmed',
        3: 'i18n.state.visited',
        4: 'i18n.state.expired'
    };
    return voxelcloudI18n.getText(STATE[statusCode]);
}

const tpl_appt_list = (bindingPath: string, bindingData: any, $con: HTMLElement, appendChild?: boolean, confirm_time?: Function, reseTime?: Function, confirmFn?: Function) => {
    let $lis = '';
    const $ul = $con.querySelector('div.list-main-con>ul.list-ul') as HTMLElement;
    $ul.setAttribute('no-data', bindingData.length > 0 ? 'false' : 'true');
    if (bindingData.length === 0) {
        $lis += `<li class='no-data'><span class='iconfont icon-ic_free_breakfast_'></span><span class='title' data-bind='${UTIL_I18NS.NO_DATA}'>${voxelcloudI18n.getText(UTIL_I18NS.NO_DATA)}</span><span class='desc' data-bind='${UTIL_I18NS.NO_DATA_DESC}'>${voxelcloudI18n.getText(UTIL_I18NS.NO_DATA_DESC)}</span></li>`
        $ul.innerHTML = $lis;
    } else {
        let defaultIndex = 0;
        if (appendChild && voxelcloudDataModel.getPropertyContext(bindingPath) && voxelcloudDataModel.getPropertyContext(bindingPath).length > 0) {
            defaultIndex = voxelcloudDataModel.getPropertyContext(bindingPath).length;
        }
        const _path = bindingPath.replace(/\//g, '.');
        bindingData.forEach((appt: APPT, index: number) => {
            $lis += `<li state='${appt.status}' data-bind='state-dataModel${_path}.${defaultIndex + index}.status'>`;
            $lis += `<div class='content'>`;
            $lis += `<div class='main-row'>`;
            $lis += `<span class='name' data-bind='state-dataModel${_path}.${defaultIndex + index}.name'>${appt.name}</span>`;
            if (appt.has_prev === 1) {
                $lis += `<span class='duplicate-state' data-bind='${UTIL_I18NS.APPT_DUP}'>${voxelcloudI18n.getText(UTIL_I18NS.APPT_DUP)}</span>`;
            }
            $lis += `</div>`;
            $lis += `<div class='second-row'>`;
            if (appt.has_prev === 1) {
                $lis += `<span class='dup-txt' data-bind='dataModel${_path}.${defaultIndex + index}.prev_time' data-formatter='formatDupTimeTxt'>${formatDupTimeTxt(appt.prev_time)}</span>`;
            } else if (Object.keys(appt.confirm_time).length > 0) {
                $lis += `<span class='month' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.month' data-formatter='format_pad'>${format_pad(appt.confirm_time.month)}</span>`;
                $lis += `<span class='day' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.day' data-formatter='format_pad'>${format_pad(appt.confirm_time.day)}</span>`;
                $lis += `<span class='available' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.available' data-formatter='formatAvailable'>${formatAvailable(appt.confirm_time.available)}</span>`;
            } else if (appt.select_time && appt.select_time.length > 0) {
                appt.select_time.forEach((day: DAY_INFO, timeIndex: number) => {
                    $lis += `<span class='month' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.month' data-formatter='format_pad'>${format_pad(day.month)}</span>`;
                    $lis += `<span class='day' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.day' data-formatter='format_pad'>${format_pad(day.day)}</span>`;
                    $lis += `<span class='available' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.available' data-formatter='formatAvailable'>${formatAvailable(day.available)}</span>`;
                });
            }
            $lis += `</div>`;
            $lis += `</div>`;
            $lis += `<div class='actions'>`;
            if (appt.status > 1 && appt.status < 4) {
                if (Object.keys(appt.confirm_time).length > 0) {
                    $lis += '<div class="confirmed-date">';
                    $lis += `<span class='month' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.month' data-formatter='format_pad'>${format_pad(appt.confirm_time.month)}</span>`;
                    $lis += `<span class='day' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.day' data-formatter='format_pad'>${format_pad(appt.confirm_time.day)}</span>`;
                    $lis += `<span class='available' data-bind='dataModel${_path}.${defaultIndex + index}.confirm_time.available' data-formatter='formatAvailable'>${formatAvailable(appt.confirm_time.available)}</span>`;
                    $lis += '</div>';
                }
            } else if (appt.status === 4) {
                $lis += '<div class="confirmed-date">';
                $lis += `<span class='expired' data-bind='i18n.state.expired'>${voxelcloudI18n.getText('i18n.state.expired')}</span>`;
                $lis += '</div>';
            } else {
                $lis += `<div rowIndex='${defaultIndex + index}' key='${appt.id}' class='sel-date-btn iconfont icon-calendar_today-24px'>`;
                $lis += `<div class='appt-edit-menu'>`;
                if (appt.status === 1) {
                    $lis += `<span class='menu-header' data-bind='${UTIL_I18NS.SEL_TIME_TITLE}'>${voxelcloudI18n.getText(UTIL_I18NS.SEL_TIME_TITLE)}</span>`;
                    $lis += `<ul class='select-times'>`;
                    const curDate = new Date();
                    appt.select_time.forEach((day: DAY_INFO, timeIndex: number) => {
                        const tgtHour = day.available === 'morning' ? 12 : 24;
                        const tgtDate = new Date(`${day.year}-${day.month}-${day.day} ${tgtHour}:00`);
                        const isSameDay = tgtDate.getFullYear() === curDate.getFullYear() && tgtDate.getMonth() === curDate.getMonth() && tgtDate.getDate() === curDate.getDate();
                        const curHour = curDate.getHours();
                        $lis += `<li class='select-time-item ${((tgtDate < curDate) || (isSameDay && tgtHour < curHour)) && "invalid" || 'valid'}' apptIndex='${defaultIndex + index}' apptID='${appt.id}' timeIndex='${timeIndex}'>`;
                        $lis += `<span class='month' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.month' data-formatter='format_pad'>${format_pad(day.month)}</span>`;
                        $lis += `<span class='day' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.day' data-formatter='format_pad'>${format_pad(day.day)}</span>`;
                        $lis += `<span class='available' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.available' data-formatter='formatAvailable'>${formatAvailable(day.available)}</span>`;
                        $lis += `<span class='year' data-bind='dataModel${_path}.${defaultIndex + index}.select_time.${timeIndex}.year'>${day.year}</span>`;
                        $lis += `</li>`;
                    });
                    $lis += `</ul>`;
                }
                $lis += `<a href='tel:${appt.contact_mobile || appt.mobile}' data-bind='${UTIL_I18NS.PHONE_CALL}'>${voxelcloudI18n.getText(UTIL_I18NS.PHONE_CALL)}</a>`;
                $lis += `<span class='btn-resel-time' apptIndex='${defaultIndex + index}' data-bind='${UTIL_I18NS.RESEL_TIME}'>${voxelcloudI18n.getText(UTIL_I18NS.RESEL_TIME)}</span>`;
            }
            $lis += `</div>`;
            $lis += '</li>';
        });
        if (appendChild) {
            $ul.innerHTML += $lis;
            voxelcloudDataModel.setPropertyContext(bindingPath, voxelcloudDataModel.getPropertyContext(bindingPath).concat(bindingData));
        } else {
            $ul.innerHTML = $lis;
            voxelcloudDataModel.setPropertyContext(bindingPath, bindingData);
            $con.querySelector('div.list-main-con').scrollTo(0, 0);
        }
    }
    tpl_appt_list_action_bind($con, confirm_time, reseTime, bindingPath, confirmFn);
};

const scrollToLoadInit = ($container: HTMLElement, attachLoadFn?: Function) => {
    // $container
    const $ul = $container.querySelector('ul.list-ul') as HTMLElement;
    let swtichCompareBottom = true;
    $container.addEventListener('scroll', () => {
        let windowRelativeBottom = $ul.getBoundingClientRect().bottom;
        if (swtichCompareBottom && windowRelativeBottom < $container.getBoundingClientRect().bottom + 100) {
            if (attachLoadFn && typeof attachLoadFn === 'function') {
                swtichCompareBottom = false;
                attachLoadFn(() => swtichCompareBottom = true);
            }
        }
    });
};

const isIOS = () => {
    return navigator.userAgent.toLowerCase().indexOf('safari') >= 0 ? true : false;
}

const formatListSelectedState = (stateCode: number) => {
    const STATE: { [key: number]: string } = {
        1: 'state.new',
        2: 'state.confirmed',
        3: 'state.visited',
        4: 'state.expired'
    };
    return voxelcloudI18n.getText(UTIL_I18NS.SELECTED_STATE_TITLE, [voxelcloudI18n.getText(STATE[stateCode]) || 'N/A']);
}

const tpl_list_header_event = ($con: HTMLElement, selectorPath: string, reloadFn?: Function, stateVisible?: STATE_VISIBLE) => {
    const $header = $con.querySelector('.list-header') as HTMLElement;
    const $headerStateSelector = $header.querySelector('.sate-selector') as HTMLElement;
    const $headerStateSelectorTxt = $headerStateSelector.querySelector('span') as HTMLElement;
    const $dropdown = $headerStateSelector.querySelector('ul.filter-selector') as HTMLElement;
    const $refreshBtn = $header.querySelector('span.refresh-list-btn') as HTMLElement;
    // const $maskLayer = $con.querySelector('div.mask-layer') as HTMLElement;
    // if ($maskLayer) {
    //     $maskLayer.addEventListener('touchend', () => {
    //         clearScreenPopup($con);
    //         event.stopPropagation();
    //     });
    // }
    // $stateSelectorMask.addEventListener('touchend', ()=>{
    //     $stateSelectorMask.setAttribute('show', 'false');
    //     event.stopPropagation();
    // });
    $headerStateSelectorTxt.setAttribute('data-bind', `dataModel${selectorPath.replace(/\//g, '.')}`);
    $headerStateSelectorTxt.innerText = formatListSelectedState(voxelcloudDataModel.getPropertyContext(selectorPath));
    $headerStateSelector.addEventListener('touchend', (event) => {
        // clearScreenPopup($con);
        $headerStateSelector.setAttribute('show-dropdown', 'true');
        $con.setAttribute('popup', 'true');
        // $stateSelectorMask.setAttribute('show', 'true');
        event.stopPropagation();
    });
    $dropdown.addEventListener(isIOS() ? 'mouseout' : 'blur', (event) => {
        $headerStateSelector.setAttribute('show-dropdown', 'false');
        $con.setAttribute('popup', 'false');
        // $stateSelectorMask.setAttribute('show', 'false');
        event.stopPropagation();
    });
    const $items = $dropdown.querySelectorAll('li') as NodeListOf<HTMLElement>;
    $items.forEach(($item: HTMLElement) => {
        if (stateVisible && Object.keys(stateVisible).length > 0) {
            const _boolean = stateVisible[parseInt($item.getAttribute('stateKey'))];
            $item.setAttribute('disabled', _boolean ? 'true' : 'false');
        } else {
            $item.setAttribute('disabled', 'false');
        }
        $item.addEventListener('touchend', (event) => {
            // clearScreenPopup($con);
            $headerStateSelector.setAttribute('show-dropdown', 'false');
            $con.setAttribute('popup', 'false');
            if ($item.getAttribute('disabled') === 'false') {
                const stateKey = $item.getAttribute('statekey');
                if (reloadFn && typeof reloadFn === 'function') {
                    voxelcloudDataModel.setPropertyContext(selectorPath, stateKey, true, $headerStateSelector);
                    reloadFn();
                }
            }

            event.stopPropagation();
        });

    });
    $refreshBtn.addEventListener('touchend', (event) => {
        // clearScreenPopup($con);
        if (reloadFn && typeof reloadFn === 'function') {
            reloadFn();
        }
        event.stopPropagation();
    });
}

const clearScreenPopup = ($con: HTMLElement) => {
    const $calendarSel = $con.querySelector('ul.calendar-selector-ul');
    const $stateFilter = $con.querySelector('div.sate-selector');
    const $actions = $con.querySelectorAll('li>.actions>div.sel-date-btn') as NodeListOf<HTMLElement>;
    $con.setAttribute('popup', 'false');
    if ($stateFilter) {
        $stateFilter.setAttribute('show-dropdown', 'false');
    }
    if ($calendarSel) {
        $calendarSel.setAttribute('show', 'false');
    }
    $actions.forEach(($actionBtn: HTMLElement) => {
        $actionBtn.setAttribute('show-menu', 'false');
    });
}

const tpl_appt_list_action_bind = ($con: HTMLElement, chooseTimeFn?: Function, reseTimeFn?: Function, bindingPath?: string, confrimFn?: Function) => {
    const $menuBtns = $con.querySelectorAll('div.sel-date-btn') as NodeListOf<HTMLElement>;
    const $resetTimeBtns = $con.querySelectorAll('span.btn-resel-time') as NodeListOf<HTMLElement>;
    const $lis = $con.querySelectorAll('div.list-main-con>ul.list-ul>li') as NodeListOf<HTMLElement>;
    $lis.forEach(($li: HTMLElement, index: number) => {
        if ($li.getAttribute('class') !== 'no-data') {
            const originStart: { startX?: number, startY?: number } = { startX: 0, startY: 0 };
            $li.addEventListener('touchstart', (event) => {
                originStart.startX = parseInt(event.changedTouches[0].clientX.toString());
                originStart.startY = parseInt(event.changedTouches[0].clientY.toString());
            });
            $li.addEventListener('touchend', (event) => {
                const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
                const offsetSumY = moveEndY - originStart.startY;
                if (Math.abs(offsetSumY) < 1) {

                    openApptDetail(`${bindingPath}/${index}`, index, chooseTimeFn, reseTimeFn, confrimFn);
                }
            });
            $li.addEventListener('touchcancel', (event) => {
                const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
                const offsetSumY = moveEndY - originStart.startY;
                if (Math.abs(offsetSumY) < 1) {
                    openApptDetail(`${bindingPath}/${index}`, index, chooseTimeFn, reseTimeFn, confrimFn);
                }
            });
        }
    });


    $resetTimeBtns.forEach(($item: HTMLElement, index: number) => {
        const originStart: { startX?: number, startY?: number } = { startX: 0, startY: 0 };
        $item.addEventListener('touchstart', (event) => {
            originStart.startX = parseInt(event.changedTouches[0].clientX.toString());
            originStart.startY = parseInt(event.changedTouches[0].clientY.toString());
        });
        $item.addEventListener('touchend', (event) => {
            const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
            const offsetSumY = moveEndY - originStart.startY;
            if (Math.abs(offsetSumY) < 1) {
                $menuBtns[index].setAttribute('show-menu', 'false');
                $con.setAttribute('popup', 'false');
                if (reseTimeFn && typeof reseTimeFn === 'function') {
                    reseTimeFn($item.getAttribute('apptIndex'));
                }
            }
            event.stopPropagation();
        });
        $item.addEventListener('touchcancel', (event) => {
            const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
            const offsetSumY = moveEndY - originStart.startY;
            if (Math.abs(offsetSumY) < 1) {
                $menuBtns[index].setAttribute('show-menu', 'false');
                $con.setAttribute('popup', 'false');
                if (reseTimeFn && typeof reseTimeFn === 'function') {
                    reseTimeFn($item.getAttribute('apptIndex'));
                }
            }
            event.stopPropagation();
        });
    });

    $menuBtns.forEach(($item: HTMLElement) => {
        const $menuCon = $item.querySelector('.appt-edit-menu') as HTMLElement;
        const $lis = $menuCon.querySelectorAll('li.select-time-item') as NodeListOf<HTMLElement>;
        $lis.forEach(($li: HTMLElement) => {
            const originStart: { startX?: number, startY?: number } = { startX: 0, startY: 0 };
            $li.addEventListener('touchstart', (event) => {
                originStart.startX = parseInt(event.changedTouches[0].clientX.toString());
                originStart.startY = parseInt(event.changedTouches[0].clientY.toString());
            });
            $li.addEventListener('touchend', (event) => {
                const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
                const offsetSumY = moveEndY - originStart.startY;
                if (Math.abs(offsetSumY) < 1) {
                    if (chooseTimeFn && typeof chooseTimeFn === 'function' && !$li.getAttribute('class').includes('invalid')) {
                        chooseTimeFn($li.getAttribute('apptIndex'), $li.getAttribute('timeIndex'));
                    }
                }
                event.stopPropagation();
            });
            $li.addEventListener('touchcancel', (event) => {
                const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
                const offsetSumY = moveEndY - originStart.startY;
                if (Math.abs(offsetSumY) < 1) {
                    if (chooseTimeFn && typeof chooseTimeFn === 'function' && !$li.getAttribute('class').includes('invalid')) {
                        chooseTimeFn($li.getAttribute('apptIndex'), $li.getAttribute('timeIndex'));
                    }
                }
                event.stopPropagation();
            });
        });

        $item.addEventListener('touchend', (event) => {
            $item.setAttribute('show-menu', 'true');
            $con.setAttribute('popup', 'true');
            event.stopPropagation();
        });
    });
}

const format_pad = (str: number) => {
    return `${str}`.padStart(2, '0');
};

const formatAvailable = (code: string) => {
    const i18ns: { [key: string]: string } = {
        'morning': 'i18n.calendar.day.mroning',
        'afternoon': 'i18n.calendar.day.afternoon'
    };
    return code ? voxelcloudI18n.getText(i18ns[code]) : '';
};

const formatDupTimeTxt = (time: DAY_INFO) => {
    return Object.keys(time).length > 0 ? voxelcloudI18n.getText(UTIL_I18NS.DUP_TXT, [`${time.month}/${time.day} ${time.year}`]) : '';
}

const footerElementNav = (curURL?: string) => {
    const $mainFooter = document.getElementById('main-con-footer');
    const $navItems = $mainFooter.querySelectorAll('.nav-btn') as NodeListOf<HTMLElement>;
    const cur_router = voxelcloudRouter.getCurrentRouter();
    const def_router = curURL || (cur_router ? cur_router.URL.BASE_URL : '');
    $navItems.forEach(($navItem: HTMLElement) => {
        $navItem.addEventListener('touchend', (event) => {
            const cur_router = voxelcloudRouter.getCurrentRouter();
            if (cur_router && cur_router.URL && cur_router.URL.BASE_URL !== $navItem.getAttribute('nav-path')) {
                // voxelcloudRouter.load($navItem.getAttribute('nav-path'));
                if ($navItem.getAttribute('nav-path') === '/setting') {
                    window.location = voxelcloudDataModel.getPropertyContext('/dr_url');
                }
                $navItems.forEach($item => $item.setAttribute('class', UTIL_CLASSES.NAV_DEF));
                $navItem.setAttribute('class', UTIL_CLASSES.NAV_SELECETED);
            }
            event.stopPropagation();
        });
        if (def_router === $navItem.getAttribute('nav-path') && $navItem.getAttribute('class') !== UTIL_CLASSES.NAV_SELECETED) {
            $navItems.forEach($item => $item.setAttribute('class', UTIL_CLASSES.NAV_DEF));
            $navItem.setAttribute('class', UTIL_CLASSES.NAV_SELECETED);
        }
    });
};

const footerInit = () => {
    const $mainFooter = document.getElementById('main-con-footer');
    const $navItems = $mainFooter.querySelectorAll('.nav-btn') as NodeListOf<HTMLElement>;
    const cur_router = voxelcloudRouter.getCurrentRouter();
    const def_router = cur_router ? cur_router.URL.BASE_URL : '';
    if (def_router) {
        $navItems.forEach(($navItem: HTMLElement) => {
            if (def_router === $navItem.getAttribute('nav-path') && $navItem.getAttribute('class') !== UTIL_CLASSES.NAV_SELECETED) {
                $navItems.forEach($item => $item.setAttribute('class', UTIL_CLASSES.NAV_DEF));
                $navItem.setAttribute('class', UTIL_CLASSES.NAV_SELECETED);
            }
        });
    }
};


const customDispatch = (event: string, $con_id?: string) => {
    const self = this;
    var e = new CustomEvent(event, {
        detail: {
            id: $con_id || '',
            controller: self
        },
        bubbles: true,
        cancelable: true,
    });

    window.dispatchEvent(e);
};

let timer: NodeJS.Timeout;
const voxelcloudMsgToast = {
    getCurID: (): string => {
        const $msgToastCon = document.getElementById('msg-toast');
        if ($msgToastCon) {
            return $msgToastCon.getAttribute('voxelcoud-id');
        }
        return '';
    },
    show: (id: string, feedOutSecond?: number) => {
        const $msgToastCon = document.getElementById('msg-toast');
        const curRouterInfo = voxelcloudRouter.getCurrentRouter();
        if (curRouterInfo && curRouterInfo.PGE_ID === 'report') {
            const $btn = document.getElementsByClassName('rpt-del-dating-state-btn')[0];
            $btn.setAttribute('style', 'bottom: 3.5rem');
        }
        if ($msgToastCon && $msgToastCon.getAttribute('class') !== UTIL_CLASSES.MSG_TOAST_SHOW) {
            $msgToastCon.setAttribute('class', UTIL_CLASSES.MSG_TOAST_SHOW);
            $msgToastCon.setAttribute('voxelcoud-id', id);
        }
        timer = setTimeout(() => {
            customDispatch(UTIL_EVENT.MSG_TOAST_TIMEOUT);
            voxelcloudMsgToast.close();
        }, feedOutSecond || 400)
    },
    close: () => {
        const curRouterInfo = voxelcloudRouter.getCurrentRouter();
        if (curRouterInfo && curRouterInfo.PGE_ID === 'report') {
            const $btn = document.getElementsByClassName('rpt-del-dating-state-btn')[0];
            $btn.removeAttribute('style');
        }
        clearTimeout(timer);
        timer = null;
        const $msgToastCon = document.getElementById('msg-toast');
        if ($msgToastCon && $msgToastCon.getAttribute('class') !== UTIL_CLASSES.MSG_TOAST_DEF) {
            $msgToastCon.setAttribute('class', UTIL_CLASSES.MSG_TOAST_DEF);
        }
    },
    setIcon: (iconClass: string) => {
        const $msgToastCon = document.getElementById('msg-toast');
        const $icon = $msgToastCon.querySelector('i.iconfont') as HTMLElement;
        if (iconClass && $icon) {
            $icon.setAttribute('class', `iconfont icon-${iconClass}`);
        }
    },
    setDes: (str: string, isI18nKey: boolean = false) => {
        if (!str) {
            return console.error("Could not found the value  of text!");
        }
        const $msgToastCon = document.getElementById('msg-toast');
        const $txtCon = $msgToastCon.querySelector('div.msg-toast-txt') as HTMLElement;
        $txtCon.innerHTML = `<span data-bind='${isI18nKey ? str : ''}'>${isI18nKey ? voxelcloudI18n.getText(str) : str}</span>`;
    },
    setActionBar: (btns: Array<HTMLElement>) => {
        const $msgToastCon = document.getElementById('msg-toast');
        const $actionBarCon = $msgToastCon.querySelector('div.msg-toat-action-bar') as HTMLElement;
        $actionBarCon.innerHTML = '';
        btns.forEach((actBtn: HTMLElement) => {
            $actionBarCon.appendChild(actBtn);
        });
    }
};

// const syncStatus = (rptData: any, exam_id: string): any => {
//     const goRemoveData = voxelcloudRouter.getCacheData(`CDATING_${exam_id}`);
//     if (goRemoveData && typeof goRemoveData === 'string') {
//         rptData.reservation = {
//             confirm_time: {},
//             id: "",
//             select_time: [],
//             status: ""
//         };
//     }
//     return rptData;
// };

const closeApptDetail = () => {
    const $apptDeailCommponent = document.getElementById('appt-detail-con');
    if (!$apptDeailCommponent) {
        console.error('Could not found the main container DOM with id "appt-detail-con"!');
        return false;
    } else {
        $apptDeailCommponent.setAttribute('show', 'false');
        $apptDeailCommponent.setAttribute('reset-time', 'false');
    }
}

const APPT_DETAIL_CONF: {
    EVENTS?: {
        MASK: { REGISTER: boolean, fn: EventHandlerNonNull },
        VIEWRPT: { REGISTER: boolean, fn: EventHandlerNonNull },
        RESETTIME: { fn: EventHandlerNonNull },
        RENEW: { fn: EventHandlerNonNull },
        CHANGETIME: { fn: EventHandlerNonNull },
        CONFIRM: { fn: EventHandlerNonNull }
    }
} = { EVENTS: { MASK: { REGISTER: false, fn: null }, VIEWRPT: { REGISTER: false, fn: null }, RESETTIME: { fn: null }, RENEW: { fn: null }, CHANGETIME: { fn: null }, CONFIRM: { fn: null } } };

const ApptDetialResetTime = (apptBindPath: string, reNew?: boolean) => {
    const $apptDeailCommponent = document.getElementById('appt-detail-con');
    const exam_id = voxelcloudDataModel.getPropertyContext(`${apptBindPath}/exam_id`);
    const APPID = voxelcloudDataModel.getPropertyContext(`${apptBindPath}/id`);
    if (exam_id) {
        if (reNew) {
            mainVoxelcloudMobileDateSel.setTitleDesc(UTIL_I18NS.TITLE_RESET_TIME, UTIL_I18NS.DESC_BEFORE_CONFIRM);
        }
        loadScope(exam_id, (resData: any) => {
            voxelcloudDataModel.setPropertyContext(`/scope/${exam_id}`, resData.scope);
            mainVoxelcloudMobileDateSel.setBindingPath(`/scope/${exam_id}`, APPID);
            $apptDeailCommponent.setAttribute('reset-time', 'true');
        }, () => { });
    }
};

const openApptDetail = (bindPath: string, apptIndex: number, setTime?: Function, resetTime?: Function, confirmFn?: Function): boolean => {
    const $apptDeailCommponent = document.getElementById('appt-detail-con');
    const bindData = voxelcloudDataModel.getPropertyContext(bindPath);
    $apptDeailCommponent.setAttribute('reset-time', 'false');
    if (!$apptDeailCommponent) {
        console.error('Could not found the main container DOM with id "appt-detail-con"!');
        return false;
    }

    mainVoxelcloudMobileDateSel.attachEvent('confirm', confirmFn);

    if (!bindData || Object.keys(bindData).length <= 0) {
        console.error(`Could not found bind data in the voxecloud data model with path "${bindPath}"`);
        return false;
    }

    const $maskLayer = $apptDeailCommponent.querySelector('div.appt-detail-mask-layer') as HTMLElement;
    if ($maskLayer && !APPT_DETAIL_CONF.EVENTS.MASK.REGISTER) {
        APPT_DETAIL_CONF.EVENTS.MASK.REGISTER = true;
        APPT_DETAIL_CONF.EVENTS.MASK.fn = () => {
            $apptDeailCommponent.setAttribute('show', 'false');

        };
        $maskLayer.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.MASK.fn, true);
    }

    const $resetTimeBtn = $apptDeailCommponent.querySelector('div.change-time-button') as HTMLElement;
    if ($resetTimeBtn) {
        $resetTimeBtn.removeEventListener('touchend', APPT_DETAIL_CONF.EVENTS.RESETTIME.fn, true);
        APPT_DETAIL_CONF.EVENTS.RESETTIME.fn = () => {
            ApptDetialResetTime(bindPath);
            // if (resetTime && typeof resetTime === 'function') {
            //     resetTime(apptIndex);
            // }
        };
        $resetTimeBtn.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.RESETTIME.fn, true);
    }

    const $viewReport = $apptDeailCommponent.querySelector('li.account-info>.area>.action-bar>span') as HTMLElement;
    if ($viewReport) {
        $viewReport.setAttribute('disabled', apptIndex < 0 ? 'true' : 'false');
        $viewReport.setAttribute('exam_id', bindData.exam_id);
        if (!APPT_DETAIL_CONF.EVENTS.VIEWRPT.REGISTER) {
            APPT_DETAIL_CONF.EVENTS.VIEWRPT.REGISTER = true;
            APPT_DETAIL_CONF.EVENTS.VIEWRPT.fn = () => {
                if ($viewReport.getAttribute('disabled') === 'false') {
                    closeApptDetail();
                    voxelcloudRouter.load(`/report?id=${$viewReport.getAttribute('exam_id')}`);
                }
            };
            $viewReport.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.VIEWRPT.fn, true);
        }
    }

    const $call = $apptDeailCommponent.querySelector('li.contact-info>.area>.action-bar>a') as HTMLElement;
    if ($call) {
        $call.setAttribute('href', `tel:${bindData.mobile}`);
    }

    const $btnConfirmTime = $apptDeailCommponent.querySelector('div.btn-confirm-appt') as HTMLElement;
    const $btnRenew = $apptDeailCommponent.querySelector('div.btn-renew-appt') as HTMLElement;
    const $btnChangeTime = $apptDeailCommponent.querySelector('div.btn-change-appt') as HTMLElement;
    $btnConfirmTime.setAttribute('active', 'false');
    if (bindData.status > 2) {

        $btnRenew.removeEventListener('touchend', APPT_DETAIL_CONF.EVENTS.RENEW.fn, true);
        APPT_DETAIL_CONF.EVENTS.RENEW.fn = () => {
            ApptDetialResetTime(bindPath, true);
            // if (resetTime && typeof resetTime === 'function') {
            //     resetTime(apptIndex, true);
            // }
        };
        $btnRenew.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.RENEW.fn, true);

        // $btnRenew.addEventListener('touchend', () => {
        //     if (resetTime && typeof resetTime === 'function') {
        //         resetTime(apptIndex, true);
        //     }
        // });
    } else if (bindData.status === 2) {

        $btnChangeTime.removeEventListener('touchend', APPT_DETAIL_CONF.EVENTS.CHANGETIME.fn, true);
        APPT_DETAIL_CONF.EVENTS.CHANGETIME.fn = () => {
            ApptDetialResetTime(bindPath);
            // if (resetTime && typeof resetTime === 'function') {
            //     resetTime(apptIndex);
            // }
        };
        $btnChangeTime.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.CHANGETIME.fn, true);

        // $btnChangeTime.addEventListener('touchend', () => {
        //     if (resetTime && typeof resetTime === 'function') {
        //         resetTime(apptIndex);
        //     }
        // });
    } else {

        $btnConfirmTime.removeEventListener('touchend', APPT_DETAIL_CONF.EVENTS.CONFIRM.fn, true);
        APPT_DETAIL_CONF.EVENTS.CONFIRM.fn = () => {
            if (setTime && typeof setTime === 'function') {
                let selTimeIndex: number = -1;
                $lis.forEach(($li: HTMLElement, i: number) => {
                    if ($li.getAttribute('selected') === 'true') {
                        selTimeIndex = i;
                    }
                });
                if (selTimeIndex >= 0) {
                    setTime(apptIndex.toString(), selTimeIndex.toString());
                }
                closeApptDetail();
            }
        };
        $btnConfirmTime.addEventListener('touchend', APPT_DETAIL_CONF.EVENTS.CONFIRM.fn, true);

        // $btnConfirmTime.addEventListener('touchend', () => {
        //     if (setTime && typeof setTime === 'function') {
        //         let selTimeIndex: number = -1;
        //         $lis.forEach(($li: HTMLElement, i: number) => {
        //             if ($li.getAttribute('selected') === 'true') {
        //                 selTimeIndex = i;
        //             }
        //         });
        //         if (selTimeIndex >= 0) {
        //             setTime(apptIndex.toString(), selTimeIndex.toString());
        //         }
        //         closeApptDetail();
        //     }
        // });
    }

    let $selLis = '';
    if (bindData.status > 1 && bindData.status < 4) {
        $selLis += `<li class='only-one'>`;
        $selLis += `<span class='month' data-bind='dataModel${bindPath.replace(/\//g, '.')}.confirm_time.month' data-formatter='format_pad'>${format_pad(bindData.confirm_time.month)}</span>`;
        $selLis += `<span class='day' data-bind='dataModel${bindPath.replace(/\//g, '.')}.confirm_time.day' data-formatter='format_pad'>${format_pad(bindData.confirm_time.day)}</span>`;
        $selLis += `<span class='available' data-bind='dataModel${bindPath.replace(/\//g, '.')}.confirm_time.available' data-formatter='formatAvailable'>${formatAvailable(bindData.confirm_time.available)}</span>`;
        $selLis += `<span class='year' data-bind='dataModel${bindPath.replace(/\//g, '.')}.confirm_time.year'>${bindData.confirm_time.year}</span>`;
        $selLis += '</li>';
    } else {
        const curDate = new Date();
        bindData.select_time.forEach((selTime: APPT_TIME, index: number) => {
            const tgtDate = new Date(`${selTime.year}-${selTime.month}-${selTime.day}`);
            const isSameDay = tgtDate.getFullYear() === curDate.getFullYear() && tgtDate.getMonth() === curDate.getMonth() && tgtDate.getDate() === curDate.getDate();
            const curHour = curDate.getHours();
            const tgtHour = selTime.available === 'morning' ? 12 : 24;
            $selLis += `<li class='${((tgtDate < curDate) || (isSameDay && tgtHour < curHour)) && "invalid" || 'valid'}'>`;
            $selLis += `<span class='month' data-bind='dataModel${bindPath.replace(/\//g, '.')}.select_time.${index}.month' data-formatter='format_pad'>${format_pad(selTime.month)}</span>`;
            $selLis += `<span class='day' data-bind='dataModel${bindPath.replace(/\//g, '.')}.select_time.${index}.day' data-formatter='format_pad'>${format_pad(selTime.day)}</span>`;
            $selLis += `<span class='available' data-bind='dataModel${bindPath.replace(/\//g, '.')}.select_time.${index}.available' data-formatter='formatAvailable'>${formatAvailable(selTime.available)}</span>`;
            $selLis += '</li>';
        });
    }
    const $selUl = $apptDeailCommponent.querySelector('ul.time-sel-area') as HTMLElement;
    $selUl.innerHTML = $selLis;
    const $lis = $apptDeailCommponent.querySelectorAll('ul.time-sel-area>li') as NodeListOf<HTMLElement>;
    if ($lis.length > 1 && bindData.status < 4) {
        $lis.forEach(($li: HTMLElement) => {
            $li.addEventListener('touchend', () => {
                if (!$li.getAttribute('class').includes('invalid')) {
                    $lis.forEach(($item: HTMLElement) => $item.setAttribute('selected', 'false'));
                    $li.setAttribute('selected', 'true');
                    $btnConfirmTime.setAttribute('active', 'true');
                    $btnRenew.setAttribute('active', 'true');
                }
            });
        });
    }

    const $accountInfo = $apptDeailCommponent.querySelector('li.account-info') as HTMLElement;;
    const $accountName = $accountInfo.querySelector('span.title') as HTMLElement;
    const $accountID = $accountInfo.querySelector('span.val') as HTMLElement;
    $accountName.setAttribute('data-bind', `dataModel${bindPath.replace(/\//g, '.')}.name`);
    $accountName.innerText = bindData.name;
    $accountID.setAttribute('data-bind', `dataModel${bindPath.replace(/\//g, '.')}.mobile`);
    $accountID.innerText = bindData.mobile;

    const $contactInfo = $apptDeailCommponent.querySelector('li.contact-info') as HTMLElement;;
    const $contactNumber = $contactInfo.querySelector('span.val') as HTMLElement;
    $contactNumber.setAttribute('data-bind', bindData.contact_mobile ? `dataModel${bindPath.replace(/\//g, '.')}.contact_mobile` : `dataModel${bindPath.replace(/\//g, '.')}.mobile`);
    $contactNumber.innerText = bindData.contact_mobile || bindData.mobile;

    const $addressInfo = $apptDeailCommponent.querySelector('li.address-info') as HTMLElement;;
    const $address = $addressInfo.querySelector('span.val') as HTMLElement;
    $address.setAttribute('data-bind', `dataModel${bindPath.replace(/\//g, '.')}.org_address`);
    $address.innerText = bindData.org_address;

    const $mainCon = $apptDeailCommponent.querySelector('div.appt-detial-main-con') as HTMLElement;
    if ($mainCon) $mainCon.setAttribute('state', bindData.status);

    $apptDeailCommponent.setAttribute('show', 'true');
};

footerElementNav();