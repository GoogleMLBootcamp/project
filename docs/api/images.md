# Images API Documentation

## Endpoints

### 1. Get All Images
Get all stored images across all stories.

**Endpoint:** `GET /api/v1/images`

**Response:**
```json
[
  {
    "id": "1",
    "story_id": "2acfa514-2915-4a9d-8a3a-338d52bd0d9e",
    "path": "/images/stories/2acfa514-2915-4a9d-8a3a-338d52bd0d9e/1.jpg",
    "created_at": "2024-03-20T10:30:00Z"
  },
  // ... more images
]
```

### 2. Get All Story IDs
Get all available story IDs.

**Endpoint:** `GET /api/v1/images/story-ids`

**Response:**
```json
[
  "2acfa514-2915-4a9d-8a3a-338d52bd0d9e",
  "43bb34f1-30de-4647-bdf3-befc687fee33",
  // ... more story IDs
]
```

### 3. Get Images by Story ID
Get all images for a specific story.

**Endpoint:** `GET /api/v1/images/{story_id}`

**Response:**
```json
[
  {
    "id": "1",
    "story_id": "2acfa514-2915-4a9d-8a3a-338d52bd0d9e",
    "path": "/images/stories/2acfa514-2915-4a9d-8a3a-338d52bd0d9e/1.jpg",
    "created_at": "2024-03-20T10:30:00Z"
  },
  // ... more images from the story
]
```

### 4. Upload Images
Upload multiple images using form-data.

**Endpoint:** `POST /api/v1/images/upload`

**Request:**
```http
POST /api/v1/images/upload
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg, ...]
```

**Response:**
```json
{
  "story_id": "2acfa514-2915-4a9d-8a3a-338d52bd0d9e",
  "image_paths": [
    "/images/stories/2acfa514-2915-4a9d-8a3a-338d52bd0d9e/1.jpg",
    "/images/stories/2acfa514-2915-4a9d-8a3a-338d52bd0d9e/2.jpg"
  ],
  "image_count": 2
}
```

### 5. Delete Story Images
Delete all images for a specific story.

**Endpoint:** `DELETE /api/v1/images/{story_id}`

**Response:**
```json
{
  "success": true,
  "message": "Images deleted successfully"
}
```

### 6. Delete All Images
Delete all story images from the system.

**Endpoint:** `DELETE /api/v1/images`

**Response:**
```json
{
  "success": true,
  "message": "All images deleted successfully"
}
```

## Error Responses

```json
{
  "detail": "Error message here"
}
```

Common error cases:
- 404: Story or images not found
- 400: Invalid request (e.g., no files provided)
- 500: Server error during file processing

## Usage Examples

### Python
```python
import requests

# Get all images
response = requests.get('http://localhost:8000/api/v1/images')
all_images = response.json()

# Upload images
files = [
    ('files', ('image1.jpg', open('image1.jpg', 'rb'), 'image/jpeg')),
    ('files', ('image2.jpg', open('image2.jpg', 'rb'), 'image/jpeg'))
]
response = requests.post('http://localhost:8000/api/v1/images/upload', files=files)
upload_result = response.json()

# Get images for a story
story_id = upload_result['story_id']
response = requests.get(f'http://localhost:8000/api/v1/images/{story_id}')
story_images = response.json()
```

### JavaScript
```javascript
// Get all images
const images = await fetch('http://localhost:8000/api/v1/images').then(r => r.json());

// Upload images
const formData = new FormData();
formData.append('files', imageFile1);
formData.append('files', imageFile2);

const uploadResponse = await fetch('http://localhost:8000/api/v1/images/upload', {
  method: 'POST',
  body: formData
});
const uploadResult = await uploadResponse.json();

// Get images for a story
const storyId = uploadResult.story_id;
const storyImages = await fetch(`http://localhost:8000/api/v1/images/${storyId}`).then(r => r.json());
``` 