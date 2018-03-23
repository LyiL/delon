import {Injectable} from "@angular/core";
/**
 * 文件上传上配置
 */
@Injectable()
export class FileConfig{
    /**
     * 上传地址
     */
    url:string;

    /**
     * 跨域安全策略
     * @type {boolean}
     */
    withCredentials:boolean = false;

    /**
     * 是否多选
     * @type {boolean}
     */
    multiple:boolean = false;

    /**
     * 文件后缀
     * @type {string}
     */
    fileSuffix:string = "*";

    /**
     * 文件大小
     * @type {string}
     */
    fileSize:string = "3M";

    /**
     * 参数
     * @type {{}}
     */
    params:{[key:string]:any} = {};

    /**
     * 就否自动上传，默认为true
     * @type {boolean}
     */
    autoUpload:boolean = true;

    /**
     * 请求方法
     * @type {string}
     */
    method:string = "POST";

    /**
     * 请求头配置
     * @type {{}}
     */
    reqHeaders:any = {};

    /**
     * 后端接收文件参数，默认为file
     * @type {string}
     */
    fieldName: string = 'file';

    /**
     * 是否本地预览
     * @type {boolean}
     */
    previewUrl:boolean = false;
    /**
     * 图片预览地址前缀
     * @type {string}
     */
    previewSuffix:string = "/assets/"

    /**
     * 是否计算上传速度
     * @type {boolean}
     */
    calculateSpeed:boolean=false;

    /**
     * 重置文件
     * @type {boolean}
     */
    fieldReset:boolean = true;
    /**
     * 可选后缀
     * @type {string}
     */
    allowedExtensions:string = "*.*";
    /**
     * 过滤后缀
     * */
    filterExtensions:string;

    fileUploadFormatErrMsg:string = "上传错误, 请以正确格式上传！({0})";

    fileUploadSizeErrMsg:string = "您上传的文件过大,请上传【{0}】之内的文件";
}
/**
 * 上传文件对象
 */
export class UploadedFile {
    id: string;
    status: number;
    statusText: string;
    progress: Object;
    originalName: string;
    size: number;
    response: string;
    done: boolean;
    error: boolean;
    abort: boolean;
    startTime: number;
    endTime: number;
    speedAverage: number;
    speedAverageHumanized: string;

    constructor(id: string, originalName: string, size: number) {
        this.id = id;
        this.originalName = originalName;
        this.size = size;
        this.progress = {
            loaded: 0,
            total: 0,
            percent: 0,
            speed: 0,
            speedHumanized: null
        };
        this.done = false;
        this.error = false;
        this.abort = false;
        this.startTime = new Date().getTime();
        this.endTime = 0;
        this.speedAverage = 0;
        this.speedAverageHumanized = null;
    }

    setProgres(progress: Object): void {
        this.progress = progress;
    }

    setError(): void {
        this.error = true;
        this.done = true;
    }

    setAbort(): void {
        this.abort = true;
        this.done = true;
    }

    onFinished(status: number, statusText: string, response: string): void {
        this.endTime = new Date().getTime();
        this.speedAverage = this.size / (this.endTime - this.startTime) * 1000;
        this.speedAverage = parseInt(<any>this.speedAverage, 10);
        this.speedAverageHumanized = humanizeBytes(this.speedAverage);
        this.status = status;
        this.statusText = statusText;
        this.response = response;
        this.done = true;
    }
}

export class UploadRejected {
    public static get EXTENSION_NOT_ALLOWED():string { return 'ExtensionNotAllowed'; }
    public static get MAX_SIZE_EXCEEDED():string { return 'MaxSizeExceeded'; }

    file: any;
    reason: string;
}

export function humanizeBytes(bytes: number): string {
    if (bytes === 0) {
        return '0 Byte';
    }
    let k = 1024;
    const sizes: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let i: number = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i] + '/s';
}
