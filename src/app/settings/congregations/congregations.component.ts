import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CongregationsService } from '../../_services/congregations.service';
import { Congregation } from '../../_interfaces/congregation.interface';
import { CongregationCreatorComponent } from 'src/app/_elements/dialogs/congregation-creator/congregation-creator.component';
import { CongregationEditorComponent } from 'src/app/_elements/dialogs/congregation-editor/congregation-editor.component';
import { Subject, BehaviorSubject, startWith, switchMap, takeUntil } from 'rxjs';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-congregations',
  templateUrl: './congregations.component.html',
  styleUrls: ['./congregations.component.scss']
})
export class CongregationsComponent implements OnInit, OnDestroy {
  reloadList$ = new BehaviorSubject<void>(undefined);
  congregations$ = new BehaviorSubject<Congregation[] | null>(null);
  unsubscribe$ = new Subject<void>();
  constructor(
    private congregationService: CongregationsService,
    private matDialog: MatDialog
  ) { }
  ngOnInit(): void {
    this.reloadList$.pipe(
      startWith(undefined),
      switchMap(() => {
        return this.congregationService.getCongregations().pipe(
          filter((f) => f !== null),
          takeUntil(this.unsubscribe$))
      })
    ).subscribe(congs => {
      this.congregations$.next(congs);
    })
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  createCongregation = () => {
    let creatDiagRef = this.matDialog.open(CongregationCreatorComponent, {
      panelClass: 'dialog-panel',
    });
    creatDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.reloadList$.next(undefined);
    });
  }
  openCongregationEditor = (congregation: Congregation) => {
    let editDiagRef = this.matDialog.open(CongregationEditorComponent, {
      panelClass: 'dialog-panel',
      data: {
        congregation,
      },
    });
    editDiagRef.afterClosed().subscribe((result) => {
      if (result === 'success')
        this.reloadList$.next(undefined);
    });
  }
  changeCongregationActivation = async (cong: Congregation) => {
    await  this.congregationService.changeCongregationsActivation(cong);
    this.reloadList$.next(undefined);  
  }
}