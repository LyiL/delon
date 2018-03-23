import {NgModule, ModuleWithProviders} from "@angular/core";
import {AdSimpleTableModule} from "../simple-table";
import {SearchWindowComponent} from "./search-window.component";
import {AlainThemeModule} from "@delon/theme";
import {NzLayoutModule, NzFormModule, NzGridModule, NzInputModule, NzButtonModule} from "ng-zorro-antd";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {SearchInputComponent} from "./search-input.component";

const COMPONENTS = [SearchWindowComponent,SearchInputComponent];
const ENTRY_COMPONENTS = [SearchWindowComponent];
const NZ_IMPORTS = [NzLayoutModule,NzFormModule,NzGridModule,NzInputModule,NzButtonModule];


@NgModule({
    imports:[CommonModule,FormsModule,AdSimpleTableModule,AlainThemeModule.forChild(),...NZ_IMPORTS],
    declarations:[...COMPONENTS],
    exports:[...COMPONENTS],
    entryComponents:[...ENTRY_COMPONENTS]
})
export class AdSearchWinodwModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdSearchWinodwModule, providers: [] };
    }
}
