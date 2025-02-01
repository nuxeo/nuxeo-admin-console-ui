import {
  Component,
  Input,
  ViewEncapsulation,
} from "@angular/core";
@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StreamRecordsComponent {
  @Input() records: { type?: string }[] = [];
  @Input() recordCount: number = 0;
}
