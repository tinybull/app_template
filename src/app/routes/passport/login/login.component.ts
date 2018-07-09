import {SettingsService} from '@delon/theme';
import {Component, OnDestroy, Inject, Optional} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NzMessageService} from 'ng-zorro-antd';
import {ITokenService, DA_SERVICE_TOKEN} from '@delon/auth';
import {ReuseTabService} from '@delon/abc';
// import {LoginService} from "./login.service";
import {Md5} from 'ts-md5';
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.less'],
    providers: []
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    loading = false;

    constructor(fb: FormBuilder,
                private router: Router,
                private http: HttpClient,
                public msg: NzMessageService,
                private settingsService: SettingsService,
                // private loginService: LoginService,
                @Optional() @Inject(ReuseTabService) private reuseTabService: ReuseTabService,
                @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {
        this.form = fb.group({
            userNo: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required],
        });

        // this.http.post('system/newLogin', {userNo: 'ccliu', password: 'fuck'})
        //     .subscribe(data => {
        //         console.log(data);
        //     });
    }

    get userNo() {
        return this.form.controls.userNo;
    }

    get password() {
        return this.form.controls.password;
    }


    submit() {
        this.error = '';

        for (const i in this.form.controls) {
            if (this.form.controls[i]) {
                this.form.controls[i].markAsDirty();
            }
        }

        if (this.form.invalid) {
            return;
        }

        console.log(this.form.value);

        const params = {
            userNo: this.form.controls.userNo.value,
            password: Md5.hashStr(this.form.controls.password.value).toString()
        };
        console.log(params);
        // console.log(this.loginService);
        //
        this.http.post('system/newLogin', params)
            .subscribe(data => {
                console.log(data);
                this.router.navigate(['/']);
            });
        // this.loginService.login(params)
        //     .subscribe(data => {
        //         console.log(data);
        //     });

        // mock http
        // this.loading = true;
        // setTimeout(() => {
        //     this.loading = false;
        //
        //     // 清空路由复用信息
        //     this.reuseTabService.clear();
        //     this.tokenService.set({
        //         token: '123456789',
        //         name: this.userName.value,
        //         email: `cipchk@qq.com`,
        //         id: 10000,
        //         time: +new Date
        //     });
        //     this.router.navigate(['/']);
        // }, 1000);
    }

    ngOnDestroy(): void {
        // if (this.interval$) clearInterval(this.interval$);
    }
}
