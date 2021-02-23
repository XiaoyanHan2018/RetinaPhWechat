enum SW_CLASSES {
    SHOW_SW_CON = 'sw-con show',
    DEF_SW_CON = 'sw-con',
    CUR_PIC = 'sw-pic sw-cur-pic',
    DEF_IMG_CLASS = 'photo-img',
    OPE_IMG_CLASS = 'photo-img outspread'
};

enum SW_STYLES {
    SHOW_DEL = 'top:50%; transform: translateY(-50%); left:0; width:100%; height:auto;',
    NEXT_DEL = 'top:50%; transform: translateY(-50%); left:100%; width:100%; height:auto;',
    PRE_DEL = 'top:50%; transform: translateY(-50%); left:-100%; width:100%; height:auto;',
    SHOW_CON = 'background-color:rgba(0,0,0,1);',
    VISIBLE = 'visibility: visible;',
    HIDE = 'visibility: hidden;'
}

enum SW_I18NS {
    CLOSE_BTN = 'i18n.report.btn.close'
}

interface SW_CONFIG {
    // ID: string
    MAIN_CON?: HTMLElement
    MAIN_CON_ID?: string
};
interface SW_P_CONFIG {
    MAX_PERCENT: number;
    MIN_PERCENT: number;
    PGE: {
        total: number;
        cur: number;
    }
};
interface SW_CACHE {
    [key: string]: any;
}
interface SW_SWITCH {
    ZOOM: boolean;
    PIC: boolean;
    OUT: boolean;
    ZOOMIN: boolean;
    goSwith: boolean;
}
interface POINT {
    clientX: number;
    clientY: number;
}

class sandwichPIC {
    id: string;
    config: SW_P_CONFIG;
    org_style: string;
    switch: SW_SWITCH;
    cache: SW_CACHE;
    $mainCon: HTMLElement;
    $images: Array<HTMLElement>;
    $curPic: HTMLElement;
    $sw: HTMLElement;
    $swHeader: HTMLElement;
    $swFooter: HTMLElement;
    $swMainCon: HTMLElement;
    $testTXT: HTMLElement;
    constructor(config?: SW_CONFIG) {
        this.$mainCon = document.getElementsByTagName('body')[0];
        this.switch = {
            ZOOM: false,
            OUT: false,
            PIC: false,
            ZOOMIN: false,
            goSwith: false
        };
        this.config = {
            MAX_PERCENT: 2,
            MIN_PERCENT: 1,
            PGE: {
                total: 0,
                cur: 0
            }
        };
        this.cache = {};
        if (config && Object.keys(config).length > 0) {
            if (config.MAIN_CON) {
                this.$mainCon = config.MAIN_CON;
            } else if (config.MAIN_CON_ID) {
                this.$mainCon = document.getElementById(config.MAIN_CON_ID);
            }
        }
        const _$imgs = this.$mainCon.querySelectorAll('img.photo-img') as NodeListOf<HTMLElement>;
        this.$images = [];
        _$imgs.forEach(($IMG: HTMLElement) => this.$images.push($IMG));
        this.config.PGE.total = this.$images.length;
        this.config.PGE.cur = 0;
        this._init();
    }

    /**
     * reset the switch of the controller into default state
     * @Sujun
     * **/
    private _initSwitch() {
        this.switch.ZOOM = false;
        this.switch.PIC = false;
        this.switch.OUT = false;
        this.switch.ZOOMIN = false;
    }

