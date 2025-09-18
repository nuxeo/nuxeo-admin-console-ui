import { StreamComponent } from "./components/stream.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ConsumerThreadPoolComponent } from "./components/consumer-thread-pool/consumer-thread-pool.component";
import { ChangeConsumerPositionComponent } from "./components/change-consumer-position/change-consumer-position.component";
export const StreamRoutes: Route[] = [
  {
    path: "",
    component: StreamComponent,
    children: [
      {
        path: "consumer",
        component: ConsumerThreadPoolComponent,
      },
      {
        path: 'change-consumer-position',
        component: ChangeConsumerPositionComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(StreamRoutes)],
  exports: [RouterModule],
})
export class StreamRoutingModule { }
