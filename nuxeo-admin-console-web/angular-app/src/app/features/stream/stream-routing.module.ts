import { StreamComponent } from "./components/stream.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
import { ConsumerThreadPoolComponent } from "./components/consumer-thread-pool/consumer-thread-pool.component";
import { ChangeConsumerPositionComponent } from "./components/consumer-position/change-consumer-position/change-consumer-position.component";
import { ConsumerPositionComponent } from "./components/consumer-position/consumer-position.component";
import { FetchConsumerPositionComponent } from "./components/consumer-position/fetch-consumer-position/fetch-consumer-position.component";
import { GetScalingAnalysisComponent } from "./components/get-scaling-analysis/get-scaling-analysis.component";
import { NuxeoStreamProcessorInfoComponent } from "./components/nuxeo-stream-processor-info/nuxeo-stream-processor-info.component";
export const StreamRoutes: Route[] = [
  {
    path: "",
    component: StreamComponent,
    title: "Stream Records",
    children: [
      {
        path: "consumer",
        component: ConsumerThreadPoolComponent,
        title: "Consumer Thread Pool",
      },
      {
        path: "consumer-position",
        component: ConsumerPositionComponent,
        children: [
          {
            path: "",
            pathMatch: "full",
            redirectTo: "get-consumer-position",
          },
          {
            path: "change-consumer-position",
            component: ChangeConsumerPositionComponent,
            title: "Change Consumer Position"
          },
          {
            path: "get-consumer-position",
            component: FetchConsumerPositionComponent,
            title: "Get Consumer Position"
          },
        ],
      },
      {
        path: 'get-scaling-analysis',
        component:GetScalingAnalysisComponent,
        title: 'Scaling Analysis'
      },
      {
        path: "nuxeo-stream-processor-info",
        component: NuxeoStreamProcessorInfoComponent,
        title: "Nuxeo Stream Processor Info",
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(StreamRoutes)],
  exports: [RouterModule],
})
export class StreamRoutingModule {}
