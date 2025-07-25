# 🌐 Zi.Care Fullstack Engineer Technical Test – Backend API #

Ini adalah backend API untuk technical test **Fullstack Engineer Zi.Care**. Aplikasi ini dibangun menggunakan **Node.js**, **Express**, dan **PostgreSQL**, dengan fitur utama:

- 🔐 Autentikasi (Register & Login menggunakan JWT)
- 👤 Manajemen User
- 🌫️ CRUD Data Sensor Pencemaran Udara

## 🚀 Tech Stack

- **Node.js** + **Express.js**
- **PostgreSQL** + **Prisma ORM**
- **JWT** (Autentikasi)
- **Express Validator**
- **Railway** (deployment)
- **NeonDB** (PostgreSQL Cloud)

## 📂 Struktur Proyek

```bash
zicare-api/
│
├── node_modules/                  # Dependensi project (otomatis setelah install)
│
├── prisma/                        # Konfigurasi dan tools Prisma ORM
│   ├── client/                    # Inisialisasi Prisma Client (dipanggil di kode)
│   │   └── index.js
│   ├── migration/                 # File migrasi database (dibuat otomatis oleh Prisma)
│   ├── schema.prisma              # Skema database utama (user, sensor, dsb)
│   └── seed.js                    # Script untuk mengisi data dummy
│
├── src/                           # Semua source code aplikasi berada di sini
│   ├── controllers/               # Logic utama untuk tiap endpoint
│   │   ├── auth/                  # Auth: register & login
│   │   │   ├── LoginController.js
│   │   │   └── RegisterController.js
│   │   ├── sensor/                # Sensor: CRUD data sensor
│   │   │   └── SensorController.js
│   │   ├── user/                  # User: CRUD data user
│   │   │   └── UserController.js
│
│   ├── middlewares/              # Middleware Express
│   │   └── auth/
│   │       └── auth.js            # Middleware cek token JWT
│
│   ├── routes/                   # Routing URL endpoint ke controller
│   │   ├── auth/
│   │   │   └── authRoutes.js
│   │   ├── sensor/
│   │   │   └── sensorRoutes.js
│   │   ├── user/
│   │   │   └── userRoutes.js
│   │   └── index.js              # Gabungan semua route utama
│
│   ├── utils/                    # Utilitas umum seperti handler dan validator
│   │   ├── handlers/
│   │   │   └── asyncHandler.js   # Wrapper async untuk penanganan error
│   │   └── validator/            # Validasi input dari request
│   │       ├── auth/
│   │       │   └── auth.js       # Validasi form register & login
│   │       ├── sensor/
│   │       │   └── sensor.js     # Validasi data sensor
│   │       └── user/
│   │           └── user.js       # Validasi data user
│
│   └── app.js                    # Inisialisasi Express & middleware global
│
├── .env                          # Konfigurasi environment (PORT, DB, JWT, dll)
├── .gitignore                    # File & folder yang diabaikan oleh Git
├── index.js                      # Entry point utama, memanggil app.js
├── package.json                  # Info project & dependensi
└── package-lock.json             # Lock version package (auto-generated)
```

## 📌 API Reference

Semua endpoint diawali dengan: http://localhost:3000/api

#### 🔐 Register

```http
POST /auth/register
```
| Field      | Type     | Description  |
|------------|----------|--------------|
| `name`     | `string` | **Required** |
| `email`    | `string` | **Required** |
| `password` | `string` | **Required** |

#### 🔐 Login

```http
POST /auth/login
```

| Field      | Type     | Description  |
|------------|----------|--------------|
| `email`    | `string` | **Required** |
| `password` | `string` | **Required** |

#### 👤 Get All Users

```http
GET /user/all?page=1&limit=10&search=
```

| Query Param | Type     | Description              |
|-------------|----------|--------------------------|
| `page`      | number   | Page number (default: 1) |
| `limit`     | number   | Jumlah item per halaman  |
| `search`    | string   | keyword pencarian        |

> Requires `Authorization: Bearer <token>`

#### 👤 Get User by ID

