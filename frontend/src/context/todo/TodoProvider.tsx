import { useReducer, useEffect, ReactNode } from 'react';
import axios from 'axios';
import {
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  TODO_FAIL,
  CLEAR_ERROR,
  MARK_COMPLETE,
  SET_LOADING,
  SET_TODO_LOADING,
} from '../types';
import TodoReducer from './TodoReducer';
import TodoContext from './TodoContext';
import { Todo } from '../../types/todo';
import setAuthToken from '../../utils/SetAuthToken';

interface Props {
  children: ReactNode;
}

const TodoProvider = ({ children }: Props) => {
  const initialState = {
    todos: [],
    loading: false,
    todoLoading: false,
    error: null,
  };

  const [state, dispatch] = useReducer(TodoReducer, initialState);

  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getTodos();
    }
  }, []);

  const getTodos = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);

      dispatch({ type: SET_TODO_LOADING });

      const res = await axios.get(`${url}/todos`);
      dispatch({ type: GET_TODOS, payload: res.data.todos });
    } catch (err: any) {
      dispatch({
        type: TODO_FAIL,
        payload: err?.response?.data?.error || 'Error fetching todos',
      });
    }
  };

  const createTodo = async (todo: Todo): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);

      dispatch({ type: SET_LOADING });

      const res = await axios.post(`${url}/todos`, todo);
      dispatch({ type: CREATE_TODO, payload: res.data.todo });

      return true;
    } catch (err: any) {
      dispatch({
        type: TODO_FAIL,
        payload: err?.response?.data?.error || 'Failed to create todo',
      });
      return false;
    }
  };

  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);

      dispatch({ type: SET_LOADING });

      await axios.delete(`${url}/todos/${id}`);
      dispatch({ type: DELETE_TODO, payload: id });

      return true;
    } catch (err: any) {
      dispatch({
        type: TODO_FAIL,
        payload: err?.response?.data?.error || 'Failed to delete todo',
      });
      return false;
    }
  };

  const markComplete = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
      if (token) setAuthToken(token);

      dispatch({ type: SET_LOADING });

      await axios.put(`${url}/todos`, { id });
      dispatch({ type: MARK_COMPLETE, payload: id });

      return true;
    } catch (err: any) {
      dispatch({
        type: TODO_FAIL,
        payload: err?.response?.data?.error || 'Failed to mark as done',
      });
      return false;
    }
  };

  const clearError = (): void => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <TodoContext.Provider
      value={{
        todoLoading: state.todoLoading,
        loading: state.loading,
        todos: state.todos,
        error: state.error,
        createTodo,
        markComplete,
        clearError,
        getTodos,
        deleteTodo,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoProvider;
