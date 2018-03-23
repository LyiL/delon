import {NgModule, ModuleWithProviders} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FileUploadComponent} from "./file-upload.component";
import {FileUploadSelectDirective} from "./file-upload-select.directive";
import {FileUploadDropDirective} from "./file-upload-drop.directive";
import {AdClickStopModule} from "../click-stop";
import {FileConfig} from "./file-config";
import {AdImagePreviewModule} from "../image-preview";

const COMPONENTS = [FileUploadComponent,FileUploadSelectDirective,FileUploadDropDirective];

@NgModule({
    imports:[CommonModule,FormsModule,AdClickStopModule.forRoot(),AdImagePreviewModule.forRoot()],
    declarations:[...COMPONENTS],
    exports:[...COMPONENTS]
})
export class AdFileUploadModule{
    static forRoot(): ModuleWithProviders {
        return { ngModule: AdFileUploadModule, providers: [FileConfig] };
    }
}
