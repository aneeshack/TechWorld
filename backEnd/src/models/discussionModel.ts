import { Schema, model } from 'mongoose';
import { IDiscussion } from '../interfaces/courses/IDiscussion';

const replySchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true, timestamps: false } // Ensure each reply has an _id
);

const discussionSchema = new Schema<IDiscussion>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'courses',
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      required: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    replies: {
      type: Number,
      default: 0,
    },
    voters: {
      type: [Schema.Types.ObjectId],
      ref: 'users',
      default: [], // Array to store user IDs who upvoted
    },
    views: {
      type: Number,
      default: 0,
    },
    repliesList: {
      type: [replySchema],
      default: [], // Array of embedded reply subdocuments
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const DiscussionModel = model<IDiscussion>('discussions', discussionSchema);