import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StreamComponent } from "./components/stream.component";
import { StreamFormComponent } from "./components/stream-form/stream-form.component";
import { StreamRoutingModule } from "./stream-routing.module";
import { StreamRecordsComponent } from "./components/stream-records/stream-records.component";

@NgModule({
  declarations: [StreamComponent, StreamFormComponent, StreamRecordsComponent],
  imports: [CommonModule, StreamRoutingModule],
})
export class StreamModule {}
