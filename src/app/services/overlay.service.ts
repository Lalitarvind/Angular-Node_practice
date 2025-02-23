import { Injectable, Injector } from '@angular/core';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  private overlayRef: OverlayRef | null = null;
  constructor(private overlay: Overlay,private injector: Injector) {}
  
  open(component:any,data:any={}):void{
    // Disable background scrolling
    document.body.style.overflow = 'hidden';
    this.overlayRef = this.overlay.create(this.getOverlayConfig());
    const injector = Injector.create({
      providers: [
        { provide: 'overlayData', useValue: data },
      ],
      parent: this.injector,
    });
    const portal = new ComponentPortal(component,null,injector);
    this.overlayRef.attach(portal)

    this.overlayRef.backdropClick().subscribe(() => this.close());

  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    // Re-enable background scrolling
    document.body.style.overflow = '';
  }

  private getOverlayConfig(): OverlayConfig {
    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      panelClass: 'overlay-panel',
      positionStrategy: this.overlay.position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }
}
