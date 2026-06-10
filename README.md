# HRMS - Hệ thống quản lý nhân sự

Ứng dụng quản lý nhân sự full-stack dành cho quản trị viên, trưởng phòng và nhân viên. Hệ thống hỗ trợ quản lý hồ sơ, phòng ban, chấm công, công việc, lương, nghỉ phép và báo cáo trên giao diện responsive theo phong cách hiện đại.

## Demo

- Website: https://q-lnhansu.vercel.app
- Backend API: https://qlnhansu.onrender.com/api
- Health check: https://qlnhansu.onrender.com/api/health

> Backend sử dụng gói miễn phí của Render nên lần truy cập đầu tiên có thể mất khoảng 30-60 giây để khởi động.

## Công nghệ

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router, Lucide Icons |
| Backend | Node.js, Express.js, Express Validator |
| Database | MongoDB, Mongoose |
| Xác thực | JWT, bcrypt |
| Triển khai | Vercel, Render, MongoDB Atlas |

## Chức năng chính

### Quản trị viên

- Dashboard thống kê và lịch nghỉ phép.
- Thêm, sửa, xóa, tìm kiếm và lọc nhân viên.
- Tự động tạo tài khoản đăng nhập khi thêm nhân viên.
- Đồng bộ tên, email, số điện thoại và trạng thái giữa hồ sơ với tài khoản.
- Quản lý phòng ban và phân công trưởng phòng.
- Theo dõi chấm công theo ngày và phòng ban.
- Giao việc cho trưởng phòng.
- Theo dõi quỹ lương và phiếu lương theo phòng ban.
- Tạo, duyệt, từ chối và xóa đơn nghỉ phép.
- Xem báo cáo tổng hợp.

### Trưởng phòng và nhân viên

- Dashboard cá nhân.
- Xem và cập nhật hồ sơ liên hệ.
- Check-in, check-out và xem lịch sử chấm công.
- Nhận việc, cập nhật trạng thái và theo dõi tiến độ.
- Xem phiếu lương cá nhân.
- Gửi và theo dõi đơn nghỉ phép.
- Trưởng phòng có thể giao việc và xử lý đơn nghỉ của nhân viên trong phòng.

## Cấu trúc dự án

```text
QLnhansu/
├── backend/                 REST API, models, controllers và migration
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── seed/
├── frontend/                Ứng dụng React
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
├── docker-compose.yml       MongoDB local bằng Docker
├── render.yaml              Cấu hình backend trên Render
└── package.json             Script chạy toàn bộ dự án
```

## Yêu cầu

- Node.js 18 trở lên.
- npm.
- MongoDB Community Server, Docker hoặc MongoDB Atlas.
- Git.

Kiểm tra môi trường:

```bash
node -v
npm -v
git --version
```

## Cài đặt

```bash
git clone https://github.com/datnhox10198-creator/QLnhansu.git
cd QLnhansu
npm install
npm run install:all
```

## Cấu hình môi trường

Tạo `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hrms
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Nếu frontend không sử dụng API local mặc định, tạo `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

`CLIENT_URL` có thể chứa nhiều origin, phân cách bằng dấu phẩy:

```env
CLIENT_URL=http://localhost:5173,https://q-lnhansu.vercel.app
```

## Khởi động MongoDB

Sử dụng MongoDB đã cài trên máy hoặc chạy bằng Docker:

```bash
docker compose up -d
```

MongoDB local mặc định:

```text
mongodb://127.0.0.1:27017/hrms
```

## Chạy dự án

Chạy đồng thời frontend và backend:

```bash
npm run dev
```

Địa chỉ local:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Health check: http://localhost:5001/api/health

Chạy riêng từng phần:

```bash
npm run dev:backend
npm run dev:frontend
```

## Dữ liệu mẫu

### Seed lại toàn bộ

```bash
npm run seed
```

> **Cảnh báo:** lệnh này xóa toàn bộ Users, Employees, Departments, LeaveRequests, Attendance và WorkTasks trước khi tạo lại dữ liệu mẫu.

### Đồng bộ 18 nhân viên mà không xóa dữ liệu

Chạy trực tiếp với MongoDB trong `backend/.env`:

```bash
npm run sync:employees --prefix backend
```

Lệnh này:

- Chuyển tên nhân viên và phòng ban mẫu sang tiếng Việt có dấu.
- Thêm nhân viên từ `NV010` đến `NV027`.
- Tạo tài khoản tương ứng với mật khẩu mặc định `User@123`.
- Có thể chạy lại mà không tạo dữ liệu trùng.

Đồng bộ thông qua API đang triển khai:

```bash
npm run sync:employees:api --prefix backend
```

Có thể cấu hình đích bằng biến môi trường:

```env
HRMS_API_URL=https://qlnhansu.onrender.com/api
HRMS_ADMIN_EMAIL=admin@hrms.local
HRMS_ADMIN_PASSWORD=Admin@123
```

### Tạo và phân công công việc mẫu

