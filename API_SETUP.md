# API Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following content:

```
VITE_BASE_URL=http://localhost:8080/api
```

## API Data Format

Based on the image, the API returns events with the following structure:

```json
{
  "id": 1,
  "title": "Hội thảo Công nghệ AI 2025",
  "description": "Sự kiện giới thiệu các xu hướng mới nhất trong trí tuệ nhân tạo và ứng dụng thực tế.",
  "startTime": "2025-07-01T09:00:00",
  "endTime": "2025-07-01T17:00:00",
  "location": "Trung tâm Hội nghị Quốc gia, Hà Nội",
  "status": "UPCOMING",
  "banner": null,
  "urlDocs": "https://example.com/docs/ai-conference-2025.pdf",
  "createdBy": 1,
  "createdAt": "2025-06-25T15:39:13",
  "enabled": true,
  "message": null
}
```

## Issues Found and Fixed

1. **Field Mapping**: The Dashboard was expecting fields like `name`, `time`, `participants`, `rate` but the API returns `title`, `startTime`, `endTime`, etc.

2. **Status Format**: The API returns status in uppercase (UPCOMING, ACTIVE, COMPLETED) but the code was expecting lowercase.

3. **Data Structure**: The API might return data in a `content` property or directly as an array.

## Debug Steps

1. Check if the backend server is running on `http://localhost:8080`
2. Verify the API endpoint `/api/events` is accessible
3. Check browser console for CORS errors
4. Verify authentication tokens are being sent correctly

## Testing

Use the ApiDebug component to see the raw API response and identify any remaining issues. 