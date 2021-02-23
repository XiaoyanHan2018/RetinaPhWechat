interface SCOPE_DAY {
    day: number,
    weekday: string,
    available: string[]
}

interface SCOPE_MONTH {
    [key: number]: SCOPE_DAY[]
}

interface SCOPE {
    [key: number]: SCOPE_MONTH
}

interface DATESEL_CONF {
    scope?: SCOPE,
    titleI18nKey?: string,
    id: string,
    $con?: HTMLElement;
}

interface SELED_DATE {
    year?: number;
    month?: number;
    day?: number;
    weekday?: string;
    available?: string;
}

interface SELED_DATE_CACHE {
    [key: string]: any
    year?: number;
    month?: number;
    day?: number;
    weekday?: string;
    dayIndex?: number;
    available?: string;
}

const DATESEL_INDEXS: { [key: string]: number } = {
    year: 0,
    month: 1,
    day: 2,
    available: 3
}

enum DATESEL_I18NS {
    DAY = 'i18n.sel.date.day',
    YEAR_TXT = 'i18n.dating.dates.year.txt',
    BTN_CONFIRM = 'i18n.date.sel.btn.confirm',
    TITLE_SEL_ANOTHRE_TIEM = 'i18n.date.sel.title.sel.another.time',
    TITLE_RESET_TIME = 'i18n.date.sel.title.reset.time',
    DESC_BEFORE_CONFIRM = 'i18n.date.sel.desc.warn'
}

class voxelcloudMobileDateSel {
    id: string;
    $con: HTMLElement;
    config: DATESEL_CONF;
    cur_bind_path: string;
    APPID: number;
    seled: SELED_DATE_CACHE;
    attachEvents: {
        [key: string]: Function
    };
    constructor(conf: DATESEL_CONF) {
        // if(!conf.scope || Object.keys(conf.scope).length <= 0){
        //     return;
        // }
        this.attachEvents = {};
        this.seled = {};
        this.id = conf.id;
        this.config = conf;
        this.$con = conf.$con || null;
        this._render();
        this._bindEvents();
    }

    private _render() {
        const $con = document.createElement('div');
        try {
            $con.setAttribute('id', this.config.id);
            $con.setAttribute('class', 'dateSel-con');
            $con.setAttribute('show', 'false');
            const $det_dom = '<div class="dateSel-main-con">' +
                '<div class="dateSel-header">' +
                `<i class='close-btn iconfont icon-ic_arrow_back_px'></i>` +
                `<span class="dateSel-title" data-bind='${DATESEL_I18NS.TITLE_SEL_ANOTHRE_TIEM}'>${voxelcloudI18n.getText(DATESEL_I18NS.TITLE_SEL_ANOTHRE_TIEM)}</span>` +
                `<span class="dateSel-desc" data-bind='${DATESEL_I18NS.DESC_BEFORE_CONFIRM}'>${voxelcloudI18n.getText(DATESEL_I18NS.DESC_BEFORE_CONFIRM)}</span>` +
                '</div>' +
                '<div class="sel-content">' +
                '<div class="sel-options">' +
                `${this.config.scope && Object.keys(this.config.scope).length > 0 ? this._optionsRender() : ''}` +
                '</div>' +
                '</div>' +
                '<div class="dateSel-footer">' +
                `<div class="btn-confirm" data-bind="${DATESEL_I18NS.BTN_CONFIRM}">${voxelcloudI18n.getText(DATESEL_I18NS.BTN_CONFIRM)}</div>` +
                '</div>' +
                '</div>';
            if (this.$con) {
                this.$con.innerHTML = $det_dom;
            } else {
                $con.innerHTML = '<div class="dateSel-mask-layer"></div>' + $det_dom;
                document.getElementsByTagName('body')[0].appendChild($con);
                this.$con = $con;
            }
            this._bindTouchEvents();
        } catch (err) {
            // this.dispatch(DATING_EVENTS.DATING_REND_ERR, this.con_id);
        }
    }

