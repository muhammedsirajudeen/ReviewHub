import mongoose, { Schema } from 'mongoose';

export interface ICourse extends Document {
  courseName: string;
  courseDescription: string;
  domain: string;
  tagline: string;
  courseImage: string;
}
const CourseSchema: Schema<ICourse> = new Schema({
  courseName: {
    type: String,
    required: true,
    unique: true,
  },
  courseDescription: {
    type: String,
    required: true,
    unique: false,
  },
  domain: {
    type: String,
    required: true,
    unique: false,
  },
  tagline: {
    type: String,
    required: true,
    unique: false,
  },
  courseImage: {
    type: String,
    required: false,
    unique: false,
  },
});

const Course = mongoose.model<ICourse>('courses', CourseSchema);
export default Course;
