@@ .. @@
 export class StepperComponent {
   @Input() workFlow: Step[] = [];
   @Input() loading = false;
+  
+  getCompletedSteps(): number {
+    return this.workFlow.filter(step => step.status?.toLowerCase() === 'done').length;
+  }
+  
+  getProgressPercentage(): number {
+    if (!this.workFlow.length) return 0;
+    const completed = this.getCompletedSteps();
+    return (completed / this.workFlow.length) * 100;
+  }
+  
+  isStepCompleted(index: number): boolean {
+    return this.workFlow[index]?.status?.toLowerCase() === 'done';
+  }

   getStepClass(item: Step, index: number): string {