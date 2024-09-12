import { CommonService } from './../../../../shared/services/common.service';
import { ErrorModalClosedInfo } from "./../../../../shared/types/common.interface";
import {
  COMMON_LABELS,
  ERROR_MESSAGES,
  ERROR_MODAL_LABELS,
  ERROR_TYPES,
  MODAL_DIMENSIONS,
} from "./../../../../shared/constants/common.constants";
import { ErrorModalComponent } from "./../../../../shared/components/error-modal/error-modal.component";
import { NuxeoJSClientService } from "./../../../../shared/services/nuxeo-js-client.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { PictureRendtionsService } from "../../services/picture-renditons.service";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Nuxeo from "nuxeo";

@Component({
  selector: "picture-document-renditions",
  templateUrl: "./picture-document-renditions.component.html",
  styleUrls: ["./picture-document-renditions.component.scss"],
})
export class PictureDocumentRenditionsComponent implements OnInit {
  
  

  constructor(
    private pictureRendtionsService: PictureRendtionsService,
    public dialogService: MatDialog,
    private fb: FormBuilder,
    private nuxeoJSClientService: NuxeoJSClientService,
    private commonService: CommonService
  ) {

  }

  ngOnInit(): void {
  // to be implemented
  return;
      }
    }

 
  
            

