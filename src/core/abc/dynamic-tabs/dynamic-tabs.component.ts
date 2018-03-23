import {
    Component,
    Input,
    QueryList,
    ViewContainerRef,
    ViewChildren,
    ComponentFactoryResolver,
    Renderer2,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    OnDestroy,
    OnInit
} from "@angular/core";
import {DynamicTabs} from "./dynamic-tabs.config";
import {Subscription} from "rxjs/Subscription";
import {DynamicTabsService} from "./dynamic-tabs.service";
import {timer} from "rxjs/observable/timer";

@Component({
    selector:'dynamic-tabs',
    templateUrl:'./dynamic-tabs.component.html'
})
export class DynamicTabsComponent implements OnInit, OnDestroy{
    @Input()
    get tabs():Array<DynamicTabs>{
        return this._tabs;
    }
    set tabs(_tabs:Array<DynamicTabs>){
        this._tabs = _tabs;
    }
    private _tabs:Array<DynamicTabs>;

    @Input()
    public tabPosition:'top'|'left'|'right'|'bottom'='top';

    @Input()
    public tabType:'line' | 'card' = 'line';

    private timerSub:Subscription;

    @Input()
    get selectedIndex():number{
        return this._selectedIndex;
    }
    set selectedIndex(_selectedIndex:number){
        if(_selectedIndex == 0 && this.dynaminTabsService.getLoadComponents().length == 0){
            this.timerSub = timer(200).subscribe(()=>{
                this.render(this.tabs[this.selectedIndex]['content']);
            });
        }
        if(_selectedIndex != this._selectedIndex){
            this._selectedIndex = _selectedIndex;
        }
        this.changeDetectorRef.detectChanges();
    }
    private _selectedIndex:number = 0;

    @Output()
    public tabsetSelectChange:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public tabSelect:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public tabClick:EventEmitter<any> = new EventEmitter<any>();
    @Output()
    public tabDeSelect:EventEmitter<any> = new EventEmitter<any>();

    @ViewChildren('tabContent', { read: ViewContainerRef }) tabContent: QueryList<any>;


    constructor(private resolver: ComponentFactoryResolver,private render2:Renderer2,private dynaminTabsService:DynamicTabsService,
                private changeDetectorRef:ChangeDetectorRef){
        dynaminTabsService.init();
    }

    ngOnInit(){
        this.selectedIndex = 0;
        //监听刷新事件
        this.dynaminTabsService.refreshSubject.subscribe((index:number)=>{
            this.render(this.tabs[index]['content'],index);
        });
    }

    onTabsetSelectChange(event:any){
        if(this.dynaminTabsService.getLoadComponents().length != 0 && !this.dynaminTabsService.getLoadCompontByIndex(this.selectedIndex)){
            this.render(this.tabs[this.selectedIndex]['content']);
        }
        this.tabsetSelectChange.emit(event);
    }

    onSelect(tab:any){
        this.tabSelect.emit(tab);
    }

    onClick(tab:any){
        this.tabClick.emit(tab);
    }

    onDeSelect(tab:any){
        this.tabDeSelect.emit(tab);
    }

    private render(content:any,index:number|undefined=undefined){
        let target:any = this.getDynamicTarget(index);
        if(typeof content == 'string'){
            let nativeEl = target.element.nativeElement;
            let pEl = nativeEl.parentElement;
            if(pEl){
                let removeNode = pEl.getElementsByClassName('tab-content-html')[0];
                if(!!removeNode){
                    pEl.removeChild(removeNode);
                }
            }

            let div = this.render2.createElement('div');
            div.setAttribute('class','tab-content-html');
            div.innerHTML = content;
            this.render2.insertBefore(nativeEl.parentElement,div,nativeEl);
        }else{
            target.clear();
            const componentFactory = this.resolver.resolveComponentFactory(content);
            let component = target.createComponent(componentFactory);
            let instance = component.instance;
            Object['assign'](instance,this.tabs[this.selectedIndex].options);
            this.dynaminTabsService.setLoadComponents(this.selectedIndex,{component:component,instance:instance});
        }
    }

    /**
     * 获取tab内容容器
     * @param index
     * @returns {QueryList<any>|undefined|any}
     */
    private getDynamicTarget(index:number|undefined=undefined):any{
        return this.tabContent && this.tabContent.find((item:any,ind:number)=>{
                //如果外部转入了容器下标，返回对应下标容器，否则返回当前面板容器
                return (index === undefined && this.selectedIndex == ind) || (index !== undefined && index == ind);
            });
    }

    ngOnDestroy(){
        if(this.dynaminTabsService.getLoadComponents().length > 0){
            this.dynaminTabsService.destoryAll();
        }
        if(this.timerSub){
            this.timerSub.unsubscribe();
        }
    }
}
