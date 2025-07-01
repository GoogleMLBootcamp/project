# OpenAI API Documentation

## Endpoints

### 1. Generate Story
Generate a story from image descriptions using OpenAI GPT.

**Endpoint:** `POST /api/v1/openai/generate-story`

**Request:**
```json
{
  "imageDescriptions": "A sunny beach with palm trees, children playing in the sand..."
}
```

**Response:**
```json
{
  "story": {
    "title": "A Day at the Beach",
    "content": "The sun was shining brightly as we arrived at the sandy shores...",
    "created_at": "2024-03-20T10:30:00Z"
  }
}
```

## Error Responses

```json
{
  "detail": "Error message here"
}
```

Common error cases:
- 400: Invalid request format
- 500: OpenAI API error

## Usage Examples

### Python
```python
import requests

# Generate story from image descriptions
story_request = {
    "imageDescriptions": "A sunny beach with palm trees, children playing in the sand..."
}
response = requests.post(
    'http://localhost:8000/api/v1/openai/generate-story',
    json=story_request
)
story = response.json()
```

### JavaScript
```javascript
// Generate story from image descriptions
const storyResponse = await fetch('http://localhost:8000/api/v1/openai/generate-story', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageDescriptions: "A sunny beach with palm trees, children playing in the sand..."
  })
});
const story = await storyResponse.json();
```

## Note

The OpenAI integration requires a valid OpenAI API key to be set in the backend's environment variables. Make sure to set the `OPENAI_API_KEY` environment variable before using these endpoints. 