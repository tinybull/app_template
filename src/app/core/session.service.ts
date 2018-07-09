import {Inject, Injectable} from '@angular/core';
import {Menu, MenuService, SettingsService} from '@delon/theme';
import {DA_SERVICE_TOKEN, TokenService} from '@delon/auth';
import {Router} from '@angular/router';
import {ReuseTabService} from '@delon/abc';
import {ACLService} from '@delon/acl';

/**
 * 用户登陆后 初始化相关信息
 */
@Injectable()
export class SessionService {

    private _loggedIn: boolean;

    constructor(private menuService: MenuService,
                private router: Router,
                @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
                private acl: ACLService,
                private reuseTabService: ReuseTabService,
                private settings: SettingsService) {
        this.tokenService.change().subscribe((res: any) => {
            console.log('change', JSON.stringify(res));
            this.settings.setUser(res);
        });
    }

    get account() {
        return this.getUserSession().account;
    }

    get orgNo() {
        return this.getUserSession().orgNo;
    }

    get isLoggedIn(): boolean {
        return this._loggedIn;
    }

    getUserSession() {
        return this.settings.user || {};
    }

    setLogin(value: boolean) {
        this._loggedIn = value;
    }

    private _currentPath: Array<Menu> = [];

    set currentPath(param: Array<Menu>) {
        this._currentPath.splice(0, this._currentPath.length);
        this._currentPath.push(...param);
    }

    get token() {
        const tokenModel = this.tokenService.get();
        return tokenModel ? tokenModel.token : '';
    }

    get canRetry(): boolean {
        return !!this.tokenService.get().token;
    }

    set redirect(param: string) {
        this.tokenService.redirect = param;
    }

    get redirect(): string {
        return this.tokenService.redirect;
    }

    get login_url(): string {
        return this.tokenService.login_url;
    }

    getCurrentPath() {
        return this._currentPath;
    }

    parseData(data) {
        const authority_list = (data.authorList || []).map((value: any) => {
            return value.authorNo;
        });
        this.acl.setAbility(authority_list);

        this.menuService.visit((menu: Menu) => {
            menu.acl = menu.serverID;
            // 对首页进行特殊处理
            if (menu.text === '首页') {
                menu.hide = true;
            }
        });
        this.menuService.resume();

        const token = {
            name: data.name,
            account: data.account,
            org: data.org,
            orgName: data.orgName,
            orgNo: data.orgNo,
            roleCatalog: data.roleCatalog,
            email: data.email || '',
            token: data['TokenID'],
        };
        console.log(token);
        this.tokenService.set(token);
        this._loggedIn = true;
    }

    logout() {
        this.tokenService.clear();
        this.reuseTabService.clear();
        this._loggedIn = false;
        this.router.navigateByUrl(this.tokenService.login_url);
    }

    clear() {
        this.tokenService.clear();
        this.reuseTabService.clear();
        this._loggedIn = false;
    }
}

