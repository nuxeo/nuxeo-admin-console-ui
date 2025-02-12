import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,

} from "@angular/core";
import { StreamService } from "../../services/stream.service";
import { Subscription } from "rxjs";
import { STREAM_LABELS } from "../../stream.constants";

@Component({
  selector: "stream-records-status",
  templateUrl: "./stream-records-status.component.html",
  styleUrls: ["./stream-records-status.component.scss"]
})

export class StreamRecordsStatusComponent implements OnInit, OnDestroy {
  // isFetchingRecords = false;
  // isFetchingRecordsSubscription: Subscription = new Subscription();
  @Input() recordsFetchedStatus = '';
  @Input() recordCount = 0;

  constructor(private streamService: StreamService) { }

  ngOnInit(): void {
    // this.isFetchingRecordsSubscription =
    //   this.streamService.isFetchingRecords.subscribe(
    //     (status) => {
    //       this.isFetchingRecords = status;
    //     }
    //   );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recordsFetchedStatus = changes["recordsFetchedStatus"].currentValue;
  }

  ngOnDestroy(): void {
   // this.isFetchingRecordsSubscription?.unsubscribe();
  }
}