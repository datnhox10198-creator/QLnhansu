# Human Resource Management System

Website quản lý nhân sự dùng ReactJS, Vite, Tailwind CSS, Node.js, ExpressJS, MongoDB, Mongoose và JWT.

## Công Nghệ

- Frontend: ReactJS, Vite, Tailwind CSS, Axios, React Router
- Backend: Node.js, ExpressJS
- Database: MongoDB, Mongoose
- Authentication: JWT

## Cấu Trúc Thư Mục

```text
backend/   REST API, MongoDB models, middleware JWT, seed data
frontend/  Giao diện React cho Admin/User
```

## Cần Cài Trước Khi Chạy

1. Node.js 18 trở lên
2. MongoDB Community Server hoặc MongoDB Atlas
3. Git, nếu tải source từ GitHub

Kiểm tra Node.js:

```bash
node -v
npm -v
```

Nếu dùng MongoDB local, cần mở MongoDB trước khi seed/chạy backend.

## Cài Đặt Dự Án

Tại thư mục gốc dự án:

```bash
npm install
npm run install:all
```

Lệnh trên sẽ cài package cho root, `backend` và `frontend`.

## Cấu Hình Môi Trường

Tạo file `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hrms
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Nếu frontend gọi API khác cổng mặc định, tạo file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001/api
```

## Tạo Dữ Liệu Mẫu

Chạy lệnh:

```bash
npm run seed
```

Lưu ý: lệnh seed sẽ xóa dữ liệu cũ trong database `hrms` và tạo lại dữ liệu test.

## Chạy Dự Án

Chạy cả frontend và backend:

```bash
npm run dev
```

Đường dẫn:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api
- Health check: http://localhost:5001/api/health

## Tài Khoản Test

Admin:

- `admin@hrms.local` / `Admin@123`

Trưởng phòng:

- Nhân sự: `an.nguyen@hrms.local` / `User@123`
- CNTT: `binh.tran@hrms.local` / `User@123`
- Tài chính: `chi.le@hrms.local` / `User@123`

Nhân viên thường:

- `dung.pham@hrms.local` / `User@123`
- `em.vo@hrms.local` / `User@123`
- `giang.do@hrms.local` / `User@123`
- `hanh.hoang@hrms.local` / `User@123`
- `khang.bui@hrms.local` / `User@123`
- `linh.dang@hrms.local` / `User@123`

## Hướng Dẫn Sử Dụng

1. Đăng nhập bằng tài khoản Admin để quản lý dữ liệu.
2. Vào `Nhân viên` để thêm, sửa, xóa, tìm kiếm và lọc nhân viên theo phòng ban.
3. Vào `Phòng ban` để thêm, sửa, xóa phòng ban và phân công trưởng phòng.
4. Vào `Nghỉ phép` để xem danh sách đơn nghỉ phép.
5. Đăng nhập tài khoản nhân viên để gửi đơn nghỉ phép và xem trạng thái đơn.
6. Đăng nhập tài khoản trưởng phòng để duyệt hoặc từ chối đơn nghỉ phép của nhân viên trong phòng ban mình quản lý.
7. Dashboard có thống kê và lịch nghỉ phép theo tuần/tháng.

## Chức Năng Chính

- Đăng nhập JWT
- Phân quyền Admin/User
- Admin: dashboard thống kê, CRUD nhân viên, CRUD phòng ban, báo cáo
- Phòng ban có thể phân công trưởng phòng từ danh sách nhân viên
- Trưởng phòng duyệt/từ chối đơn nghỉ phép của nhân viên trong phòng ban
- User: dashboard cá nhân, xem/cập nhật hồ sơ, gửi đơn nghỉ phép, xem trạng thái đơn
- Lịch nghỉ phép theo tuần và theo tháng cho Admin/User
- Tìm kiếm nhân viên theo tên, lọc nhân viên theo phòng ban
- Bảng dữ liệu có phân trang
- Form thêm/sửa dữ liệu
- Modal xác nhận xóa

## Lệnh Thường Dùng

Chạy backend:

```bash
npm run dev --prefix backend
```

Chạy frontend:

```bash
npm run dev --prefix frontend
```

Build frontend:

```bash
npm run build --prefix frontend
```

Seed dữ liệu:

```bash
npm run seed
```

## Ghi Chú

- Không commit file `backend/.env` vì có thông tin cấu hình riêng.
- Nếu đổi `PORT` backend, cần đổi `VITE_API_URL` ở frontend cho đúng.
- Nếu dùng MongoDB Atlas, thay `MONGO_URI` bằng connection string của Atlas.
