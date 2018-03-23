import {Component} from "@angular/core";
import {DynamicTabs} from "@delon/abc";
import {Tab1Component} from "./tabs/tab1.component";
import {Tab2Component} from "./tabs/tab2.component";
import {Tab3Component} from "./tabs/tab3.component";

@Component({
    selector:'dy-tabs',
    templateUrl:'./dynamic-tabs.component.html'
})
export class DynamicTabsDomeComponent{
    public tabs:Array<DynamicTabs> = [{
        title:'Tab 1',
        content:Tab1Component
    },{
        title:'Tab 2',
        content:Tab2Component
    },{
        title:'Tab 3',
        content:Tab3Component
    }];
}
