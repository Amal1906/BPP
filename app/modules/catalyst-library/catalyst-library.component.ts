import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CatalystDetailsModalComponent } from './catalyst-details-modal/catalyst-details-modal.component';

interface Catalyst {
  id: string;
  title: string;
  description: string;
  details: string[];
  businessImpact: string[];
  videoPath: string;
  videoPlaceholder: string;
  color: string;
  showDetails?: boolean; // Add this property to track individual card state
}

@Component({
  selector: 'app-catalyst-library',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './catalyst-library.component.html',
  styleUrls: ['./catalyst-library.component.scss']
})
export class CatalystLibraryComponent implements OnInit {
  
  showDetails = false;
  
  catalysts: Catalyst[] = [
    {
      id: 'policy-check',
      title: 'Policy Check Catalyst',
      description: 'Powering Intelligent Document Exchange with AMS.\nSeamless integrations with AMS/DMS for document exchange.\nUsing Agentic Automation.',
      details: [
        'Auto retrieval of source docs from AMS/DMS.',
        'Extract and Classify LOB and send it to CoPilot AI Models.',
        'Validate output and upload it back to Doc folders or AMS.',
        'Updates to AMS based on request.'
      ],
      businessImpact: [
        '80% of time savings for Agencies.',
        'Scalable solution for increasing volumes.'
      ],
      videoPath: 'assets/gifs/policy_check.gif',
      color: '#ffffffff',
      showDetails: false,
      videoPlaceholder: ''
    },
    {
      id: 'coi',
      title: 'COI Catalyst',
      description: 'Fully automated COI processing using AI Agents within your AMS/Certificate Editor.\n Save 90% of your staff time.',
      details: [
        'Integrated with Broker workflows and AMS.',
        'Email extraction, intent recognition & metadata creation.',
        'COI processing in auto mode with complexity categorization.',
        'Automated emails.'
      ],
      businessImpact: [
        '100% auto flow for Simple to medium COI cases.',
        'Complex COIs automated with human review in loop.'
      ],
      videoPath: 'assets/gifs/COI.gif',
      color: '#ffffffff',
      showDetails: false,
      videoPlaceholder: ''
    },
    {
      id: 'carrier-download',
      title: 'Carrier Download Catalyst',
      description: 'Auto retrieval of carrier docs without manual intervention.\nAgentic automation to downloads all docs in context.',
      details: [
        'Seamless connectivity with API or robotic.',
        'Extract and queue for qualified accounts for doc/notification.',
        'Auto downloads all types of docs, notices or cancellations etc.',
        'Auto place docs, trigger workflows.'
      ],
      businessImpact: [
        'Fully automated downloads.',
        'Triggering next workflows.',
        '80% Time and cost savings.'
      ],
      videoPath: 'assets/gifs/Carrier_Download.gif',
      color: '#ffffffff',
      showDetails: false,
      videoPlaceholder: ''
    },
    {
      id: 'renewal',
      title: 'Renewal Catalyst',
      description: 'Complete renewal automation solution using agentic workflow.\n Now don\'t miss on notices, renewal steps with Insured and Carriers.',
      details: [
        'Auto run renewal workflow 60/90 days prior.',
        'Insured and Carrier communication.',
        'Auto downloads for notices and policies.',
        'Compile renewal proposals to carrier based on updates.',
        'Auto run policy checks and Updates to AMS.'
      ],
      businessImpact: [
        '70% of time savings for retail agencies on renewals.',
        'Scalable solution for large volumes.'
      ],
      videoPath: 'assets/gifs/Renewal.png',
      color: '#ffffffff',
      showDetails: false,
      videoPlaceholder: ''
    }
  ];

  expandedCatalyst: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  // Modified method to toggle individual catalyst details
  toggleCatalystDetails(catalyst: Catalyst): void {
    catalyst.showDetails = !catalyst.showDetails;
    // Update global showDetails if any catalyst is expanded
    this.showDetails = this.catalysts.some(c => c.showDetails);
  }

  // Method to collapse all catalysts
  collapseAllDetails(): void {
    this.showDetails = false;
    this.catalysts.forEach(catalyst => {
      catalyst.showDetails = false;
    });
  }

  openCatalystModal(catalyst: Catalyst): void {
    this.dialog.open(CatalystDetailsModalComponent, {
      width: '1000px',        // bigger modal width
      height: '800px',        
      maxWidth: '95vw',       
      maxHeight: '90vh',      
      data: catalyst,
      panelClass: 'catalyst-modal'
    });
  }
}