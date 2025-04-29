import { useEffect, useState, useRef } from "react";
import { IMessage, IncomingCall, Notification, JitsiOptions,JitsiMeetExternalAPI } from "../../types/Ichat";
import { Role, SignupFormData } from "../../types/IForm";
import { IEnrollment } from "../../types/IEnrollment";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { useSocket } from "../../context/Sockets";
import ScrollToBottom from "react-scroll-to-bottom";
import pic from '../../assets/commonPages/placeHolder.png'
import { format, isToday, isYesterday, startOfDay, isSameDay } from 'date-fns';
import EmojiPicker, { EmojiClickData }  from "emoji-picker-react";
import { chatUploadToCloud } from "../../utilities/axios/UploadCloudinary";

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (
      domain: string,
      options: JitsiOptions
    ) => JitsiMeetExternalAPI;
  }
}

const ChatPage = () => {
  const [instructors, setInstructors] = useState<SignupFormData[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<string | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [jitsiLoaded, setJitsiLoaded] = useState(false);
  const [roomName, setRoomName] = useState("");
  const user = useSelector((state: RootState) => state.auth.data);
  const socket = useSocket();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);
  const [incomingCall, setIncomingCall] = useState<IncomingCall>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestMessages, setLatestMessages] = useState<{ [key: string]: IMessage }>({});
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: boolean }>({});
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiObject:EmojiClickData) => {
    setNewMessage((prev) => prev + emojiObject.emoji); 
    setShowEmojiPicker(false); 
  };

  // recieve messages and notifications
  useEffect(() => {
    if (socket) {

      socket.on("receiveMessage", (newMessage: IMessage) => {      
        
        setMessages((prev) =>
          prev
            .map((msg) =>
              msg._id?.startsWith("temp-") &&
              (typeof msg.sender === "string" ? msg.sender : msg.sender?._id) === (typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender?._id) &&
              msg.reciever === newMessage.reciever
                ? newMessage
                : msg
            )
            .concat(
              (typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender?._id) === user?._id
                ? []
                : [newMessage]
            )
        );
      
        const senderId = typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender?._id;
        const recieverId = typeof newMessage.reciever === "string" ? newMessage.reciever : newMessage.reciever?._id;
      
        if (!senderId || !recieverId) {
          console.error("Missing sender or reciever ID:", newMessage);
          return; 
        }
      
        const contactId: string = senderId === user?._id ? recieverId : senderId;
        setLatestMessages((prev) => ({
          ...prev,
          [contactId]: newMessage,
        }));
      });
      
      // listen to the new notifications
      socket.on("receiveNotification", (notification: Notification) => {
        console.log("New notification received:", notification);

        setNotifications((prev) => {
          if (notification.sender === selectedInstructor) {
            console.log(
              "Ignoring notification because user is already chatting with this person"
            );
            // Mark as seen immediately if chatting with sender
            CLIENT_API.put("/chats/notification/seen", {
              notificationId: notification._id,
              userId: user?._id,
            });
            console.log("updated notification");
            return prev;
          }
          // Avoid duplicate notifications
          if (!prev.some((notif) => notif.sender === notification.sender)) {
            return [...prev, notification];
          }
          return prev;
        });
      });

      return () => {
        console.log("socket disconnected");
        socket.off("receiveMessage");
        socket.off("receiveNotification");
      };
    }
  }, [socket, selectedInstructor, user]);

