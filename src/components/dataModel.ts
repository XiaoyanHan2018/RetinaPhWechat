interface DATA_MODEL {
    [key: string]: any
}
class dataModel {
    _DATA_MODEL: DATA_MODEL = {};
    constructor() {
        this._init();
    }

    private _init() {
        this._DATA_MODEL = {};
    }

    /**
     * Get the context data wtih input binding path
     * @Sujun **/
    public getPropertyContext(path?: string): any {
        if (!path) {
            return this._DATA_MODEL;
        }
        const paths = path.startsWith('/') ? path.replace('/', '').split('/') : path.split('/');
        const lastIndex = paths.length - 1;
        let temp = this._DATA_MODEL;
        let reuslt = null;
        paths.some((_propertyName: string, index: number) => {
            if (temp.hasOwnProperty(_propertyName)) {
                temp = temp[_propertyName];
                if (index === lastIndex) {
                    reuslt = temp;
                }
            } else if (!_propertyName && temp) {
                reuslt = temp;
            } else {
                console.warn('The input binding path is not exist in data mdoel.');
                return true;
            }
        });
        return reuslt;
    };

    /**
     * Set the context data into the data model by path 
     * @Sujun **/
    public setPropertyContext(path: string, data: any, needUpdate: boolean = false, conatiner?: Element) {
        const paths = path.startsWith('/') ? path.replace('/', '').split('/') : path.split('/');
        const lastIndex = paths.length - 1;
        let temp = this._DATA_MODEL;
        let reuslt = null;
        paths.some((_propertyName: string, index: number) => {
            if (temp.hasOwnProperty(_propertyName)) {
                if (index === lastIndex) {
                    switch (typeof temp[_propertyName]) {
                        case 'number':
                            temp[_propertyName] = parseFloat(data);
                            break;
                        default:
                            temp[_propertyName] = data;
                    }
                } else {
                    temp = temp[_propertyName];
                }
            } else if (index < lastIndex) {
                temp[_propertyName] = {};
                temp = temp[_propertyName];
            } else {
                temp[_propertyName] = data;
            }
        });
        if (needUpdate) {
            let DM_PATH_CODE = path.startsWith('/') ? path.replace('/', '') : path;
            if (DM_PATH_CODE.endsWith('/')) {
                DM_PATH_CODE = DM_PATH_CODE.slice(0, DM_PATH_CODE.length - 1);
            }
            const con = conatiner || document;
            this.updateBindings(con.querySelectorAll("[data-bind*='dataModel." + DM_PATH_CODE.replace(/\//g, ".") + "']") as NodeListOf<HTMLElement>);
        }
    }

    /**
     * udpate all the binding data in the container
     * @Sujun
     * **/
    public updateBindings(doms?: NodeListOf<HTMLElement> | Array<HTMLElement>, conatiner?: Element) {
        const con = conatiner || document;
        const all_doms = doms || con.querySelectorAll("[data-bind*='dataModel.']") as NodeListOf<HTMLElement>;
        const self = this;
        all_doms.forEach((el: HTMLElement | HTMLInputElement) => {

            const _bindInfo = el.getAttribute('data-bind');
            if (_bindInfo.startsWith('dataModel.')) {
                const paths = _bindInfo.replace('dataModel.', '').split('.');
                const lastIndex = paths.length - 1;
                let temp = this._DATA_MODEL;
                paths.some((_propertyName: string, index: number) => {
                    if (temp.hasOwnProperty(_propertyName)) {
                        temp = temp[_propertyName];
                        if (index === lastIndex) {
                            const _innerText = typeof temp === 'object' && temp !== null ? JSON.stringify(temp) : (temp === null || temp === undefined ? '' : temp);
                            const funName: any = el.getAttribute('data-formatter') || '';
                            const formatFn: any = funName ? window[funName] : null;
                            el.innerText = formatFn && typeof formatFn === 'function' ? formatFn(_innerText, el) : _innerText;
                        }
                    } else {
                        console.warn('The input binding path is not exist in data mdoel.');
                        return true;
                    }
                });
            } else {
                _bindInfo.split(',').forEach((_bf: string) => {
                    const [attrName, _bind] = _bf.split('-');

                    if (attrName && el.hasAttribute(attrName) && _bind.startsWith('dataModel.')) {
                        const paths = _bind.replace('dataModel.', '').split('.');
                        const lastIndex = paths.length - 1;
                        let temp = this._DATA_MODEL;
                        paths.some((_propertyName: string, index: number) => {
                            if (temp.hasOwnProperty(_propertyName)) {
                                temp = temp[_propertyName];
                                if (index === lastIndex) {
                                    const _val = typeof temp === 'object' && temp !== null ? JSON.stringify(temp) : (temp === null || temp === undefined ? '' : temp);
                                    const funName: any = el.getAttribute('data-formatter') || '';
                                    const formatFn: any = funName ? window[funName] : null;
                                    const attrVal = formatFn && typeof formatFn === 'function' ? formatFn(_val, el) : _val;
                                    el.setAttribute(attrName, attrName !== 'selkey' && attrVal.toString() === '0' ? '' : attrVal.toString());
                                    if (attrName === 'value') {
                                        const _input = el as HTMLInputElement;
                                        _input.value = el.getAttribute(attrName);
                                    }
                                    if (attrName === 'selkey') {
                                        const $inputCon = el.parentNode.parentNode as HTMLElement;
                                        if ($inputCon.getAttribute('class').includes('sel-date')) {
                                            el.setAttribute('value', _val.toString());
                                        } else if ($inputCon.getAttribute('class').includes('sel')) {
                                            const $options = $inputCon.querySelectorAll('ul.sel-options>li') as NodeListOf<HTMLElement>;
                                            for (let n = 0; n < $options.length; n++) {
                                                if ($options[n].getAttribute('key') === _val.toString()) {
                                                    el.setAttribute('value', $options[n].innerText);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    let _valExist = false;
                                    if (attrName === 'selkey') {
                                        _valExist = _val !== null && _val !== undefined && _val !== '' && _val.toString() !== '-1';
                                    } else {
                                        _valExist = _val !== null && _val !== undefined && _val !== '' && _val.toString() !== '0';
                                    }
                                    if (_valExist && el.tagName === 'INPUT') {
                                        const parent = el.parentNode as HTMLLIElement;
                                        parent.setAttribute('class', 'input-field-main hasVal focus');
                                    }
                                    if (el.tagName === 'INPUT') {
                                        const $input = el as HTMLInputElement;
                                        if (attrName !== 'selkey') {
                                            $input.addEventListener('input', () => {
                                                self.setPropertyContext(`/${paths.join('/')}`, $input.value);
                                            });
                                            const $con = $input.parentElement;
                                            const $clearBtn = $con.querySelector('i.field-btn.iconfont.icon-ic_close_px') as HTMLLIElement;
                                            $clearBtn.addEventListener('touchend', () => {
                                                self.setPropertyContext(`/${paths.join('/')}`, '');
                                                event.stopPropagation();
                                            });
                                        } else {
                                            const observer = new MutationObserver(function (mutations) {
                                                mutations.forEach(function (mutation) {
                                                    if (mutation.type === 'attributes' && mutation.attributeName === 'selkey') {
                                                        self.setPropertyContext(`/${paths.join('/')}`, $input.getAttribute('selkey'));
                                                    }
                                                });
                                            });
                                            observer.observe($input, {
                                                attributes: true
                                            });
                                        }
                                    }
                                }
                            } else {
                                console.warn('The input binding path is not exist in data mdoel.');
                                return true;
                            }
                        });
                    }
                });
            }
        });
    }
}

const voxelcloudDataModel = new dataModel();