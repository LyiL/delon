import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NzRadioExtraModule} from "ng-zorro-antd-extra";

import { SimpleTableComponent } from './simple-table.component';
import { SimpleTableRowDirective } from './simple-table-row.directive';
import { SimpleTableConfig } from './simple-table.config';
import {SimpleExpandDirective} from './simple-expand.directive';

const COMPONENTS = [SimpleTableComponent, SimpleTableRowDirective,SimpleExpandDirective];

// region: zorro modules

import { NzTableModule, NzCheckboxModule, NzRadioModule, NzDropDownModule, NzMenuModule, NzPopconfirmModule } from 'ng-zorro-antd';

const ZORROMODULES = [ NzTableModule, NzCheckboxModule, NzRadioModule, NzDropDownModule, NzMenuModule, NzPopconfirmModule,NzRadioExtraModule];

// endregion

@NgModule({
    imports:        [CommonModule, FormsModule, ...ZORROMODULES],
    declarations:   [...COMPONENTS],
    exports:        [...COMPONENTS]
})
export class AdSimpleTableModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdSimpleTableModule, providers: [ SimpleTableConfig ] };
    }
}