```bash
npm run sync:tasks:api --prefix backend
```

Lệnh này:

- Tạo nhiệm vụ quản lý phù hợp cho trưởng phòng Marketing, IT, Tài Chính và Kinh Doanh.
- Tạo bốn công việc chuyên môn cho mỗi phòng ban.
- Phân công mỗi nhân viên cấp dưới vào hai công việc.
- Phân bố tiến độ `Pending`, `Doing`, `Done` theo seed cố định.
- Có thể chạy lại mà không tạo công việc trùng.

## Tài khoản demo

### Quản trị viên

| Họ tên | Email | Mật khẩu |
| --- | --- | --- |
| Quản trị viên | `admin@hrms.local` | `Admin@123` |

### Tài khoản nhân viên có sẵn

Tất cả tài khoản bên dưới sử dụng mật khẩu `User@123`.

| Mã | Họ tên | Email |
| --- | --- | --- |
| NV001 | Nguyễn Văn An | `an.nguyen@hrms.local` |
| NV002 | Trần Thị Bình | `binh.tran@hrms.local` |
| NV003 | Lê Minh Chi | `chi.le@hrms.local` |
| NV004 | Phạm Quốc Dũng | `dung.pham@hrms.local` |
| NV005 | Võ Thị Em | `em.vo@hrms.local` |
| NV006 | Đỗ Minh Giang | `giang.do@hrms.local` |
| NV007 | Hoàng Thu Hạnh | `hanh.hoang@hrms.local` |
| NV008 | Bùi Nam Khang | `khang.bui@hrms.local` |
| NV009 | Đặng Mỹ Linh | `linh.dang@hrms.local` |
| NV010 | Nguyễn Hoàng Minh | `minh.nguyen@hrms.local` |
| NV011 | Trần Ngọc Mai | `mai.tran@hrms.local` |
| NV012 | Lê Đức Anh | `anh.le@hrms.local` |
| NV013 | Phạm Thảo Nguyên | `nguyen.pham@hrms.local` |
| NV014 | Vũ Thành Đạt | `dat.vu@hrms.local` |
| NV015 | Đặng Khánh Vy | `vy.dang@hrms.local` |
| NV016 | Bùi Quang Huy | `huy.bui@hrms.local` |
| NV017 | Đỗ Phương Linh | `phuong.do@hrms.local` |
| NV018 | Ngô Tuấn Kiệt | `kiet.ngo@hrms.local` |
| NV019 | Hồ Gia Hân | `han.ho@hrms.local` |
| NV020 | Nguyễn Nhật Nam | `nam.nguyen@hrms.local` |
| NV021 | Trương Bảo Trâm | `tram.truong@hrms.local` |
| NV022 | Phan Minh Quân | `quan.phan@hrms.local` |
| NV023 | Lý Thanh Hà | `ha.ly@hrms.local` |
| NV024 | Đinh Quốc Bảo | `bao.dinh@hrms.local` |
| NV025 | Mai Ngọc Ánh | `anh.mai@hrms.local` |
| NV026 | Trịnh Công Thành | `thanh.trinh@hrms.local` |
| NV027 | Tạ Thuỳ Dương | `duong.ta@hrms.local` |

## Tài khoản khi thêm nhân viên

Khi quản trị viên tạo nhân viên từ giao diện:

- Email nhân viên được sử dụng làm tài khoản đăng nhập.
- Mật khẩu mặc định là `User@123`.
- Khi sửa hồ sơ, tên, email, số điện thoại và trạng thái tài khoản được cập nhật theo.
- Khi xóa nhân viên, tài khoản liên kết cũng được xóa.

Không sử dụng mật khẩu mặc định cho hệ thống thực tế. Nên bổ sung chức năng đổi mật khẩu hoặc gửi lời mời thiết lập mật khẩu trước khi sử dụng production.

## Lệnh thường dùng

```bash
# Chạy toàn bộ dự án
npm run dev

# Build frontend
npm run build --prefix frontend

# Chạy backend production
npm start --prefix backend

# Seed lại toàn bộ dữ liệu
npm run seed

# Đồng bộ nhân viên trực tiếp vào MongoDB
npm run sync:employees --prefix backend

# Đồng bộ nhân viên qua API
npm run sync:employees:api --prefix backend

# Tạo công việc và tiến độ mẫu qua API
npm run sync:tasks:api --prefix backend
```

## Triển khai

### Frontend trên Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Biến môi trường:

```env
VITE_API_URL=https://qlnhansu.onrender.com/api
```

### Backend trên Render

Repo đã có file `render.yaml`. Các biến cần cấu hình trên Render:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://q-lnhansu.vercel.app
```

## Lưu ý bảo mật

- Không commit file `.env`.
- Không dùng `JWT_SECRET` mặc định khi triển khai.
- Không công khai tài khoản demo trong hệ thống chứa dữ liệu thật.
- Nên thay mật khẩu mặc định sau lần đăng nhập đầu tiên.
- Nên giới hạn CORS về đúng domain frontend production.
