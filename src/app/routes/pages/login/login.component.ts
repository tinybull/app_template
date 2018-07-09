import {Router} from '@angular/router';
import {Component} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {SettingsService} from '@delon/theme';
import {LoginService} from "./login.service";
import {Md5} from 'ts-md5';

@Component({
    selector: 'app-pages-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    valForm: FormGroup;

    constructor(public settings: SettingsService,
                fb: FormBuilder,
                private loginService: LoginService,
                private router: Router) {
        this.valForm = fb.group({
            // email: [null, Validators.compose([Validators.required, Validators.email])],
            userNo: [null, Validators.required],
            password: [null, Validators.required],
            remember_me: [null]
        });
    }

    submit() {
        // tslint:disable-next-line:forin
        for (const i in this.valForm.controls) {
            this.valForm.controls[i].markAsDirty();
        }

        console.log(this.valForm.value);

        if (this.valForm.valid) {
            console.log('Valid!');
            console.log(this.valForm.value);
            console.log(Md5.hashStr(this.valForm.controls.password.value).toString());

            const params = {
                userNo: this.valForm.controls.userNo.value,
                password: Md5.hashStr(this.valForm.controls.password.value).toString(),
            };

            console.log(params);


            // this.loginService.login({})
            //     .subscribe(
            //         data => {
            //             // this.loading = false;
            //             console.log('登录信息：', data);
            //             switch (data.retCode) {
            //                 // case RET_CODE.PSW_FIRST:
            //                 case '000FL':
            //                     // this.session.parseData(data);
            //                     this.router.navigate(['password']);
            //                     break;
            //                 // case RET_CODE.SUCCESS:
            //                 case '00000':
            //                     this.router.navigate([this.tokenService.redirect || '/']);
            //                     break;
            //                 default :
            //                     console.log('未知错误！');
            //                     break;
            //             }
            //
            //         },
            //         error => {
            //         }
            //     );
            // this.router.navigate(['dashboard']);
        }
    }
}
