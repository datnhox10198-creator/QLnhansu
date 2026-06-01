# Human Resource Management System

Website quản lý nhân sự dùng ReactJS, Vite, Tailwind CSS, Node.js, ExpressJS, MongoDB, Mongoose và JWT.

## Cấu trúc

```text
backend/   REST API, MongoDB models, JWT auth, seed data
frontend/  React admin/user dashboard
```

## Yêu cầu

- Node.js 18+
- MongoDB đang chạy local hoặc MongoDB Atlas URI

## Cài đặt

```bash
npm install
npm run install:all
```

Tạo file `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hrms
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
```

Tạo file `frontend/.env` nếu API không chạy ở cổng mặc định:

```env
VITE_API_URL=http://localhost:5001/api
```

## Seed dữ liệu mẫu

```bash
npm run seed
```

Tài khoản mẫu:

- Admin: `admin@hrms.local` / `Admin@123`
- Trưởng phòng Nhân sự: `an.nguyen@hrms.local` / `User@123`
- Trưởng phòng CNTT: `binh.tran@hrms.local` / `User@123`
- Trưởng phòng Tài chính: `chi.le@hrms.local` / `User@123`
- Nhân viên thường: `dung.pham@hrms.local`, `em.vo@hrms.local`, `giang.do@hrms.local`, `hanh.hoang@hrms.local`, `khang.bui@hrms.local`, `linh.dang@hrms.local` / `User@123`

## Chạy dự án

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001/api

## Chức năng

- Đăng nhập JWT
- Phân quyền Admin/User
- Admin: dashboard thống kê, CRUD nhân viên, CRUD phòng ban, duyệt/từ chối đơn nghỉ phép, báo cáo
- Phòng ban có thể phân công trưởng phòng từ danh sách nhân viên
- User: dashboard cá nhân, xem/cập nhật hồ sơ, gửi đơn nghỉ phép, xem trạng thái đơn
- Tìm kiếm nhân viên theo tên, lọc theo phòng ban
- Bảng dữ liệu có phân trang, form thêm/sửa, modal xác nhận xóa
