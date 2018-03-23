import {SimpleTableColumn} from "../simple-table";

/**
 * 查询窗体面板
 */
export interface SearchWindowConfig{
    /**
     * 窗体标题
     */
    title:string;
    /**
     * 查询字段
     */
    searchFields:Array<Field>;
    /**
     * 请求地址
     */
    url:string;
    /**
     * 请求方法
     */
    reqMehtod?:string;
    /**
     * 请求参数
     */
    params?:any;
    /**
     * HTTP请求类
     */
    http?:any;
    /**
     * 表格字段
     */
    tableColumns:Array<SimpleTableColumn>;
    /**
     * 是否多选
     * @type {boolean}
     */
    isMultiSelect?:boolean;
    /**
     * 是否默认查询
     * @type {boolean}
     */
    isAjax?:boolean;
    /**
     * 查询结果数据字段
     */
    resReName:any;
    /**
     * 请求数据字段
     */
    reqReName:any;
}
/**
 * 查询条件字段
 */
export interface Field{
    /**
     * 字段
     */
    field:string;
    /**
     * 显示名称
     */
    label:string;
    /**
     * 输入框提示
     */
    placeHolder?:string;
    /**
     * 默认值
     */
    defaultValue?:any;
    /**
     * 渲染方法
     */
    render?:()=>void
}
