import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type Rootstate } from "../../redux/store";
import { clearData } from "../../redux/slice/userSlice/authDataSlice";
import toast from 'react-hot-toast';
import { useLogout } from '../../hooks/AuthHooks';


const Home = () => {
 const userData = useSelector((state: Rootstate) => state.authData)



 
  console.log("userDatas", userData);

  const dispatch = useDispatch();
  const navigate = useNavigate();
const {mutate: logout} = useLogout()

  const handleLogout = () => {
   logout(undefined,{
      onSuccess: () => {
        dispatch(clearData())
        toast.success("User logged out successfully");
        navigate("/admin/login")
      },
      onError: () => {
        toast.error("Logout failed. Please try again.");
      }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-blue-200">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Home Page</h1>

      

      <h1>Name: {userData.name}</h1>
        <p>{userData.email}</p>
  

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
