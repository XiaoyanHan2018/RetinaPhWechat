interface CANLENDER_CONF {
    $mainCon: HTMLElement;
    id: string;
    $con: HTMLElement;
    selectDay?: Function;
};
interface CALENDAR_DAY {
    year: number,
    month: number,
    day: number,
    weekday: string,
    morning: number,
    afternoon: number,
    sum: number,
}

enum CALENDAR_I18N {
    FOLD = 'i18n.calendar.btn.fold',
    MORN = 'i18n.calendar.day.mroning',
    AFTERNOON = 'i18n.calendar.day.afternoon',
    UNIT = 'i18n.calendar.unit',
    UNFOLD = 'i18n.calendar.btn.unfold',
    YEAR = "i18n.calendar.dates.year",
    STATE_CONFIRMED = "i18n.calendar.state.confirmed",
    MONTH_1 = "i18n.calendar.date.month.jan",
    MONTH_2 = "i18n.calendar.date.month.feb",
    MONTH_3 = "i18n.calendar.date.month.mar",
    MONTH_4 = "i18n.calendar.date.month.apr",
    MONTH_5 = "i18n.calendar.date.month.may",
    MONTH_6 = "i18n.calendar.date.month.jun",
    MONTH_7 = "i18n.calendar.date.month.jly",
    MONTH_8 = "i18n.calendar.date.month.aug",
    MONTH_9 = "i18n.calendar.date.month.sep",
    MONTH_10 = "i18n.calendar.date.month.oct",
    MONTH_11 = "i18n.calendar.date.month.nov",
    MONTH_12 = "i18n.calendar.date.month.dec"
}

class voxelcloudMobileCalendar {
    id: string;
    _bindingPath: string;
    $con: HTMLElement;
    $pageCon: HTMLElement;
    selectDay: Function;
    constructor(conf: CANLENDER_CONF) {
        this.id = conf.id;
        this._render(conf.$mainCon, conf.id);
        this.selectDay = conf.selectDay;
        this.$con = conf.$mainCon;
        this.$pageCon = conf.$con;
        this._eventBinding();
    }

    private _render($mainCon: HTMLElement, _id: string) {
        if ($mainCon) {
            $mainCon.innerHTML = `<div class='mask-layer'></div><div id='${_id}' class="calendar-header">` +
                `${this._renderSelector()}` +
                // `<div class='calendar-switch-btn' data-bind='${CALENDAR_I18N.FOLD}'>${voxelcloudI18n.getText(CALENDAR_I18N.FOLD)}</div>` +
                '</div>' +
                '<div class="calendar-card" showDayInfo="false">' +
                `${this._renderWeekDOM()}` +
                `${this._renderDayInfoDOM()}`
            '</div>';
        }
    }

    private _renderSelector(): string {
        let res = '';
        res += '<div class="calendar-selector-con">';
        res += '<span class="calendar-selector-selected-val-year" data-bind="dataModel.calendar.selector.selected.val.year" data-formatter="formatYear"></span>';
        res += '<span class="calendar-selector-selected-val-month" data-bind="dataModel.calendar.selector.selected.val.month" data-formatter="formatMonth"></span>';
        res += '<i class="iconfont icon-ic_arrow_drop_down_"></i>';
        // res += `<div class='calendar-selector-mask-layer'></div>`;
        res += '<ul class="calendar-selector-ul"></ul>';
        res += '</div>';
        return res;
    }

    private _renderWeekDOM(): string {
        let res = '<div class="calendar-week">';
        res += '<ul class="calendar-days" style="transform: translate3d(0rem, 0rem, 0rem);">';
        res += '</ul>';
        res += '</div>'
        return res;
    }

