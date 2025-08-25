import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { createUrl } from '../../../core/interfaces/url-details.model';
import { UrlService } from '../../../core/services/url.service';
import { SharedModule } from '../../../core/shared/shared.module';

@Component({
  selector: 'app-generate-short-url',
  imports: [SharedModule],
  templateUrl: './generate-short-url.component.html',
  styleUrl: './generate-short-url.component.scss',
  standalone: true,
})
export default class GenerateShortUrlComponent {
  createUrlForm: FormGroup;
  formData: createUrl = {
    originalUrl: '',
    customKey: '',
    neverExpire: false,
  };

  shortenedUrl: string | null = null;

  constructor(private urlService: UrlService, private fb: FormBuilder) {
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
        this.shortenedUrl = response.shortUrl;
        this.createUrlForm.reset();
      },
      error: (err) => {
        console.error('Failed to shorten URL: ', err);
      },
    });
  }

  copyToClipboard() {}

  openInNewTab() {}

  downloadQRCode() {}

  isInvalid(controlName: string): boolean {
    const control = this.createUrlForm.get(controlName);
    return !!(control && control.touched && control.invalid);
  }
}
