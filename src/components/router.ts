enum ROUTER_EVENT {
  PGE_LOAD_ST = 'pageLoadStart',
  PGE_LOAD_CAN = 'pageLoadCancel',
  PGE_LOAD_ERR = 'pageLoadError',
  PGE_LOAD_CMPLT = 'pageLoadComplete',
  PGE_ANM_ST = 'pageAnimationStart',
  PGE_ANM_E = 'pageAnimationEnd',
  PGE_INIT_E = 'pageInitEnd'
}

enum DOM_IDs {
  PGE_MN_CON = 'page-con'
}

enum DOM_CLs {
  PAGE = 'page',
  TGT_PGE_CON = 'page-tgt',
  CUR_PGE_CON = 'page-cur',
  DEF_MN_PGE_CON = 'page-con',
  DEF_TGT_PGE_CON = 'page page-tgt',
  DEF_CUR_PGE_CON = 'page page-cur'
}

enum ROUTER_SESSION {
  ROUTER = 'voxelcloud.retina.wechat.router',
  CACHE = 'voxelcloud.retina.wechat.cache',
  STATE_IDNEX_ID = 'voxelcloud.retina.wechat.router.state.index',
  LOGIN = 'TE9HSU5fSU5GTw',
  HISTORY = 'SElTVE9SWQ',
  OPEN_ID = 'T1BFTl9JRA'
};

const DEF_PGE_URL = '/login';
const HOME_PGE = '/home';
const OPE_ID_REGEX = new RegExp("[?&]openid(=([^&#]*)|&|#|$)");
const NO_NEED_LOG_REGEX = new RegExp("[?&]no_login(=([^&#]*)|&|#|$)");
const TOKEN_REGEX = new RegExp("[?&]token(=([^&#]*)|&|#|$)");
const REDIRECT = new RegExp("[?&]redirect(=([^&#]*)|&|#|$)");

interface URL_INFO {
  ABS_URL?: string;         // get the absolute URL, (exp: '/d' --> 'http://www.a.com/d');
  BASE_URL?: string;        // get the base URL, (exp: 'http://www.a.com/d/e/#1' => 'http://www.a.com/d/e/');
  HASH?: string;            // get the hash value in URL. (exp: 'http://www.a.com/d/e/#page1' => 'page1');
  ORIG_URL?: string;        // original URL
  PARAMS?: object;          // params
}

interface PGES_STA {
  PGES?: NodeListOf<HTMLElement>;
  CUR_PGE?: Element;
  CUR_PGE_ID?: string | null;
  VISIBLE_PGES?: Array<Element>;
}

interface ROUTER_STATE {
  ID?: Number;
  URL?: URL_INFO;
  PGE_ID?: string | null;
}

interface CALLBACK {
  success?: Function,
  error?: Function
}

interface CACHE {
  [key: string]: any;
}

interface ROUTER_CONF {
  DEF_PGE_URL: string
}

class Router {
  xhr: XMLHttpRequest;                      // navigate URL;
  $MN_CON: HTMLElement;                     // Main DOM container;
  $TGT_CON: Element;                        // Main DOM container;
  $CUR_CON: Element;                        // Main DOM container;
  history: History                          // history of the window;
  URL_INFO: URL_INFO = {};                  // the info of the URL;
  PGES_STA: PGES_STA = {};                  // the state info of the pages;
  RENDERED: Object = {};                    // the section which has been rendered.
  DEF_PGE_URL: string;
  // LOCAL_HREF: string;
  CACHE: CACHE = { MOBI: '', OPEN_ID: '', PID: '', IS_LOGIN: '0' };
  loginRouters: Array<string> = ['login', 'pwd', 'register'];
  redirect: boolean = false;
  constructor(config?: ROUTER_CONF) {
    this.xhr = null;
    this.history = window.history;
    const LOCAL_HREF = '?' + this._parseVal();
    this.redirect = this._getDirect(LOCAL_HREF) === '0' ? true : false;
    const curHASH = this._analyzeURL(LOCAL_HREF).HASH;
    this.DEF_PGE_URL = this._getNoNeedLogin(LOCAL_HREF) ? (curHASH && this.loginRouters.indexOf(curHASH) < 0 ? `/${curHASH}` : HOME_PGE) : DEF_PGE_URL;
    if (!this.getCacheData(ROUTER_SESSION.HISTORY)) this.setCacheData(ROUTER_SESSION.HISTORY, []);
    this._init();
    window.addEventListener('popstate', this._onPopState.bind(this));
  }


