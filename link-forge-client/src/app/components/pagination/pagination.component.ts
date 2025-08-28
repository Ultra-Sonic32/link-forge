import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../core/shared/shared.module';

@Component({
  selector: 'app-pagination',
  imports: [SharedModule],
  standalone: true,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 10;
  @Input() totalItems: number = 0;
  @Input() itemsPerPageOptions: number[] = [5, 10, 20, 50];
  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get paginationPages(): number[] {
    const range = 2;
    const pages: number[] = [];
    const start = Math.max(this.currentPage - range, 1);
    const end = Math.min(this.currentPage + range, this.totalPages);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
