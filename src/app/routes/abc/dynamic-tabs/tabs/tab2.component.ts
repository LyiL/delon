import {Component, OnInit} from "@angular/core";
import {DynamicTabsService} from "@delon/abc";
@Component({
    selector:'tab2',
    template:`Tab2 Content...`
})
export class Tab2Component implements OnInit{

    constructor(private dynaimicTabsService:DynamicTabsService){}

    ngOnInit(){
        console.log('tab2 component...',this.dynaimicTabsService.getComponentInstanceByIndex(0),this.dynaimicTabsService.getComponentInstanceByIndex(2));
    }
}