    /***
     * Intial the component append the DOM
     * **/
    private _init() {
        const $body = document.getElementsByTagName('body')[0];
        this.$sw = document.createElement('div');
        this.$sw.setAttribute('class', 'sw-con');
        this.$sw.setAttribute('id', 'sw-con');
        const self = this;
        const $sw_dels =
            '<div class="sw-header"><span class="sw-title">' + '左眼' + '</span></div>' +
            '<div class="sw-main-con">' +
            '<img class="sw-pic sw-cur-pic"></img>' +
            '</div>' +
            '<div class="sw-footer">' +
            '<span class="sw-btn-close" data-bind="' + SW_I18NS.CLOSE_BTN + '"></span>' +
            '<div class="sw-paging">' +
            '<div id="sw-paging-txt" class="sw-paging-txt">' +
            '<span></span>' +
            '<span></span>' +
            '</div>' +
            '</div>' +
            '<span id="testTXT"></span>'
        '</div>';
        this.$sw.innerHTML = $sw_dels;
        $body.appendChild(this.$sw);
        this.$curPic = this.$sw.querySelector('.sw-cur-pic') as HTMLElement;
        this.$swHeader = this.$sw.querySelector('.sw-header') as HTMLElement;
        this.$swFooter = this.$sw.querySelector('.sw-footer') as HTMLElement;
        this.$testTXT = this.$sw.querySelector('#testTXT') as HTMLElement;
        this.$swMainCon = this.$sw.querySelector('.sw-main-con') as HTMLElement;
        const $btnClose = this.$sw.querySelector('.sw-btn-close') as HTMLElement;
        $btnClose.addEventListener('touchend', () => {
            self.$swHeader.removeAttribute('style');
            self.$swFooter.removeAttribute('style');
            self.$sw.removeAttribute('style');
            const [tgtIMG] = self.$images.filter($img => $img.getAttribute('del-src') === self.$curPic.getAttribute('src'));
            const offset = tgtIMG.getBoundingClientRect();
            self.$curPic.setAttribute('style', `top:${offset.top}px;left:${offset.left}px;width:${offset.width}px;height:${offset.height}px`);
            setTimeout(() => {
                self.$curPic.removeAttribute('style');
                self.$curPic.setAttribute('src', '');
                self.$sw.setAttribute('class', SW_CLASSES.DEF_SW_CON);
            }, 300);
        });
        this._handleTounches();
    };

    /***
     * Binding the evnet handle, judge the tounches and dealing the pictures;
     * @Sujun
     * **/
    private _handleTounches() {
        let oldX: number, oldY: number, orgWidth: number, orgHeight: number, orgX: number, orgY: number, tgtX: number = 0, tgtY: number = 0;
        let org_dist: number;
        const self = this;
        this.$swMainCon.addEventListener('touchstart', (event: TouchEvent) => {
            const curOffset = self.$curPic.getBoundingClientRect();
            orgWidth = curOffset.width;
            orgHeight = curOffset.height;
            tgtY = curOffset.y;
            tgtX = curOffset.x;
            orgX = tgtX;
            orgY = tgtY;
            self._initSwitch();
            if (event.touches.length > 1) {
                self.switch.ZOOM = true;
                org_dist = self.calcDistBetweenTwoPoint(event.touches[0], event.touches[1]);
            } else if (event.touches.length === 1) {
                self.switch.PIC = true;
                if (self.cache.pic_org_width !== curOffset.width || self.cache.pic_org_height !== curOffset.height) {
                    self.switch.ZOOMIN = self.cache.firstTouch ? false : true;
                    self.cache.firstTouch = false;
                }
                oldX = event.touches[0].clientX;
                oldY = event.touches[0].clientY
            } else {
                return false;
            }
        });
        this.$swMainCon.addEventListener('touchmove', (event: TouchEvent) => {
            if (self.switch.ZOOM && event.touches.length < 2) {
                return false;
            }
            const offsets = this.$curPic.getBoundingClientRect();
            if (self.switch.ZOOM) {
                const cur_dist = self.calcDistBetweenTwoPoint(event.touches[0], event.touches[1]);
                const percent = ((cur_dist - org_dist) / org_dist);
                const tgt_width = orgWidth * (1 + percent);
                const tgt_height = orgHeight * (1 + percent);
                tgtX = orgX + ((orgWidth - tgt_width) / 2);
                tgtY = orgY + ((orgHeight - tgt_height) / 2);
                this.$curPic.setAttribute('style', `transition:none; transform: translate3d(${tgtX}px,${tgtY}px,0px); width:${tgt_width}px; height:${tgt_height}px`);
            } else if (self.switch.PIC) {
                tgtX += (event.touches[0].clientX - oldX);
                if (Math.abs(offsets.width - self.cache.pic_org_width) > 1 && self.switch.ZOOMIN) {
                    tgtY += (event.touches[0].clientY - oldY);
                }
                this.$curPic.setAttribute('style', `transition:none; transform: translate3d(${tgtX / 16}rem,${tgtY / 16}rem,0rem) scale(1); width:${offsets.width / 16}rem; height:${offsets.height / 16}rem`)
                oldX = event.touches[0].clientX;
                oldY = event.touches[0].clientY;
            }
        });
        this.$swMainCon.addEventListener('touchend', (event: TouchEvent) => {
            const offsets = this.$curPic.getBoundingClientRect();
            if (self.switch.ZOOM) {
                if ((offsets.width / self.cache.pic_org_width) > self.config.MAX_PERCENT) {
                    const tgt_width = self.cache.pic_org_width * self.config.MAX_PERCENT;
                    const tgt_height = self.cache.pic_org_height * self.config.MAX_PERCENT;
                    tgtX = self.cache.pic_org_x + ((self.cache.pic_org_width - tgt_width) / 2);
                    tgtY = self.cache.pic_org_y + ((self.cache.pic_org_height - tgt_height) / 2);
                    setTimeout(() => {
                        self.$curPic.setAttribute('style', `transition:none; transform: translate3d(${tgtX / 16}rem,${tgtY / 16}rem,0rem); width:${tgt_width / 16}rem; height:${tgt_height / 16}rem`);
                    }, 100);
                } else if ((offsets.width / self.cache.pic_org_width) < self.config.MIN_PERCENT) {
                    const tgt_width = self.cache.pic_org_width * self.config.MIN_PERCENT;
                    const tgt_height = self.cache.pic_org_height * self.config.MIN_PERCENT;
                    tgtX = self.cache.pic_org_x + ((self.cache.pic_org_width - tgt_width) / 2);
                    tgtY = self.cache.pic_org_y + ((self.cache.pic_org_height - tgt_height) / 2);
                    setTimeout(() => {
                        self.$curPic.setAttribute('style', `transition:none; transform: translate3d(${tgtX / 16}rem,${tgtY / 16}rem,0rem); width:${tgt_width / 16}rem; height:${tgt_height / 16}rem`);
                    }, 100);
                }
            } else if (self.switch.PIC) {
                if (self.switch.ZOOMIN) {
                    if (Math.abs(offsets.y - orgY) - Math.abs(offsets.x - orgX) < 0) {
                        self.switchPIC(offsets.x < 0, offsets.x > 0 || offsets.x > (window.outerWidth - offsets.width), orgX);
                    }
                } else {
                    self.switchPIC(offsets.x < 0, false, orgX);
                }
            }
        });
    };

