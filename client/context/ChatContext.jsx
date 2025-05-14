import { useContext, useEffect } from "react";
import { Children, createContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { data } from "react-router-dom";
import toast from "react-hot-toast";

export const ChatContext = createContext()

export const ChatProvider = ({children})=>{
    
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setunseenMessages] = useState({});
    const {socket,axios,token} = useContext(AuthContext)

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            if (!token) return;

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await axios.get('/api/message/users');
            console.log("user:", data);

            if (data.success) {
            setUsers(data.users);
            setunseenMessages(data.unseenMessages);
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get message for selectedUser
    const getMessages = async (userId) => {
        try {
          const {data} = await axios.get(`/api/message/${userId}`)
          console.log("data:",data);
          if (data.success) {
            setMessages(data.messages)
          }
        } catch (error) {
            toast.error(error.message)
        }
    }      

    //function to send message to selected user
    const sendMessage =async (messageData) => {
        try {
            const {data} = await axios.post(`/api/message/send/${selectedUser._id}`,messageData)
            console.log("messages:",data);
            if (data.success) {
                setMessages((prevMessages)=>[...prevMessages,data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    //function to subscribe to messages for selected user

    const subscribeToMessages = async () => {
        if (!socket)  return;

        socket.on('newMessage',(newMessage)=>{
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages((prevMessages)=>[...prevMessages,newMessage])    
                axios.put(`/api/message/mark/${newMessage._id}`);
            } else{
                setunseenMessages((prevunseenMessages)=>({
                    ...prevunseenMessages,[newMessage.senderId]:
                    prevunseenMessages[newMessage.senderId]? prevunseenMessages[newMessage.senderId]+1 : 1
                }))
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages =()=>{
        if (socket) socket.off('newMessage') 
    }


    useEffect(() => {
        subscribeToMessages();
        return ()=>unsubscribeFromMessages()
    //    getUsers()
    }, [socket,selectedUser]);

    const value={
        messages,
        users,
        selectedUser,setSelectedUser,
        getUsers,
        setMessages,
        getMessages,
        sendMessage,
        unseenMessages,setunseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}