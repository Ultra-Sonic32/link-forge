import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createUrl } from '../../../core/interfaces/url-details.model';
import { UrlService } from '../../../core/services/url.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-generate-short-url',
  imports: [SharedModule],
  templateUrl: './generate-short-url.component.html',
  styleUrl: './generate-short-url.component.scss',
  standalone: true,
})
export default class GenerateShortUrlComponent {
  createUrlForm: FormGroup;
  copyButton: string = 'copy';
  copied: boolean = false;

  shortenedUrl: string | null = null;

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
      },
      error: (err) => {
        console.error('Failed to shorten URL: ', err);
      },
    });
  }

  copyToClipboard() {
    if (this.shortenedUrl) {
      navigator.clipboard.writeText(this.shortenedUrl).then(() => {
        this.copied = true;
        this.copyButton = 'Copied';
        this.cdr.detectChanges();
        setTimeout(() => {
          this.copied = false;
          this.copyButton = 'Copy';
          this.cdr.detectChanges();
        }, 2000);
      });
    }
  }

  downloadQRCode() {}

  isInvalid(controlName: string): boolean {
    const control = this.createUrlForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }
}
