import {Injectable, EventEmitter} from "@angular/core";
import {FileConfig, UploadedFile, humanizeBytes} from "./file-config";
import {AlainI18NService} from "@delon/theme";
import {strFormat} from "../utils/utils";
/**
 * 文件上传服务类
 */
export class FileUploadService{
    /**
     * 上传队列
     * @type {Array}
     * @private
     */
    private _queue:Array<any> = [];
    /**
     * 上传触发器
     * @type {EventEmitter}
     * @private
     */
    public _emitter:EventEmitter<any> = new EventEmitter();
    /**
     * 上传进度触发器
     * @type {EventEmitter}
     * @private
     */
    public _progress:EventEmitter<any> = new EventEmitter();
    /**
     * 上传终止触发器
     * @type {EventEmitter}
     * @private
     */
    public _abort:EventEmitter<any> = new EventEmitter();
    /**
     * 上传异常触发器
     * @type {EventEmitter}
     * @private
     */
    public _error:EventEmitter<any> = new EventEmitter();
    /**
     * 预览触发器
     * @type {EventEmitter}
     */
    public _previewEmitter:EventEmitter<any> = new EventEmitter();

    set options(_options:FileConfig){
        this._options = Object['assign'](this._options,_options);
    }
    get options(){
        return this._options;
    }
    private _options:FileConfig = new FileConfig();

    constructor(){
        // Object['assign'](this._options,fileConfig);
    }

    /**
     * 上传队列
     */
    public uploadFilesInQueue(){
        let newFiles = this._queue.filter((f) => { return !f.uploading; });
        newFiles.forEach((f) => {
            this.uploadFile(f);
        });
    }

    /**
     * 上传文件
     * @param file
     */
    public uploadFile(file: any):any{
        let xhr = new XMLHttpRequest();
        let form = new FormData();
        form.append(this.options.fieldName, file, file.name);

        Object.keys(this.options.params).forEach((k)=>{
            form.append(k, this.options.params[k]);
        });

        let uploadingFile = new UploadedFile(
            this.generateRandomIndex(),
            file.name,
            file.size
        );

        let queueIndex = this._queue.indexOf(file);

        let time: number = new Date().getTime();
        let load = 0;
        let speed = 0;
        let speedHumanized: string = null;

        xhr.upload.onprogress = (e: ProgressEvent) => {
            if (e.lengthComputable) {
                if (this.options.calculateSpeed) {
                    time = new Date().getTime() - time;
                    load = e.loaded - load;
                    speed = load / time * 1000;
                    speed = parseInt(<any>speed, 10);
                    speedHumanized = humanizeBytes(speed);
                }

                let percent = Math.round(e.loaded / e.total * 100);
                if (speed === 0) {
                    uploadingFile.setProgres({
                        total: e.total,
                        loaded: e.loaded,
                        percent: percent
                    });
                } else {
                    uploadingFile.setProgres({
                        total: e.total,
                        loaded: e.loaded,
                        percent: percent,
                        speed: speed,
                        speedHumanized: speedHumanized
                    });
                }
                this._progress.emit(uploadingFile);
            }
        };

        xhr.upload.onabort = (e: Event) => {
            uploadingFile.setAbort();
            this._abort.emit(uploadingFile);
        };

        xhr.upload.onerror = (e: Event) => {
            uploadingFile.setError();
            this._error.emit(uploadingFile);
        };

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                uploadingFile.onFinished(
                    xhr.status,
                    xhr.statusText,
                    xhr.response
                );
                this.removeFileFromQueue(queueIndex);
                this._emitter.emit(uploadingFile);
            }
        };

        xhr.open(this.options.method, this.options.url, true);
        xhr.withCredentials = this.options.withCredentials;

        if (this.options.reqHeaders) {
            Object.keys(this.options.reqHeaders).forEach((key) => {
                xhr.setRequestHeader(key, this.options.reqHeaders[key]);
            });
        }

        xhr.send(form);

    }

    public addFilesToQueue(files: File[]): void {
        files.forEach((file: File, i: number) => {
            let hint:string = undefined;
            if(!this.hasFileSuffix(file.name)){
                this._error.emit({error:1000,message: strFormat(this.options.fileUploadFormatErrMsg,this.options.fileSuffix)});
                return;
            }
            if(file.size > this.transBytes()){
                this._error.emit({error:1001,message:strFormat(this.options.fileUploadSizeErrMsg,this.options.fileSize)});
                return;
            }
            if (this.isFile(file) && !this.inQueue(file)) {
                this._queue.push(file);
            }
        });

        if (this.options.previewUrl) {
            files.forEach(file => this.createFileUrl(file));
        }

        if (this.options.autoUpload) {
            this.uploadFilesInQueue();
        }
    }

    public transBytes():number{
        let _size:number = Number(this.options.fileSize.replace(/^(\d+)(K|M|G|TB)+/,'$1'));
        let _unit = this.options.fileSize.replace(/^(\d+)(K|KB|M|G|TB)+/,'$2').toLocaleUpperCase();
        let _defByte = 1024;
        if(_unit == 'K' || _unit == 'KB'){
            return _size * _defByte;
        }else if(_unit == 'M'){
            return _size * Math.pow(_defByte,2);
        }else if(_unit == 'G'){
            return _size * Math.pow(_defByte,3);
        }else if(_unit == 'TB'){
            return _size * Math.pow(_defByte,4);
        }else{
            return _size;
        }
    }

    /**
     * 判断文件格式
     * @param fileName
     * @returns {boolean}
     */
    public hasFileSuffix(fileName){
        if(this.options.fileSuffix == '*'){
            return true;
        }
        let _suffix = fileName.substring(fileName.lastIndexOf('.'));
        let _fileSuffixs:Array<any> = this.options.fileSuffix.split(';');
        let flag = false;
        _fileSuffixs.forEach((value,ind)=>{
            if(_suffix == value){
                flag = true;
            }
        });
        return flag;
    }

    public createFileUrl(file: File){
        let reader: FileReader = new FileReader();
        reader.addEventListener('load', () => {
            this._previewEmitter.emit(reader.result);
        });
        reader.readAsDataURL(file);
    }

    /**
     * 从队列中删除文件
     * @param i
     */
    public removeFileFromQueue(i: number): void {
        this._queue.splice(i, 1);
    }

    /**
     * 清除队列
     */
    public clearQueue(): void {
        this._queue = [];
    }

    /**
     * 获取队列大小
     * @returns {number}
     */
    public getQueueSize(): number {
        return this._queue.length;
    }

    /**
     * 是否在队列中
     * @param file
     * @returns {boolean}
     */
    private inQueue(file: any): boolean {
        let fileInQueue = this._queue.filter((f) => { return f === file; });
        return fileInQueue.length ? true : false;
    }

    /**
     * 是否为文件
     * @param file
     * @returns {boolean|any}
     */
    private isFile(file: any): boolean {
        return file !== null && (file instanceof Blob || (file.name && file.size));
    }

    private generateRandomIndex(): string {
        return Math.random().toString(36).substring(7);
    }
}


