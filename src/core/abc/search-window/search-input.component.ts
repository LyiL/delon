import {Component, Input, Output, EventEmitter, forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {ModalHelper} from "@delon/theme";
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {SearchWindowConfig} from "./search-window.config";
import {SearchWindowComponent} from "./search-window.component";

@Component({
    selector:'search-input',
    templateUrl:'./search-input.component.html',
    styleUrls:['./search-input.less'],
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchInputComponent),
            multi      : true
        }
    ]
})
export class SearchInputComponent implements ControlValueAccessor{
    private _disabled = false;

    _value: string;
    _size = 'default';
    _prefixCls = 'ant-input';
    _classMap;

    // ngModel Access
    onChange: (value: string) => void = () => null;
    onTouched: () => void = () => null;

    @Input() nzPlaceHolder: string;//提示语
    @Input() nzId: string;//id
    @Input() name: string;//名称
    @Input() tableCfg:SearchWindowConfig;//表格配置
    @Input() winOption:any;//窗体配置
    @Input() displayField:string;//显示值字段名
    @Input() valueField:string;//提交值字段名
    @Input() searchBefore:(val:any)=>boolean;//查询前置条件
    @Input()
    get displayValue(){
        return this._displayValue;
    }
    set displayValue(_displayValue:any){
        this._displayValue = _displayValue;
        this.displayValueChange.emit(_displayValue);
    }
    private _displayValue:any;
    @Output()
    public displayValueChange:EventEmitter<any> = new EventEmitter();

    @Input()
    set nzSize(value: string) {
        this._size = { large: 'lg', small: 'sm' }[ value ];
        this.setClassMap();
    }

    get nzSize(): string {
        return this._size;
    }

    @Input()
    set nzDisabled(value: boolean) {
        this._disabled = coerceBooleanProperty(value);
        this.setClassMap();
    }

    get nzDisabled(): boolean {
        return this._disabled;
    }

    @Output() nzBlur: EventEmitter<FocusEvent> = new EventEmitter();
    @Output() nzFocus: EventEmitter<FocusEvent> = new EventEmitter();
    @Output() nzSelect: EventEmitter<any> = new EventEmitter();
    @Output() nzClear:EventEmitter<any> = new EventEmitter();

    get nzValue(): string {
        return this._value;
    }

    set nzValue(value: string) {
        if ((this._value === value) || ((this._value == null) && (value == null))) {
            return;
        }
        this._value = value;
        this.onChange(value);
    }

    constructor(private modalHelper: ModalHelper){}

    _emitBlur($event: FocusEvent): void {
        this.nzBlur.emit($event);
        this.onTouched();
    }

    _emitFocus($event: FocusEvent): void {
        this.nzFocus.emit($event);
    }

    /**
     * 清除数据
     * @private
     */
    _onClearValueHeadler(){
        if(this.nzDisabled){
            return;
        }
        this.nzValue = '';
        this.displayValue = '';
        this.nzClear.emit();
    }

    /**
     * 查询
     * @private
     */
    _onSearchHeadler(){
        if(this.nzDisabled){
            return;
        }
        if(this.searchBefore && this.searchBefore(this.nzValue) === false){
            return;
        }
        this.winOption = Object['assign']({zIndex:9999},this.winOption);
        this.modalHelper.static(SearchWindowComponent,this.tableCfg,550,this.winOption).subscribe((res)=>{
            if(res){
                this.nzValue = res[this.valueField];
                this.displayValue = res[this.displayField];
                this.nzSelect.emit(res);
            }
        });
    }

    setClassMap(): void {
        this._classMap = {
            [`${this._prefixCls}-${this._size}`]: true,
            [`${this._prefixCls}-disabled`]     : this._disabled
        };
    }

    writeValue(value: any): void {
        this._value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.nzDisabled = isDisabled;
    }
}
