// asyncHandler.ts
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next); // ส่งข้อผิดพลาดไปที่ next()
  };
};
