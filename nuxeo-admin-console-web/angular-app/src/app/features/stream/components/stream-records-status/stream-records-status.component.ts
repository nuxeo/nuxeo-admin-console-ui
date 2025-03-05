import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "stream-records-status",
  templateUrl: "./stream-records-status.component.html",
  styleUrls: ["./stream-records-status.component.scss"]
})

export class StreamRecordsStatusComponent implements OnChanges {
  @Input() recordsFetchedStatusText = '';
  @Input() recordCount = 0;
  @Input() isFetchingRecords = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.recordsFetchedStatusText = changes["recordsFetchedStatusText"]?.currentValue;
  }
}