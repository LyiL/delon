import {Injectable} from "@angular/core";
import {StepDynamiComponent} from "./dynamic-steps.config";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DynamicStepsService{
    private _steps:Array<StepDynamiComponent> = [];
    public stepSubject:Subject<any> = new Subject<any>();

    setSteps(index:number,step:StepDynamiComponent){
        if(this._steps[index]){
            this._steps[index].component['destroy']();
        }
        this._steps[index] = step;
    }

    getStepByInstance(index:number){
        return this._steps[index] && this._steps[index].instance
    }

    destroyAll(){
        for(let i=0; i<this._steps.length; i++){
            this._steps[i] && this._steps[i].component['destroy']();
        }
        this._steps.splice(0,this._steps.length);
    }

    /**
     * 上一步
     */
    prevStep(){
        this.stepSubject.next(false);
    }

    /**
     * 下一步
     */
    nextStep(){
        this.stepSubject.next(true);
    }

    /**
     * 跳转
     * @param step
     */
    goStep(step:number){
        this.stepSubject.next(step);
    }
}
