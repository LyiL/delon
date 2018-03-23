import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {NzTabsModule} from "ng-zorro-antd";
import {DynamicTabsComponent} from "./dynamic-tabs.component";
import {FormsModule} from "@angular/forms";
import {DynamicTabsService} from "./dynamic-tabs.service";

const NZ_IMPORTS = [NzTabsModule];
const COMPONENTS = [DynamicTabsComponent];

@NgModule({
    imports:[CommonModule, FormsModule,...NZ_IMPORTS],
    declarations:[...COMPONENTS],
    exports:[...COMPONENTS],
})
export class AdDynamicTabsModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdDynamicTabsModule, providers: [DynamicTabsService] };
    }
}
