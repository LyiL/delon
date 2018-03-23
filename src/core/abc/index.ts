import { NgModule, ModuleWithProviders } from '@angular/core';

// region: all modules
import { AdErrorCollectModule } from './error-collect/error-collect.module';
import { AdFooterToolbarModule } from './footer-toolbar/footer-toolbar.module';
import { AdSidebarNavModule } from './sidebar-nav/sidebar-nav.module';
import { AdDownFileModule } from './down-file/down-file.module';
import { AdImageModule } from './image/image.module';
import { AdAvatarListModule } from './avatar-list/avatar-list.module';
import { AdDescListModule } from './desc-list/desc-list.module';
import { AdEllipsisModule } from './ellipsis/ellipsis.module';
import { AdGlobalFooterModule } from './global-footer/global-footer.module';
import { AdExceptionModule } from './exception/exception.module';
import { AdNoticeIconModule } from './notice-icon/notice-icon.module';
import { AdNumberInfoModule } from './number-info/number-info.module';
import { AdProHeaderModule } from './pro-header/pro-header.module';
import { AdResultModule } from './result/result.module';
import { AdStandardFormRowModule } from './standard-form-row/standard-form-row.module';
import { AdTagSelectModule } from './tag-select/tag-select.module';
import { AdTrendModule } from './trend/trend.module';
import { AdUtilsModule } from './utils/utils.module';
import { AdChartsModule } from './charts/charts.module';
import { AdCountDownModule } from './count-down/count-down.module';
import { AdSimpleTableModule } from './simple-table/simple-table.module';
import { AdReuseTabModule } from './reuse-tab/reuse-tab.module';
import { AdFullContentModule } from './full-content/full-content.module';
import { AdXlsxModule } from './xlsx/xlsx.module';
import { AdZipModule } from './zip/zip.module';
import {AdSearchWinodwModule} from "./search-window/search-window.module";
import {AdImagePreviewModule} from "./image-preview/image-preview.module";
import {AdDynamicTabsModule} from "./dynamic-tabs";
import {AdDynamicStepsModule} from "./dynamic-steps";
import {AdFileUploadModule} from "./file-upload";
import {AdClickStopModule} from "./click-stop";

const MODULES = [
    AdErrorCollectModule, AdFooterToolbarModule, AdSidebarNavModule, AdDownFileModule, AdImageModule,
    AdAvatarListModule, AdDescListModule, AdEllipsisModule, AdGlobalFooterModule, AdExceptionModule,
    AdNoticeIconModule, AdNumberInfoModule, AdProHeaderModule, AdResultModule, AdStandardFormRowModule,
    AdTagSelectModule, AdTrendModule, AdUtilsModule, AdChartsModule, AdCountDownModule, AdSimpleTableModule,
    AdReuseTabModule, AdFullContentModule, AdXlsxModule, AdZipModule,AdReuseTabModule,AdSearchWinodwModule,
    AdImagePreviewModule,AdDynamicTabsModule,AdDynamicStepsModule,AdFileUploadModule,AdClickStopModule
];

// endregion

// region: export

export * from './error-collect';
export * from './footer-toolbar';
export * from './sidebar-nav';
export * from './down-file';
export * from './image';
export * from './avatar-list';
export * from './desc-list';
export * from './ellipsis';
export * from './global-footer';
export * from './exception';
export * from './notice-icon';
export * from './number-info';
export * from './pro-header';
export * from './result';
export * from './standard-form-row';
export * from './tag-select';
export * from './trend';
export * from './utils';
export * from './charts';
export * from './count-down';
export * from './simple-table';
export * from './reuse-tab';
export * from './full-content';
export * from './xlsx';
export * from './zip';
export * from './search-window';
export * from './image-preview';
export * from './dynamic-tabs';
export * from './dynamic-steps';
export * from './file-upload';
export * from './click-stop';

// endregion

@NgModule({
    imports: [
        AdErrorCollectModule.forRoot(), AdFooterToolbarModule.forRoot(), AdSidebarNavModule.forRoot(), AdDownFileModule.forRoot(), AdImageModule.forRoot(),
        AdAvatarListModule.forRoot(), AdDescListModule.forRoot(), AdEllipsisModule.forRoot(), AdExceptionModule.forRoot(), AdExceptionModule.forRoot(),
        AdNoticeIconModule.forRoot(), AdNumberInfoModule.forRoot(), AdProHeaderModule.forRoot(), AdResultModule.forRoot(), AdStandardFormRowModule.forRoot(),
        AdTagSelectModule.forRoot(), AdTrendModule.forRoot(), AdUtilsModule.forRoot(), AdChartsModule.forRoot(), AdCountDownModule.forRoot(), AdSimpleTableModule.forRoot(),
        AdReuseTabModule.forRoot(), AdFullContentModule.forRoot(), AdXlsxModule.forRoot(), AdZipModule.forRoot(),AdSearchWinodwModule.forRoot(),AdImagePreviewModule.forRoot(),
        AdDynamicTabsModule.forRoot(),AdDynamicStepsModule.forRoot(),AdFileUploadModule.forRoot(),AdClickStopModule.forRoot()
    ],
    exports: MODULES
})
export class AlainABCRootModule {
}

@NgModule({ exports: MODULES })
export class AlainABCModule {
    public static forRoot(): ModuleWithProviders {
        return { ngModule: AlainABCRootModule };
    }
}
