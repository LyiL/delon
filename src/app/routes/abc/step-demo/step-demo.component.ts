import {Component} from "@angular/core";
import {Step1Component} from "./step/step1.component";
import {Step2Component} from "./step/step2.component";
import {Step3Component} from "./step/step3.component";
import {TransferService} from "./transfer.service";
@Component({
    selector:'step-demo',
    templateUrl:'./step-demo.component.html',
    providers:[TransferService]
})
export class StepDemoComponent{
    public current:number = 0;

    public steps:Array<any> = [{
        title:'Finished',
        content:Step1Component
    },{
        title:'In Progress',
        content:Step2Component
    },{
        title:' Waiting',
        content:Step3Component
    }];
}
