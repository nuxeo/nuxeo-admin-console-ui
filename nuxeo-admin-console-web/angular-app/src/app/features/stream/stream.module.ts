import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StreamComponent } from "./components/stream.component";
import { StreamFormComponent } from "./components/stream-form/stream-form.component";
import { StreamRoutingModule } from "./stream-routing.module";
import { StreamRecordsComponent } from "./components/stream-records/stream-records.component";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from "@angular/material/card";
import { StreamRecordsStatusComponent } from "./components/stream-records-status/stream-records-status.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from "@angular/material/tabs";
import { ConsumerThreadPoolComponent } from './components/consumer-thread-pool/consumer-thread-pool.component';
import { ChangeConsumerPositionComponent } from './components/change-consumer-position/change-consumer-position.component';
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { ISO_DATE_FORMATS } from "./stream.constants";
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    StreamComponent,
    StreamFormComponent,
    StreamRecordsComponent,
    StreamRecordsStatusComponent,
    ConsumerThreadPoolComponent,
    ChangeConsumerPositionComponent,
  ],
  imports: [
    CommonModule,
    StreamRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
  ],
  providers: [
   { provide: MAT_DATE_FORMATS, useValue: ISO_DATE_FORMATS },
  ],
})
export class StreamModule {}