    private _optionsRender(): string {
        let resStr = '';
        // Years
        resStr += `<div class="sel-options-con" style="width: calc(25% - 1px)">${this._renderYear()}</div>`;
        // Months
        resStr += `<div class="sel-options-con" style="width: calc(25% - 1px)">${this._renderMonth()}</div>`;
        // Days
        resStr += `<div class="sel-options-con" style="width: calc(25% - 1px)">${this._renderDay()}</div>`;
        // Day AM?PM?
        resStr += `<div class="sel-options-con" style="width: calc(25% - 1px)">${this._renderMA()}</div>`;
        return resStr;
    };

    /**
     * render the year list according to the year range.
     * @Sujun
     * **/
    private _renderYear(): string {
        let resStr = '';
        let $lis = '';
        const self = this;
        Object.keys(this.config.scope).forEach((year: string, index: number) => {
            if (index === 0) {
                self.seled.year = parseInt(year);
            }
            $lis += `<li key="${year}" selected='${index === 0 ? true : false}'>${year}${voxelcloudI18n.getText(DATESEL_I18NS.YEAR_TXT)}</li>`
        });
        resStr += `<ul class='sel-ul-year' style="transform: translate3d(0rem, 5rem, 0rem);">`;
        resStr += $lis;
        resStr += '</ul>'
        return resStr;
    }

    /**
     * render the month list according to the selected year (default select first item of the year range).
     * @Sujun
     * **/
    private _renderMonth(onlyUl?: boolean): string {
        let resStr = '';
        const self = this;
        const M_I18NS = [
            'calendar.date.month.jan',
            'calendar.date.month.feb',
            'calendar.date.month.mar',
            'calendar.date.month.apr',
            'calendar.date.month.may',
            'calendar.date.month.jun',
            'calendar.date.month.jly',
            'calendar.date.month.aug',
            'calendar.date.month.sep',
            'calendar.date.month.oct',
            'calendar.date.month.nov',
            'calendar.date.month.dec']
        resStr += `<ul class='sel-ul-year' style='transform: translate3d(0rem, 5rem, 0rem);'>`;
        if (!this.seled.year) {
            return resStr;
        }
        Object.keys(this.config.scope[this.seled.year]).forEach((month: string, index: number) => {
            if (index === 0) {
                self.seled.month = parseInt(month);
            }
            resStr += `<li key='${month}' selected='${index === 0 ? true : false}' data-bind='i18n.${M_I18NS[parseInt(month) - 1]}'>${voxelcloudI18n.getText(M_I18NS[parseInt(month) - 1])}</li>`;
        });
        resStr += '</ul>'
        return resStr;
    }
    /**
     * render the day list according to the selected month (default select first item of the month range).
     * @Sujun
     * **/
    private _renderDay(): string {
        let resStr = '';
        resStr += `<ul class='sel-ul-day' style='transform: translate3d(0rem, 5rem, 0rem);'>`;
        const self = this;
        if (!this.seled.year || !this.seled.month) {
            return resStr;
        }
        const DEF_WEEK_DAY_I18NS: { [key: string]: string } = {
            Monday: "i18n.dating.dates.weekday.mon",
            Tuesday: "i18n.dating.dates.weekday.tue",
            Wednesday: "i18n.dating.dates.weekday.wed",
            Thursday: "i18n.dating.dates.weekday.thu",
            Friday: "i18n.dating.dates.weekday.fri",
            Saturday: "i18n.dating.dates.weekday.sat",
            Sunday: "i18n.dating.dates.weekday.sun"
        }
        this.config.scope[this.seled.year][this.seled.month].forEach((dayInfo: SCOPE_DAY, index: number) => {
            if (index === 0) {
                self.seled.day = dayInfo.day;
                self.seled.weekday = dayInfo.weekday;
                self.seled.dayIndex = index;
            }
            resStr += `<li key='${dayInfo.day}' weekday='${dayInfo.weekday}' selected='${index === 0 ? true : false}'>` +
                '<div>' +
                `<span  data-bind='${DATESEL_I18NS.DAY}' i18n-op='${JSON.stringify([dayInfo.day])}'>${voxelcloudI18n.getText(DATESEL_I18NS.DAY, [dayInfo.day.toString()])}</span>` +
                '/' +
                `<span data-bind='${DEF_WEEK_DAY_I18NS[dayInfo.weekday]}'>${voxelcloudI18n.getText(DEF_WEEK_DAY_I18NS[dayInfo.weekday])}</span>` +
                '</div></li>';
        });
        resStr += '</ul>'
        return resStr;
    }
    /**
     * render the day area list according to the selected day (default select first item of the day range).
     * morning/afternoon
     * @Sujun
     * **/
    private _renderMA(): string {
        let resStr = '';
        const self = this;
        if (!this.seled.year || !this.seled.month || this.seled.dayIndex < 0) {
            return resStr;
        }
        const MA_I18NS: { [key: string]: string } = {
            morning: "i18n.dating.dates.day.am",
            afternoon: "i18n.dating.dates.day.pm"
        };
        resStr += `<ul class='sel-ul-mf' style='transform: translate3d(0rem, 5rem, 0rem);'>`;
        this.config.scope[this.seled.year][this.seled.month][this.seled.dayIndex].available.forEach((maKey: string, index: number) => {
            if (index === 0) {
                self.seled.available = maKey;
            }
            resStr += `<li key="${maKey}" data-bind="${MA_I18NS[maKey]}"  selected='${index === 0 ? true : false}' >${voxelcloudI18n.getText(MA_I18NS[maKey])}</li>`
        });
        resStr += '</ul>';
        return resStr;
    }

