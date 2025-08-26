import { Component, EventEmitter, Input, Output } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { SharedModule } from '../../../../core/shared/shared.module';

@Component({
  selector: 'app-qr-model',
  imports: [SharedModule, QRCodeComponent],
  standalone: true,
  templateUrl: './qr-model.component.html',
  styleUrl: './qr-model.component.scss',
})
export class QrModelComponent {
  @Input() url: string = '';
  @Output() close = new EventEmitter<void>();

  downloadQRCode(qrCanvas: any) {
    const canvas = qrCanvas.qrcElement.nativeElement.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'short-url-qr.png';
    link.click();
  }

  emitClose() {
    this.close.emit();
  }
}
