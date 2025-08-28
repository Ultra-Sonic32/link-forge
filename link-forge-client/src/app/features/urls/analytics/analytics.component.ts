import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  signal,
} from '@angular/core';
import {
  analytics,
  analyticsDashboardStats,
  clicksOverTime,
} from '../../../core/interfaces/analytics.model';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { getClickOverTimeLineChartConfig } from '../../../core/shared/chart-config.utils';
import { Chart } from 'chart.js';
import { SharedModule } from '../../../core/shared/shared.module';
import { urlDetails } from '../../../core/interfaces/url-details.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { environment } from '../../../../environments/environment.development';
import { AnalyticsDetailsModalComponent } from '../../../components/analytics-details-modal/analytics-details-modal.component';

@Component({
  selector: 'app-analytics',
  imports: [SharedModule, PaginationComponent, AnalyticsDetailsModalComponent],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export default class AnalyticsComponent implements OnInit {
  dashboardCardStats = signal<analyticsDashboardStats | null>(null);
  selectedTab = signal<'urls' | 'analytics'>('urls');
  clickOverTime = signal<clicksOverTime[]>([]);
  topUrls = signal<urlDetails[]>([]);
  recentAccessLogs = signal<analytics[]>([]);
  isLoadingData = signal<boolean>(true);
  chartInstance: Chart | null = null;
  selectedLog = signal<analytics | null>(null);
  showDetailsModal = signal<boolean>(false);

  // Pagination properties
  // Top URLs
  topUrlsCurrentPage = signal(1);
  topUrlsItemsPerPage = signal(10);
  paginatedUrls = signal<urlDetails[]>([]);

  // Analytics
  analyticsCurrentPage = signal(1);
  analyticsItemsPerPage = signal(10);
  paginatedAnalytics = signal<analytics[]>([]);

  constructor(private analyticService: AnalyticsService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.isLoadingData.set(true);
    try {
      await Promise.all([
        this.loadDashboardStats(),
        this.loadClickOverTime(),
        this.loadTopUrls(),
        this.loadRecentAnalytics(),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoadingData.set(false);
    }
  }

  /**
   *** Dashboard Stats Card
   **/
  private async loadDashboardStats() {
    this.analyticService.getDashboardStats().subscribe({
      next: (data) => this.dashboardCardStats.set(data),
      error: (err) => console.error('Failed to load dashboard stats', err),
    });
  }

  readonly totalUrls = computed(() => this.dashboardCardStats()?.totalUrls ?? 0);
  readonly totalClicks = computed(() => this.dashboardCardStats()?.totalClicks ?? 0);
  readonly mostClicked = computed(() => this.dashboardCardStats()?.mostClicked?.shortUrl ?? '--');
  readonly mostRecent = computed(() => this.dashboardCardStats()?.mostRecent?.shortUrl ?? '--');

  /**
   *** Clicks Over Time
   **/
  private async loadClickOverTime() {
    this.analyticService.getclickOverTime().subscribe({
      next: (data) => {
        this.clickOverTime.set(data);
        this.renderLineChart();
      },
      error: (error) => console.error('Failed to load clicks over time', error),
    });
  }

  private renderLineChart() {
    const ctx = document.getElementById('clicksLineChart') as HTMLCanvasElement;
    const data = this.clickOverTime();
    if (!data.length || !ctx) return;

    const config = getClickOverTimeLineChartConfig(data);
    this.chartInstance = new Chart(ctx, config);
  }

  /**
   *** Top 5 most popular urls
   **/
  private async loadTopUrls() {
    this.analyticService.gettopShortUrl().subscribe({
      next: (data) => {
        this.topUrls.set(data);
        this.updateTopUrlsPagination();
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to top urls', error),
    });
  }

  /**
   *** Load the recently access logs analytics
   **/
  private async loadRecentAnalytics() {
    this.analyticService.getRecentAccessLogs().subscribe({
      next: (data) => {
        this.recentAccessLogs.set(data);
        this.updateAnalyticsPagination();
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to top urls', error),
    });
  }

  /**
   * Helper Button for table
   */
  copyShortUrl(shortUrl: string): void {
    const fullUrl = `${environment.apiUrl}/urls/resolve/${shortUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Short URL copied to clipboard!');
    });
  }

  detailedInfoModal(log: analytics): void {
    this.selectedLog.set(log);
    this.showDetailsModal.set(true);
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
  }

  /**
   * Pagination Controls and methods
   */
  updateTopUrlsPagination(): void {
    const startIndex = (this.topUrlsCurrentPage() - 1) * this.topUrlsItemsPerPage();
    const endIndex = startIndex + this.topUrlsItemsPerPage();
    const paginated = this.topUrls().slice(startIndex, endIndex);
    this.paginatedUrls.set(paginated);
  }

  goToTopUrlsPage(page: number): void {
    this.topUrlsCurrentPage.set(page);
    this.updateTopUrlsPagination();
  }

  onTopUrlsItemsPerPageChange(itemsPerPage: number): void {
    this.topUrlsItemsPerPage.set(Number(itemsPerPage));
    this.topUrlsCurrentPage.set(1);
    this.updateTopUrlsPagination();
  }
  updateAnalyticsPagination(): void {
    const startIndex = (this.analyticsCurrentPage() - 1) * this.analyticsItemsPerPage();
    const endIndex = startIndex + this.analyticsItemsPerPage();
    const paginated = this.recentAccessLogs().slice(startIndex, endIndex);
    this.paginatedAnalytics.set(paginated);
  }

  goToAnalyticsPage(page: number): void {
    this.analyticsCurrentPage.set(page);
    this.updateAnalyticsPagination();
  }

  onAnalyticsItemsPerPageChange(itemsPerPage: number): void {
    this.analyticsItemsPerPage.set(Number(itemsPerPage));
    this.analyticsCurrentPage.set(1);
    this.updateAnalyticsPagination();
  }
}