    private _bindEvents() {
        const $confirmBtn = this.$con.querySelector('div.btn-confirm') as HTMLElement;
        const $closeBtn = this.$con.querySelector('i.close-btn') as HTMLElement;
        const $mark = this.$con.querySelector('div.dateSel-mask-layer') as HTMLElement;
        const self = this;
        $confirmBtn.addEventListener('touchend', () => {
            self.close();
            self.attachEvents.confirm ? self.attachEvents.confirm(self.getSelectedDate(), self.APPID) : null;
        });
        $closeBtn.addEventListener('touchend', () => {
            self.close();
            const $apptDeailCommponent = document.getElementById('appt-detail-con');
            if(self.id === 'main_date_selector' && $apptDeailCommponent){
                $apptDeailCommponent.setAttribute('reset-time', 'false');
            }
        });
        if ($mark) {
            $mark.addEventListener('touchend', () => self.close());
        }
    }

    private _bindTouchEvents() {
        const $options = this.$con.querySelectorAll('div.sel-options-con') as NodeListOf<HTMLElement>;
        const self = this;
        $options.forEach(($option: HTMLElement, index: number) => {
            let optionConfig = null;
            let optionName = '';
            switch (index) {
                case 0:
                    optionName = 'year';
                    optionConfig = Object.keys(self.config.scope);
                    break;
                case 1:
                    optionName = 'month';
                    // optionConfig = self.config.options.month;
                    break;
                case 2:
                    optionName = 'day';
                    // optionConfig = self.config.options.day;
                    break;
                case 3:
                    optionName = 'available';
                // optionConfig = self.config.options.ma;
            }
            // if (optionName) {
            self._addListenerForOption($option, optionName);
            // }
        });
    }

