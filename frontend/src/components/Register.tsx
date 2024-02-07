import { useNavigate } from "react-router-dom";
import FormRegister from "../forms/formRegister"
import useGraphStore from "../store"
import { IoHomeOutline } from 'react-icons/io5';
const Register = () => {
  const { username } = useGraphStore(); 
  const navigate = useNavigate();


  const handleClickHome = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    navigate('/');
  }

return (
    <div className='bg-blue-500 h-full'>
        <div className="flex items-center justify-start p-4">
        <IoHomeOutline 
            onClick={handleClickHome}
            className="text-gray-300 text-3xl ml-4 rounded-md border mt-4 border-gray-300 p-1 cursor-pointer hover:bg-gray-50 hover:border-gray-500 hover:text-gray-500"
        />
        </div>
        <div className="flex items-center justify-center min-h-screen bg-blue-500">
            <div className="bg-white p-8 rounded-lg shadow-md w-80">
                {
                    username ? 
                    <>
                        <h2 className="text-2xl font-semibold text-center mb-4 text-blue-500">
                            Ya has iniciado sesión {username}
                        </h2>
                        <p className="text-center mt-4 text-sm text-gray-600">
                            Volver al inicio <button onClick={handleClickHome} className="text-blue-500 focus:outline-none underline hover:text-blue-800">Inicio</button>
                        </p>
                        
                    </>
                    : <FormRegister />
                }
            </div>
        </div>
    </div>
  )
}

export default Register