import mongoose, { mongo } from "mongoose";
// Define mongoose schemas
const todoSchema = new mongoose.Schema({
    title: {type: String},
    description: String,
    done: Boolean,
    userId: String
  });

const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
});
  
export const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
  
export const User = mongoose.models.Todo || mongoose.model('User', userSchema);
  