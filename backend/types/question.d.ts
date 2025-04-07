import { ObjectId } from 'mongodb';
import { Request } from 'express';
import { DatabaseFolder, Folder } from './folder';

/**
 * Represents a question.
 * - `title`: The title of the question.
 * - `text`: The detailed content of the question.
 * - `folders`: An array of folders associated with the question.
 * - `askedBy`: The username of the user who asked the question.
 * - `askDateTime`: The timestamp when the question was asked.
 * - `views`: An array of usernames who have viewed the question.
 */
export interface Question {
  title: string;
  text: string;
  folders: Folder[];
  askedBy: string;
  askDateTime: Date;
  views: string[];
}

/**
 * Represents a question stored in the database.
 * - `_id`: Unique identifier for the question.
 * - `folders`: An array of ObjectIds referencing folders associated with the question.
 */
export interface DatabaseQuestion extends Omit<Question, 'folders'> {
  _id: ObjectId;
  folders: ObjectId[];
}

/**
 * Represents a fully populated question from the database.
 * - `folders`: An array of populated `DatabaseFolder` objects.
 */
export interface PopulatedDatabaseQuestion
  extends Omit<DatabaseQuestion, 'folders'> {
  folders: DatabaseFolder[];
}

/**
 * Type representing possible responses for a Question-related operation.
 * - Either a `DatabaseQuestion` object or an error message.
 */
export type QuestionResponse = DatabaseQuestion | { error: string };

/**
 * Type representing an object with the vote success message, updated upVotes,
 */
export type VoteInterface = { msg: string; upVotes: string[]; downVotes: string[] };

/**
 * Type representing possible responses for a vote-related operation.
 * - Either an object with the vote success message, updated upVotes,
 *   and updated downVotes, or an error message.
 */
export type VoteResponse = VoteInterface | { error: string };

/**
 * Interface for the request query to find questions using a search string.
 * - `search`: The search string used to find questions.
 * - `askedBy`: The username of the user who asked the question.
 * - `order`: The order type to filter the questions.
 * - `username`: The username for AI-based recommendations.
 * - `isAiSearch`: Whether to use AI-based search.
 */
export interface FindQuestionRequest extends Request {
  query: {
    search: string;
    askedBy: string;
    order?: string;
    username?: string;
    isAiSearch?: string;
  };
}

/**
 * Interface for the request when finding a question by its ID.
 * - `qid`: The unique identifier of the question (params).
 * - `username`: The username of the user making the request (body).
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - `body`: The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - `qid`: The unique identifier of the question being voted on (body).
 * - `username`: The username of the user casting the vote (body).
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}