    private switchPIC(isNext: boolean = false, needSwithCheck: boolean, orgX?: number) {
        const self = this;
        const curOffsets = this.$curPic.getBoundingClientRect();
        const $titleCon = this.$sw.querySelector('.sw-title') as HTMLElement;
        const direction = isNext ? 'L' : 'R';
        if ((!this.switch.goSwith || !(this.cache.lastDerction && this.cache.lastDerction === direction)) && needSwithCheck) {
            setTimeout(() => {
                self.switch.goSwith = true;
                self.cache.lastDerction = direction;
                self.$curPic.setAttribute('style', `transform: translate3d(${isNext ? (window.outerWidth - curOffsets.width) / 16 : 0}rem,${curOffsets.y / 16}rem,0rem); width:${curOffsets.width / 16}rem; height:${curOffsets.height / 16}rem`);
            }, 80);
            return;
        }
        this.switch.goSwith = false;
        const $tgtIMG = document.createElement('img');
        $tgtIMG.setAttribute('class', 'sw-pic');
        let n: number = -1;
        this.$images.some(($IMG: HTMLElement, index: number) => {
            if ($IMG.getAttribute('del-src') === self.$curPic.getAttribute('src')) {
                n = isNext ? (index + 1) : (index - 1)
                return true;
            }
        });
        if (n >= 0 && n < this.$images.length) {
            const tgtSrc = this.$images[n].getAttribute('del-src');
            const tgtTitle = this.$images[n].getAttribute('alt');
            $tgtIMG.setAttribute('src', tgtSrc);

            let transStyle: string;
            if (isNext) {
                transStyle = `top:50%; transform: translateY(-50%); left:${(curOffsets.width + curOffsets.x) / 16}rem; width:100%; height:auto`;
            } else {
                transStyle = `top:50%; transform: translateY(-50%); left:${(curOffsets.x - self.cache.pic_org_width) / 16}rem; width:100%; height:auto`;
            }
            $tgtIMG.setAttribute('style', transStyle);
            this.$swMainCon.appendChild($tgtIMG);
            setTimeout(() => {
                self.$curPic.setAttribute('style', `transform: translate3d(${(isNext ? -1 : 1) * curOffsets.width / 16}rem,${needSwithCheck ? curOffsets.y / 16 : self.cache.pic_org_y / 16}rem,0rem); width:${curOffsets.width / 16}rem; height:${curOffsets.height / 16}rem`);
                $tgtIMG.setAttribute('style', SW_STYLES.SHOW_DEL);
                setTimeout(() => {
                    $tgtIMG.setAttribute('class', SW_CLASSES.CUR_PIC);
                    self.$swMainCon.removeChild(self.$curPic);
                    self.$curPic = $tgtIMG;
                    $titleCon.innerText = tgtTitle;
                    self.setPGE(n + 1);
                    const curOffsets = self.$curPic.getBoundingClientRect();
                    self.cache['pic_org_width'] = curOffsets.width;
                    self.cache['pic_org_height'] = curOffsets.height;
                    self.cache['pic_org_x'] = curOffsets.x;
                    if (needSwithCheck) {
                        self.cache['pic_org_y'] = curOffsets.y;
                    }
                }, 300);
            }, 100);
        } else if (Math.abs(curOffsets.width - self.cache.pic_org_width) <= 1) {
            setTimeout(() => {
                self.$curPic.setAttribute('style', `transform: translate3d(0rem,${needSwithCheck ? curOffsets.y / 16 : self.cache.pic_org_y / 16}rem,0rem); width:${curOffsets.width / 16}rem; height:${curOffsets.height / 16}rem`);
            }, 100);
        }
    }

