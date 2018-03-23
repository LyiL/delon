import {Component, ViewChild} from "@angular/core";
import {SimpleTableComponent} from "@delon/abc";
import {HttpClient} from "@angular/common/http";
@Component({
    selector:'demo-table',
    templateUrl:'./demo-table.component.html'
})
export class DemoTableComponent{
    @ViewChild('table') table:SimpleTableComponent;

    public url:string = "/assets/test.org.data.json";
    public htmlStr:string = "<div>123123123</div>";

    constructor(public http:HttpClient){}

    columns:Array<any> = [{
        index:'orgNo',
        title:'机构编号'
    },{
        index:'orgName',
        title:'机构名称'
    },{
        title:'输入html内容',
        render:'htmlRender'
    }];

    onSearch(){
        console.log('search....');
        this.url = "/assets/test2.org.data.json";
        this.table.doSearch();
    }
    expandData:any[]=[];
    onExpandChange(val){
        console.log('expandChange:::',val);
        if(!this.expandData[val.index]){
            this.http.get('/assets/test2.org.data.json').subscribe(res=>{
                this.expandData[val.index] = res;
                this.expandData[val.index]['status'] = Math.floor(Math.random() * 10);
            });
        }
    }
}
