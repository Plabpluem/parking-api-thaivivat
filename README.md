

## วิธีการ RUN ด้วย docker

```bash
# run docker
$ docker-compose up

```

## Api document

### Base URL

```
http://localhost:8081
```

---

### 1. Create Parking Lot (สร้างข้อมูลที่จอดรถ)

```
POST /api/parking
```

**Body:**
```json
{
  "number": 1
}
```

---

### 2. Park a Car (ลูกค้าเข้าที่จอดรถ รับบัตร)

```
POST /api/car-customer/parking
```

**Body:**
```json
{
  "plate_number": "กข1234",
  "size": "small"
}
```

> size: `small` | `medium` | `large`

---

### 3. Leave Parking Slot (ลูกค้าออกจากที่จอดรถ)

```
POST /api/car-customer/leaving
```

**Body:**
```json
{
  "plate_number": "กข1234"
}
```

---

### 4. Get Parking Lot Status (status ของที่จอดรถในระบบ + ลูกค้าคนไหนจอด)

```
GET /api/parking/status
```

**Response (200):**
```json
{
  "message": "successfully",
  "statusCode": 200,
  "data": [
    { "number": 1, "is_available": true, "car_customer": null },
    { "number": 2, "is_available": false, "car_customer": { "plate_number": "กข1234", "size": "small" } }
  ]
}
```

---

### 5. Get Plate Numbers by Car Size (ดูเลขทะเบียน โดยเลือกขนาดของรถ)

```
GET /api/car-customer/number-by-sizecar?size=small
```

**Response (200):**
```json
{
  "message": "successfully",
  "statusCode": 200,
  "data": [
    { "plate_number": "กข1234" },
    { "plate_number": "กค5678" }
  ]
}
```

---

### 6. Get Allocated Slot Numbers by Car Size (ดูที่จอดรถที่ถูกใช้งาน โดยเลือกขนาดรถ)

```
GET /api/parking/by-carsize?size=small
```

**Response (200):**
```json
{
  "message": "successfully",
  "statusCode": 200,
  "data": [
    { "number": 1 },
    { "number": 3 }
  ]
}
```
