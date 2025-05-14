import { Children, createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [socket, setSocket] = useState(null);

  //check if user is authenticated and if so, set  the user data and connect the socket

  const checkAuth = async (params) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const { data } = await axios.get("/api/user/checkAuth");
    //   console.log("data:", data);
      if (data.success) {
        setAuthUser(data.user);
        console.log("AuthUser",data.user);
        connectSocket(data.user);
      }
    } catch (error) {
      toast.error("Session expired, please login again.");
      setAuthUser(null);
      localStorage.removeItem("token");
    }
  };

  //login function to handle user auth and socket connection

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/user/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        axios.defaults.headers.common["token"] = data.accesstoken;
        setToken(data.accesstoken);
        localStorage.setItem("token", data.accesstoken);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //logout function for handle user logout and socket disconnection

  const logout = async () => {
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
    setOnlineUser([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged Out successfully!");
    socket.disconnect();
  };

  //update user profile

  const updateprofile = async (body) => {
    try {
      const { data } = await axios.put("/api/user/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //connect socket function to handle socket connection and online users updates

  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUser(userIds);
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    axios,
    token,
    authUser,
    onlineUser,
    socket,
    login,
    logout,
    updateprofile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
