(() => {
    // IE 11 not support the nodelist foreach;
    if ('NodeList' in window && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
            thisArg = thisArg || window;
            for (var i = 0; i < this.length; i++) {
                callback.call(thisArg, this[i], i, this);
            }
        };
    }

    const originBodyHeight = document.documentElement.clientHeight || document.body.scrollHeight;
    const _userAgent = window.navigator.userAgent;
    const isAndroid = _userAgent.indexOf('Android') > -1 || _userAgent.indexOf('Adr') > -1; //android终端
    if (isAndroid) {
        window.addEventListener('resize', () => {
            const _login_footer = document.querySelector('.login-con>.login-footer') as HTMLElement;
            const $loginMain = document.querySelector('.login-main-con') as HTMLElement;
            if ($loginMain) {
                if (document.body.scrollHeight < originBodyHeight) {
                    $loginMain.setAttribute('style', 'position: fixed; bottom: -4rem;');
                } else {
                    $loginMain.removeAttribute('style');
                }

            }
            if (_login_footer) {
                _login_footer.setAttribute('show', document.body.scrollHeight < originBodyHeight ? 'false' : 'true')
            }
        });

    }

    // IE 11 not support new CustomEvent();
    (function () {
        if (
            typeof window.CustomEvent === "function" ||
            // In Safari, typeof CustomEvent == 'object' but it otherwise works fine
            this.CustomEvent.toString().indexOf('CustomEventConstructor') > -1
        ) { return; }

        function CustomEvent(event: string, params: any) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = <any>CustomEvent;
    })();
})();