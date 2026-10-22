import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HttpcallsService } from './httpcalls.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  title = 'CovidTracker';
  public asOf$ = this.httpcall.getDataAsOf();

  constructor(private httpcall: HttpcallsService) {}
}
