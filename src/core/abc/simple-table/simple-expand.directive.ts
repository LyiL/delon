import {Directive, OnInit, Input, ContentChild} from "@angular/core";
import {SimpleTableService} from "./simple-table.service";
import {SimpleTableComponent} from "./simple-table.component";
@Directive({
    selector:'[nzSimpleExpand]'
})
export class SimpleExpandDirective implements OnInit{

    @Input('nzSimpleExpand')
    parentData:any;

    @ContentChild(SimpleTableComponent) table:SimpleTableComponent;

    constructor(private service:SimpleTableService){}

    ngOnInit():void{
        if(this.table){
            this.table._parentRowData = this.parentData;
            this.service.addChildTable({id:this.parentData['table_id'],table:this.table});
        }
    }
}