  /** parse the init config from token **/
  private _parseVal(): any {
    const results = TOKEN_REGEX.exec(location.href);
    if (!results) return null;
    if (!results[2]) return null;
    let _bStr = decodeURIComponent(results[2].replace(/\+/g, '')); // base 64 code;
    if (Math.ceil(_bStr.length / 4) > 0) {
      _bStr.padEnd(Math.ceil(_bStr.length / 4), '=');
    }
    return atob(_bStr);
  }

  /** Init function of the Router **/
  private _init() {
    this.$MN_CON = document.getElementById(DOM_IDs.PGE_MN_CON);
    // setting current info of the pages;
    if (!this.$MN_CON) {
      throw new Error('Router initial failed: can not found the main page container with ID: "' + DOM_IDs.PGE_MN_CON + '"')
      return;
    }
    this._animatePrepare();
    const PGES: NodeListOf<HTMLElement> = this.$MN_CON.querySelectorAll(".page") as NodeListOf<HTMLElement>;
    const $viibles: Array<Element> = [];
    PGES.forEach((element: HTMLElement) => {
      if (element.style.display !== 'none') {
        $viibles.push(element);
      }
    })

    const $backBtn = document.getElementById('btn-back') as HTMLElement;
    const self = this;
    $backBtn.addEventListener('touchend', () => {
      self.back();
    });
    // for (let element of PGES) {

    // }
    this.PGES_STA = {
      CUR_PGE: this.$CUR_CON,
      PGES: PGES,
      VISIBLE_PGES: $viibles,
      CUR_PGE_ID: this.$CUR_CON.getAttribute('id')
    }

    if (!sessionStorage.getItem(ROUTER_SESSION.CACHE)) {
      sessionStorage.setItem(ROUTER_SESSION.CACHE, this._btoa('{}'));
    }

    // this.CACHE.OPEN_ID = "";
    // setting the current info of the URLs

    // let curURL = null;
    //TODO should has function check if the cache in Router is different with the current DOM in HTML;
    if (!sessionStorage.getItem(ROUTER_SESSION.ROUTER)) {
      this.URL_INFO = this._analyzeURL(this.DEF_PGE_URL);
      const stateIndex = sessionStorage.getItem(ROUTER_SESSION.STATE_IDNEX_ID);
      const curState: ROUTER_STATE = {
        ID: stateIndex ? parseInt(stateIndex, 10) + 1 : 1,
        URL: this.URL_INFO,
        PGE_ID: this.URL_INFO.BASE_URL.split('/').slice(-1).pop()
      };
      // this.history.replaceState(curState, curState.PGE_ID);//, '#' + btoa(curState.PGE_ID).replace(/(=+)$/g, ''));
      this.setCacheData(ROUTER_SESSION.HISTORY, [curState]);
      this._updateRouterState(curState);
      this._updateRouterStateIndex(curState.ID);
    }
    // const locationURLInfo = this.history.state.URL;
    // this.CACHE.OPEN_ID = this.getCacheData('OPEN_ID') || this._getOpenID(this.LOCAL_HREF);
    const CUR_HREF = this._parseVal();
    const LOCAL_HREF = '?' + CUR_HREF;
    // if (!this.getCacheData(ROUTER_SESSION.OPEN_ID)) {
    //   this.setCacheData(ROUTER_SESSION.OPEN_ID, this._getOpenID(LOCAL_HREF))
    // }
    if (CUR_HREF && CUR_HREF.includes('openid')) {
      this.setCacheData(ROUTER_SESSION.OPEN_ID, this._getOpenID(LOCAL_HREF))
      const tgtToken = CUR_HREF.replace(`openid=${this.getCacheData(ROUTER_SESSION.OPEN_ID)}`, '');
      window.location.href = `${window.location.href.split('?token=')[0]}${tgtToken ? '?token=' + this._btoa('ORIGIN=T' + tgtToken) : ''}`;
    }

    // sessionStorage.setItem(ROUTER_SESSION.CACHE, this._btoa(JSON.stringify(Object.assign(JSON.parse(this._atob(sessionStorage.getItem(ROUTER_SESSION.CACHE)) || '{}'), { OPEN_ID: this.getCacheData(ROUTER_SESSION.OPEN_ID) }))));

    const LOGIN_CACEH = this.getCacheData(ROUTER_SESSION.LOGIN);
    // const HISTORY = this.getCacheData(ROUTER_SESSION.HISTORY);
    if (!LOGIN_CACEH || !LOGIN_CACEH.userid || LOGIN_CACEH.status !== 'logged' || !LOGIN_CACEH.dr_url) {
      this.load(DEF_PGE_URL, false);
    } else {
      const curState = JSON.parse(sessionStorage.getItem(ROUTER_SESSION.ROUTER));
      if (curState.PGE_ID === 'login') {
        this.setCacheData(ROUTER_SESSION.LOGIN, { userid: '', state: '', dr_url: '' });
      }
      voxelcloudDataModel.setPropertyContext('/dr_url', LOGIN_CACEH.dr_url);
      this.refreshCurPage(curState.URL);
    }
  }