    private setPGE(cur?: number) {
        const $footer = this.$sw.querySelector('.sw-paging-txt') as HTMLElement;
        const $cur = $footer.querySelectorAll('span')[0] as HTMLElement;
        const $total = $footer.querySelectorAll('span')[1] as HTMLElement;
        if (cur) {
            this.config.PGE.cur = cur;
        }
        $cur.innerText = cur ? cur.toString() : this.config.PGE.cur.toString();
        $total.innerText = this.config.PGE.total.toString();
    }

    private calcDistBetweenTwoPoint(pointA: POINT, pointB: POINT) {
        const org_dist_xs = pointA.clientX - pointB.clientX;
        const org_dist_ys = pointA.clientY - pointB.clientY;
        return Math.sqrt((org_dist_xs * org_dist_xs) + (org_dist_ys * org_dist_ys));
    }

    public buildPicViewer($con?: HTMLElement) {
        if ($con) {
            this.$mainCon = $con;
            const _$imgs = this.$mainCon.querySelectorAll('img.photo-img') as NodeListOf<HTMLElement>;
            this.$images = [];
            _$imgs.forEach(($IMG: HTMLElement) => this.$images.push($IMG));
            this.config.PGE.total = this.$images.length;
            this.config.PGE.cur = 0;
        }
        this._initSwitch();
        const self = this;
        const $titleCon = this.$sw.querySelector('.sw-title') as HTMLElement;
        this.$images.forEach(($img: HTMLElement, index: number) => {
            let startX: number, startY: number;
            $img.addEventListener('touchstart', (event: TouchEvent) => {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
            });
            $img.addEventListener('touchend', (event: TouchEvent) => {
                if (Math.abs(event.changedTouches[0].clientX - startX) <= 1 && Math.abs(event.changedTouches[0].clientY - startY) <= 1) {
                    const offset = $img.getBoundingClientRect();
                    // const $swMainCon = self.$sw.querySelector('.sw-main-con') as HTMLElement;
                    // const swMainConHeight = $swMainCon.getBoundingClientRect().height;
                    $titleCon.innerText = $img.getAttribute('alt');
                    self.$sw.setAttribute('class', SW_CLASSES.SHOW_SW_CON);
                    self.$curPic.setAttribute('src', $img.getAttribute('del-src') || $img.getAttribute('src'));
                    self.org_style = `top:${offset.top}px;left:${offset.left}px;width:${offset.width}px;height:${offset.height}px`;
                    self.$curPic.setAttribute('style', self.org_style);
                    self.config.PGE.cur = index + 1;
                    self.setPGE();
                    self.cache.firstTouch = true;
                    // const tgt_style = `width:100%; heigth:auto; transform: translate3d(0px,${}px,0px);`;
                    setTimeout(() => {
                        self.$curPic.setAttribute('style', SW_STYLES.SHOW_DEL);
                        self.$sw.setAttribute('style', SW_STYLES.SHOW_CON);
                        setTimeout(() => {
                            self.$swHeader.setAttribute('style', SW_STYLES.VISIBLE);
                            self.$swFooter.setAttribute('style', SW_STYLES.VISIBLE);
                            const curOffsets = self.$curPic.getBoundingClientRect();
                            self.cache['pic_org_width'] = curOffsets.width;
                            self.cache['pic_org_height'] = curOffsets.height;
                            self.cache['pic_org_x'] = curOffsets.x;
                            self.cache['pic_org_y'] = curOffsets.y;
                        }, 300);
                    }, 100);
                }
            });
        });
    }
};

const voxelcloudPictureViewer = new sandwichPIC(); 