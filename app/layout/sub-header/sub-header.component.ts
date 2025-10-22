import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sub-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {

  public pathName: string = "";
  public pageTitle: string = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.setCurrentPath();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.pathName = this.router.routerState.snapshot.url;
        this.updatePageTitle();
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    this.pathName = this.router.routerState.snapshot.url;
    this.updatePageTitle();
    this.cdr.detectChanges();
  }

  private setCurrentPath(): void {
    this.pathName = this.router.routerState.snapshot.url;
    this.updatePageTitle();
    this.cdr.markForCheck();
  }


  private updatePageTitle(): void {
    if (this.pathName.includes('/layout/catalyst-library')) {
      this.pageTitle = 'Agentic Automation Management Console';
    } else 
    if (this.pathName === '/layout' || this.pathName === '/layout/dashboard') {
      this.pageTitle = 'Automation Dashboard';
    } else if (this.pathName.includes('/layout/details')) {
      this.pageTitle = 'Automation Details Page';
    } else if (this.pathName.includes('/layout/trigger')) {
      this.pageTitle = 'Automation Trigger Page';
    } else {
      this.pageTitle = '';
    }
  }
}
