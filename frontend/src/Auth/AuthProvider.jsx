import { useContext, createContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { decodeToken } from "./decode";


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const backend_Url = import.meta.env.VITE_BACKEND_URL;
  const [info, setInfo] = useState(JSON.stringify(decodeToken(localStorage.getItem("accessToken"))) || null)
  const [token, setToken] = useState(localStorage.getItem("accessToken") || "");




  const navigate = useNavigate();
  const loginAction = async (data) => {
    try {
      const response = await fetch(`${backend_Url}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Something went wrong');
        } else {
          throw new Error('Unexpected response format');
        }
      }

       const res = await response.json();
      
        
        setToken(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setInfo(JSON.stringify(decodeToken(res.data.accessToken)));
        navigate('/dashboard');
        toast("Logged In Successfully");
        return true;
      
      
    } catch (err) {
      
      toast(err.message); //pop up error message
      return false;
    }
  };

  const logOut = async() => {
    try {
      const response = await fetch(`${backend_Url}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", 
        
      })
       const res = await response.json();
      
      
      setToken("");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    toast("Logged Out Successfully");
      
    } catch (err) {
      toast(err.message);
    }
    
  };
  const Register = async(data)=>{
    console.log('register')
    try{
      const response = await fetch(`${backend_Url}/api/v1/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
       const res = await response.json();
       console.log(res)
       if (res.statusCode == 200) {
        toast("OTP sent successfully check your email");
        return true;
      }
      return false;
    }catch(err){
      toast("Error while registration");
      return false;
    }
    
  }
  const verify = async(data)=>{
    try {
      const response = await fetch(`${backend_Url}/api/v1/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })
       const res = await response.json();
       
      
      if (res.data.accessToken && res.data.refreshToken) {
        
        setToken(res.data.accessToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setInfo(JSON.stringify(decodeToken(res.data.accessToken)));
        navigate('/dashboard');
        toast("Logged In Successfully");
        return;
      }
      navigate('/loginError')
      throw new Error(res.message);
    } catch (err) {
      toast(err.message);
    }
  }
  return (
    <AuthContext.Provider value={{ info,backend_Url,token, loginAction, logOut,Register,verify,setInfo }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