    /** 
    * add drag hanlder for the colunms.
    * @Sujun
    * **/
    private _addListenerForOption($option: HTMLElement, opt_name: string) {
        let startY: number, oldMoveY: number, offset: number;
        const LI_HEIGHT = 2.5;
        const self = this;
        // Cache the origin state of postioin when touch start;
        $option.addEventListener('touchstart', function (event) {
            event.preventDefault();
            startY = event.touches[0].clientY;
            oldMoveY = parseInt(startY.toString());
        }, false);
        // calcluate the final moving range, and correct the coordinate value according to the min/max range, then udpate the final value of position;
        $option.addEventListener('touchend', function (event) {
            event.preventDefault();
            const $optionUL = $option.querySelector('ul');
            const moveEndY = parseInt(event.changedTouches[0].clientY.toString());
            const offsetSum = moveEndY - startY;

            if (offsetSum == 0) {
                const cur_posn = parseFloat($optionUL.getAttribute('style').replace('transform: translate3d(0rem, ', '').replace('rem, 0rem);', ''));
                const e_posn = cur_posn + offset / 16;
                const max_top = LI_HEIGHT;
                const _index = Math.round((max_top - e_posn) / LI_HEIGHT);
                if ((max_top - e_posn) % LI_HEIGHT) {
                    self.setSeledState($optionUL, - ((_index - 2) * LI_HEIGHT), opt_name);
                    setTimeout(() => {
                        $optionUL.setAttribute('style', `transform: translate3d(0rem, ${- ((_index - 2) * LI_HEIGHT)}rem, 0rem);`)
                        self._updateMiddleSelColor($optionUL, - ((_index - 2) * LI_HEIGHT), opt_name);
                    }, 100)
                }
            } else {
                const cur_posn = parseFloat($optionUL.getAttribute('style').replace('transform: translate3d(0rem, ', '').replace('rem, 0rem);', ''));
                const e_posn = cur_posn + offset / 16;
                const max_top = LI_HEIGHT * 2;
                const min_top: number = -(LI_HEIGHT * ($option.querySelectorAll('li').length - 3));
                if (e_posn > max_top) {
                    self.setSeledState($optionUL, max_top, opt_name);
                    setTimeout(() => {
                        $optionUL.setAttribute('style', `transform: translate3d(0rem, ${max_top}rem, 0rem);`);
                        self._updateMiddleSelColor($optionUL, max_top, opt_name);
                    }, 100);
                } else if (e_posn < min_top) {
                    self.setSeledState($optionUL, min_top, opt_name);
                    setTimeout(() => {
                        $optionUL.setAttribute('style', `transform: translate3d(0rem, ${min_top}rem, 0rem);`);
                        self._updateMiddleSelColor($optionUL, min_top, opt_name);
                    }, 100);
                } else {
                    let _index = Math.round((max_top - e_posn) / LI_HEIGHT);
                    if ((max_top - e_posn) % LI_HEIGHT) {
                        self.setSeledState($optionUL, - ((_index - 2) * LI_HEIGHT), opt_name);
                        setTimeout(() => {
                            $optionUL.setAttribute('style', `transform: translate3d(0rem, ${- ((_index - 2) * LI_HEIGHT)}rem, 0rem);`)
                            self._updateMiddleSelColor($optionUL, - ((_index - 2) * LI_HEIGHT), opt_name);
                        }, 100)
                    }
                }
            }
            self._dealOptionsData(opt_name);
        }, false);
        // update the position according to the value change of the 'clientY'. calculate the moving range and update the value of position;
        $option.addEventListener('touchmove', function (event) {
            event.preventDefault();
            offset = event.touches[0].clientY - oldMoveY;
            const $optionUL = $option.querySelector('ul');
            let cur_posn = parseFloat($optionUL.getAttribute('style').replace('transform: translate3d(0rem, ', '').replace('rem, 0rem);', ''));
            let tgt_posn = cur_posn + offset / 16;
            self._updateMiddleSelColor($optionUL, tgt_posn, opt_name);
            $optionUL.setAttribute('style', `transform: translate3d(0rem, ${tgt_posn}rem, 0rem);`);
            oldMoveY = event.touches[0].clientY;
        }, false);
    }

