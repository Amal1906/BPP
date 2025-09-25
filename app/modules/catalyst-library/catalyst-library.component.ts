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
  videoPlaceholder: string;
  color: string;
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
      description: 'Powering Intelligent Document Exchange with AMS - Seamless integrations with AMS/DMS for document exchange - Using Agentic Automation',
      details: [
        'Auto retrieval of source docs from AMS/DMS',
        'Extract and Classify with LOB and sends it to CoPilot AI Models',
        'Validate output and upload it back to Doc folders or AMS',
        'Updates to AMS based on request'
      ],
      businessImpact: [
        '80% of time savings for Agencies',
        'Scalable solution for increasing volumes'
      ],
      videoPlaceholder: 'Policy Check Catalyst Demo Video',
      color: '#667eea'
    },
    {
      id: 'coi',
      title: 'COI Catalyst',
      description: 'Fully automated COI processing using AI Agents within your AMS/Certificate Editor - save 90% of your staff time',
      details: [
        'Integrated with Broker workflows and AMS',
        'Email extraction, intent recognition & metadata creation',
        'COI processing in auto mode with complexity categorization',
        'Automated emails'
      ],
      businessImpact: [
        '100% auto flow for Simple to medium COI cases',
        'Complex COIs automated with human review in loop'
      ],
      videoPlaceholder: 'COI Catalyst Demo Video',
      color: '#4facfe'
    },
    {
      id: 'carrier-download',
      title: 'Carrier Download Catalyst',
      description: 'Auto retrieval of carrier docs without manual intervention - Agentic automation to downloads all docs in context',
      details: [
        'Seamless connectivity with API or robotic',
        'Extract and queue for qualified accounts for doc/notification',
        'Auto downloads all types of docs, notices or cancellations etc',
        'Auto place docs, trigger workflows'
      ],
      businessImpact: [
        'Fully automated downloads - triggering next workflows',
        '80% Time and costs savings'
      ],
      videoPlaceholder: 'Carrier Download Catalyst Demo Video',
      color: '#43e97b'
    },
    {
      id: 'renewal',
      title: 'Renewal Catalyst',
      description: 'Complete renewal automation solution using agentic workflow - now don\'t miss on notices, renewal steps with Insured and Carriers',
      details: [
        'Auto run renewal workflow 60/90 days prior - Insured and Carrier communications',
        'Auto downloads for notices and policies',
        'Compile renewal proposals to carrier based on updates',
        'Auto run policy checks and Updates to AMS'
      ],
      businessImpact: [
        '70% of time savings for retail agencies on renewals',
        'Scalable solution for large volumes'
      ],
      videoPlaceholder: 'Renewal Catalyst Demo Video',
      color: '#fa709a'
    }
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  openCatalystModal(catalyst: Catalyst): void {
    this.dialog.open(CatalystDetailsModalComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: catalyst,
      panelClass: 'catalyst-modal'
    });
  }
}