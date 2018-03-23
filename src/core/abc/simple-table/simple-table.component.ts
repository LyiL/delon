import { Component, Inject, Input, Output, OnDestroy, OnInit, OnChanges, SimpleChanges, EventEmitter, Renderer2, ElementRef, TemplateRef, SimpleChange, QueryList, ViewChildren, AfterViewInit, ContentChildren, ContentChild, Optional } from '@angular/core';
import { _HttpClient, CNCurrencyPipe, MomentDatePipe, YNPipe, ModalHelper, ALAIN_I18N_TOKEN, AlainI18NService } from '@delon/theme';
import { ACLService } from '@delon/acl';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { tap, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { SimpleTableColumn, SimpleTableChange, CompareFn, SimpleTableSelection, SimpleTableFilter, SimpleTableData, SimpleTableButton, STExportOptions } from './interface';
import { SimpleTableConfig } from './simple-table.config';
import {deepGet, newClone, uuid} from '../utils/utils';
import { SimpleTableRowDirective } from './simple-table-row.directive';
import { SimpleTableExport } from './simple-table-export';
import {HttpHeaders} from "@angular/common/http";
import {NzLocaleService, ObjectExtend} from "ng-zorro-antd";
import {HttpParams} from "@angular/common/http";

@Component({
    selector: 'simple-table',
    templateUrl: './simple-table.component.html',
    styleUrls: [ './simple-table.less' ],
    providers: [ SimpleTableExport, CNCurrencyPipe, MomentDatePipe, YNPipe ]
})
export class SimpleTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

    private data$: Subscription;
    _data: SimpleTableData[] = [];
    _parentRowData:any;//父级数据
    _originalData:(SimpleTableData)[] = [];//原始数据
    // _url: string;
    _isPagination = true;
    _classMap: string[] = [];
    _allChecked = false;
    _indeterminate = false;
    _sortMap: { [key: number ]: any } = {};
    _sortColumn: SimpleTableColumn = null;
    _sortOrder: string;
    _sortIndex: number;
    _footer = false;
    _columns: SimpleTableColumn[] = [];
    _nzCustomNoResult:boolean = false;
    _noResult:string;

    @ContentChild('nzTableExpand') tableExpand:TemplateRef<void>;

    // region: fields

    @Input()
    get isAjax(){
        return this._isAjax;
    }
    set isAjax(_isAjax:any){
        this._isAjax = coerceBooleanProperty(_isAjax);
    }
    private _isAjax = false;
    /** 数据源 */
    @Input() data: string | any[] | Observable<any[]>;
    /**
     * 后端URL地址
     * @deprecated 已过期，请使用 `data` 属性，`0.6.1` 后将移除
     */
    @Input() get url():string{
        return this._url;
    }
    set url(_url:string){
        this._url = _url;
        this.urlChange.emit(_url);
    }
    private _url: string;
    @Output() urlChange:EventEmitter<any> = new EventEmitter();
    /**
     * 额外请求参数，默认自动附加 `pi`、`ps` 至URL
     * - `{ status: 'new' }` => `url?pi=1&ps=10&status=new`
     */
    @Input() extraParams: any;
    /** 请求方法 */
    @Input() reqMehtod: string = 'POST';
    /** 请求体 `body` */
    @Input() reqBody: any;
    /**
     * 请求体 `Header`
     */
    @Input() reqHeaders: any = new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' });
    @Input() responseType:'arraybuffer' | 'blob' | 'json' | 'text' = 'json';
    @Input() observe:'body' | 'events' | 'response' = 'body';
    /**
     * 重命名请求参数 `pi`、`ps`
     * - `{ pi: 'Page' }` => `pi` 会被替换成 Page
     */
    @Input()
    get reqReName(){
        return this._reqReName;
    }
    set reqReName(_reqReName:any){
        this._reqReName = _reqReName;
        this.reqReNameChange.emit(_reqReName);
        this.logger.debug('reqReName:',_reqReName);
    }
    private _reqReName: any = {pi:'page',ps:'size'};
    @Output() reqReNameChange:EventEmitter<any> = new EventEmitter();
    /** 请求异常时回调 */
    @Output() reqError: EventEmitter<any> = new EventEmitter<any>();
    /**
     * 重命名返回参数 `total`、`list`
     * - `{ total: 'Total' }` => Total 会被当作 `total`
     */
    @Input()
    get resReName(){
        return this._resReName;
    }
    set resReName(_resReName:{ total?: string | string[], list?: string | string[],pi?: string | string[],ps?: string | string[], message?:string | string[]}){
        this._resReName = _resReName;
        this.resReNameChange.emit(_resReName);
        this.logger.debug('resReName:',_resReName);
    }
    private _resReName: { total?: string | string[], list?: string | string[],pi?: string | string[],ps?: string | string[], message?:string | string[]} = {list:'data.innerData',total:'data.totalRows',pi:'data.currentPage',ps:'data.pageSize',message:'message'};
    @Output() resReNameChange:EventEmitter<{ total?: string | string[], list?: string | string[],pi?: string | string[],ps?: string | string[],message?:string | string[]}> = new EventEmitter();
    /** 列描述  */
    @Input() columns: SimpleTableColumn[] = [];
    /** 每页数量，当设置为 `0` 表示不分页，默认：`10` */
    @Input()
    get ps() { return this._ps; }
    set ps(value: any) {
        this._ps = coerceNumberProperty(value);
    }
    private _ps = 10;
    /** 当前页码 */
    @Input()
    get pi() { return this._pi; }
    set pi(value: any) {
        this._pi = coerceNumberProperty(value);
    }
    private _pi = 1;
    /** 数据总量 */
    @Input()
    get total() { return this._total; }
    set total(value: any) {
        this._total = coerceNumberProperty(value);
    }
    private _total = 0;
    /** 是否显示Loading */
    @Input()
    get loading() { return this._loading; }
    set loading(value: any) {
        this._loading = coerceBooleanProperty(value);
    }
    private _loading = false;
    /** 是否显示边框 */
    @Input()
    get bordered() { return this._bordered; }
    set bordered(value: any) {
        this._bordered = coerceBooleanProperty(value);
    }
    private _bordered = false;
    /** table大小 */
    @Input() size: 'small' | 'middle' | 'default' = 'default';
    /** 纵向支持滚动，也可用于指定滚动区域的高度：`{ y: 300 }` */
    @Input() scroll: { y: number };
    /** 是否显示pagination中改变页数 */
    @Input()
    get showSizeChanger() { return this._showSizeChanger; }
    set showSizeChanger(value: any) {
        this._showSizeChanger = coerceBooleanProperty(value);
    }
    private _showSizeChanger = false;
    /** pagination中每页显示条目数下拉框值 */
    @Input() pageSizeSelectorValues: number[] = [10, 20, 30, 40, 50];
    /** 是否显示pagination中快速跳转 */
    @Input()
    get showQuickJumper() { return this._showQuickJumper; }
    set showQuickJumper(value: any) {
        this._showQuickJumper = coerceBooleanProperty(value);
    }
    private _showQuickJumper = false;
    /** 是否显示总数据量 */
    @Input()
    get showTotal() { return this._showTotal; }
    set showTotal(value: any) {
        this._showTotal = coerceBooleanProperty(value);
    }
    private _showTotal = false;
    /** 数据变更后是否保留在数据变更前的页码 */
    @Input()
    get isPageIndexReset() { return this._isPageIndexReset; }
    set isPageIndexReset(value: any) {
        this._isPageIndexReset = coerceBooleanProperty(value);
    }
    private _isPageIndexReset = true;
    /** 分页方向 */
    @Input() pagePlacement?: 'left' | 'center' | 'right' = 'right';
    /** 切换分页时返回顶部 */
    @Input()
    get toTopInChange() { return this._toTopInChange; }
    set toTopInChange(value: any) {
        this._toTopInChange = coerceBooleanProperty(value);
    }
    private _toTopInChange = true;
    /** 返回顶部偏移值 */
    @Input()
    get toTopOffset() { return this._toTopOffset; }
    set toTopOffset(value: any) {
        this._toTopOffset = coerceNumberProperty(value);
    }
    private _toTopOffset = 0;
    /** 重命名排序值，`columns` 的重命名高于属性 */
    @Input() sortReName: { ascend?: string, descend?: string };
    /** 数据处理前回调 */
    @Input() preDataChange: (data: SimpleTableData[]) => SimpleTableData[];
    @Input()
    get isExpand(){
        return this._isExpand;
    }
    set isExpand(_isExpand:any){
        this._isExpand = coerceBooleanProperty(_isExpand);
    }
    private _isExpand = false;
    /** 额外 `body` 内容 */
    @ContentChild('body') body: TemplateRef<any>;
    /** `footer` 内容 */
    @ContentChild('footer') footer: TemplateRef<any>;
    /** 页码、每页数量变化时回调 */
    @Output() change: EventEmitter<SimpleTableChange> = new EventEmitter<SimpleTableChange>();
    /** checkbox变化时回调，参数为当前所选清单 */
    @Output() checkboxChange: EventEmitter<SimpleTableData[]> = new EventEmitter<SimpleTableData[]>();
    /** radio变化时回调，参数为当前所选 */
    @Output() radioChange: EventEmitter<SimpleTableData> = new EventEmitter<SimpleTableData>();
    /** 排序回调 */
    @Output() sortChange: EventEmitter<any> = new EventEmitter<any>();
    /** Filter回调 */
    @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();
    /**
     * 表格行双击事件
     * @type {EventEmitter<any>}
     */
    @Output() rowDBLClick:EventEmitter<any> = new EventEmitter<any>();
    /**
     * 展开事件
     * @type {EventEmitter<any>}
     */
    @Output() expandChange:EventEmitter<any> = new EventEmitter<any>();

    // endregion

    constructor(
        defConfig: SimpleTableConfig,
        private _http: _HttpClient,
        private el: ElementRef,
        private renderer: Renderer2,
        private exportSrv: SimpleTableExport,
        @Optional() private acl: ACLService,
        @Optional() @Inject(ALAIN_I18N_TOKEN) private i18nSrv: AlainI18NService,
        private modal: ModalHelper,
        private currenty: CNCurrencyPipe,
        private date: MomentDatePipe,
        private logger:NzLocaleService,
        private object:ObjectExtend,
        private yn: YNPipe
    ) {
        Object['assign'](this, defConfig);
    }

    // region: data

    private getAjaxData(url?: string): Observable<any> {
        const params: any = {};
        params[this.reqReName && this.reqReName['pi'] || 'pi'] = this.pi - 1;
        params[this.reqReName && this.reqReName['ps'] || 'ps'] = this.ps;

        let reqOptions = {
            headers:this.reqHeaders,
            reportProgress:true,
            responseType:this.responseType,
            observe:this.observe
        };
        if(this.reqMehtod.toLocaleLowerCase() == 'post'){
            reqOptions['body'] = this.object.extend(params,this.extendPrivateFieldFilter(this.extraParams) , this.getReqSortMap(), this.getReqFilterMap());
        }else if(this.reqMehtod.toLocaleLowerCase() == 'get'){
            let _params = new HttpParams();
            this.object.extend(params, this.extendPrivateFieldFilter(this.extraParams), this.getReqSortMap(), this.getReqFilterMap());
            for(let key in params){
                _params.set(key,params[key]);
            }
            this.object.extend(reqOptions,_params);
        }

        return this._http.request(this.reqMehtod, url || this.url, reqOptions).pipe(map((res: any) => {
            const ret = deepGet(res, this.resReName.list as string[], null);
            const retMessage = deepGet(res,this.resReName.message as string[], null);
            if((ret == null || ret == undefined) && retMessage){
                this._nzCustomNoResult = true;
                this._noResult = retMessage;
                this.loading = false;
                if(this._data && this._data.length > 0){
                    this._data.splice(0,this._data.length);
                }
                throw retMessage;
            }else{
                this._nzCustomNoResult = false;
            }
            if (typeof ret === 'undefined') {
                this.logger.warn(`results muse contain '${(this.resReName.list as string[]).join('.')}' attribute.`);
                this.loading = false;
                throw "ret undefined";
            }
            if (!Array.isArray(ret)) {
                this.logger.warn(`'${(this.resReName.list as string[]).join('.')}' muse be array type.`);
                this.loading = false;
                throw `'${(this.resReName.list as string[]).join('.')}' muse be array type.`;
            }
            // total
            const retTotal = this.resReName.total && deepGet(res, this.resReName.total as string[], null);
            if (typeof retTotal === 'undefined') {
                if (this.resReName.total) this.logger.warn(`results muse contain '${(this.resReName.total as string[]).join('.')}' attribute.`);
                this.loading = false;
                throw `results muse contain '${(this.resReName.total as string[]).join('.')}' attribute.`;
            } else {
                this.total = +retTotal;
            }
            return <any[]>ret;
        }));
    }

    doSearch(forceRefresh: boolean = true){
        this.isAjax = true;
        this._genAjax(forceRefresh);
    }

    load(pi = 1) {
        this.pi = pi;
        this._change('pi');
    }

    _change(type: 'pi' | 'ps') {
        this._genAjax();
        this._genData();
        this._toTop();
        this.change.emit({
            type: type,
            pi: this.pi,
            ps: this.ps,
            total: this.total
        });
    }

    _genAjax(forceRefresh: boolean = false) {
        if (!this.isAjax) return;
        this.loading = true;
        if (forceRefresh === true) this.pi = 1;
        this.getAjaxData().subscribe((res: any) => this._subscribeData(res), err => {
            this.loading = false;
            this.reqError.emit(err);
        });
    }

    _genData(forceRefresh: boolean = false) {
        if (this.isAjax) return;
        let data = <any[]>this.data || [];
        // sort
        data = data.slice(0);
        const sorterFn = this.getSorterFn();
        if (sorterFn) {
            data = this.recursiveSort(data, sorterFn);
        }

        // filter
        this._columns.filter(w => w.filters && w.filters.length).forEach(c => {
            const values = c.filters.filter(w => w.checked);
            if (values.length === 0) return;
            const onFilter = c.filter;
            data = data.filter(record => {
                return values.some(v => onFilter(v, record));
            });
        });

        if (forceRefresh) {
            if (this.isPageIndexReset) {
                this.pi = 1;
            } else {
                const maxPageIndex = Math.ceil(data.length / this.ps);
                this.pi = !this.pi ? 1 : (this.pi > maxPageIndex ? maxPageIndex : this.pi);
            }
        }
        this.total = this.total <= 0 ? data.length : this.total;
        this._isPagination = this.ps > 0 && this.total > this.ps;
        this._subscribeData(data.slice((this.pi - 1) * this.ps, this.pi * this.ps));
    }

    _toTop() {
        if (!this.toTopInChange) return;
        if (this.scroll) {
            (this.el.nativeElement as HTMLElement).querySelector('.ant-table-body').scrollTo(0, 0);
            return ;
        }
        if (this.el.nativeElement.scrollIntoView) this.el.nativeElement.scrollIntoView();
        // todo: toTopOffset
    }

    _get(item: any, col: SimpleTableColumn) {
        if (col.format) return col.format(item, col);

        let ret:any = deepGet(item, col.index as string[], '');
        if (typeof ret === 'undefined') return '';
        if(col.data){//处理数据
            ret = col.data(ret,item,col);
        }
        switch (col.type) {
            case 'img':
                return `<img src="${ret}" class="img">`;
            case 'currency':
                return this.currenty.transform(ret);
            case 'date':
                return this.date.transform(ret, col.dateFormat);
            case 'yn':
                return this.yn.transform(ret === col.ynTruth, col.ynYes, col.ynNo);
        }
        return ret;
    }

    /**
     * 判断是否显示列
     * @param c 列信息
     * @returns {boolean} 如果 hide方法与属性为true,表示不显示，否则为显示
     */
    isShowColumn(c:any){
        if(c.hide && this.object.isFunction(c.hide)){
            return !c.hide();
        }else{
            return c.hide  === true ? false : true;
        }
    }

    /**
     * 判断按钮是否显示
     * @param btn 当前按钮
     * @param i 数据
     * @param c 列信息
     * @returns {boolean} 如果 hide方法与属性为true,表示不显示，否则为显示
     */
    isShowBtn(btn:any,i:any,c:any){
        if(btn.hide && this.object.isFunction(btn.hide)){
            return !btn.hide(i,c);
        }else{
            return btn.hide  === true ? false : true;
        }
    }

    /**
     * 判断是否显示隔离线
     * @param btns 所有按钮
     * @param btn 当前按钮
     * @param r 数据
     * @param c 列信息
     * @returns {any} 当按钮不显示时，线也不显示，如果当前按钮为最后一个显示的，隔离线也不显示
     */
    isShowBtnLine(btns:Array<any>,btn,r,c){
        let showBtns:Array<string> = [];
        for(let i=0; i<btns.length; i++){
            if(this.isShowBtn(btns[i],r,c)){
                showBtns.push(btns[i].text);
            }
        }
        if(showBtns.length > 0 && showBtns[showBtns.length - 1] == btn.text){//判断显示的是否为最后一个
            return false;
        }else{
            return this.isShowBtn(btn,r,c);
        }
    }

    /**
     * 表格行双击事件
     * @param data
     * @private
     */
    _onRowDBLClick(data){
        this.rowDBLClick.emit(data);
    }

    /**
     * 扩充行点击事件
     * @private
     */
    public _onExpandChange(val:any,data:any,index:number){
        this.expandChange.emit({expand:val,data:data,index:index});
    }

    private getDataObs(urlOrData?: string | any[]): Observable<any[]> {
        return urlOrData || Array.isArray(this.data) ? of(urlOrData as any[] || this.data as any[]) : this.data as Observable<any[]>;
    }

    private processData() {
        if (!this.data && !this.url) {
            // this.isAjax = false;
            this.data = [];
            return;
        }

        // this.isAjax = false;
        if (typeof this.data === 'string' || this.url) {
            this._url = this.url || this.data as string;
            // this.isAjax = true;
            this._genAjax(true);
        } else if (Array.isArray(this.data)) {
            this._genData(true);
        } else {
            if (!this.data$) {
                this.data$ = <any>this.data['pipe'](tap(() => this.loading = true)).subscribe((res) => {
                    this.data = res;
                    this._genData(true);
                });
            }
        }
    }

    private _subscribeData(res: any[]) {
        if (this.preDataChange) res = this.preDataChange(res);
        this.loading = false;
        this._data = res;
        this._data && this._data.forEach((_d:any,_i:number)=>{
            this._data[_i]['table_id'] = uuid();
        })
        if(this._originalData.length == 0){
            this._originalData = newClone(this._data);
        }
        this._refCheck();
    }

    // endregion

    // region: sort

    private getReqSortMap(): { [key: string]: string } {
        const ret: { [ key: string]: string } = {};
        if (!this._sortOrder) return ret;

        const mapData = this._sortMap[this._sortIndex];
        ret[mapData.key] =
            (this._sortColumn.sortReName || this.sortReName || {})[mapData.v] || mapData.v;
        return ret;
    }

    private recursiveSort(data: any[], sorterFn: (a: any, b: any) => number): any[] {
        const childrenColumnName = 'children';
        return data.sort(sorterFn).map((item: any) => {
            if(item[childrenColumnName]){
                item[childrenColumnName] = this.recursiveSort(item[childrenColumnName], sorterFn);
            }
            return item;
        });
    }

    private getSorterFn(){
        // _sortMap
        if (!this._sortOrder || !this._sortColumn || typeof this._sortColumn.sorter !== 'function') {
            return;
        }

        return (a: any, b: any) => {
            const result = (this._sortColumn!.sorter as CompareFn)(a, b);
            if (result !== 0) {
                return (this._sortOrder === 'descend') ? -result : result;
            }
            return 0;
        };
    }

    sort(index: number, value: any) {
        if (this._sortIndex === index && this._sortOrder === value) return;
        this._sortColumn = this._columns[index];
        this._sortOrder = value;
        this._sortIndex = index;
        Object.keys(this._sortMap).forEach(key => this._sortMap[key].v = +key === index ? value : null);
        this._genAjax(true);
        this._genData(true);
        this.sortChange.emit({ value, map: this.getReqSortMap(), column: this._sortColumn });
    }

    // endregion

    // region: filter

    private getReqFilterMap(): { [key: string]: string } {
        let ret: { [ key: string]: string } = {};
        this._columns.filter(w => w.filtered === true).forEach(col => {
            const values = col.filters.filter(f => f.checked === true);
            let obj: Object = {};
            if (col.filterReName)
                obj = col.filterReName(col.filters, col);
            else
                obj[col.filterKey || col['indexKey']] = values.map(i => i.value).join(',');

            ret = Object['assign'](ret, obj);
        });
        return ret;
    }

    private handleFilter(col: SimpleTableColumn) {
        col.filtered = col.filters['findIndex'](w => w.checked) !== -1;
        this._genAjax(true);
        this._genData(true);
        this.filterChange.emit(col);
    }

    filterConfirm(col: SimpleTableColumn) {
        this.handleFilter(col);
    }

    filterClear(col: SimpleTableColumn) {
        col.filters.forEach(i => i.checked = false);
        this.handleFilter(col);
    }

    filterRadio(col: SimpleTableColumn, item: SimpleTableFilter, checked: boolean) {
        col.filters.forEach(i => i.checked = false);
        item.checked = checked;
    }

    // endregion

    // region: checkbox

    _checkAll() {
        this._data.filter(w => !w.disabled).forEach(i => i.checked = this._allChecked);
        this._refCheck();
        this.checkboxChange.emit(this._data.filter(w => w.checked === true));
    }

    _checkSelection(i: SimpleTableData) {
        this.checkboxChange.emit(this._data.filter(w => w.checked === true));
    }

    _refCheck() {
        const validData = this._data && this._data.filter(w => !w.disabled);
        const checkedList = validData.filter(w => w.checked === true);
        this._allChecked = checkedList.length > 0 && checkedList.length === validData.length;
        const allUnChecked = validData.every(value => !value.checked);
        this._indeterminate = (!this._allChecked) && (!allUnChecked);
    }

    _rowSelection(row: SimpleTableSelection) {
        if (row.select) row.select(this._data);
        this._refCheck();
        this.checkboxChange.emit(this._data.filter(w => !w.disabled && w.checked === true));
    }

    // endregion

    // region: radio

    _refRadio(idx: number, checked: boolean) {
        this._data.forEach(i => i.checked = false);
        this._data[idx].checked = checked;
        this.radioChange.emit({ checked, item: this._data[idx] });
    }

    // endregion

    // region: buttons

    btnClick(record: any, btn: SimpleTableButton) {
        if (btn.type === 'modal' || btn.type === 'static') {
            this.modal[btn.type === 'modal' ? 'open' : 'static'](btn.component, Object['assign']({
                record
            }, btn.params && btn.params(record)), btn.size, btn.modalOptions).subscribe(res => {
                if (btn.click) btn.click(record, res);
            });
            return;
        }
        if (btn.click) btn.click(record);
    }

    btnText(record: any, btn: SimpleTableButton) {
        if (btn.format) return btn.format(record, btn);
        return btn.text;
    }

    // endregion

    // region: export

    /**
     * 导出Excel，确保已经注册 `AdXlsxModule`
     * @param urlOrData 重新指定数据，例如希望导出所有数据非常有用
     * @param opt 额外参数
     */
    export(urlOrData?: string | any[], opt?: STExportOptions) {
        (
            (!urlOrData && this.isAjax) || (urlOrData && typeof urlOrData === 'string') ?
                this.getAjaxData(urlOrData as string) :
                this.getDataObs(urlOrData)
        )
            .subscribe((res: any[]) =>
                this.exportSrv.export(Object['assign']({}, opt, <STExportOptions>{
                    _d: res,
                    _c: this._columns
                }))
            );
    }

    // endregion

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this._footer = !!this.footer;
    }

    addRow(row: SimpleTableRowDirective) {
        const col = this._columns['find'](w => w.render === row.id);
        if (col) col.__render = row.templateRef;
    }

    private updateStatus() {
        if (this.data && this.url) throw new Error(`data & url property muse be either-or`);

        this.setClass();

        // columns
        if (!this.columns || this.columns.length === 0) throw new Error(`the columns property muse be define!`);
        if (this._columns.length === 0) {
            let checkboxCount = 0;
            let radioCount = 0;
            const sortMap: Object = {};
            let idx = 0;
            const newColumns: SimpleTableColumn[] = [];
            for (const item of this.columns) {
                if (this.acl && item.acl && !this.acl.can(item.acl)) continue;
                if (item.index) {
                    if (!Array.isArray(item.index))
                        item.index = item.index['split']('.');

                    item['indexKey'] = item.index['join']('.');
                }
                // rowSelection
                if (!item.selections) item.selections = [];
                if (item.type === 'checkbox') {
                    ++checkboxCount;
                    if (!item.width) item.width = `${item.selections.length > 0 ? 60 : 50}px`;
                }
                if (item.type === 'radio') {
                    ++radioCount;
                    item.selections = [];
                    if (!item.width) item.width = '50px';
                }
                if (!item.className) {
                    item.className = {
                        // 'checkbox': 'text-center',
                        // 'radio': 'text-center',
                        'currency': 'text-right',
                        'date': 'text-center'
                    }[item.type];
                }
                if (item.type === 'yn' && typeof item.ynTruth === 'undefined')
                    item.ynTruth = true;

                // sorter
                if (item.sorter) {
                    sortMap[idx] = { v: item.sort, key: item.sortKey || item['indexKey'] };
                    if (item.sort && !this._sortColumn) {
                        this._sortColumn = item;
                        this._sortOrder = item.sort;
                        this._sortIndex = idx;
                    }
                }
                // filter
                if (!item.filter || !item.filters) item.filters = [];
                if (typeof item.filterMultiple === 'undefined') item.filterMultiple = true;
                if (!item.filterConfirmText) item.filterConfirmText = `确认`;
                if (!item.filterClearText) item.filterClearText = `重置`;
                if (!item.filterIcon) item.filterIcon = `anticon anticon-filter`;
                item.filtered = item.filters['findIndex'](w => w.checked) !== -1;

                if (this.acl) {
                    item.selections = item.selections.filter(w => !w.acl || this.acl.can(w.acl));
                    item.filters = item.filters.filter(w => !w.acl || this.acl.can(w.acl));
                }

                // buttons
                const buttons: SimpleTableButton[] = [];
                if (item.buttons) {
                    for (const btn of item.buttons) {
                        if (this.acl && btn.acl && !this.acl.can(btn.acl)){ continue;}

                        if (btn.type === 'del' && typeof btn.pop === 'undefined'){
                            btn.pop = true;
                        }
                        if (btn.pop === true) {
                            btn['_type'] = 2;
                            if (typeof btn.popTitle === 'undefined') btn.popTitle = `确认删除吗？`;
                        }
                        if (btn.children && btn.children.length > 0) {
                            btn['_type'] = 3;
                        }
                        if (!btn['_type']){ btn['_type'] = 1};

                        // i18n
                        if (btn.i18n && this.i18nSrv){ btn.text = this.i18nSrv.fanyi(btn.i18n)};

                        buttons.push(btn);
                    }
                    // if (buttons.length === 0) continue;
                }
                item.buttons = buttons;
                // i18n
                if (item.i18n && this.i18nSrv) item.title = this.i18nSrv.fanyi(item.i18n);

                ++idx;
                newColumns.push(item);
            }
            this._columns = newColumns;
            if (checkboxCount > 1) throw new Error(`just only one column checkbox`);
            if (radioCount > 1) throw new Error(`just only one column radio`);
            this._sortMap = sortMap;
        }
        // reqReName
        if (this.reqReName) {
        }
        // resReName
        if (this.resReName) {
            if (this.resReName.list){
                if (!Array.isArray(this.resReName.list)){ this.resReName.list = this.resReName.list['split']('.');}
            }else{
                this.resReName.list = ['data','innerData'];
            }
            if (this.resReName.total){
                if (!Array.isArray(this.resReName.total)){ this.resReName.total = this.resReName.total['split']('.');}
            }else{
                this.resReName.total = ['data','totalRows'];
            }
            if(this.resReName.message){
                if (!Array.isArray(this.resReName.message)) this.resReName.message = this.resReName.message['split']('.');
            }else{
                this.resReName.message = ['message'];
            }
        } else {
            this.resReName = { total: ['data','totalRows'], list: ['data','innerData'] };
        }
    }

    private setClass() {
        this._classMap.forEach(cls => this.renderer.removeClass(this.el.nativeElement, cls));

        this._classMap = [];
        if (this.pagePlacement)
            this._classMap.push('page-' + this.pagePlacement);

        this._classMap.forEach(cls => this.renderer.addClass(this.el.nativeElement, cls));
    }

    private extendPrivateFieldFilter(source:any){
        let _source = {};
        for(let key in source){
            if(this.object.has(source,key) && (''+key).startsWith('_')){
                continue;
            }
            _source[key] = source[key];
        }
        _source = this.trimParam(_source);
        return _source;
    }

    /**
     * 去除参数里的空格
     * @param data
     * @returns {any}
     */
    private trimParam(data:any){
        if(!data){
            return data;
        }
        if(this.object.size(data) > 0){
            for(let item in data){
                //值为时间对象时Object.prototype.toString.call(data[item]) === "[object Date]"，不做处理
                switch(Object.prototype.toString.call(data[item])){
                    case "[object String]":  //字符串类型
                        data[item] = data[item].trim()
                        break;
                    case "[object Array]": //数组类型
                    case "[object Object]": //对象类型
                        data[item] = this.trimParam(data[item])
                        break;
                    default://(其他类型:)number date function undefined boolean null 类型跳过不做处理
                        break;
                }
            }
            return data;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns']) this._columns = [];

        this.updateStatus();

        if (changes['data'] || changes['url']) {
            this.processData();
        }
    }

    ngOnDestroy(): void {
        if (this.data$) {
            this.data$.unsubscribe();
            this.data$ = null;
        }
        if(this._data && this._data.length > 0){
            this._data.splice(0,this._data.length);
        }
    }

}
