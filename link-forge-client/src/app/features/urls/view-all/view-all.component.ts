import { ChangeDetectorRef, Component, effect, OnInit, signal } from '@angular/core';
import { urlDetails } from '../../../core/interfaces/url-details.model';
import { UrlService } from '../../../core/services/url.service';
import { SharedModule } from '../../../core/shared/shared.module';
import { environment } from '../../../../environments/environment';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-view-all',
  imports: [SharedModule, PaginationComponent],
  standalone: true,
  templateUrl: './view-all.component.html',
  styleUrl: './view-all.component.scss',
})
export default class ViewAllComponent implements OnInit {
  urls = signal<urlDetails[]>([]);
  searchedUrls = signal<urlDetails[]>([]);
  paginatedUrls = signal<urlDetails[]>([]);
  searchText: string = '';
  isLoadingData = signal<boolean>(true);

  // Pagination properties
  currentPage = signal(1);
  itemsPerPage = signal(10);
  itemsPerPageOptions = [1, 5, 10, 20, 50];

  constructor(private urlService: UrlService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.refresh();
  }

  private loadAllUrls(): void {
    this.isLoadingData.set(true);
    this.urlService.getAllShortUrls().subscribe({
      next: (urls) => {
        this.urls.set(urls);
        this.searchedUrls.set(urls);
        this.updatePagination();
        this.isLoadingData.set(false);
        this.cdr.detectChanges(); // Force view update
      },
      error: (err) => {
        console.error('Failed to fetch URLs:', err);
        this.isLoadingData.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(): void {
    const query = this.searchText.toLowerCase().trim();
    const filtered = this.urls().filter((url) =>
      Object.values(url).some((val) => val?.toString().toLowerCase().includes(query))
    );

    this.searchedUrls.set(filtered);
    this.currentPage.set(1);
    this.updatePagination();
  }

  copyShortUrl(shortUrl: string): void {
    const fullUrl = `${environment.apiUrl}/urls/resolve/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Short URL copied to clipboard!');
    });
  }

  calculateDaysLeft(expiryDate: string): number {
    console.log('Data form andpoint rsponse', expiryDate);
    const today = new Date();
    const expires = new Date(expiryDate);
    console.log('Converted with newDate', expires);
    const diff = Math.ceil((expires.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  async refresh() {
    this.loadAllUrls();
    effect(() => {
      this.updatePagination();
    });
  }

  /*
Pagination Controls and methods
*/
  updatePagination(): void {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    const paginated = this.searchedUrls().slice(startIndex, endIndex);
    this.paginatedUrls.set(paginated);
  }

  goToPage(page: number): void {
    this.currentPage.set(page);
    this.updatePagination();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage.set(Number(itemsPerPage));
    this.currentPage.set(1);
    this.updatePagination();
  }

  get totalPages(): number {
    return Math.ceil(this.searchedUrls().length / this.itemsPerPage());
  }
}