    private setSeledState($ul: Element, tgt_posn: number, opt_name: string) {
        let index = 2 - Math.round(tgt_posn / 2.5);
        const self = this;
        const $lis = $ul.querySelectorAll('li') as NodeListOf<HTMLElement>;
        if (index < $lis.length && index >= 0) {
            $lis.forEach(($li: HTMLElement, liIndex: number) => {
                if (liIndex === index) {
                    self.seled[opt_name] = opt_name !== 'available' ? parseInt($li.getAttribute('key')) : $li.getAttribute('key');
                    if (opt_name === 'day') {
                        self.seled.dayIndex = liIndex;
                        self.seled.weekday = $li.getAttribute('weekday');
                    }
                }
            });
        }
    }

    private _dealOptionsData(opt_name: string) {
        const $options = this.$con.querySelectorAll('div.sel-options-con') as NodeListOf<HTMLElement>;
        const self = this;
        const optionNames: { [key: number]: string } = {
            0: 'year',
            1: 'month',
            2: 'day',
            3: 'available',
        };
        $options.forEach(($option: HTMLElement, index: number) => {
            if (index > DATESEL_INDEXS[opt_name]) {
                if (optionNames[index] === 'month') {
                    $option.innerHTML = self._renderMonth();
                }
                if (optionNames[index] === 'day') {
                    $option.innerHTML = self._renderDay();
                }
                if (optionNames[index] === 'available') {
                    $option.innerHTML = self._renderMA();
                }
            }
        });
    }

    /** 
     * update the color of the cells in middle row.
     * @Sujun
     * **/
    private _updateMiddleSelColor($ul: HTMLElement, tgt_posn: number, opt_name: string) {
        let index = 2 - Math.round(tgt_posn / 2.5);
        const self = this;
        const $lis = $ul.querySelectorAll('li') as NodeListOf<HTMLElement>;
        if (index < $lis.length && index >= 0) {
            $lis.forEach(($li: HTMLElement, liIndex: number) => {
                $li.setAttribute('selected', liIndex === index ? 'true' : 'false');
            });
        }
    }


    public setBindingPath(path: string, appID: number): boolean {
        if (!this.$con || !path) {
            console.warn('Could not found the DOM element of the select date component or the input path is invalid!');
            return false;
        }
        const $dateOptionsCon = this.$con.querySelector('div.sel-options') as HTMLElement;
        if (path !== this.cur_bind_path) {
            this.APPID = appID;
            const newScopeData = voxelcloudDataModel.getPropertyContext(path);
            if (newScopeData && Object.keys(newScopeData).length > 0) {
                this.config.scope = newScopeData;
                $dateOptionsCon.innerHTML = this._optionsRender();
                this._bindTouchEvents();
                this.cur_bind_path = path;
            }
        }
    }

    public setTitleDesc(titleI18nkey: string, descI18nKey: string): boolean {
        if (!this.$con) {
            return false;
        }
        if (titleI18nkey) {
            const $titleCon = this.$con.querySelector('span.dateSel-title') as HTMLElement;
            if ($titleCon) {
                $titleCon.setAttribute('data-bind', titleI18nkey);
                $titleCon.innerText = voxelcloudI18n.getText(titleI18nkey);
            }
        }
        if (descI18nKey) {
            const $descCon = this.$con.querySelector('span.dateSel-desc') as HTMLElement;
            if ($descCon) {
                $descCon.setAttribute('data-bind', descI18nKey);
                $descCon.innerText = voxelcloudI18n.getText(descI18nKey);
            }
        }
    }

    public close() {
        this.$con.setAttribute('show', 'false');
    }

    public open(bindPath?: string, APPID?: number) {
        if (bindPath && this.cur_bind_path !== bindPath) {
            this.setBindingPath(bindPath, APPID);
        }
        this.$con.setAttribute('show', 'true');
    }

    public attachEvent(eventName: string, callback: Function) {
        this.attachEvents[eventName] = callback;
    }

    public getSelectedDate(): SELED_DATE {
        let res: SELED_DATE_CACHE = Object.assign({}, this.seled);
        delete res.dayIndex;
        return res;
    }
}

const mainVoxelcloudMobileDateSel = new voxelcloudMobileDateSel({ id: 'main_date_selector', $con: document.querySelector('#appt-detail-con>.appt-detial-main-con>.change-time-con') });