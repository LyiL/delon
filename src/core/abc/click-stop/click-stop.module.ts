import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ClickStopDirective} from "./click-stop.directive";

const DIRECTIVES = [ClickStopDirective];

@NgModule({
    imports:        [CommonModule],
    declarations:   [...DIRECTIVES],
    exports:        [...DIRECTIVES]
})
export class AdClickStopModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdClickStopModule, providers: [ ] };
    }
}
