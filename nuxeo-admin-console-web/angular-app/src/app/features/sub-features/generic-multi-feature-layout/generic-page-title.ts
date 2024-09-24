import { ROUTES_TITLE } from './../../../layouts/menu-bar/menu-bar.constants';
import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { RouterStateSnapshot, TitleStrategy } from "@angular/router";
import {
  FeaturesKey,
  getFeatureKeyByValue,
} from "./generic-multi-feature-layout.mapping";


@Injectable({ providedIn: "root" })
export class GenericPageTitle extends TitleStrategy {
  routeTitle = ROUTES_TITLE;
  updateTitle(snapshot: RouterStateSnapshot): void {
    console.log(this.title.getTitle());
    if (snapshot.url.indexOf("elasticsearch") > -1) {
      const featureRoute = snapshot.url.split("/")[1];
      const subFeature = snapshot.url.split("/")[2];
      const featureKey = getFeatureKeyByValue(featureRoute) as FeaturesKey;
      const tabtype = this.getTab(subFeature);
    //   const labelsDataEs= featureMap()[FEATURES[featureKey]](
    //     `${GENERIC_LABELS.DOCUMENT}`
    //  ) as FeatureData;
      // const labelsDataEs= featureMap()[FEATURES[featureKey]](
      //    `${GENERIC_LABELS[tabtype]}`
      // ) as FeatureData;
    //   const labelsData = featureMap()[FEATURES[routeTitle[featureRoute]]](
    //     this.getTab(subFeature)
    //  ) as FeatureData;
    //  this.title.setTitle(labelsDataEs?.labels?.pageTitle);
    }
  }
  constructor(private title: Title) {
    super();
  }

  getTab(tabname: string): string {
    let tabRef = "";
    switch (tabname) {
      case "document":
        tabRef = "DOCUMENT";
        break;
      case "folder":
        tabRef = "FOLDER";
        break;
      case "nxql":
        tabRef = "NXQL";
        break;
    }
    return tabRef;
  }
}
