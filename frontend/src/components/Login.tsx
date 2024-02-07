import { IoHomeOutline } from 'react-icons/io5';
import FormLogin from '../forms/formLogin';
import useGraphStore from '../store';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { username } = useGraphStore();
  const navigate = useNavigate();

  const handleClickHome = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className='bg-gray-800 h-full'>
      <div className="flex items-center justify-start p-4">
        <IoHomeOutline 
            onClick={handleClickHome}
            className="text-gray-300 text-3xl ml-4 rounded-md border mt-4 border-gray-300 p-1 cursor-pointer  hover:bg-gray-500 hover:border-gray-500 hover:text-gray-50"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-80">
          {username ? (
            <>
              <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">¡Bienvenido de nuevo, {username}!</h2>
            </>
          ) : (
            <FormLogin />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
