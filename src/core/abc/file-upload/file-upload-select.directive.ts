import {Directive, HostListener, Input, Output, EventEmitter, ElementRef} from "@angular/core";
import {UploadRejected} from "./file-config";
import {FileUploadService} from "./file-upload.service";
import {FileConfig} from "./file-config";
/**
 * 选择文件上传
 */
@Directive({
    selector:"[fileUploadSelect]"
})
export class FileUploadSelectDirective{
    @Input() events: EventEmitter<any>;
    @Output() onUpload: EventEmitter<any> = new EventEmitter();
    @Output() onPreviewData: EventEmitter<any> = new EventEmitter();
    @Output() onUploadRejected: EventEmitter<UploadRejected> = new EventEmitter<UploadRejected>();
    @Output() onError:EventEmitter<any> = new EventEmitter();

    @Input()
    get options(): any {
        return this._options;
    }
    set options(value: any) {
        if(value){
            this._options = value;
        }
        this.uploader.options = this.options;
    }
    _options:any = {};
    files: any[] = [];
    uploader: FileUploadService;

    constructor(public el: ElementRef) {
        this.uploader = new FileUploadService();
        setTimeout(() => {
            this.uploader.options = this.options;
        });

        this.uploader._emitter.subscribe((data: any) => {
            this.onUpload.emit(data);
            if (data.done) {
                this.files = this.files.filter(f => f.name !== data.originalName);
                if (this.uploader.options.fieldReset) {
                    this.el.nativeElement.value = '';
                }
            }
        });

        this.uploader._error.subscribe((res)=>{
            this.onError.emit(res);
        });

        this.uploader._previewEmitter.subscribe((data: any) => {
            this.onPreviewData.emit(data);
        });

        setTimeout(() => {
            if (this.events) {
                this.events.subscribe((data: string) => {
                    if (data === 'startUpload') {
                        this.uploader.uploadFilesInQueue();
                    }
                });
            }
        });
    }

    filterFilesByExtension(): void {
        this.files = this.files.filter(f => {
            let ext: string = f.name.split('.').pop();

            if(this.options.filterExtensions && this.options.filterExtensions.indexOf(ext) !== -1){
                return false;
            }
            if (this.options.allowedExtensions === '*.*' || this.options.allowedExtensions.indexOf(f.type) !== -1 || this.options.allowedExtensions.indexOf(ext) !== -1) {
                return true;
            }

            this.onUploadRejected.emit({file: f, reason: UploadRejected.EXTENSION_NOT_ALLOWED});

            return false;
        });
    }

    @HostListener('change') onChange(event): void {
        this.files = Array['from'](this.el.nativeElement.files);
        if (this.options.filterExtensions && this.options.allowedExtensions) {
            this.filterFilesByExtension();
        }

        if (this.uploader && this.files.length) {
            this.uploader.addFilesToQueue(this.files);
        }
    }
}