  private _dealingLocalHref(defUrl: string): string {
    let result = defUrl;
    if (window.location.href.indexOf('#') > 0) {
      const [otehr, tag] = window.location.href.split('#');
      if (!this.redirect) {
        return `${defUrl.split('#')[0]}#${atob(tag.padEnd(Math.ceil(tag.length / 4), '='))}`;
      }
    }
    return result;
  }

  /** Intercept URL redirects, get the content of new page by AJAX 
   * @Sujun **/
  private _onPopState(event: any) {
    const state: ROUTER_STATE = event.state;
    // if not a valid state, do nothing
    if (!state) {
      return;
    }

    const lastState = (() => {
      try {
        return JSON.parse(sessionStorage.getItem(ROUTER_SESSION.ROUTER) || '');
      } catch (err) {
        return '';
      }
    })()
    if (!lastState) {
      console.error && console.error('Could not found the router state in session storage.');
      return;
    }
    if (state.ID === lastState.ID) {
      return;
    }

    if (state.ID && state.ID < lastState.ID) {
      // this.back(state, lastState);
    } else {
      this.forward(state, lastState);
    }
  }

  /** Get the open id from URL;
   * @Sujun **/
  private _getOpenID(URL: string): any {
    const results = OPE_ID_REGEX.exec(URL);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, ''));
  };


  private _getDirect(URL: string): any {
    const results = REDIRECT.exec(URL);
    if (!results) return null;
    if (!results[2]) return null;
    return decodeURIComponent(results[2].replace(/\+/g, ''));
  }

  /** Get the value for judge whether need login for the APP
   * @Sujun **/
  private _getNoNeedLogin(URL: string): boolean {
    const results = NO_NEED_LOG_REGEX.exec(URL);
    if (!results) return null;
    if (!results[2]) return null;
    const urlVal = decodeURIComponent(results[2].replace(/\+/g, ''));
    return urlVal === '1';
  }

  // /** 
  //  * If no need login, stright nav to home page and reqeust the pid from back-end
  //  * @Sujun
  // */
  // private _getPID(urlStr?: string) {
  //   const req = new XMLHttpRequest();
  //   const self = this;
  //   req.onreadystatechange = function () {
  //     if (this.readyState == 4) {
  //       if (this.status == 200) {
  //         const resData = JSON.parse(this.responseText);
  //         // const locationURLInfo = self._analyzeURL(self._dealingLocalHref(self.LOCAL_HREF));
  //         self.setCacheData('PID', resData.pid || '');
  //         self.setCacheData('IS_LOGIN', '1')
  //         self.load(urlStr || self.DEF_PGE_URL, urlStr ? true : false);
  //         // footerElementNav(self.DEF_PGE_URL);
  //       } else {
  //         // TODO should has error handler for them, to popup message box?
  //         throw new Error(`${this.status}: ${JSON.parse(this.responseText).error_message}`);

  //       }
  //     }
  //   }
  //   req.open('POST', '/api/wechat_pid', true);
  //   req.setRequestHeader('Content-Type', 'application/json');
  //   req.send(JSON.stringify({ openid: self.CACHE.OPEN_ID }));
  // }

  private _analyzeURL(URL: string): URL_INFO {
    const result: URL_INFO = {
      ORIG_URL: URL
    };
    const hashIndex = URL.indexOf('#');
    // get hash value in URL;
    result.HASH = hashIndex < 0 ? URL.split('/').slice(-1).pop() : URL.slice(hashIndex + 1).padEnd(Math.ceil(URL.slice(hashIndex + 1).length / 4), '=');
    // get the base URL from input URL;
    result.BASE_URL = hashIndex < 0 ? URL.split('?')[0] : URL.slice(0, hashIndex);

    // get the absolute URL from input URL;
    let _link = document.createElement('a');
    _link.setAttribute('href', URL);
    result.ABS_URL = _link.href.replace(URL, '');
    if (result.BASE_URL === result.ABS_URL) {
      result.BASE_URL = '';
    }
    // _link = null;
    return result;
  }

  private _updateRouterState(curState: ROUTER_STATE) {
    sessionStorage.setItem(ROUTER_SESSION.ROUTER, curState ? JSON.stringify(curState) : '');
  }
  private _updateRouterStateIndex(index: Number | undefined) {
    sessionStorage.setItem(ROUTER_SESSION.STATE_IDNEX_ID, index ? index.toString() : '');
  }

  private _loadHTMLDoc(url?: string, callback?: CALLBACK) {
    if (!url) {
      return false;
    }
    this.dispatch(ROUTER_EVENT.PGE_LOAD_ST);
    if (this.xhr && this.xhr.readyState < 4) {
      this.xhr.onreadystatechange = function () { };
      this.xhr.abort();
      this.dispatch(ROUTER_EVENT.PGE_LOAD_CAN);
    }
    this.dispatch(ROUTER_EVENT.PGE_ANM_ST);
    const self = this;
    this.xhr = new XMLHttpRequest();
    this.xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          callback.success && callback.success.call(self, this.responseText, this.status);
          self.dispatch(ROUTER_EVENT.PGE_LOAD_CMPLT);
        } else {
          callback.error && callback.error.call(self, this.responseText, this.status);
          self.dispatch(ROUTER_EVENT.PGE_LOAD_ERR);
        }
      }
    };
    this.xhr.open("GET", url, true);
    this.xhr.send();
  }

  public refreshCurPage(urlInfo: URL_INFO) {
    const storage: string = sessionStorage.getItem(ROUTER_SESSION.ROUTER);
    const jsonStorage: ROUTER_STATE = storage ? JSON.parse(storage) : {};
    let cur_url = '';
    if (urlInfo.HASH) {
      const _HASH = `${urlInfo.HASH}`.replace('/', '').split('?')[0];
      if (!storage || (_HASH === jsonStorage.URL.BASE_URL.replace('/', ''))) {
        cur_url = `./views/${_HASH}.html`
      }
    } else if (urlInfo.BASE_URL === this.DEF_PGE_URL) {
      cur_url = `./views${urlInfo.BASE_URL}.html`
    }
    if (cur_url) {
      const $body = document.getElementsByTagName('body')[0];
      $body.setAttribute('cur-router', cur_url.split('/').slice(-1).pop().replace('.html', ''));
      this._loadHTMLDoc(cur_url, {
        success: (res: string, status: number) => {
          this.$CUR_CON.innerHTML = res;
          voxelcloudI18n.onloadRPLC(this.$CUR_CON);
          this.registerNavEvent(this.$CUR_CON);
          this._requireControllerforView(urlInfo.HASH.split('?')[0]);
        },
        error: (errTxt: string) => {
          throw new Error(errTxt);
        }
      });
    }
  }

  private _requireControllerforView(controller_name: string) {
    if (controller_name) {
      const _path = `./controllers/${controller_name}.js`;
      let hasLoadScript = false;
      const script = document.createElement('script');
      const scripts = document.querySelectorAll('script') as NodeListOf<HTMLScriptElement>;
      scripts.forEach((_script: HTMLScriptElement) => {
        if (_script && _script.getAttribute('src') === _path) {
          hasLoadScript = true;
        }
      });
      if (!hasLoadScript) {
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', _path);
        script.setAttribute('charset', 'utf-8');
        document.body.appendChild(script);
      }
    }
  }

  private _switchPage(_url: string, hash?: string, noNeedUpdate?: boolean, noPushHistory?: boolean) {
    if (!_url && !hash) {
      return;
    }
    if (hash) {
      //TODO support anchor in future;
    } else if (_url) {
      const $body = document.getElementsByTagName('body')[0];
      $body.setAttribute('cur-router', _url.split('?')[0].replace(/\//g, ''));
      this._loadHTMLDoc(`./views${_url.split('?')[0]}.html`, {
        success: (res: string, status: number) => {
          this.$TGT_CON.innerHTML = res;
          voxelcloudI18n.onloadRPLC(this.$TGT_CON);
          this.registerNavEvent(this.$TGT_CON);
          this._requireControllerforView(_url.replace('/', '').split('?')[0]);
          this._animate();
          if (!noNeedUpdate) {
            this._updateAllState(this._analyzeURL(_url), noPushHistory);
          }
        },
        error: (errTxt: string) => {
          throw new Error(errTxt);
        }
      });
    }
  }

  private _animate() {
    this.dispatch(ROUTER_EVENT.PGE_ANM_ST);
    this.$MN_CON.setAttribute('class', 'page-con page-trans');
    this.$CUR_CON.setAttribute('class', 'page page-cur page-leave-from-center hide');
    this.$TGT_CON.setAttribute('class', 'page page-tgt page-from-bottom-to-center');
  }

  private _animatePrepare() {
    this.$TGT_CON = document.getElementsByClassName(DOM_CLs.TGT_PGE_CON)[0];
    this.$CUR_CON = document.getElementsByClassName(DOM_CLs.CUR_PGE_CON)[0];
    if (!this.$CUR_CON) {
      this.$CUR_CON = document.createElement('div');
      this.$CUR_CON.setAttribute('class', 'page page-cur');
      this.$MN_CON.prepend(this.$CUR_CON)
    }
    if (!this.$TGT_CON) {
      this.$TGT_CON = document.createElement('div');
      this.$TGT_CON.setAttribute('class', 'page page-tgt');
      this.$MN_CON.prepend(this.$TGT_CON)
    }
    this.$TGT_CON.innerHTML = '';
    this.$CUR_CON.addEventListener('animationend', () => {
      this.$CUR_CON.setAttribute('class', DOM_CLs.DEF_TGT_PGE_CON);
    });

    this.$TGT_CON.addEventListener('animationend', () => {
      this.$MN_CON.setAttribute('class', DOM_CLs.DEF_MN_PGE_CON);
      this.$TGT_CON.setAttribute('class', DOM_CLs.DEF_CUR_PGE_CON);
      this.$CUR_CON.innerHTML = '';
      this.dispatch(ROUTER_EVENT.PGE_ANM_E);
    });
  }

  /** Update the new state into history;
   *  Update the new state into session storage;
   *  Update the new staet ID into session storage;
   * @Sujun **/
  private _updateAllState(urlInfo?: URL_INFO, noPushHistory?: boolean) {
    const stateIndex = sessionStorage.getItem(ROUTER_SESSION.STATE_IDNEX_ID);
    const pageID = urlInfo.BASE_URL.split('/').slice(-1).pop();
    const newState: ROUTER_STATE = {
      ID: stateIndex ? parseInt(stateIndex, 10) + 1 : 1,
      URL: urlInfo || {},
      PGE_ID: pageID
    };
    if (!noPushHistory) {
      let history = this.getCacheData(ROUTER_SESSION.HISTORY);
      if (history.slice(-1).pop().PGE_ID === 'login' && newState.PGE_ID !== 'login') {
        history = [];
      }
      history.push(newState);
      this.setCacheData(ROUTER_SESSION.HISTORY, history);
    }
    // this.history.pushState(newState, pageID);
    this._updateRouterState(newState);
    this._updateRouterStateIndex(newState.ID);
  }

  /** get current router info
   * If there no router state cache return null;
   * @Sujun **/
  public getCurrentRouter(): ROUTER_STATE {
    const cur_router_state = sessionStorage.getItem(ROUTER_SESSION.ROUTER);
    if (cur_router_state) {
      return JSON.parse(cur_router_state);
    } else {
      return null;
    }
  }

  private _atob(codeStr: string): any {
    if (!codeStr) {
      return '{}';
    }
    if (Math.ceil(codeStr.length / 4) > 0) {
      codeStr.padEnd(Math.ceil(codeStr.length / 4), '=');
    }
    return atob(codeStr);
  }

  private _btoa(str: string): string {
    if (!str) {
      str = '{}';
    }
    return btoa(str).replace(/(=+)$/g, "");
  }

  /**
   * get the data/member fo router cache
   * @Sujun   */
  public getCacheData(key?: string): any {
    this.CACHE = JSON.parse(this._atob(sessionStorage.getItem(ROUTER_SESSION.CACHE)));
    if (key === 'OPEN_ID') { key = ROUTER_SESSION.OPEN_ID; }
    if (key === 'USER_ID') { return this.CACHE[ROUTER_SESSION.LOGIN] ? this.CACHE[ROUTER_SESSION.LOGIN].userid || '' : '' }
    return key ? this.CACHE[key] : this.CACHE;
  }

  public getRedirect() {
    return this.redirect;
  }

  /**
   * set the data/member fo router cache
   * @Sujun   */
  public setCacheData(key: string, val: any) {
    this.CACHE = JSON.parse(this._atob(sessionStorage.getItem(ROUTER_SESSION.CACHE)));
    if (key) {
      if (key === 'DR_URL') {
        this.CACHE[ROUTER_SESSION.LOGIN]['dr_url'] = val;
      } else {
        this.CACHE[key] = val;
      }
      sessionStorage.setItem(ROUTER_SESSION.CACHE, this._btoa(JSON.stringify(this.CACHE)));

    }

  }

  /**
   * remove the data/member fo router cache
   * @Sujun   */
  public removeCacheData(key: string) {
    this.CACHE = JSON.parse(atob(sessionStorage.getItem(ROUTER_SESSION.CACHE)));
    if (key) {
      delete this.CACHE[key];

      sessionStorage.setItem(ROUTER_SESSION.CACHE, this._btoa(JSON.stringify(this.CACHE)));
    }
  }

  /** load page's content 
   * @Sujun **/
  public load(url: string, noNeedUpdate?: boolean) {
    const urlInfo = this._analyzeURL(url);
    let LOCAL_HREF = '?' + this._parseVal();
    if (url === '/login' && LOCAL_HREF.includes('no_login')) {
      LOCAL_HREF = LOCAL_HREF.replace('&no_login=1', '');
    }
    if (this.redirect && urlInfo.ORIG_URL !== this.DEF_PGE_URL) {
      this._switchPage(DEF_PGE_URL, null, noNeedUpdate);
    } else {
      if (this._analyzeURL(LOCAL_HREF).BASE_URL === urlInfo.BASE_URL) {
        this._switchPage('', urlInfo.HASH, noNeedUpdate);
      } else {
        this._switchPage(url, null, noNeedUpdate);
      }
    }
  }

  /** 
   * get the parameter value form the URL according to the input name;
   * @Sujun
   *  **/
  public getParamFormURL(paramName: string, URL: string) {
    const p_name = paramName.replace(/\[]/g, "\\$&");
    const regex = new RegExp(`[?&]${p_name}(=([^&#]*)|&|#|$)`);
    const res = regex.exec(URL);
    if (!res) return null;
    if (!res[2]) return '';
    return decodeURIComponent(res[2].replace(/\+/g, " "));
  }

  // /** 
  //  * remove the port from the request URL;
  //  * @Sujun
  //  *  **/
  // public dealRquestURL(URL: string): string {
  //   const res = '';
  //   const _a = document.createElement('a');
  //   _a.setAttribute('href', URL);
  //   const abs_url = _a.href;
  //   const port = location.port;
  //   return abs_url.replace(`:${port}/`, '/');
  // }

  /** back to the previous router;
   * @Sujun **/

  public back(state?: ROUTER_STATE) {
    const history = this.getCacheData(ROUTER_SESSION.HISTORY);
    const lastState = history.slice(-2).shift();
    this.setCacheData(ROUTER_SESSION.HISTORY, history.slice(0, history.length - 1));
    this._switchPage(history.length > 0 ? lastState.URL.ORIG_URL : this.DEF_PGE_URL, '', false, true);
    // this._switchPage(lastState.URL.BASE_URL || this.DEF_PGE_URL);
    // this._switchPage(state.URL.BASE_URL || this.DEF_PGE_URL);
  }

  public forward(state: ROUTER_STATE, from: ROUTER_STATE) {
    this._switchPage(state.URL.BASE_URL || this.DEF_PGE_URL);
  }

  public dispatch(event: string) {
    var e = new CustomEvent(event, {
      bubbles: true,
      cancelable: true,
    });

    window.dispatchEvent(e);
  };

  public registerNavEvent(DOM_CON?: Element) {
    const con = DOM_CON || document;
    const navItems: NodeListOf<HTMLElement> = con.querySelectorAll('a.nav-item') as NodeListOf<HTMLElement>;
    navItems.forEach((element: HTMLElement) => {
      const classes = element.getAttribute('class');
      const isNavBack = classes && classes.indexOf('back') >= 0;
      const _url = element.getAttribute('href');
      element.onclick = (_event: MouseEvent) => {
        _event.preventDefault();
        if (isNavBack) {
          this.history.back();
        } else if (_url && _url !== '#') {
          this.load(_url);
        }
      };
    });
  };

}

// auto new a router component for the APP; @Sujun
const voxelcloudRouter = new Router();
voxelcloudRouter.registerNavEvent();