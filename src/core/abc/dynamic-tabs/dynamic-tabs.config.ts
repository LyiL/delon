import {ComponentRef} from "@angular/core";
export interface DynamicTabs{
    title:string;
    content:any;
    options?:any;
    disabled?:boolean;
}

export interface DynamicTabComponents{
    component:any;
    instance:any;
}
