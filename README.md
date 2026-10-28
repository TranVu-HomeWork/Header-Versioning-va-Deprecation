#Bài tập: Header Versioning và Deprecation

API này sử dụng chiến lược Header Versioning để giữ nguyên URL `/api/books` trong khi vẫn hỗ trợ nhiều cấu trúc trả về khác nhau dựa trên header `Api-Version`. Đồng thời áp dụng Deprecation Policy cho phiên bản cũ.

## Kịch bản Test trên Postman

### 1. Test Version 1 (v1) - Kèm cảnh báo Sunset
- **URL:** `GET http://localhost:3000/api/books`
- **Headers:** 
  - `Api-Version`: `v1` (Hoặc không truyền gì cả)
- **Kết quả mong đợi:** Cấu trúc dữ liệu có `author` là String.
```json
{
    "success": true,
    "data": [
        { "id": 1, "title": "Clean Code", "author": "Robert C. Martin" }
    ]
}