    private _renderDayInfoDOM(): string {
        let res = '<div class="calendar-dayInfo">';
        res += '<div class="calendar-dayInfo-morn">';
        res += `<span class='label' data-bind='${CALENDAR_I18N.MORN}'>${voxelcloudI18n.getText(CALENDAR_I18N.MORN)}</span>`
        res += `<span class='val' data-bind=''></span>`;
        res += `<span class='unit' data-bind='${CALENDAR_I18N.UNIT}'>${voxelcloudI18n.getText(CALENDAR_I18N.UNIT)}</span>`;
        res += `<span class="state" data-bind='${CALENDAR_I18N.STATE_CONFIRMED}'>${voxelcloudI18n.getText(CALENDAR_I18N.STATE_CONFIRMED)}</span>`;
        res += '</div>';
        res += `<div class='calendar-dayInfo-afternoon'>`;
        res += `<span class='label' data-bind='${CALENDAR_I18N.AFTERNOON}'>${voxelcloudI18n.getText(CALENDAR_I18N.AFTERNOON)}</span>`;
        res += `<span class='val' data-bind=''></span>`;
        res += `<span class='unit' data-bind='${CALENDAR_I18N.UNIT}'>${voxelcloudI18n.getText(CALENDAR_I18N.UNIT)}</span>`;
        res += `<span class="state" data-bind='${CALENDAR_I18N.STATE_CONFIRMED}'>${voxelcloudI18n.getText(CALENDAR_I18N.STATE_CONFIRMED)}</span>`;
        res += `</div>`;
        res += '</div>';
        return res;
    }

    private _eventBinding() {
        const $selector = this.$con.querySelector('div.calendar-selector-con') as HTMLElement;
        const $ul = this.$con.querySelector('ul.calendar-selector-ul') as HTMLElement;
        const $maskLayer = this.$con.querySelector('div.mask-layer');
        $maskLayer.addEventListener('touchend', ()=>{
            clearScreenPopup(self.$pageCon);
            this.$pageCon.setAttribute('popup', 'false');
            event.stopPropagation();
        });
        const self = this;
        // const $switchBtn = this.$con.querySelector('div.calendar-switch-btn') as HTMLElement;
        // const $calendarCard = this.$con.querySelector('div.calendar-card')  as HTMLElement;

        $selector.addEventListener('touchend', (event) => {
            $ul.setAttribute('show', 'true');
            this.$pageCon.setAttribute('popup', 'true');
            event.stopPropagation();
        });

        $ul.addEventListener(this.isIOS() ? 'mouseout' : 'blur', (event) => {
            $ul.setAttribute('show', 'false');
            this.$pageCon.setAttribute('popup', 'false');
            event.stopPropagation();
        });

        this.calendarMovingListener();

        // $switchBtn.addEventListener('touchend', ()=>{
        //     $calendarCard.setAttribute('showDayInfo', $switchBtn.getAttribute('data-bind') === CALENDAR_I18N.FOLD ? 'false' : 'true');
        //     $switchBtn.innerText = $switchBtn.getAttribute('data-bind') === CALENDAR_I18N.FOLD ? voxelcloudI18n.getText(CALENDAR_I18N.UNFOLD) :  voxelcloudI18n.getText(CALENDAR_I18N.FOLD); 
        //     $switchBtn.setAttribute('data-bind', $switchBtn.getAttribute('data-bind') === CALENDAR_I18N.FOLD ? CALENDAR_I18N.UNFOLD : CALENDAR_I18N.FOLD );
        // });
    }

