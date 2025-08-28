import { AfterViewInit, Component, computed, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-analytics',
  imports: [SharedModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export default class AnalyticsComponent implements OnInit {
  dashboardCardStats = signal<analyticsDashboardStats | null>(null);
  clickOverTime = signal<clicksOverTime[]>([]);
  topUrls = signal<urlDetails[]>([]);
  recentAccessLogs = signal<analytics[]>([]);
  isLoadingData = signal<boolean>(true);
  chartInstance: Chart | null = null;

  constructor(private analyticService: AnalyticsService) {}

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
      },
      error: (error) => console.error('Failed to top urls', error),
    });
  }
}
