import { StreamComponent } from "./components/stream.component";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Route } from "@angular/router";
export const StreamRoutes: Route[] = [
  {
    path: "",
    component: StreamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(StreamRoutes)],
  exports: [RouterModule],
})
export class StreamRoutingModule { }
