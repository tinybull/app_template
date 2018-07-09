import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {MenuDefineComponent} from './define/menu-define.component';


@NgModule({
    imports: [
        SharedModule,
    ],
    declarations: [
        MenuDefineComponent,
    ],
    entryComponents: [
        MenuDefineComponent
    ]
})
export class MenuModule {

}
