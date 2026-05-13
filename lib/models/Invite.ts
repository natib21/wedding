import { Schema, Document, model, models } from 'mongoose';

export interface IInvite extends Document {
  fullName: string;
  phoneNumber: string;
  slug: string;
  isAdmin: boolean;
  status: 'pending' | 'attended';
  createdAt: Date;
}

const InviteSchema = new Schema<IInvite>({
  fullName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phoneNumber: { 
    type: String, 
    required: false 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true 
  },
  isAdmin: {
  type: Boolean,
  default: false
},
  status: { 
    type: String, 
    enum: ['pending', 'attended'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Invite = models.Invite || model<IInvite>('Invite', InviteSchema);

export default Invite;
