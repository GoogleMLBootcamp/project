/* src/utils/abs.ts */
import { API_URL } from '../api';
export const abs = (u: string) => (u.startsWith('http') ? u : `${API_URL}/${u}`);