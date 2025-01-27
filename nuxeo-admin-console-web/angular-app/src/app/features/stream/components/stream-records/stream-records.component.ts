import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { StreamsState } from "../../store/reducers";
@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamRecordsComponent implements OnInit {
  @Input() records: unknown[] = [];
 // records$!: Observable<unknown[]>;

  constructor(private store: Store<{ stream: StreamsState }>) {}

  ngOnInit(): void {
   // this.records$ = this.store.select((state) => state?.stream?.records);
  }

  ngOnChanges() {
   console.log(this.records);
  }
}
