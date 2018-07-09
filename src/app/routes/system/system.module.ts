import {NgModule} from '@angular/core';
import {SystemRoutingModule} from './system.routing';
import {MenuModule} from "./menu/menu.module";
import {SysMenuService} from "./menu/menu.service";


@NgModule({
    imports: [
        MenuModule,
        SystemRoutingModule
    ],
    providers: [
        SysMenuService
    ]
})
export class SystemModule {
    constructor() {
    }
}
