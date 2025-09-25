import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { SubHeaderComponent } from "./sub-header/sub-header.component";


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, RouterModule, MatSidenavModule, CommonModule, MatIconModule, SubHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

    isSidebarOpen = false;
    sidebarWidth = 70;
  
     /**
     * Handles sidebar toggle events and adjusts sidebar width accordingly
     * @param {boolean} isOpen - The new state of the sidebar (true for open, false for closed)
     */
    onSidebarToggle(isOpen: boolean): void {
      this.isSidebarOpen = isOpen;
      this.sidebarWidth = isOpen ? 250 : 70;
    }

     /**
     * Gets the current year
     * @return {number} The current year as a four-digit number
     */
    getyear(){
        let year = new Date()
        return year.getFullYear()
    }
}
