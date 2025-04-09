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
    <div className="flex  h-[70vh]">
   <div className="w-1/4 bg-gray-100 p-4 h-[75vh]">
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
                  const latestMessage = latestMessages? latestMessages[contact?._id || ""] || null :null;
                  return (
                    <li
                      key={contact._id}
                      className={`p-3 rounded-lg cursor-pointer flex flex-col items-center hover:bg-blue-100 transition-colors ${
                        selectedInstructor === contact._id
                          ? "bg-blue-200"
                          : "bg-white"
                      }`}
                      onClick={() => fetchMessages(contact?._id || "")}
                    >
                      <div className="flex items-center space-x-3">
                      <img
                        src={contact.profile?.avatar || pic} 
                        alt={contact.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{contact.userName}</span>
                      {hasNotification && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                      </div>
                      {latestMessage ? (
                  <span className="text-sm text-gray-600 truncate">
                    {latestMessage.content?.substring(0, 10) || "No message content"}
                    {latestMessage.content && latestMessage.content.length > 30 ? "..." : ""}
                  </span>
                ) : (
                  
                  <span className="text-sm text-gray-400">No messages yet</span>
                )}
                    </li>
                  );
                })}
              </ul>
            )}
            {instructors.length === 0 && !loading && (
              <p className="text-gray-500">No contacts found</p>
            )}
          </div>

      <div className="w-3/4 p-4 flex flex-col h-[80vh]">
        {selectedInstructor ? (
          <>
            <div className="bg-white rounded-lg shadow p-2 mb-4 flex justify-between items-center">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-800">
                    {instructors.find((i) => i._id === selectedInstructor)?.userName || "Chat"}
                  </h3>
                  {onlineUsers[selectedInstructor] && (
                    <span
                      className="ml-2 w-3 h-3 bg-green-500 rounded-full"
                      title="Online"
                    ></span>
                  )}
                </div>
                {onlineUsers[selectedInstructor] && (
                  <p className="text-xs text-gray-600">online</p>
                )}
              </div>
              <button
                onClick={startVideoCall}
                className={`${
                  isVideoCallActive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 rounded-lg transition-colors`}
                disabled={!jitsiLoaded}
              >
                {!jitsiLoaded
                  ? "Loading Jitsi..."
                  : isVideoCallActive
                  ? "End Call"
                  : "Start Video Call"}
              </button>
              {incomingCall && (
                <div className="fixed bottom-5 right-5 bg-white shadow-lg rounded-lg p-4 border border-gray-300 w-64">
                  <p className="text-sm font-medium text-gray-700">
                    📞 {incomingCall?.callerName} is calling...
                  </p>
                  <div className="flex justify-between mt-3">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      onClick={() => {
                        setIsVideoCallActive(true);
                        setRoomName(incomingCall.roomName);
                        window.location.href = `https://meet.jit.si/${incomingCall.roomName}`;
                        setIncomingCall(null);
                      }}
                    >
                      ✅ Join
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                      onClick={() => {
                        socket?.emit("callRejected", {
                          callerId: incomingCall.callerId,
                        });
                        setIncomingCall(null);
                      }}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isVideoCallActive && (
              <div
                ref={jitsiContainerRef}
                className="mb-4 border rounded-lg overflow-hidden h-96"
              />
            )}
      

            <ScrollToBottom
              className={`flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 ${
                isVideoCallActive ? "max-h-40" : "h-60"
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

                  return (
                    <div key={msg._id || index}>
                      {showDateSeparator && currentDate && (
                        <div className="flex justify-center my-2">
                          <span className="text-xs text-gray-600 bg-gray-200 px-2 py-1 rounded">
                            {getDateLabel(startOfDay(currentDate))}
                          </span>
                        </div>
                      )}
                      <div
                        className={`flex ${
                          (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                          (typeof msg.sender === "string" && msg.sender === user?._id)
                            ? "justify-end"
                            : "justify-start"
                        } my-2`}
                      >
                        <div
                          className={`flex flex-col ${
                            (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                            (typeof msg.sender === "string" && msg.sender === user?._id)
                              ? "items-end"
                              : "items-start"
                          }`}
                        >
                          <span
                            className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words ${
                              (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                              (typeof msg.sender === "string" && msg.sender === user?._id)
                                ? "bg-blue-500 text-white rounded-br-none"
                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                            }`}
                          >
                            {/* {msg.content} */}
                            {msg.contentType === "image" ? (
    <img
      src={msg.content}
      alt="uploaded"
      className="max-w-[200px] max-h-[200px] rounded-lg object-cover"
    />
  ) : msg.contentType === "video" ? (
    <video controls className="max-w-[200px] rounded-lg">
      <source src={msg.content} />
      Your browser does not support the video tag.
    </video>
  ) : msg.contentType === "audio" ? (
    <audio controls>
      <source src={msg.content} />
      Your browser does not support the audio tag.
    </audio>
  ) : (
    <a href={msg.content} target="_blank" rel="noopener noreferrer" >
      {msg.content}
    </a>
  )}
                          </span>
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
                <p className="text-center text-gray-500 my-8">
                  No messages yet. Start the conversation!
                </p>
              )}
                           <div className="chat-box">
        {typingUser === selectedInstructor && (
          <div className="typing-indicator">Typing...</div>
        )}
      </div>
            </ScrollToBottom>
            
            {/* <div className="flex">
            <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="bg-gray-200 p-2 rounded-l-lg border-r"
        >
          😊
        </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={handleKeyPress}
                className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg transition-colors"
              >
                Send
              </button>
            </div> */}



            <div className="flex">
            <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="bg-gray-200 p-2 rounded-l-lg border-r"
        >
          😊
        </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value)
                  handleTyping()
                }}
                onKeyPress={handleKeyPress}
                className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Type a message..."
              />
              <input
    type="file"
    id="file-upload"
    className="hidden"
    accept="image/*,video/*,audio/*,.pdf" // Define acceptable file types
    onChange={handleFileUpload}
  />
  <label
    htmlFor="file-upload"
    className="bg-gray-200 p-3 cursor-pointer hover:bg-gray-300 transition-colors"
  >
    📎 {/* Attachment icon */}
  </label>
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg transition-colors"
              >
                Send
              </button>
            </div>
             {/* Emoji Picker Dropdown */}
      {showEmojiPicker && (
        <div className="absolute bottom-12 left-0">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">
              Select a contact to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );


};

export default ChatPage;



