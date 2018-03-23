import { Component } from '@angular/core';
import { ReuseTabService } from '@delon/abc';

@Component({
    selector: 'app-reuse-tab',
    templateUrl: './reuse-tab.component.html'
})
export class DemoReuseTabComponent {
    value = 'reuse-tab';
    linenceImg:string = "";
    constructor(private srv: ReuseTabService) {}

    ngOnInit() {
        this.srv.title = 'reuse';
    }

    public  defFieldUploadSetting:any = {
        fileSuffix:'.jpg;.jpeg;.png;.gif;'
    };

    public onFileUploadError(err){
        console.log(err);
    }
}