```http
GET /user/:id
```

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | **Required**. User ID |

> Requires `Authorization: Bearer <token>`

#### 👤 Create User

```http
POST /user/create
```

| Field      | Type     | Description     |
|------------|----------|-----------------|
| `name`     | `string` | **Required**.   |
| `email`    | `string` | **Required**.   |
| `password` | `string` | **Required**.   |

> Requires `Authorization: Bearer <token>`

#### 👤 Update User

```http
PUT /user/update/:id
```

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | **Required**. User ID |

> Requires `Authorization: Bearer <token>`

Body JSON (password opsional):
```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com"
  "password": "Mypass123@"
}
```

#### 👤 Delete User

```http
DELETE /user/delete/:id
```

| Parameter | Type     | Description           |
|-----------|----------|-----------------------|
| `id`      | `string` | **Required**. User ID |

> Requires `Authorization: Bearer <token>`

#### 🌫️ Get All Sensors

```http
GET /sensor/all
```

| Query Param | Type     | Description              |
|-------------|----------|--------------------------|
| `page`      | number   | Page number (default: 1) |
| `limit`     | number   | Jumlah item per halaman  |
| `search`    | string   | keyword pencarian        |

> Requires `Authorization: Bearer <token>`

#### 🌫️ Get Sensor by ID

```http
GET /sensor/:id
```

| Parameter | Type     | Description             |
|-----------|----------|-------------------------|
| `id`      | `number` | **Required**. Sensor ID |

> Requires `Authorization: Bearer <token>`

#### 🌫️ Get All Locations

```http
GET /sensor/locations
```
> Requires `Authorization: Bearer <token>`

#### 🌫️ Get All Parameters

```http
GET /sensor/parameters
```
> Requires `Authorization: Bearer <token>`

#### 🌫️ Create Sensor

```http
POST /sensor/create
```

| Field         | Type     | Description                |
|---------------|----------|----------------------------|
| `locationId`  | number   | **Required**. ID lokasi    |
| `parameterId` | number   | **Required**. ID parameter |
| `value`       | number   | **Required**. Nilai sensor |
| `recordedAt`  | string   | **Required**. ISO datetime |

> Requires `Authorization: Bearer <token>`

Contoh:
```json
{
  "locationId": 2,
  "parameterId": 3,
  "value": 54,
  "recordedAt": "2025-07-24T14:00:00.000Z"
}
```

#### 🌫️ Update Sensor

```http
PUT /sensor/update/:id
```

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `id`      | number   | **Required**. Sensor ID |

> Requires `Authorization: Bearer <token>`
 
Body JSON sama seperti `POST /sensor/create`.

#### 🌫️ Delete Sensor

```http
DELETE /sensor/delete/:id
```

| Parameter | Type     | Description            |
|-----------|----------|------------------------|
| `id`      | number   | **Required**. Sensor ID |

> Requires `Authorization: Bearer <token>`

## 🛠️ Cara Menjalankan Proyek

📦 1. Clone & Install Dependencies
- git clone :
```
https://github.com/username/zicare-api.git
```
- cd zicare-api
- npm install

⚙️ 2. Setup Environment
Buat file .env di root project:
```
PORT=
DATABASE_URL=
JWT_SECRET=
```
🗃️ 3. Setup Database
Jalankan migrasi dan seeding:
```
npx prisma migrate dev --name init
node prisma/seed.js
```

▶️ 4. Start Server
```
npm run dev
```
Server berjalan di: 
```
http://localhost:3000
```

🌱 Seeding Database
- Untuk mengisi data dummy seperti lokasi dan parameter sensor:
```
node prisma/seed.js
```

## 📬 Postman Collection
Import file berikut untuk mencoba semua endpoint.
Hubungi pemilik untuk mendapatkan Postman Collection

## ☁️ Deployment
- Backend Api : Railway
- Database : NeonDB (PostgreSQL Cloud)

## 📄 License
Proyek ini dibuat untuk keperluan technical test. Bebas digunakan secara pribadi atau edukasi, tidak untuk komersial.
