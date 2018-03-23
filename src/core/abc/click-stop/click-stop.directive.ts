import {Directive, Renderer2, ElementRef, EventEmitter, Output} from "@angular/core";
@Directive({
    selector:'[click.stop]'
})
export class ClickStopDirective{
    @Output("click.stop") stopPropEvent = new EventEmitter();
    unsubscribe: () => void;

    constructor(
        private renderer: Renderer2, // Angular 2.x导入Renderer
        private element: ElementRef) {
    }

    ngOnInit() {
        this.unsubscribe = this.renderer.listen(
            this.element.nativeElement, 'click', event => {
                event.stopPropagation();
                this.stopPropEvent.emit(event);
            });
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