//  fetch messages after selecting a user
  const fetchMessages = async (contactId: string) => {
    try {
      setLoading(true);
      setSelectedInstructor(contactId);

      const senderId = user?._id;
      const receiverId = contactId;

      // Access the chat
      await CLIENT_API.post("/chats/access", { userId: senderId, receiverId });

      // Fetch the messages
      const response = await CLIENT_API.get(`/chats/${senderId}/${receiverId}`);
      setMessages(response.data.data || []);

      // Update notifications: Mark notifications from this contact as seen
      const updatedNotifications = notifications.map((notif) =>
        notif.sender === contactId && !notif.isSeen
          ? { ...notif, isSeen: true }
          : notif
      );
      setNotifications(updatedNotifications);

      // Make an API call to update the notification's isSeen status on the server
      const unseenNotifications = notifications.filter(
        (notif) => notif.sender === contactId && !notif.isSeen
      );
      if (unseenNotifications.length > 0) {
        await Promise.all(
          unseenNotifications.map((notif) =>
            CLIENT_API.put("chats/notification/seen", {
              notificationId: notif._id,
            })
          )
        );
      }

      // Get chat ID and mark messages as seen
      const chat = await getChatId(senderId || "", receiverId);
      if (chat) {
        await CLIENT_API.put("/chats/seen", { chatId: chat, userId: senderId });
      }
    } catch (error) {
      console.error("Error fetching messages", error);
    } finally {
      setLoading(false);
    }
  };

  const getChatId = async (userId: string, receiverId: string) => {
    try {
      const response = await CLIENT_API.post("/chats/access", {
        userId,
        receiverId,
      });
      return response.data.data._id;
    } catch (error) {
      console.error("Error getting chat ID", error);
      return null;
    }
  };


  useEffect(() => {
    if (user?._id) {
      fetchContacts();
      fetchNotifications();
    }
  }, [user?._id]);


