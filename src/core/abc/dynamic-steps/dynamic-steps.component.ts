import {
    Component, Input, ViewChild, ViewContainerRef, ComponentFactoryResolver, OnDestroy,
    OnInit
} from "@angular/core";
import {StepConfig} from "./dynamic-steps.config";
import {DynamicStepsService} from "./dynamic-steps.service";

@Component({
    selector:'dynamic-steps',
    templateUrl:'./dynamic-steps.component.html'
})
export class DynamicStepsComponent implements OnInit, OnDestroy{
    @Input()
    get dyCurrent():number{
        return this._dyCurrent;
    }
    set dyCurrent(_dyCurrent:number){
        console.log('set dyCurrent..',_dyCurrent,'this._dyCurrent',this._dyCurrent);
        if(this._dyCurrent != _dyCurrent){
            this._dyCurrent = _dyCurrent;
            this.render();
        }
    }
    private _dyCurrent:number = -1;

    @Input()
    public steps:Array<StepConfig> = [];
    @Input()
    public defOptions:any;

    @ViewChild('stepContent',{read:ViewContainerRef}) stepContent:any;

    constructor(private resolver: ComponentFactoryResolver,private dynamicStepsService:DynamicStepsService){
        this.dynamicStepsService.destroyAll();
    }

    ngOnInit(){
        this.dyCurrent = 0;
        this.dynamicStepsService.stepSubject.subscribe((res:any)=>{
           if(typeof res === 'boolean'){
               if(res === true && this.dyCurrent < this.steps.length){
                   this.dyCurrent+=1;
               }else if(!res && this.dyCurrent > 0){
                   this.dyCurrent-=1;
               }
           }else{
               this.dyCurrent = Number(res);
           }
        });
    }

    render(){
        this.stepContent.clear();
        let step = this.steps[this.dyCurrent];
        const factory = this.resolver.resolveComponentFactory(step.content);
        let component = this.stepContent.createComponent(factory);
        let instance = component.instance;
        Object['assign'](instance,this.defOptions||{});
        Object['assign'](instance,step.options||{});
        this.dynamicStepsService.setSteps(this.dyCurrent,{component:component,instance:instance});
    }

    ngOnDestroy(){
        this.dynamicStepsService.destroyAll();
    }
}
