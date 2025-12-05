import {
  ChangeDetectionStrategy,
  Component,
  Input
} from "@angular/core";

@Component({
  selector: "stream-records-status",
  templateUrl: "./stream-records-status.component.html",
  styleUrls: ["./stream-records-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class StreamRecordsStatusComponent {
  @Input() recordsFetchedStatusText = '';
  @Input() recordCount = 0;
  @Input() isFetchingRecords = false;
}