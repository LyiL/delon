import {NgModule, ModuleWithProviders} from "@angular/core";
import {DynamicStepsService} from "./dynamic-steps.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {DynamicStepsComponent} from "./dynamic-steps.component";
import {NzStepsModule} from "ng-zorro-antd";

const NZ_IMPORTS = [NzStepsModule];
const COMPONENTS = [DynamicStepsComponent];

@NgModule({
    imports:[CommonModule, FormsModule,...NZ_IMPORTS],
    declarations:[...COMPONENTS],
    exports:[...COMPONENTS],
})
export class AdDynamicStepsModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdDynamicStepsModule, providers: [DynamicStepsService] };
    }
}
