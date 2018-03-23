import {Injectable} from "@angular/core";
import {SimpleTableExpand} from "./interface";
import {ObjectExtend} from "ng-zorro-antd";
import {uuid} from "../utils/utils";
import {SimpleTableComponent} from "./simple-table.component";

const TABLE_ID = 'table_id';

@Injectable()
export class SimpleTableService{
    get childTables(){
        return this._childTables;
    }
    private _childTables:Array<SimpleTableExpand> = [];

    // get pTable(){
    //     return this._pTable;
    // }
    set pTable(_pTable:SimpleTableComponent){
        // this._pTable = _pTable;
        this._pTables.push(_pTable);
    }
    get pTable():SimpleTableComponent{
        return this._pTables[0];
    }
    getPTable(ind:number):SimpleTableComponent{
        return this._pTables[ind];
    }
    private _pTables:Array<SimpleTableComponent> = [];

    constructor(private objectExtend:ObjectExtend){}

    /**
     * 清空子表格
     */
    public clear(){
        this._childTables.splice(0,this._childTables.length);
        this._pTables.splice(0, this._pTables.length);
    }

    /**
     * 添加子控件
     * @param table
     */
    public addChildTable(table:SimpleTableExpand){
        let _table = this.childTables['find']((cTable:SimpleTableExpand)=>{
            return cTable.id == table.id;
        });
        if(!_table){
            this._childTables.push(table);
        }
    }

    /**
     * 向子表格添加数据
     * @param id 区分表格的唯一值
     * @param data 新数据
     */
    public addRow(data:any,id:any|undefined = undefined){
        const table = this.getTable(id);

        if(table){
            let tableData = <any[]>table._data;
            data['table_id'] = uuid();
            tableData.push(data);
        }
    }

    /**
     * 修改数据
     * @param id 区分表格的唯一值
     * @param data 修改数据
     */
    public editRow(data:any,id:any|undefined = undefined){
        let newData = this.getNewData(id);
        if(newData){
            let _ind = newData['findIndex']((_data:any,index:number)=>{
                return data[TABLE_ID] == _data[TABLE_ID];
            });
            newData[_ind] = data;
        }
    }

    /**
     * 删除数据
     * @param id 区分表格的唯一值
     * @param tableId 数据唯一值
     */
    public delRow(id,tableId:any){
        const newData = this.getNewData(id);
        if(newData){
            let _ind = newData['findIndex']((_data:any,index:number)=>{
                return tableId == _data[TABLE_ID];
            });
            newData.splice(_ind,1);
        }
    }

    /**
     * 获取子表格表格原始数据
     * @param id 区分表格的唯一值
     * @returns {any}
     */
    public getOriginalData(id:any):any{
        const table = this.getTable(id);
        if(table){
            return table._originalData;
        }
        return null;
    }

    /**
     * 获取子表格表格原始数据
     * @param id 区分表格的唯一值
     * @returns {any}
     */
    public getNewData(id:any|undefined = undefined):any{
        const table = this.getTable(id);
        if(table){
            return table._data;
        }
        return null;
    }

    /**
     * 判断是否有修改数据
     * @param id
     * @returns {boolean}
     */
    public hasModifyData(id:any):boolean{
        const table = this.getRowChildTable(id);
        if(table){
            if(table._data.length != table._originalData.length){
                return true;
            }
            let pFlag: boolean = false;//判断数据是否有修改，默认为没有修改
            table._originalData.forEach((_oData)=>{
               let tmp = table._data['find']((_data)=> {//先找到对应数据
                   return _oData[TABLE_ID] == _data[TABLE_ID];
               });

               if(tmp){
                   for(let key in tmp){
                       if(this.objectExtend.has(_oData,key) && this.objectExtend.has(tmp,key) && _oData[key] != tmp[key]){ //判断数据是否有修改
                           pFlag = true;
                       }
                   }
               }
            });
            return pFlag;
        }
        return false;
    }

    /**
     * 获取子表格实例
     * @param id 区分表格的唯一值
     * @returns {((data:...[any])=>void)|any|SimpleTableComponent}
     */
    public getRowChildTable(id:any){
        const expendTable = this.childTables['find']((item:SimpleTableExpand)=>{
            return item.id == id;
        });
        return expendTable ? expendTable.table : null;
    }

    private getTable(id:any|undefined=undefined){
        let table = this.getPTable(0);
        if(id){
            if(typeof id == 'number'){
                table = this.getPTable(id);
            }else{
                table = this.getRowChildTable(id);
            }
        }
        return table;
    }
}
