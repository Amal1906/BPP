import { Component, ElementRef, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ CommonModule , FormsModule , ReactiveFormsModule , NgbModule , ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  encapsulation:ViewEncapsulation.None
})
export class ModalComponent implements OnInit{

  modalBody : any;
  modalTitle : any;
  modalName : any;
  isModalShow : boolean = false;
  isLoading = false;

  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) data: { modalBody : string , modalTitle : string , modalName : string  },
    private eRef: ElementRef,
  ) {
    this.modalBody = data ? data.modalBody : '';
    this.modalTitle = data ? data.modalTitle : '';
    this.modalName = data ? data.modalName : '';
  }

ngOnInit(): void {
  this.isModalShow = true;
}

@HostListener('document:click', ['$event'])
clickout(event: any) {
  const clickedInside = this.eRef.nativeElement.contains(event.target);
  if (this.isModalShow && !clickedInside) {
    this.onCancel()
  }
}
  onCancel(): void {
    this.dialogRef.close(false);
  }    
}
