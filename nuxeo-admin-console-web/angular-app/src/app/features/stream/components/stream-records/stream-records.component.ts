import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { StreamService } from "../../services/stream.service";
import { Subscription } from "rxjs";
import { STREAM_LABELS } from "../../stream.constants";
@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"]
})

export class StreamRecordsComponent implements OnInit, OnDestroy {
  @Input() records: { type?: string }[] = [];
  @Input() recordCount = 0;
  isFetchingRecords = false;
  isFetchingRecordsSubscription: Subscription = new Subscription();
  STREAM_LABELS = STREAM_LABELS;

  constructor(private streamService: StreamService) { }

  ngOnInit(): void {
    this.isFetchingRecordsSubscription =
      this.streamService.isFetchingRecords.subscribe(
        (status) => {
          this.isFetchingRecords = status;
        }
      );
  }

  insertCount(label: string): string {
    return label.replace('{{ recordCount }}', this.recordCount as unknown as string);
  }

  ngOnDestroy(): void {
    this.isFetchingRecordsSubscription?.unsubscribe();
  }
}
