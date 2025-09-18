# CareerConnect

## Giới thiệu (Introduction)

**Tiếng Việt:**  
CareerConnect là nền tảng tư vấn hướng nghiệp trực tuyến giúp học sinh xác định ngành học phù hợp.  
Hệ thống tích hợp các bài trắc nghiệm tâm lý **RIASEC** và **TIPI**, đồng thời sử dụng trí tuệ nhân tạo (AI) để gợi ý ngành học dựa trên kết quả bài test và hồ sơ cá nhân.  
Quản trị viên có thể quản lý người dùng, ngành học, lớp học, và xuất báo cáo thống kê phục vụ công tác tư vấn.  

**English:**  
CareerConnect is an online career guidance platform that helps students identify suitable majors.  
It integrates **RIASEC** and **TIPI** psychological assessments, combined with AI to suggest majors based on test results and student profiles.  
Administrators can manage users, majors, classes, and generate statistical reports to support career counseling.  

---

## Công nghệ sử dụng (Technologies Used)

- **Frontend:** ReactJS (TypeScript), Redux Toolkit, Ant Design  
- **Backend:** Spring Boot (Java), RESTful API, OAuth2 Resource Server, JWT Authentication  
- **Database:** MySQL  
- **AI Integration:** Machine Learning model for career recommendation  

---

## Tính năng chính (Key Features)

**Tiếng Việt:**  
- Đăng ký / đăng nhập / xác thực người dùng (JWT + Refresh Token)  
- Làm bài trắc nghiệm RIASEC + TIPI  
- AI gợi ý ngành học phù hợp  
- Quản lý hồ sơ học sinh (CRUD)  
- Quản lý ngành học, lớp học, người dùng (Admin)  
- Thống kê & xuất báo cáo  
- Trình soạn thảo HTML cho mô tả ngành học (có upload ảnh)
- Upload tài liệu học tập (Teacher), Xem và tải tài liệu (Student)

**English:**  
- User registration / login / authentication (JWT + Refresh Token)  
- Take RIASEC + TIPI tests  
- AI-based career recommendation  
- Student profile management (CRUD)  
- Admin management: majors, classes, users  
- Statistics & report generation  
- HTML editor for major description (with image upload)
- Upload study materials (Teacher), View and download study materials (Student)

---

## Cấu trúc dự án (Project Structure)
careerconnect/
│── backend/ # Spring Boot RESTful API
│── frontend/ # ReactJS (TypeScript)
│── module-AI/ # Service AI Predict (Python)
└── README.md

## Cài đặt (Installation)
1. Clone repo:  
   ```bash
   git clone https://github.com/quipa3012/CareerOrientation.git
   cd CareerOrientation

2. Frontend:
  cd frontend
  npm install
  npm run dev

3. Backend:
  cd backend
  .\mvnw.cmd spring-boot:run
   
5. AI-Service:
  cd .\module-AI\Ai-service
  python AI_predict.py