// fetch all the contacts while enter to the page
   const fetchContacts = async () => {
    try {
      setLoading(true);
      let contacts:SignupFormData[] =[];

      if (user?.role === Role.Student) {
        const response = await CLIENT_API.get(`/student/enrolled/${user?._id}`);
        const enrolledCourses = response.data.data;

         contacts = Array.from(
          new Set(
            enrolledCourses
              .filter(
                (course: IEnrollment) =>
                  course.courseDetails?.instructor?._id !== undefined
              )
              .map(
                (course: IEnrollment) => course.courseDetails?.instructor?._id
              )
          )
        )
          .map((id) => {
            const course = enrolledCourses.find(
              (course: IEnrollment) =>
                course.courseDetails?.instructor?._id === id
            );
            return course?.courseDetails?.instructor;
          })
          .filter(
            (instructor): instructor is NonNullable<typeof instructor> =>
              instructor !== undefined
          );
        
        
      } else if (user?.role === Role.Instructor) {
        const response = await CLIENT_API.get(
          `/chats/instructor/meesagedStudent/${user?._id}`
        );
         contacts = response.data.data;
      }
      setInstructors(contacts);

    // Fetch all messages involving the user and extract latest per contact
    const messagesResponse = await CLIENT_API.get(`/chats/all/messages/${user?._id}`);
    console.log('message response',messagesResponse.data.data)
    const allMessages: IMessage[] = messagesResponse.data.data || [];

    const latestMsgs: { [key: string]: IMessage } = {};
    contacts.forEach((contact) => {
      const contactMessages = allMessages
 
        .filter((msg: IMessage) => msg.createdAt !== undefined)
        .filter((msg: IMessage) => {
          const senderId =
            typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
          const recieverId =
            typeof msg.reciever === "string" ? msg.reciever : msg.reciever?._id;
          return (
            (senderId === user?._id && recieverId === contact._id) ||
            (senderId === contact._id && recieverId === user?._id)
          );
        })
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());

      if (contactMessages.length > 0) {
        latestMsgs[contact._id ?? ''] = contactMessages[0]; // Latest message
        
      }
    });
    setLatestMessages(latestMsgs);
    console.log('latest message',latestMsgs)

    } catch (error) {
      console.error("Error fetching instructors", error);
    } finally {
      setLoading(false);
    }
  };

    // fetching notifications
    const fetchNotifications = async () => {
      try {
        const response = await CLIENT_API.get(
          `/chats/new/notifications/${user?._id}`
        );
        const fetchedNotifications = response.data.data || [];
  
        // Filter out notifications that belong to the selected chat
        const unseenNotifications = fetchedNotifications.filter(
          (notification: Notification) =>
            notification.sender !== selectedInstructor
        );
  
        // If there are notifications from the active chat, mark them as seen
        const seenNotifications = fetchedNotifications.filter(
          (notification: Notification) =>
            notification.sender === selectedInstructor
        );
  
        if (seenNotifications.length > 0) {
          await CLIENT_API.put("/chats/notification/seen", {
            notificationIds: seenNotifications?.map(
              (notif: Notification) => notif._id
            ),
            userId: user?._id,
          });
        }
  
        setNotifications(unseenNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };


  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedInstructor || !user?._id) return;
    try {
      const messageData = {
        sender: user._id,
        reciever: selectedInstructor,
        content: newMessage,
        contentType: "text" as const,
      };
      if (socket) {
        const tempMessage:IMessage = { ...messageData, _id: 'temp-' + Date.now(), createdAt: new Date() };
        setMessages((prev) => [...prev, tempMessage]);
        
        setLatestMessages((prev) => ({
          ...prev,
          [selectedInstructor]: tempMessage, // Set as latest for this contact
        }));
        socket.emit("sendMessage", messageData);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  // get all online users
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("get_online_users", user._id);
      
      socket.on("initial_online_users", (onlineUsersList) => {
        setOnlineUsers(onlineUsersList);
      });
  
      socket.on("online_status", ({ userId, isOnline }) => {
        setOnlineUsers((prev) => {
          const newState = { ...prev, [userId]: isOnline };
          return newState;
        });
      });
  
      socket.on("user_data", (latestMessages) => {
        setLatestMessages((prev) => ({
          ...prev,
          [latestMessages?.sender?._id]: latestMessages,
        }));
        setLoading(false);
      });
  
      return () => {
        socket.off("user_data");
        socket.off("initial_online_users");
        socket.off("online_status");
      };
    }
  }, [socket, user?._id]);


  // send message by pressing enter button
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

    // show date label for date seperation
    const getDateLabel = (date: Date) => {
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMMM d, yyyy"); 
    };
  

    // Load Jitsi video call script
    useEffect(() => {
      if (
        !document.querySelector(
          'script[src="https://meet.jit.si/external_api.js"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://meet.jit.si/external_api.js";
        script.async = true;
        script.onload = () => {
          setJitsiLoaded(true);
        };
        script.onerror = () => {
          console.error("Failed to load Jitsi script");
        };
        document.body.appendChild(script);
      } else {
        setJitsiLoaded(true);
      }
    }, []);

    // start video call function
  const startVideoCall = () => {
    if (isVideoCallActive) {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      // Notify others that the call has ended
      socket?.emit("callEnded", { roomName });
      setIsVideoCallActive(false);
      return;
    }

    if (!selectedInstructor || !user || !user._id) {
      console.log("Cannot start call - missing user or instructor data");
      return;
    }

    // Make sure Jitsi is loaded before allowing call
    if (!jitsiLoaded) {
      console.log("Jitsi not loaded yet, please try again in a moment");
      return;
    }

    // Create a unique room name
    const newRoomName = `Chat_${user._id}_${selectedInstructor}`.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    );
    setRoomName(newRoomName);

    // Notify the other user about the call
    socket?.emit("callUser", {
      callerId: user._id,
      receiverId: selectedInstructor,
      roomName: newRoomName,
      callerName: user.userName,
    });

    setIsVideoCallActive(true);
  };

  // video call states update
  useEffect(() => {
    if (socket) {
      socket.on("incomingCall", (data) => {

        // Store call details in state
        setIncomingCall({
          roomName: data.roomName,
          callerName: data.callerName,
          callerId: data.callerId,
        });
      });

      socket.on("callRejected", () => {
        alert("Call was rejected");
        setIsVideoCallActive(false);
      });
    }

    return () => {
      if (socket) {
        socket.off("incomingCall");
        socket.off("callRejected");
      }
    };
  }, [socket]);

  // Initialize Jitsi when call becomes active
  useEffect(() => {
    
    if (
      !isVideoCallActive ||
      !jitsiContainerRef.current ||
      !roomName ||
      !jitsiLoaded ||
      !user
    ) {
      return;
    }

    try {
      console.log("Initializing Jitsi call for room:", roomName);
      const domain = "meet.jit.si";

      const options: JitsiOptions = {
        roomName: roomName,
        width: "100%",
        height: "400px",
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: user.userName || "",
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
        },
      };

      // Use window.JitsiMeetExternalAPI since it's loaded as a global
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;
      console.log("Jitsi API initialized");

      api.addEventListener("videoConferenceLeft", () => {
        console.log("Video conference left");
        setIsVideoCallActive(false);
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }

        socket?.emit("callEnded", { roomName });
      });

      // Handle page navigation/closing
      const handleBeforeUnload = () => {
        if (jitsiApiRef.current) {
          jitsiApiRef.current.dispose();
          socket?.emit("callEnded", { roomName });
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        if (jitsiApiRef.current) {
          console.log("Cleaning up Jitsi");
          jitsiApiRef.current.dispose();
          jitsiApiRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing Jitsi:", error);
      setIsVideoCallActive(false);
    }
  }, [isVideoCallActive, roomName, jitsiLoaded, user, socket]);

  // Handle call ended event
  useEffect(() => {
    if (socket) {
      socket.on("callEnded", (data) => {
        console.log("Call ended for room:", data.roomName);
        if (data.roomName === roomName) {
          setIsVideoCallActive(false);
          if (jitsiApiRef.current) {
            jitsiApiRef.current.dispose();
            jitsiApiRef.current = null;
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("callEnded");
      }
    };
  }, [socket, roomName]);

  // Handle typing event
  useEffect(() => {
    if (!socket) return;

    // Listen for typing event from backend
    socket.on("typing", (senderId) => {
      setTypingUser(senderId);
    });

    // Listen for stop typing event
    socket.on("stop_typing", (senderId) => {
      if (typingUser === senderId) setTypingUser(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [typingUser]);

  const handleTyping = () => {
    if(!socket)return
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        senderId: user?._id,
        receiverId: selectedInstructor,
      });

      // Stop typing after 2 seconds if no further input
      setTimeout(() => {
        setIsTyping(false);
        socket.emit("stop_typing", {
          senderId: user?._id,
          receiverId: selectedInstructor,
        });
      }, 2000);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedInstructor || !user?._id) return;
  
    try {
      setLoading(true);
  
      const uploadedFileUrl = await chatUploadToCloud(file);

    if (!uploadedFileUrl) {
      console.error("File upload failed");
      return;
    }

    // ⬇️ Determine file type
    const contentType = getContentType(file.type);
  
      const messageData: IMessage = {
        sender: user._id,
        reciever: selectedInstructor,
        content: uploadedFileUrl,
        contentType,
        _id: `temp-${Date.now()}`,
        createdAt: new Date(),
      };
  
      // Add temp message to UI
      setMessages((prev) => [...prev, messageData]);
      setLatestMessages((prev) => ({
        ...prev,
        [selectedInstructor]: messageData,
      }));
  
      // Emit via socket
      if (socket) {
        socket.emit("sendMessage", messageData);
      }
  
      // Clear file input
      e.target.value = "";
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper to determine content type
  const getContentType = (mimeType: string): IMessage["contentType"] => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "file"; 
  };
  
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Contacts sidebar - hide on mobile when chat is selected */}
      <div className={`${selectedInstructor ? 'hidden md:block' : 'block'} w-full md:w-1/3 lg:w-1/4 bg-gray-100 p-4 h-full overflow-y-auto`}>
        <h2 className="text-lg font-semibold mb-4">
          {user?.role === Role.Student ? "Instructors" : "Students"}
        </h2>
        {loading && !selectedInstructor ? (
          <p className="text-gray-500">Loading Contacts...</p>
        ) : (
          <ul className="space-y-2">
            {instructors.map((contact) => {
              const hasNotification = notifications.some(
                (notif) => notif.sender === contact._id && !notif.isSeen
              );
              const latestMessage = latestMessages ? latestMessages[contact?._id || ""] || null : null;
              return (
                <li
                  key={contact._id}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${
                    selectedInstructor === contact._id ? "bg-blue-200" : "bg-white"
                  } shadow-sm`}
                  onClick={() => fetchMessages(contact?._id || "")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={contact.profile?.avatar || pic}
                          alt={contact.userName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        {contact._id && onlineUsers[contact._id] && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></span>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 truncate max-w-xs">{contact.userName}</span>
                        {latestMessage ? (
                          <span className="text-xs text-gray-600 truncate max-w-xs">
                            {latestMessage.content?.substring(0, 20) || "No message content"}
                            {latestMessage.content && latestMessage.content.length > 20 ? "..." : ""}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No messages yet</span>
                        )}
                      </div>
                    </div>
                    {hasNotification && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {instructors.length === 0 && !loading && (
          <p className="text-gray-500 text-center mt-8">Please enroll in a course to start chatting with the instructor.</p>
        )}
      </div>
  
      {/* Chat area - show on mobile only when chat is selected */}
      <div className={`${selectedInstructor ? 'block' : 'hidden md:block'} w-full md:w-2/3 lg:w-3/4 flex flex-col h-full`}>
        {selectedInstructor ? (
          <>
            {/* Chat header */}
            <div className="bg-white shadow p-3 flex justify-between items-center sticky top-0 z-10 border-b ">
              <div className="flex items-center space-x-3">
                <button
                  className="md:hidden text-gray-600 hover:text-gray-800"
                  onClick={() => fetchMessages("")} // Deselect to show contact list
                  aria-label="Back to contacts"
                > 
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img
                  src={instructors.find((i) => i._id === selectedInstructor)?.profile?.avatar || pic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <h3 className="font-medium text-gray-800">
                    {instructors.find((i) => i._id === selectedInstructor)?.userName || "Chat"}
                  </h3>
                  {onlineUsers[selectedInstructor] && (
                    <p className="text-xs text-green-600">online</p>
                  )}
                </div>
              </div>
              <button
                onClick={startVideoCall}
                className={`${
                  isVideoCallActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-3 py-2 rounded-lg transition-colors text-sm flex items-center`}
                disabled={!jitsiLoaded}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {!jitsiLoaded
                  ? "Loading..."
                  : isVideoCallActive
                  ? "End Call"
                  : "Video Call"}
              </button>
            </div>
  
            {/* Video call container */}
            {isVideoCallActive && (
              <div
                ref={jitsiContainerRef}
                className="border rounded-lg overflow-hidden h-64 md:h-96 mx-2"
              />
            )}
  
            {/* Messages area */}
            <ScrollToBottom
              className={`flex-1 overflow-y-auto p-4 bg-gray-50 ${
                isVideoCallActive ? "max-h-40" : "flex-grow"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => {
                  const currentDate = msg.createdAt ? new Date(msg.createdAt) : null;
                  const prevMsg = index > 0 ? messages[index - 1] : null;
                  const prevDate = prevMsg?.createdAt ? new Date(prevMsg.createdAt) : null;
  
                  const showDateSeparator =
                    index === 0 || (currentDate && prevDate && !isSameDay(currentDate, prevDate));
  
                  const isCurrentUser = (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                    (typeof msg.sender === "string" && msg.sender === user?._id);
  
                  return (
                    <div key={msg._id || index}>
                      {showDateSeparator && currentDate && (
                        <div className="flex justify-center my-3">
                          <span className="text-xs text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                            {getDateLabel(startOfDay(currentDate))}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        } my-2`}
                      >
                        <div
                          className={`flex flex-col ${
                            isCurrentUser ? "items-end" : "items-start"
                          } max-w-xs sm:max-w-sm md:max-w-md`}
                        >
                          <div
                            className={`inline-block px-4 py-2 rounded-lg ${
                              isCurrentUser
                                // ? "bg-blue-500 text-white rounded-br-none"
                                ? `${
                                  msg.contentType === "image" || msg.contentType === "video"
                                    ? "text-white rounded-br-none"
                                    : "bg-blue-500 text-white rounded-br-none"
                                }`
                                : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                            }`}
                          >
                            {msg.contentType === "image" ? (
                              <img
                                src={msg.content}
                                alt="uploaded"
                                className="max-w-full rounded-lg object-cover"
                              />
                            ) : msg.contentType === "video" ? (
                              <video controls className="max-w-full rounded-lg">
                                <source src={msg.content} />
                                Your browser does not support the video tag.
                              </video>
                            ) : msg.contentType === "audio" ? (
                              <audio controls className="max-w-full">
                                <source src={msg.content} />
                                Your browser does not support the audio tag.
                              </audio>
                            ) : (
                              msg.content
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">
                            {msg.createdAt
                              ? format(new Date(msg.createdAt), "h:mm a")
                              : "Time not available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-center text-gray-500">
                    No messages yet. Start the conversation!
                  </p>
                </div>
              )}
              <div className="chat-box">
                {typingUser === selectedInstructor && (
                  <div className="typing-indicator flex items-center space-x-1 p-2">
                    <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="bg-gray-300 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                )}
              </div>
            </ScrollToBottom>
  
            {/* Message input area */}
            <div className="p-3 bg-white border-t relative">
              <div className="flex rounded-lg overflow-hidden border">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="bg-gray-100 hover:bg-gray-200 p-3 transition-colors flex-shrink-0"
                  aria-label="Emoji picker"
                >
                  😊
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={handleKeyPress}
                  className="flex-1 p-3 focus:outline-none focus:ring-1 focus:ring-blue-300"
                  placeholder="Type a message..."
                />
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,video/*,audio/*,.pdf"
                  onChange={handleFileUpload}
                />
                <label
                  htmlFor="file-upload"
                  className="bg-gray-100 hover:bg-gray-200 p-3 cursor-pointer transition-colors flex items-center justify-center flex-shrink-0"
                  aria-label="Attach file"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </label>
                <button
                  onClick={sendMessage}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 transition-colors flex items-center justify-center flex-shrink-0"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              {/* Emoji Picker Dropdown */}
              {showEmojiPicker && (
                <div className="absolute bottom-16 left-0 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-4 md:flex">

            <img
    src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" 
    alt="Empty Chat"
    className="h-40 w-40 object-contain mb-4 opacity-50"
  />
            <p className="text-gray-500 text-lg text-center">
              Select a contact to start chatting
            </p>
          </div>
        )}
      </div>
  
      {/* Incoming call notification */}
      {incomingCall && (
        <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 border border-gray-300 w-64 z-50 animate-bounce">
          <p className="text-sm font-medium text-gray-700">
            <span className="text-lg mr-2">📞</span> {incomingCall?.callerName} is calling...
          </p>
          <div className="flex justify-between mt-3">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 w-full mr-2 flex items-center justify-center"
              onClick={() => {
                setIsVideoCallActive(true);
                setRoomName(incomingCall.roomName);
                window.location.href = `https://meet.jit.si/${incomingCall.roomName}`;
                setIncomingCall(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Join
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 w-full flex items-center justify-center"
              onClick={() => {
                socket?.emit("callRejected", {
                  callerId: incomingCall.callerId,
                });
                setIncomingCall(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;



