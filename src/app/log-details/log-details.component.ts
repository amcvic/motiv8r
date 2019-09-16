import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { LogService } from '../log.service';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LogDetailsComponent>, private logService: LogService) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close('successfully closed');
  }

  submit(workout: string, length: number, intensity: number, log: string): void {
    this.logService.editLog(workout, length, intensity, log)
      .subscribe((response) => {
        console.log(response);
        this.logService.refreshLogs = true;
      });
    this.close();
  }

}
