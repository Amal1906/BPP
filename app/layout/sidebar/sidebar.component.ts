import { CommonModule} from '@angular/common';
import { EventEmitter, Component, Input, OnInit, Output, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, DropdownModule, TreeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})

export class SidebarComponent implements OnInit, AfterViewInit {
    @Input() isOpen: boolean = false;
    @Output() toggle = new EventEmitter<boolean>();
    sidebarWidth = 250;
    tooltipText: string = '';
    isDropdownOpen: boolean = false;
  
    tooltipX: number = 0; 
    tooltipY: number = 0; 
  
    public pathName: string = '';
  
    menuItems = [
    { route: 'catalyst-library', name: 'Catalyst Library', icon: 'pi pi-book', tooltip: 'Catalyst Library', type: 'icon' },
    { route: 'dashboard', name: 'Dashboard', icon: 'pi pi-th-large', tooltip: 'Dashboard', type: 'icon' },
    { route: 'details', name: 'Details', icon: 'pi pi-list', tooltip: 'Details', type: 'icon' },
   { route: 'trigger', name: 'Trigger', icon: 'pi pi-bolt', tooltip: 'Trigger', type: 'image' }
];

  
    constructor(public router: Router, private cdr: ChangeDetectorRef) {}
  
     /**
     * Initializes component and sets up route tracking
     * @returns {void}
     */
    ngOnInit(): void {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.pathName = this.router.routerState.snapshot.url;
        }
      });
    }
  
    /**
     * Angular lifecycle hook after view initialization
     * @returns {void}
     */
    ngAfterViewInit(): void {
      this.pathName = this.router.routerState.snapshot.url;
      this.cdr.detectChanges();
    }
  
    /**
     * Navigates to the specified route
     * @param {string} routeName - Name of the route to navigate to
     * @returns {void}
     */
    public redirectToOtherPage(routeName: string) {
      let targetRoute = '';
      if(routeName == 'catalyst-library') {
          targetRoute = '/layout/catalyst-library';
      }
      if(routeName == 'dashboard') {
          targetRoute = '/layout/dashboard';
      }
      if (routeName == "trigger"){
          targetRoute = "/layout/trigger"
      }
      if (routeName == "details"){
        targetRoute = "/layout/details"
      }

      if (this.router.url === targetRoute) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([targetRoute]);
        });
      } else {
        this.router.navigate([targetRoute]);
      }
    }
  
    /**
     * Toggles the sidebar open/closed state
     * @returns {void}
     */
    sideBar(): void {
      this.isOpen = !this.isOpen;
      this.toggle.emit(this.isOpen);
      this.cdr.detectChanges();
    }
  
    /**
     * Displays tooltip at mouse position
     * @param {MouseEvent} event - Mouse event containing position data
     * @param {string} text - Text to display in the tooltip
     * @returns {void}
     */
    showTooltip(event: MouseEvent, text: string) {
      if (!this.isOpen) {
        this.tooltipText = text;
        const target = event.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        this.tooltipX = rect.right + 10;
        this.tooltipY = rect.top + rect.height / 2 - 10;
      }
    }
  
    /**
     * Hides the currently displayed tooltip
     * @returns {void}
     */
    hideTooltip() {
      this.tooltipText = '';
    }

    /**
     * Checks if the given route is currently active
     * @param {string} route - Route to check
     * @returns {boolean} True if route is active
     */
    isActiveRoute(route: string): boolean {
      return this.pathName.includes(`/layout/${route}`);
    }
  }