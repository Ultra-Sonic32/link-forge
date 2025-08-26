import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createUrl } from '../../../core/interfaces/url-details.model';
import { UrlService } from '../../../core/services/url.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { environment } from '../../../../environments/environment';
import { QrModelComponent } from '../../../components/shared/components/qr-model/qr-model.component';

@Component({
  selector: 'app-generate-short-url',
  imports: [SharedModule, QrModelComponent],
  templateUrl: './generate-short-url.component.html',
  styleUrl: './generate-short-url.component.scss',
  standalone: true,
})
export default class GenerateShortUrlComponent {
  createUrlForm: FormGroup;
  copyButton = signal('Copy');
  copied = signal(false);
  shortenedUrl: string | null = null;
  showQrModal = signal(false);

  constructor(
    private urlService: UrlService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.createUrlForm = this.fb.group({
      originalUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+$/i)]],
      customKey: [''],
      neverExpire: [false],
    });
  }

  onGenerate(): void {
    if (this.createUrlForm.invalid) {
      this.createUrlForm.markAllAsTouched();
      return;
    }

    const urlData: createUrl = this.createUrlForm.value;

    this.urlService.generateShortUrl(urlData).subscribe({
      next: (response) => {
        this.shortenedUrl = `${environment.apiUrl}/urls/resolve/${response.shortUrl}`;
        this.createUrlForm.reset();
        this.copyButton.set('Copy');
        this.copied.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to shorten URL: ', err);
      },
    });
  }

  copyToClipboard() {
    if (this.shortenedUrl) {
      navigator.clipboard.writeText(this.shortenedUrl).then(() => {
        this.copyButton.set('Copied');
        this.copied.set(true);
        this.cdr.detectChanges();

        setTimeout(() => {
          this.copyButton.set('Copy');
          this.copied.set(false);
          this.cdr.detectChanges();
        }, 2000);
      });
    }
  }

  downloadQRCode(): void {
    this.showQrModal.set(true);
  }

  closeModal(): void {
    this.showQrModal.set(false);
  }

  isInvalid(controlName: string): boolean {
    const control = this.createUrlForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }
}
