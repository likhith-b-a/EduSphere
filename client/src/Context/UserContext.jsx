import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { server } from "../main";


const UserContext = createContext();

export const UserContextProvider = ({ children }) => {

  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState([]);

  async function loginUser(email, password, navigate) {
    setBtnLoading(true);
    try {

      const { data } = await axios.post(`${server}/api/user/login`, { email, password })

      console.log(data.data.accessToken);
      toast.success(data.message);
      localStorage.setItem("token", data.data.accessToken);
      setUser(data.user)
      setIsAuth(true);
      setBtnLoading(false);

      await fetchUser();
      navigate("/")

    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setBtnLoading(false);
      toast.error(error.response.data.message);
    }
  }

  async function registerUser(name, email, password, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/register`, {
        name, email, password
      })

      console.log(data);

      toast.success(data.message);
      localStorage.setItem("activationToken", data.data);
      setBtnLoading(false);
      navigate("/verify");

    } catch (error) {
      setBtnLoading(false);
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  async function verifyOtp(otp, navigate) {
    setBtnLoading(true);
    const activationToken = localStorage.getItem("activationToken");
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        activationToken,
      });

      toast.success(data.message);
      navigate("/login");
      localStorage.clear();
      setBtnLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/profile`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        }
      })
      setIsAuth(true);
      setUser(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function fetchMyCourses() {
    try {
      const { data } = await axios.get(`${server}/api/course/mycourse`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        setMyCourses(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <UserContext.Provider
      value={{
        user, setUser, setIsAuth, isAuth, loginUser, btnLoading, loading, fetchUser, registerUser,
        verifyOtp, fetchMyCourses, myCourses
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  )
}

export const UserData = () => useContext(UserContext);