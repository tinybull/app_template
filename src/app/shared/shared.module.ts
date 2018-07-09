import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
// delon
import {NgZorroAntdExtraModule} from 'ng-zorro-antd-extra';
import {AlainThemeModule} from '@delon/theme';
import {AlainACLModule} from '@delon/acl';
import {ZORROMODULES, ABCMODULES} from '../delon.module';
// i18n
import {TranslateModule} from '@ngx-translate/core';

// third libs
import {CountdownModule} from 'ngx-countdown';
import {UEditorModule} from 'ngx-ueditor';
import {NgxTinymceModule} from 'ngx-tinymce';
import {NzSchemaFormModule} from 'nz-schema-form';
import {ContextMenuModule} from "ngx-contextmenu";
import {AngularSplitModule} from "angular-split";
import {TreeModule} from "angular-tree-component";
import {NzTreeModule} from "ng-tree-antd";

// your components & directives
import {AceEditorDirective} from "@shared/directives/ace-editor.directive";

// region: third libs
const THIRDMODULES = [
    CountdownModule,
    UEditorModule,
    NgxTinymceModule,
    NzSchemaFormModule,
    AngularSplitModule,
    TreeModule,
    NzTreeModule,
    ContextMenuModule
];
// endregion

// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [
    AceEditorDirective
];

// endregion

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule.forChild(),
        ...ABCMODULES,
        AlainACLModule,
        // third libs
        ...THIRDMODULES,
        ContextMenuModule.forRoot({
            autoFocus: false
        })
    ],
    declarations: [
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ...ZORROMODULES,
        NgZorroAntdExtraModule,
        AlainThemeModule,
        ...ABCMODULES,
        AlainACLModule,
        // i18n
        TranslateModule,
        // third libs
        ...THIRDMODULES,
        // your components
        ...COMPONENTS,
        ...DIRECTIVES
    ]
})
export class SharedModule {
}
