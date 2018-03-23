import {Injectable, ComponentRef} from "@angular/core";
import {DynamicTabComponents} from "./dynamic-tabs.config";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DynamicTabsService{
    private _loadComponents:Array<DynamicTabComponents> = [];
    public refreshSubject:Subject<number> = new Subject<number>();

    init(){
        this.destoryAll();
        this._loadComponents.splice(0,this._loadComponents.length);
    }

    /**
     * 设置Tabs中加载的组件
     * @param index 下标
     * @param component 组件
     */
    setLoadComponents(index:number,component:DynamicTabComponents){
        this._loadComponents[index] = component;
    }

    /**
     * 获取Tabs中加载的组件
     * @returns {Array<DynamicTabComponents>}
     */
    getLoadComponents(){
        return this._loadComponents;
    }

    /**
     * 通过下标获取Tabs中的组件
     * @param index 下标
     * @returns {DynamicTabComponents}
     */
    getLoadCompontByIndex(index:number){
        return this._loadComponents[index];
    }

    /**
     * 通过下标获取Tabs中组件的实例
     * @param index 下标
     * @returns {any} 组件实例
     */
    getComponentInstanceByIndex(index:number):ComponentRef<any>{
        return this._loadComponents[index] && this._loadComponents[index].instance;
    }

    /**
     * 通过下标刷新tab页内容
     * @param index
     */
    refreshByIndex(index:number){
        this.destoryByIndex(index);
        this.refreshSubject.next(index);
    }

    /**
     * 销毁所有子组件
     */
    destoryAll(){
        for(let i=0; i<this._loadComponents.length; i++){
            this._loadComponents[i] && this._loadComponents[i].component && this._loadComponents[i].component['destroy']();
        }
    }

    /**
     * 销毁对应下标的子组件
     * @param index 下标
     */
    private destoryByIndex(index:number){
        this._loadComponents[index] && this._loadComponents[index].component['destroy']();
    }
}
