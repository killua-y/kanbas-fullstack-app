import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Question collection.
 *
 * This schema defines the structure for storing questions in the database.
 * Each question includes the following fields:
 * - `title`: The title of the question.
 * - `text`: The detailed content of the question.
 * - `folders`: An array of references to `Folder` documents associated with the question.
 * - `answers`: An array of references to `Answer` documents associated with the question.
 * - `askedBy`: The username of the user who asked the question.
 * - `askDateTime`: The date and time when the question was asked.
 * - `views`: An array of usernames that have viewed the question.
 * - `upVotes`: An array of usernames that have upvoted the question.
 * - `downVotes`: An array of usernames that have downvoted the question.
 * - `comments`: Comments that have been added to the question by users.
 */
const questionSchema: Schema = new Schema(
  {
    title: {
      type: String,
    },
    text: {
      type: String,
    },
    folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
    askedBy: {
      type: String,
    },
    askDateTime: {
      type: Date,
    },
  },
  { collection: 'Question' },
);

export default questionSchema;
