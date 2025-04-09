import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

//components
import Button from '../common/Button';
import Input from '../common/Input';

//types
import { User, UserState } from '../../types/user';

//context
import AuthContext from '../../context/auth/AuthContext';

const Signup = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [registering, setRegistering] = useState(false);

  const { isRegistered, error, clearError, signup } =
    useContext<UserState>(AuthContext);

  const checkValid = () => {
    const { email, password, confirmPassword, username } = user;
    if (!email || !password || !confirmPassword || !username) {
      toast.error('Please fill all the fields', {
        style: { background: '#333', color: '#fff' },
      });
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        style: { background: '#333', color: '#fff' },
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loadingToast = toast.loading('Signing Up...', {
      style: { background: '#333', color: '#fff' },
    });

    if (!checkValid()) {
      toast.dismiss(loadingToast);
      return;
    }

    setRegistering(true);
    try {
      if (signup) {
        await signup({
          email: user.email,
          password: user.password,
          username: user.username,
        });
      }

      toast.dismiss(loadingToast);
      if (!error) {
        toast.success('Signed Up Successfully', {
          style: { background: '#333', color: '#fff' },
        });
      }
    } catch (err) {
      toast.dismiss(loadingToast);
    }
  };

  const onInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (isRegistered) {
      navigate('/todos');
    }
  }, [isRegistered]);

  useEffect(() => {
    if (error) {
      setRegistering(false);
      toast.error(error, {
        style: { background: '#333', color: '#fff' },
      });
      clearError?.();
    }
  }, [error]);

  return (
    <>
      <div className='min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-md'>
          <h2 className='mt-6 text-center text-3xl font-bold text-slate-200'>
            Sign UP to save your TODOs
          </h2>
        </div>

        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
          <div className='bg-gray-600/50 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
              <div>
                <label htmlFor='username' className='block text-sm font-medium text-slate-200'>
                  Username
                </label>
                <div className='mt-1'>
                  <Input
                    id='username'
                    name='username'
                    type='text'
                    variant='dark'
                    onChange={onInputChangeHandler}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-slate-200'>
                  Email address
                </label>
                <div className='mt-1'>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    variant='dark'
                    autoComplete='email'
                    onChange={onInputChangeHandler}
                  />
                </div>
                <p className='text-sm text-slate-400 mt-1'>
                  Only accepting Gmail, Yahoo and Outlook emails
                </p>
              </div>

              <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-200'>
                  Password
                </label>
                <div className='mt-1'>
                  <Input
                    id='password'
                    name='password'
                    type='password'
                    variant='dark'
                    autoComplete='current-password'
                    onChange={onInputChangeHandler}
                  />
                </div>
              </div>

              <div>
                <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-200'>
                  Confirm Password
                </label>
                <div className='mt-1'>
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    variant='dark'
                    autoComplete='current-password'
                    onChange={onInputChangeHandler}
                  />
                </div>
              </div>

              <Button
                text={registering ? 'Signing Up..' : 'Sign Up'}
                type='submit'
                variant='success'
              />
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
};

export default Signup;
