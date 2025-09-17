import { StreamComponent } from "./components/stream.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ConsumerThreadPoolComponent } from "./components/consumer-thread-pool/consumer-thread-pool.component";
import { ChangeConsumerPositionComponent } from "./components/consumer-position/change-consumer-position/change-consumer-position.component";
import { ConsumerPositionComponent } from "./components/consumer-position/consumer-position.component";
import { FetchConsumerPositionComponent } from "./components/consumer-position/fetch-consumer-position/fetch-consumer-position.component";
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
        path: "consumer-position",
        component: ConsumerPositionComponent,
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "change-consumer-position",
          },
          {
            path: "change-consumer-position",
            component: ChangeConsumerPositionComponent,
          },
          {
            path: "get-consumer-position",
            component: FetchConsumerPositionComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(StreamRoutes)],
  exports: [RouterModule],
})
export class StreamRoutingModule {}
