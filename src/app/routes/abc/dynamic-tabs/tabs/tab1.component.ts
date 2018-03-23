import {Component, OnInit} from "@angular/core";
import {DynamicTabsService} from "@delon/abc";
@Component({
    selector:'tab1',
    template:`Tab1 Content...<a (click)="onClick()">添加</a>`
})
export class Tab1Component implements OnInit{

    public params:any = {a:1,b:'b'};

    constructor(private dynaimicTabsService:DynamicTabsService){}

    ngOnInit(){
        console.log('tab1 component...',this.dynaimicTabsService.getLoadComponents());
    }

    onClick(){
        this.params['a']++;
    }
}
