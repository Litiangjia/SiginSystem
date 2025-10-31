//classes接口规范
export interface Classes{
  classId?: number;
  className: string;
  classNumber: number;
  grade: number;
}

//Courses接口规范
export interface Course{
  courseId?: number;
  courseName: string;
}

//CourseSchedule接口规范
export interface CourseSchedule{
  scheduleId?: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
  numberOfLessons: number;
}
//Student接口规范
export interface Student {
  studentId: number;
  classId: number;
  name: string;
  active: number;
  age: number;
  phoneNumber: string;
  studentNumber: string;
  token: string;
  createTime: Date;  // 时间类型
}



//请求分页接口规范
export interface PageRequest<T>{
    records:T[];
    total: number;
    current: number;
    size: number;
    pages: number;
}


// 定义后端菜单项的接口
export interface Menu {
  name: string;
  url?: string;
  root?: boolean;
  childrenActive?: boolean;
  children?: Menu[];
}
// 定义前端导航菜单项的接口
export interface NavMenuItem {
  name: string;
  url: string;
  icon: string;
  navActive: boolean;
}
