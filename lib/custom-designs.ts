export type CustomDesignStatus =
  | "Pending"
  | "Reviewing"
  | "Quotation Sent"
  | "Approved"
  | "Rejected"
  | "Production Started"
  | "Production Completed"
  | "Delivered";

export type CustomDesignFileType =
  | "reference"
  | "images"
  | "sketches"
  | "cad"
  | "pdf";

export const CUSTOM_DESIGN_FILE_KINDS: CustomDesignFileType[] = ["reference", "images", "sketches", "cad", "pdf"];


export type UploadItem = {
  id: string;
  kind: CustomDesignFileType;
  name: string;
  url: string; // object URL in browser for preview
  sizeBytes: number;
  mimeType: string;
};

export type StatusTimelineEvent = {
  id: string;
  status: CustomDesignStatus;
  at: string; // ISO date
  by: string;
  note?: string;
};

export type CustomDesignRequest = {
  id: string;
  requestId: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  address: string;

  designType: string;
  designTitle: string;
  designCategory: string;
  jewelleryType: string;
  preferredMetal: string;
  purity: string;
  approxWeight: number;
  budgetRange: string;
  budget: number;
  designDescription: string;

  status: CustomDesignStatus;
  createdAt: string; // ISO date
  assignedStaff: string;

  timeline: StatusTimelineEvent[];
  internalNotes: string[];
  activityHistory: {
    id: string;
    at: string;
    by: string;
    action: string;
    meta?: string;
  }[];

  uploads: {
    images: UploadItem[]; // includes reference images + multiple images
    sketches: UploadItem[];
    cad: UploadItem[];
    pdfs: UploadItem[];
  };
};

export const CUSTOM_DESIGN_STATUSES: { value: CustomDesignStatus; label: string; short: string }[] = [
  { value: "Pending", label: "Pending", short: "Pending" },
  { value: "Reviewing", label: "Reviewing", short: "Review" },
  { value: "Quotation Sent", label: "Quotation Sent", short: "Quote" },
  { value: "Approved", label: "Approved", short: "Approved" },
  { value: "Rejected", label: "Rejected", short: "Rejected" },
  { value: "Production Started", label: "Production Started", short: "Production" },
  { value: "Production Completed", label: "Production Completed", short: "Produced" },
  { value: "Delivered", label: "Delivered", short: "Delivered" },
];

