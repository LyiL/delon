import {Component, OnInit} from "@angular/core";
import {DynamicTabsService} from "@delon/abc";
@Component({
    selector:'tab3',
    template:`Tab3 Content...<a (click)="onClick()">显示Tab1 的数据</a>`
})
export class Tab3Component implements OnInit{

    constructor(private dynaimicTabsService:DynamicTabsService){}

    ngOnInit(){
        console.log('tab3 component...',this.dynaimicTabsService.getComponentInstanceByIndex(0),this.dynaimicTabsService.getComponentInstanceByIndex(1));
    }

    onClick(){
        let tab1 = this.dynaimicTabsService.getComponentInstanceByIndex(0)
        console.log(tab1['params']);
    }
}
