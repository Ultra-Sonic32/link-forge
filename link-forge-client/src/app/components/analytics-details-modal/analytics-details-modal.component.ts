import { Component, Input } from '@angular/core';
import { analytics } from '../../core/interfaces/analytics.model';
import { SharedModule } from '../../core/shared/shared.module';

@Component({
  selector: 'app-analytics-details-modal',
  imports: [SharedModule],
  standalone: true,
  templateUrl: './analytics-details-modal.component.html',
  styleUrl: './analytics-details-modal.component.scss',
})
export class AnalyticsDetailsModalComponent {
  @Input() log: analytics | null = null;
  @Input() show = false;

  close(): void {
    this.show = false;
  }
}
