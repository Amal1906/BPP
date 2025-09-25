import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private isModalOpen = false;

  // 🔹 Date state
  private selectedDateSource = new BehaviorSubject<any>({ start: null, end: null });
  selectedDate$ = this.selectedDateSource.asObservable();

  // 🔹 Client state
  private selectedClientSource = new BehaviorSubject<string | null>(null);
  selectedClient$ = this.selectedClientSource.asObservable();

  constructor() { }

  /**
   * Retrieves the current modal window state
   * @return {boolean} Current modal state (true = open, false = closed)
   */
  public getModalState(): boolean {
    return this.isModalOpen;
  }

  /**
   * Updates the modal window state
   * @param {boolean} state - The new state to set (true = open, false = closed)
   * @return {void}
   */
  public setModalState(state: boolean): void {
    this.isModalOpen = state;
  }

  /**
   * Updates the current date range
   * @param {DateRange} dates - The new date range to store
   */
  setDate(dates: any) {
    this.selectedDateSource.next(dates);
  }

  /**
   * Gets the current date range
   * @return {DateRange} The current date range
   */
  getSelectedDate() {
    return this.selectedDateSource.value;
  }

  /**
   * Updates the selected client
   * @param {string} client - The client name to store
   */
  setClient(client: string) {
    this.selectedClientSource.next(client);
  }

  /**
   * Gets the currently selected client
   * @return {string | null} The current client
   */
  getSelectedClient() {
    return this.selectedClientSource.value;
  }
}
