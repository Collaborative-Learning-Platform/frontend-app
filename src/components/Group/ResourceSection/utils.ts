import type { ApiResource, Resource } from './types';

// Transform API resource to our Resource interface
export const transformApiResource = (apiResource: ApiResource): Resource => {
  const getResourceType = (contentType: string, fileName: string): Resource['type'] => {
    if (contentType.includes('pdf')) return 'pdf';
    if (contentType.startsWith('video/')) return 'video';
    if (contentType.startsWith('image/')) return 'image';
    if (contentType.includes('text/') || fileName.endsWith('.txt') || fileName.endsWith('.md')) return 'document';
    if (contentType.includes('application/vnd.') || fileName.endsWith('.docx') || fileName.endsWith('.doc') || fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) return 'document';
    if (contentType.includes('application/x-msdownload') || fileName.endsWith('.exe')) return 'executable';
    return 'other';
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return undefined;
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return {
    id: apiResource.resourceId,
    name: apiResource.fileName,
    fileName: apiResource.fileName,
    type: getResourceType(apiResource.contentType, apiResource.fileName),
    size: formatFileSize(apiResource.size),
    uploadedBy: `User (${apiResource.userId.slice(0, 8)}...)`, // Show partial user ID for now
    uploadedAt: apiResource.createdAt,
    contentType: apiResource.contentType,
    description: apiResource.description,
    tags: apiResource.tags.map(tag => tag.tag),
    estimatedCompletionTime: apiResource.estimatedCompletionTime,
  };
};

// Format file size for display
export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format relative time
export const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

// Format completion time
export const formatCompletionTime = (minutes?: number) => {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

// Predefined tags for resources
export const availableTags = [
  'Study Material',
  'Assignment',
  'Tutorial',
  'Reference',
  'Video Lecture',
  'Notes',
  'Presentation',
  'Project',
  'Research',
  'Documentation',
  'Code',
  'Images',
  'Important',
  'Draft',
  'Final',
  'Exam Prep',
  'Homework',
  'Lab Report',
  'Textbook',
  'Article',
  'Sample Code',
  'Template',
  'Guidelines',
  'Requirements',
  'Solution'
];

// Predefined tags for easy selection
export const PREDEFINED_TAGS = [
  'Assignment', 'Reading', 'Video', 'Presentation', 'Notes', 'Research',
  'Tutorial', 'Practice', 'Reference', 'Template', 'Example', 'Guide',
  'Homework', 'Project', 'Quiz', 'Exam', 'Study Material', 'Resource'
];
