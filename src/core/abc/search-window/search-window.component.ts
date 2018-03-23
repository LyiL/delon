import {Component, OnInit, ViewChild, OnDestroy} from "@angular/core";
import {Field} from "./search-window.config";
import {SimpleTableComponent, SimpleTableColumn} from "../simple-table";
import {NzModalSubject} from "ng-zorro-antd";

@Component({
    selector:'search-win',
    templateUrl:'./search-window.component.html'
})
export class SearchWindowComponent implements OnInit, OnDestroy{
    public dynamicForm:any = {};//查询表单
    public searchFieldColWidth:number = 12;
    @ViewChild('searchTable') searchTable:SimpleTableComponent;
    /**
     * 窗体标题
     */
    public title:string;
    /**
     * 查询按钮label
     * @type {string}
     */
    public btnLable:string = '查询';
    /**
     * 查询字段
     */
    public searchFields:Field[] = [];
    /**
     * 请求地址
     */
    public url:string;
    /**
     * 请求方法，默认post
     * @type {string}
     */
    public reqMehtod:string = 'post';
    /**
     * 请求参数
     */
    public params:any = {};
    /**
     * HTTP请求类
     */
    public http:any;

    /**
     * 表格字段
     */
    public tableColumns:SimpleTableColumn[];
    /**
     * 是否多选
     * @type {boolean}
     */
    public isMultiSelect:boolean = false;
    /**
     * 是否默认查询
     * @type {boolean}
     */
    public isAjax:boolean = false;
    /**
     * 查询结果数据字段
     */
    get resReName(){
        return this._resReName;
    }
    set resReName(_resReName:any){
        this._resReName = _resReName;
    }
    private _resReName:any = {list:'data.innerData'};

    public reqReName:any = {pi:'currentIndex',ps:'pageSize'};

    constructor(private subject: NzModalSubject){}

    ngOnInit(){
        this.calcSearchFieldColLayoutMoiety();
        this.createForm(this.searchFields);
    }

    ngOnDestroy(){
        this.close();
    }

    onSearch(){
        Object['assign'](this.params,this.dynamicForm);
        this.searchTable.doSearch();
    }

    _onRowDBLClick(args:any){
        if(!this.isMultiSelect){
            this.subject.next(args['data']);
            this.close();
        }
    }

    /**
     * 计算查询字段布局
     */
    private calcSearchFieldColLayoutMoiety(){
        this.searchFieldColWidth = Math.floor((24 - 4) / this.searchFields.length);
    }

    /**
     * 转义查询|表格字段的label与placeHolder
     */
    private createForm(fields:Field[]){
        fields.forEach((field,index)=>{
           this.dynamicForm[field.field] = '';
        });
    }

    private close(){
        this.subject.destroy();
    }
}
