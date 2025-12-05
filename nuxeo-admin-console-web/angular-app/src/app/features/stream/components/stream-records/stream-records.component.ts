import {
  ChangeDetectionStrategy,
  Component,
  Input
} from "@angular/core";
@Component({
  selector: "stream-records",
  templateUrl: "./stream-records.component.html",
  styleUrls: ["./stream-records.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})

export class StreamRecordsComponent {
  @Input() records: { type?: string }[] = [];
  @Input() clearSearch = false;
}
