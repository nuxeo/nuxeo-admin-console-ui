import {
  Component,
  Input
} from "@angular/core";

@Component({
  selector: "stream-records-status",
  templateUrl: "./stream-records-status.component.html",
  styleUrls: ["./stream-records-status.component.scss"]
})

export class StreamRecordsStatusComponent {
  @Input() recordsFetchedStatusText = '';
  @Input() recordCount = 0;
  @Input() isFetchingRecords = false;
}