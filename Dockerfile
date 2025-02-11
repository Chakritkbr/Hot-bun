# ใช้ Node.js base image ที่มีขนาดเล็ก
FROM node:18-alpine

# กำหนด working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json (ช่วยลด layer caching)
COPY package.json package-lock.json ./

# ติดตั้ง dependencies แบบ clean
RUN npm ci

# คัดลอกโค้ดทั้งหมดเข้า container
COPY . .

# คัดลอกไฟล์ .env เพื่อให้ Prisma ใช้
COPY .env .env

# สร้าง Prisma Client
RUN npx prisma generate

# คอมไพล์ TypeScript
RUN npm run build

# กำหนด port ที่จะ expose
EXPOSE ${PORT}

# คำสั่งเริ่มต้น รันเซิร์ฟเวอร์จากไฟล์ที่ถูกคอมไพล์
CMD ["npm", "run", "dev"]