    private calendarMovingListener() {
        const $selUl = this.$con.querySelector('ul.calendar-days') as HTMLElement;
        // const $li = this.$con.querySelector('.cur') as HTMLElement;
        //2.58;
        let startX: number, oldMoveX: number, offset: number;
        const self = this;
        $selUl.addEventListener('touchstart', function (event) {
            event.preventDefault();
            startX = event.touches[0].clientX;
            oldMoveX = parseInt(startX.toString());
        }, false);
        // calcluate the final moving range, and correct the coordinate value according to the min/max range, then udpate the final value of position;
        $selUl.addEventListener('touchend', function (event) {
            event.preventDefault();
            const moveEndX = parseInt(event.changedTouches[0].clientX.toString());
            const offsetSum = moveEndX - startX;
            const lis: number = voxelcloudDataModel.getPropertyContext(self._bindingPath).length;
            const LI_WIDTH_P = 0.14285714285;
            //  $selUl.querySelector('li').clientWidth / 16 + 0.04;
            if (offsetSum !== 0) {
                const cur_posn = parseFloat($selUl.getAttribute('style').replace('transform: translate3d(', '').replace(', 0rem, 0rem);', ''));
                const e_posn = cur_posn + offset / 16;
                const max_left = 0;
                const min_left: number = -((LI_WIDTH_P * (lis - 7) * $selUl.clientWidth) / 16 - (0.04 * lis));
                if (e_posn > max_left) {
                    setTimeout(() => {
                        $selUl.setAttribute('style', `transform: translate3d(${max_left}rem, 0rem, 0rem);`);
                    }, 100);
                } else if (e_posn < min_left) {
                    setTimeout(() => {
                        $selUl.setAttribute('style', `transform: translate3d(${min_left}rem, 0rem, 0rem);`);
                    }, 100);
                } else {
                    const LI_WIDTH = LI_WIDTH_P * $selUl.clientWidth / 16 - 0.04;
                    if (Math.abs(cur_posn) % LI_WIDTH !== 0) {
                        const fixLeft: number = Math.ceil(Math.abs(cur_posn) / LI_WIDTH) * LI_WIDTH;
                        setTimeout(() => {
                            $selUl.setAttribute('style', `transform: translate3d(-${fixLeft}rem, 0rem, 0rem);`);
                        }, 100);
                    }
                }
            }
            event.stopPropagation();
        }, false);
        // update the position according to the value change of the 'clientY'. calculate the moving range and update the value of position;
        $selUl.addEventListener('touchmove', function (event) {
            event.preventDefault();
            offset = event.touches[0].clientX - oldMoveX;
            let cur_posn = parseFloat($selUl.getAttribute('style').replace('transform: translate3d(', '').replace(', 0rem, 0rem);', ''));
            let tgt_posn = cur_posn + offset / 16;
            $selUl.setAttribute('style', `transform: translate3d(${tgt_posn}rem, 0rem, 0rem);`);
            oldMoveX = event.touches[0].clientX;
        }, false);
    }

    private isIOS() {
        return navigator.userAgent.toLowerCase().indexOf('safari') >= 0 ? true : false;
    }

