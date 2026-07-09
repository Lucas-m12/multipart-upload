import type { Uploader } from '../../types';
import { getPresignedUrl } from './getPresignedUrl';
import { createPresignedUploader } from './presignedUploader';

export const uploader: Uploader = createPresignedUploader({ getPresignedUrl });
