export interface ApiResource {
  resourceId: string;
  groupId: string;
  userId: string;
  fileName: string;
  s3Key: string;
  description: string;
  contentType: string;
  size: number | null;
  createdAt: string;
  estimatedCompletionTime?: number; // in minutes
  tags: Array<{
    tagId: string;
    tag: string;
    resourceId: string;
  }>;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'document' | 'image' | 'other' | 'executable';
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  url?: string;
  fileName: string;
  contentType: string;
  description?: string;
  tags?: string[];
  estimatedCompletionTime?: number; // in minutes
}

export interface ResourceSectionProps {
  groupId: string;
}

export type SortBy = 'name' | 'date' | 'type';
export type CompletionTimeUnit = 'minutes' | 'hours';
