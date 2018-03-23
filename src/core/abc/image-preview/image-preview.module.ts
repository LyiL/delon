import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ImagePreviewComponent} from "./image-preview.component";

@NgModule({
    imports:[CommonModule],
    declarations:[ImagePreviewComponent],
    exports:[ImagePreviewComponent]
})
export class AdImagePreviewModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdImagePreviewModule, providers: [] };
    }
}
