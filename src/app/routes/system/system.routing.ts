import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MenuDefineComponent} from './menu/define/menu-define.component';

const routes: Routes = [
    {
        path: 'menuDefine',
        component: MenuDefineComponent,
        data: {text: '菜单定义'}
    }
];

export const SystemRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
