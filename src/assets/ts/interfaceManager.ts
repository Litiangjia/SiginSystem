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
//课程表接口规范
export interface CourseTable{
  courseTableId: number;
  courseFkId: number;
  classFkId: number;
  weekDay: number;
  courseScheduleFkId: number;
  teacherFkId: number;
  creadit: number;
}

//课程表名接口规范，是课程表的归类
export interface CourseTableNames{
  id: number;
  courseTableName: string;
  classFkId: number;
}

// 定义课程表行数据接口
export interface CourseTableRow {
  courseTableId?: number
  courseFkId: number
  teacherFkId: number
  courseScheduleFkId?:number
  credit: number
  weekDay: number // 0-6 表示周一到周日
  courseTableNameFkId:number
}

export interface WeekDay{  //星期数据
  weekDay:number;
  courseTableRows:CourseTableRow[];  //星期对应的课程表行数据
}

// //定义接口类型 表数据
// export interface CourseTableData {
//   weekDays:WeekDay[];  //课程表数据
// }


//定义教师接口规范
export interface Teacher{
  teacherId: number;
  name: string;
  gender: number;
  age: number;
  hireDate: Date;
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