    /**
     * Binding the data of the calendar;
     * @Sujun
     * **/
    public bindDayList(path: string) {
        if (!path) {
            console.error('Could not found the binding context in the data mdoel!');
            return false;
        }
        const days: Array<CALENDAR_DAY> = voxelcloudDataModel.getPropertyContext(path);
        const $ul = this.$con.querySelector('ul.calendar-days') as HTMLElement;
        const $selUl = this.$con.querySelector('ul.calendar-selector-ul') as HTMLElement;
        const $selector = this.$con.querySelector('div.calendar-selector-con') as HTMLElement;
        const self = this;
        this._bindingPath = path;
        let $lis = '';
        let $sellis = '';
        const groupsObj: { [key: string]: any } = {};
        const groups: Array<{ year: number, month: number, key: string, val: string }> = [];
        let markDay: CALENDAR_DAY | {} = {};
        days.forEach((dayInfo: CALENDAR_DAY, index: number) => {
            const groupKey = `${dayInfo.year}-${dayInfo.month}`;
            if (!groupsObj[groupKey]) {
                groupsObj[groupKey] = { year: dayInfo.year, month: dayInfo.month, key: groupKey, dayIndex: index };
                groups.push(groupsObj[groupKey]);
                $sellis += `<li key='${groupKey}' index=${index}>` +
                    `<span data-bind='dataModel.calendar.selector.list.${groups.length - 1}.year' data-formatter='formatYear'>${formatYear(dayInfo.year)}</span>` +
                    `<span>, </span>` +
                    `<span data-bind='dataModel.calendar.selector.list.${groups.length - 1}.month' data-formatter='formatMonth'>${formatMonth(dayInfo.month)}</span>` +
                    `</li>`;
            }
            if (index === 0) {
                const $markDayMronVal = this.$con.querySelector('.calendar-dayInfo-morn>span.val') as HTMLElement;
                const $markDayAfternoonVal = this.$con.querySelector('.calendar-dayInfo-afternoon>span.val') as HTMLElement;
                $markDayMronVal.innerText = dayInfo.morning.toString();
                $markDayMronVal.setAttribute('data-bind', `dataModel${path.replace(/\//g, '.') + '.' + index + '.morning'}`);
                $markDayAfternoonVal.innerText = dayInfo.afternoon.toString();
                $markDayAfternoonVal.setAttribute('data-bind', `dataModel${path.replace(/\//g, '.') + '.' + index + '.afternoon'}`);
            }
            $lis += `<li class='${index === 0 ? 'cur' : ''}' index='${index}'>` +
                `<span class='day' data-bind='dataModel${path.replace(/\//g, '.') + '.' + index + '.day'}'>${dayInfo.day}</span>` +
                `<span class="week-day" data-bind='dataModel${path.replace(/\//g, '.') + '.' + index + '.weekday'}' data-formatter='formatWeekDay'>${formatWeekDay(dayInfo.weekday)}</span>` +
                `<span class='sum ${dayInfo.sum === 0 ? 'null' : ''}' data-bind='dataModel${path.replace(/\//g, '.') + '.' + index + '.sum'}' data-formatter='formatSum'>${formatSum(dayInfo.sum)}</span></li>`;
        });
        // voxelcloudDataModel.setPropertyContext('/calendar/mark_day', markDay);
        voxelcloudDataModel.setPropertyContext('/calendar/selector/list', groups);
        voxelcloudDataModel.setPropertyContext('/calendar/selector/selected', { key: groups[0].key, val: { year: groups[0].year, month: groups[0].month } }, true, $selector);
        $selUl.innerHTML = $sellis;
        $ul.innerHTML = $lis;

        const $days = $ul.querySelectorAll('li') as NodeListOf<HTMLElement>;
        $days.forEach(($day: HTMLElement) => {
            const dayMove: {startX?:number} ={startX:0};
            $day.addEventListener('touchstart', (event)=>{
                dayMove.startX = parseInt(event.changedTouches[0].clientX.toString());
            });
            $day.addEventListener('touchend', (event) => {
                // clearScreenPopup(self.$pageCon);
                const _index = $day.getAttribute('index');
                const days: Array<CALENDAR_DAY> = voxelcloudDataModel.getPropertyContext(path);
                const moveEndX = parseInt(event.changedTouches[0].clientX.toString());
                const offsetSum = moveEndX - dayMove.startX;
                if (self.selectDay && typeof self.selectDay === 'function' && Math.abs(offsetSum) < 1) {
                    self.selectDay(days[parseInt(_index)]);
                }
            });
        });

        // bind the date selector the chagne event;
        const $liArr = $selUl.querySelectorAll('li') as NodeListOf<HTMLElement>;
        $liArr.forEach(($li: HTMLElement) => {
            $li.addEventListener('touchend', (event) => {
                const days: Array<CALENDAR_DAY> = voxelcloudDataModel.getPropertyContext(path);
                let index = parseInt($li.getAttribute('index'));
                voxelcloudDataModel.setPropertyContext('/calendar/selector/selected', { key: $li.getAttribute('key'), val: { year: days[index].year, month: days[index].month } }, true, $selector);
                clearScreenPopup(self.$pageCon);
                const lis: number = voxelcloudDataModel.getPropertyContext(self._bindingPath).length;
                const LI_WIDTH_P = 0.14285714285;
                const LI_WIDTH = LI_WIDTH_P * $ul.clientWidth / 16 - 0.04;
                if (index < 0) { index = 0 }
                if (index > lis - 7) {
                    index = lis - 7;
                }

                $ul.setAttribute('style', `transform: translate3d(${-(index * LI_WIDTH)}rem, 0rem, 0rem);`);
                event.stopPropagation();
            });
        });
    }
}