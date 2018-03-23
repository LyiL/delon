import {Component, OnInit} from "@angular/core";
import {ImagePreviewService, ImageType} from "@delon/abc";
@Component({
    selector:'detail',
    templateUrl:'./detail.component.html'
})
export class DetailComponent implements OnInit{

    constructor(private imagePreviewService:ImagePreviewService){}

    ngOnInit(){
        let imgs:Array<ImageType> = [{fieldName:'aa',imageUrl:'assets/img/933cc834a2d41c30175e8457e491e56f.jpg'}];
        this.imagePreviewService.loadImages(imgs);
    }

    _onImagePreview(){
        this.imagePreviewService.showImageViewer(true);
    }
}
