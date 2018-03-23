import {Directive, HostListener, EventEmitter, ElementRef, Input, Output} from "@angular/core";
import {UploadRejected, FileConfig} from "./file-config";
import {FileUploadService} from "./file-upload.service";
@Directive({
    selector:'[fileUploadDrop]'
})
export class FileUploadDropDirective{
    @Input() events: EventEmitter<any>;
    @Output() onUpload: EventEmitter<any> = new EventEmitter();
    @Output() onPreviewData: EventEmitter<any> = new EventEmitter();
    @Output() onFileOver:EventEmitter<any> = new EventEmitter();
    @Output() onUploadRejected: EventEmitter<UploadRejected> = new EventEmitter<UploadRejected>();

    _options:any = {};

    get options(): any {
        return this._options;
    }

    @Input('options')
    set options(value: any) {
        if(value){
            this._options = value;
        }
        this.uploader.options = this.options;
    }

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
            }
        });

        this.uploader._previewEmitter.subscribe((data: any) => {
            this.onPreviewData.emit(data);
        });

        setTimeout(() => {
            if (this.events instanceof EventEmitter) {
                this.events.subscribe((data: string) => {
                    if (data === 'startUpload') {
                        this.uploader.uploadFilesInQueue();
                    }
                });
            }
        });

        this.initEvents();
    }

    initEvents(): void {
        if (typeof this.el.nativeElement.addEventListener === 'undefined') {
            return;
        }

        this.el.nativeElement.addEventListener('drop', (e: any) => {
            e.stopPropagation();
            e.preventDefault();

            this.files = Array['from'](e.dataTransfer.files);
            if (this.files.length) {
                this.uploader.addFilesToQueue(this.files);
            }
        }, false);

        this.el.nativeElement.addEventListener('dragenter', (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);

        this.el.nativeElement.addEventListener('dragover', (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();
        }, false);
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

    @HostListener('change') onChange(): void {
        this.files = Array['from'](this.el.nativeElement.files);

        if (this.options.filterExtensions && this.options.allowedExtensions) {
            this.filterFilesByExtension();
        }

        if (this.files.length) {
            this.uploader.addFilesToQueue(this.files);
        }
    }

    @HostListener('dragover', ['$event'])
    public onDragOver():void {
        this.onFileOver.emit(true);
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave():any {
        this.onFileOver.emit(false);
    }
}
