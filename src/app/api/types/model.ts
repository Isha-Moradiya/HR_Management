import { Types } from "mongoose";

export interface User {
  _id?: string;
  companyId: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  dob: Date;
  joiningDate: Date;
  department: Types.ObjectId | string;
  role: "admin" | "employee";
  avatar?: string; 
  salary?: number;
  skillset?: ("JavaScript" | "Python" | "Java" | "React" | "Node.js")[];
  emailVerified?: boolean;
}

export interface Otp {
  email: string;
  otpCode: string;
  expiresAt: Date;
}

export interface Department {
  _id: string;
  companyId: string;
  department_name: string;
  logo?: string;
  status: "active" | "inactive";
}


export interface Attendance {
  employee: Types.ObjectId | string;
  date: Date;
  status: "present" | "absent" | "half-day" | "leave";
}
