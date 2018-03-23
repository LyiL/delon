import {Component, Renderer2, Input} from "@angular/core";
import {ImageType} from "./interface";
import {ImagePreviewService} from "./image-preview.service";

@Component({
    selector:'image-preview',
    templateUrl:'./image-preview.component.html',
    styleUrls:['./image-preview.less']
})
export class ImagePreviewComponent{
    public images:ImageType[] = [];           //图片数据
    public currentIndex:number = 0;    //当前显示下标
    public showViewer:boolean = false;//是否显示
    public imgScale:number = 1; //图片原始比例
    public imgRotateDirection:number = 0; //图片旋转角度
    public isLoadError:boolean = false;//是否加载到图片

    @Input()
    public defErrImgPath:string = 'webassets/images/img_load_err.png';
    @Input()
    public imgLoadHint:string = '图片资源加载失败';

    constructor(private imgService:ImagePreviewService,private render2:Renderer2){
        //监控图片资源
        this.imgService.imagesLoaded$.subscribe((images:ImageType[])=>{
            this.images = images;
        });

        //监控显示下标
        this.imgService.showImageByIndex$.subscribe((index)=>{
            this.currentIndex = index;
            if(this.images && this.images.length > 0){
                this.images.forEach((image)=>image ? image['active'] = false:void(0));
                this.images[this.currentIndex]['active'] = true;
            }
        });
        //监控是否显示控件
        this.imgService.showImageViewerChanged$.subscribe(showViewer=>{
            this.showViewer = showViewer;
        });
    }

    /**
     * 是否显示左侧翻页按钮
     * @returns {boolean}
     */
    leftArrowActive():boolean{
        return this.currentIndex > 0;
    }

    /**
     * 是否显示右侧翻页按钮
     * @returns {boolean}
     */
    rightArrowActive():boolean{
        return this.currentIndex < this.images.length - 1;
    }

    /**
     * 判断图片预览窗
     * @param e
     */
    closeImagePreview(e:MouseEvent){
        this.images && this.images.length > 0 && this.images.forEach((image)=>image ? image['active'] = false:void(0));
        this.imgService.showImageViewer(false);
    }

    onShowImageLoad(image:any){
        this.images[this.currentIndex]['originalHeight'] = image.height;
        this.images[this.currentIndex]['originalWidth'] = image.width;
        this.calcImageSize(window.innerWidth - 253,window.innerHeight);
    }

    onResize(){
        let screenWidth = window.innerWidth - 253;
        let screenHeight = window.innerHeight;
        this.calcImageSize(screenWidth,screenHeight);
    }

    public calcImageSize(maxWidth, maxHeight){
        let iwidth = maxWidth; //定义允许图片宽度
        let iheight = maxHeight; //定义允许图片高度
        let _curImg = this.images[this.currentIndex];
        let curWidth = _curImg['originalWidth'];
        let curHeight = _curImg['originalHeight'];
        if(curWidth>0 && curHeight>0){
            if(curWidth/curHeight>= iwidth/iheight){
                if(curWidth>iwidth){
                    _curImg['width']=iwidth;
                    _curImg['height']=(curHeight*iwidth)/curWidth;
                }
            } else{
                if(curHeight>iheight){
                    _curImg['height']=iheight;
                    _curImg['width']=(curWidth*iheight)/curHeight;
                }
            }
        }
    }

    /**
     *
     * @param direction (-1: left, 1: right)
     * @param swipe
     */
    navigate(direction: number, swipe: any){
        if((direction === 1 && this.currentIndex >= this.images.length - 1) ||
            (direction === -1 && this.currentIndex <= 0)){
            return false;
        }
        this.imgScale = 1;
        this.currentIndex += direction
    }

    /**
     * 缩放功能
     * @param narrow :number -1 缩小  1 放大
     */
    zoom(narrow:number,img:any){
        if(narrow == -1 && this.imgScale > 0.6){
            this.imgScale -= 0.1;
        }else if(narrow == 1 && this.imgScale < 2){
            this.imgScale += 0.1;
        }
        //rotate(-45deg)
        this.render2.setStyle(img,'transform','translateY(-50%) scale('+this.imgScale+')');
    }

    /**
     * 旋转
     * @param direction 方向 -1 左  1 右
     */
    rotate(direction:number,img:any){
        if((direction === 1 && this.imgRotateDirection > 360) ||
            (direction === -1 && this.imgRotateDirection < -360)){
            return false;
        }

        this.imgRotateDirection += ( direction === 1 ? 90 : -90);

        this.render2.setStyle(img,'transform','translateY(-50%) rotate('+this.imgRotateDirection+'deg)');
    }

    onLoadImgError(e:Event){
        let target = e.target;
        if(target && target['src']){
            target['src'] = this.defErrImgPath;
        }
        this.isLoadError = true;
    }
}
