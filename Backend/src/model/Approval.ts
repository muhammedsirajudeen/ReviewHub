import mongoose, { Schema } from 'mongoose';

interface IApproval extends Document {
  userId: mongoose.Types.ObjectId;
  experience: number;
  domain: string;
  comment: string;
  resumeFile: string;
  approvalStatus:boolean
}

const ApprovalSchema = new Schema<IApproval>({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
    ref:'User'
  },
  experience: {
    type: Number,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  resumeFile: {
    type: String,
    required: true,
  },
  approvalStatus:{
    type:Boolean,
    required:false,
    default:false
  }
});

const Approval = mongoose.model<IApproval>('approvals', ApprovalSchema);

export default Approval;
