const SUPT_LANG = ['en', 'zh'];
declare const i18n_en: Object;
declare const i18n_zh: Object;

class i18n {
    i18n_main: any = {};
    constructor() {
        SUPT_LANG.forEach(code => {
            switch (code) {
                case 'en':
                    this.i18n_main.en = i18n_en;
                    break;
                case 'zh':
                    this.i18n_main.zh = i18n_zh;
                    break;
            }
            this._init();
        }, this);
    }

    private _init() {
        const body = document.getElementsByTagName('body')[0];
        const that = this;
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    that.onloadRPLC();
                }
            });
        });

        observer.observe(body, {
            attributes: true //configure it to listen to attribute changes
        });
    }

    public getText(i18nID: string, options?: Array<string>): string {
        const cur_lang = document.getElementsByTagName('body')[0].getAttribute('lang');
        const tgt_i18n = this.i18n_main[cur_lang];
        if (!tgt_i18n) {
            throw new Error('Could not found the i18n resouces from "/i18n/".');
            return i18nID;
        }
        if (!tgt_i18n[i18nID.replace('i18n.', '')]) {
            throw new Error(`Could not found the related i18n(${i18nID}) value from "/i18n/${cur_lang}.json".`);
            return i18nID;
        }
        if (options && options.length > 0) {
            let str = tgt_i18n[i18nID.replace('i18n.', '')];
            options.forEach((op: string, index: number) => {
                str = str.replace('${' + index + '}', op);
            });
            return str;
        } else {
            return tgt_i18n[i18nID.replace('i18n.', '')];
        }
    }

    public onloadRPLC(conatiner?: Element) {
        const con = conatiner || document;
        const all_i18n_doms = con.querySelectorAll("[data-bind*='i18n.']") as NodeListOf<HTMLElement>;
        all_i18n_doms.forEach(el => {
            const dataBind = el.getAttribute('data-bind');
            const op = el.getAttribute('i18n-op');
            if (dataBind.startsWith('i18n.')) {
                const i18nID = dataBind.replace(/[${}]|i18n./gi, '');
                if (op) {
                    el.innerText = this.getText(i18nID, JSON.parse(op));
                } else {
                    el.innerText = this.getText(i18nID);
                }
            } else {
                dataBind.split(',').forEach((attr: string) => {
                    const [attrName, i18nCode] = attr.split('-');
                    if (attrName && el.hasAttribute(attrName) && i18nCode.startsWith('i18n.')) {
                        const i18nID = i18nCode.replace(/[${}]|i18n./gi, '');
                        if (op) {
                            el.setAttribute(attrName, this.getText(i18nID, JSON.parse(op)));
                        } else {
                            el.setAttribute(attrName, this.getText(i18nID));
                        }
                    }
                });
            }
        });
    }

    /**
     * getCurrentLangeCode
     * return the value of current language code;
     */
    public getCurrentLangeCode(): string {
        const $body = document.getElementsByTagName('body')[0];
        if (!$body) {
            throw new Error('Could not found the DOM of "body".');
            return '';
        }
        return $body.getAttribute('lang');
    }

    /**
     * switchLange
     * change APP language by input;
     */
    public switchLange(langCode: string) {
        const $body = document.getElementsByTagName('body')[0];
        if (!$body) {
            throw new Error('Could not found the DOM of "body".');
            return;
        }
        if (SUPT_LANG.indexOf(langCode) < 0) {
            throw new Error(`Could not found the i18n resouces of ${langCode}`);
            return;
        }
        $body.setAttribute('lang', langCode);

    }

}

const voxelcloudI18n = new i18n();