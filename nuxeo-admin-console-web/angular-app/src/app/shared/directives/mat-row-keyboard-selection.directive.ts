<div class="icon-text-container">
  <mat-icon class="success-icon" *ngIf="data.panelClass === 'success-snack'; else errorIcon">check</mat-icon>
  <ng-template #errorIcon>
    <mat-icon class="error-icon">error</mat-icon>
  </ng-template>
  <span>{{data.message}}</span>
  <button (click)="close()">
    <mat-icon>close</mat-icon>
  </button>
</div>