enum LOGIN_CLASSES {
    BG = 'bg bg-login',
    FOCUS = 'login-inp focus',
    UNFOCUS = 'login-inp',
    PWD_FOCUS = 'login-pwd-inp focus',
    PWD_UNFOCUS = 'login-pwd-inp',
    SHOW_PWD='btn-switch-pw-mode iconfont icon-ic_remove_red_eye_',
    HIDE_PWD='btn-switch-pw-mode iconfont icon-ic_visibility_off_',
}
enum LOGIN_CON_MODE {
    USER_ID = 'INP_ID',
    USER_PWD = 'INP_PWD'
}
enum LOGIN_KEYS {
    LOGIN = 'TE9HSU5fSU5GTw'
}
interface LOGIN_RES {
    user_id: string;
    doctor_url: string;
    active_url: string;
}
/** init for login controller, setting the default state and value
 * @Sujun **/
const login_init = () => {
    const $bg = document.getElementById('bg');
    const $mainCon = document.getElementById('main-con');
    const $loginCon = document.getElementById('login-con');
    const $loginMainCon = $loginCon.querySelector('.login-main-con');
    const $userInp = $loginMainCon.querySelector('input.login-inp') as HTMLInputElement;
    const $switchPWBtn = $loginMainCon.querySelector('i.btn-switch-pw-mode') as HTMLElement;
    const $pwdInp = $loginMainCon.querySelector('input.login-pwd-inp') as HTMLInputElement;
    const $nexBtn = $loginMainCon.querySelector('div.btn-next-step');
    const $loginBtn = $loginMainCon.querySelector('div.btn-login');
    $mainCon.querySelector('div.header-shadow').setAttribute('style', 'display:none');
    $mainCon.querySelector('div#header-shadow-mask').setAttribute('style', 'display:none');
    $bg.setAttribute('class', LOGIN_CLASSES.BG);
    let switchNoOnBlur = false;
    $switchPWBtn.addEventListener('touchend', (event) => {
        $pwdInp.setAttribute('type', $pwdInp.getAttribute('type') === 'text' ? 'password' : 'text');
        switchNoOnBlur = true;
        $pwdInp.focus();
        $switchPWBtn.setAttribute('class', $pwdInp.getAttribute('type') === 'text' ? LOGIN_CLASSES.HIDE_PWD : LOGIN_CLASSES.SHOW_PWD);
        $switchPWBtn.setAttribute('focus', 'true');
        event.stopPropagation();
    });

    $userInp.addEventListener('touchend', (event) => {
        $userInp.setAttribute('class', LOGIN_CLASSES.FOCUS);
        event.stopPropagation();
    });

    $pwdInp.addEventListener('touchend', (event) => {
        $pwdInp.setAttribute('class', LOGIN_CLASSES.PWD_FOCUS);
        $switchPWBtn.setAttribute('focus', 'true');
        event.stopPropagation();
    });

    $userInp.addEventListener('input', (event) => {
        $loginMainCon.setAttribute('invalid', 'false');
        $nexBtn.setAttribute('active', $userInp.value ? 'true' : 'false');
        event.stopPropagation();
    });

    $pwdInp.addEventListener('input', (event) => {
        $pwdInp.focus();
        $loginMainCon.setAttribute('invalid', 'false');
        $switchPWBtn.setAttribute('show', $pwdInp.value ? 'true' : 'false');
        $loginBtn.setAttribute('active', $pwdInp.value ? 'true' : 'false');
        event.stopPropagation();
    });

    $userInp.addEventListener('blur', (event) => {
        $userInp.setAttribute('class', LOGIN_CLASSES.UNFOCUS);
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
        event.stopPropagation();
    });

    $pwdInp.addEventListener('blur', (event) => {
        if(!switchNoOnBlur){
            $pwdInp.setAttribute('class', LOGIN_CLASSES.PWD_UNFOCUS);
            $switchPWBtn.setAttribute('focus', 'false');
        }else{
            $pwdInp.focus();
        }
        switchNoOnBlur = false;
        setTimeout(function () {
            var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
            window.scrollTo(0, Math.max(scrollHeight - 1, 0));
        }, 100);
        event.stopPropagation();
    });

    $nexBtn.addEventListener('touchend', (event) => {
        const openID = voxelcloudRouter.getCacheData('OPEN_ID');
        if ($userInp.value) {
            login($userInp.value, openID, null, () => {
                $loginMainCon.setAttribute('mode', LOGIN_CON_MODE.USER_PWD);
            }, (res: any) => {
                $loginMainCon.setAttribute('invalid', 'true');
            });
        }
        event.stopPropagation();
    });
    $loginBtn.addEventListener('touchend', (event) => {
        const openID = voxelcloudRouter.getCacheData('OPEN_ID');
        if ($userInp.value && $pwdInp.value) {
            login($userInp.value, openID, $pwdInp.value, (res: LOGIN_RES) => {
                voxelcloudRouter.setCacheData(LOGIN_KEYS.LOGIN, { userid: res.user_id || '', status: "logged" });
                voxelcloudDataModel.setPropertyContext('/dr_url', res.doctor_url);
                voxelcloudRouter.setCacheData('DR_URL', res.doctor_url);
                voxelcloudRouter.load('/home');
            }, (res: any) => {
                $loginMainCon.setAttribute('invalid', 'true');
            })
        }
        event.stopPropagation();
    });
};

/** add event listener for the router complete (url: '/login')
 * @Sujun **/
window.addEventListener('pageAnimationEnd', () => {
    const routerInfo = voxelcloudRouter.getCurrentRouter();
    if (routerInfo && routerInfo.URL && routerInfo.URL.BASE_URL === '/login') {
        login_init();
    }
});