// workflow.config.ts
export const WORKFLOWS: { [key: string]: string[] } = {
  policy_checking: [
    "Read Input Files",
    "Extract Metadata",
    "Classify Documents",
    "Generate Checklist",
    "Upload Checklist to Target System"
  ],
  coi: [
    "Read Input Files",
    "Extract Metadata",
    "Generate COI",
    "Email to Requestor"
  ]
};
