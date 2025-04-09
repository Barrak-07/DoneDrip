import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Components
import Input from '../common/Input';
import Button from '../common/Button';
import TodoItem from './TodoItem';
import TodosLoader from './TodosLoader';

// Types
import { UserState } from '../../types/user';
import { Todo, TodoState } from '../../types/todo';

// Contexts
import AuthContext from '../../context/auth/AuthContext';
import TodoContext from '../../context/todo/TodoContext';

// Icon
import githubIcon from '../../assets/github.svg';

const TodoLayout = () => {
  const navigate = useNavigate();

  const [currTodo, setCurrTodo] = useState<Todo>({
    title: '',
    description: '',
    completed: false,
  });

  const { logout }: UserState = useContext(AuthContext);
  const {
    todos,
    todoLoading,
    error,
    getTodos,
    createTodo,
    markComplete,
    deleteTodo,
    clearError,
  } = useContext<TodoState>(TodoContext);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrTodo({ ...currTodo, [e.target.name]: e.target.value });
  };

  const clearCurrTodo = () => {
    setCurrTodo({ title: '', description: '', completed: false });
  };

  const checkValid = () => {
    if (!currTodo.title.trim() || !currTodo.description.trim()) {
      toast.error('Please fill all the fields', {
        style: { background: '#333', color: '#fff' },
      });
      return false;
    }
    return true;
  };

  const addTodoHandler = async () => {
    const loadingToast = toast.loading('Adding Todo...', {
      style: { background: '#333', color: '#fff' },
    });

    if (!checkValid()) {
      toast.dismiss(loadingToast);
      return;
    }

    const success = await createTodo?.(currTodo);
    toast.dismiss(loadingToast);

    if (success) {
      toast.success('Todo Added Successfully', {
        style: { background: '#333', color: '#fff' },
      });
      clearCurrTodo();
    }
  };

  const markCompleteHandler = async (id: string) => {
    const loadingToast = toast.loading('Marking as Done...', {
      style: { background: '#333', color: '#fff' },
    });

    const success = await markComplete?.(id);
    toast.dismiss(loadingToast);

    if (success) {
      toast.success('Marked as Done', {
        style: { background: '#333', color: '#fff' },
      });
    } else {
      toast.error('Failed to mark as done', {
        style: { background: '#333', color: '#fff' },
      });
    }
  };

  const deleteTodoHandler = async (id: string) => {
    const loadingToast = toast.loading('Deleting Todo...', {
      style: { background: '#333', color: '#fff' },
    });

    const success = await deleteTodo?.(id);
    toast.dismiss(loadingToast);

    if (success) {
      toast.success('Deleted Successfully', {
        style: { background: '#333', color: '#fff' },
      });
    } else {
      toast.error('Failed to delete todo', {
        style: { background: '#333', color: '#fff' },
      });
    }
  };

  const logoutHandler = () => {
    logout();
    toast.success('Logged out Successfully', {
      style: { background: '#333', color: '#fff' },
    });
    navigate('/user/signin');
  };

  useEffect(() => {
    getTodos?.();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        style: { background: '#333', color: '#fff' },
      });
      clearError?.();
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-drip-bg text-drip-contrast font-drip px-6 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold drop-shadow-drip">DoneDrip Dashboard</h1>
        <Button text="Logout" onClick={logoutHandler} variant="danger" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Add Todo Form */}
        <div className="col-span-1">
          <Input
            type="text"
            name="title"
            placeholder="Todo Title"
            value={currTodo.title}
            onChange={onInputChange}
          />
          <Input
            type="text"
            name="description"
            placeholder="Todo Description"
            value={currTodo.description}
            onChange={onInputChange}
          />
          <Button
            text="Add Todo"
            onClick={addTodoHandler}
            className="w-full mt-2"
            type="button"
          />
        </div>

        {/* Todo List */}
        <div className="col-span-3 space-y-4">
          {todoLoading ? (
            <TodosLoader />
          ) : (
            todos?.length > 0 &&
            todos.map((todo, idx) => (
              todo?._id && (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  id={todo._id}
                  deleteTodoHandler={deleteTodoHandler}
                  markAsDone={markCompleteHandler}
                />
              )
            ))
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-center">
        <Link to="https://github.com/Barrak-07" target="_blank" rel="noreferrer">
          <img src={githubIcon} alt="GitHub" className="w-10 h-10" />
        </Link>
      </div>

      <Toaster />
    </div>
  );
};

export default TodoLayout;
