import axios from 'axios';

/* -------------------------------------------------
   공통 상수
------------------------------------------------- */
export const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:8000';

/* -------------------------------------------------
   타입 (v2 응답에 맞춤)
------------------------------------------------- */
export interface ImageUploadResponse {
  story_id: string;
  image_urls: string[];    // v2에서는 image_urls
  image_count: number;
  created_at: string;      // ← 반드시 포함 (서버에서 반드시 내려줘야 함)
}

/* -------------------------------------------------
   API 객체
------------------------------------------------- */
export const api = {
  /**
   * 새 story + 이미지 업로드 → v2 API 사용
   * POST /v2/images/upload
   */
  uploadImages: async (files: File[]): Promise<ImageUploadResponse> => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));

    const { data } = await axios.post(
      `${API_URL}/v2/images/upload`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data as ImageUploadResponse;
  },

  /**
   * 기존 story에 이미지 추가 (v2에서도 지원)
   * POST /v2/images/upload?story_id=xxx
   */
  uploadImagesToStory: async (storyId: string, files: File[]) => {
    const form = new FormData();
    files.forEach(f => form.append('files', f));

    const { data } = await axios.post(
      `${API_URL}/v2/images/upload?story_id=${storyId}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data as { image_urls: string[] };
  },

  /**
   * 특정 story의 이미지 목록 가져오기 (v2)
   * GET /v2/images/{story_id}
   */
  getStoryImages: async (storyId: string): Promise<string[]> => {
    const { data } = await axios.get(`${API_URL}/v2/images/${storyId}`);
    return Array.isArray(data) ? data.map((x: any) => x.image_url ?? x) : [];
  },

  /**
   * 특정 story 삭제 (v2)
   * DELETE /v2/images/{story_id}
   */
  deleteStoryImages: async (storyId: string) =>
    axios.delete(`${API_URL}/v2/images/${storyId}`),

  /**
   * 스토리 생성 (v1 API 사용)
   * POST /api/v1/openai/generate-story
   */
  generateStoryById: async (storyId: string): Promise<string> => {
    const { data } = await axios.post(
      `${API_URL}/api/v1/openai/generate-story`,
      JSON.stringify(storyId),
      { headers: { 'Content-Type': 'application/json' } },
    );
    return data.story as string;
  },

  /**
   * BLIP 이미지 설명 분석
   * POST /api/v1/blip/analyze
   */
  analyzeImageWithBLIP: async (image_url: string): Promise<string> => {
    const { data } = await axios.post(
      `${API_URL}/api/v1/blip/analyze`,
      { image_url },  // 서버에서 image_url이라는 키로 받는다고 가정
      { headers: { 'Content-Type': 'application/json' } },
    );
    return data?.description ?? '';
  },

  /**
   * 생성된 스토리를 MongoDB에 저장
   * PUT /api/v1/stories/{story_id}?story_text=...
   */
  saveStoryToDB: async (
    storyId: string,
    storyText: string
  ): Promise<void> => {
    await axios.put(
      `${API_URL}/api/v1/stories/${storyId}?story_text=${encodeURIComponent(storyText)}`
    );
  }
};