// import { useEffect, useState } from "react";
// import { IMessage } from "../../types/chat";
// import { Role, SignupFormData } from "../../types/IForm";
// import { IEnrollment } from "../../types/IEnrollment";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { CLIENT_API } from "../../utilities/axios/Axios";
// import { useSocket } from "../../context/Sockets";

// // Declare JitsiMeetExternalAPI to satisfy TypeScript
// declare const JitsiMeetExternalAPI: any;
// const ChatPage = () => {
//     const [instructors, setInstructors] = useState<SignupFormData[]>([]);
//     const [messages, setMessages] = useState<IMessage[]>([]);
//     const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//     const user = useSelector((state: RootState) => state.auth.data);
//     const socket = useSocket();
  
//     // Load Jitsi Meet External API script dynamically
//     useEffect(() => {
//         const script = document.createElement("script");
//         script.src = "https://meet.jit.si/external_api.js";
//         script.async = true;
//         document.body.appendChild(script);
//         return () => {
//             document.body.removeChild(script);
//         };
//     }, []);

//     useEffect(() => {
//         if (socket) {
//             socket.on("receiveMessage", (newMessage) => {
//                 console.log("New message received:", newMessage);
//                 setMessages((prevMessages) => [...prevMessages, newMessage]);
//                 console.log('messages are',messages)
//             });
    
//             return () => {
//                 console.log('socket disconnected')
//                 socket.off("receiveMessage");
//             };
//         }
//     }, [socket]);
    
//     useEffect(() => {
//         if (user) {
//             fetchContacts();
//         }
//     }, [user]);

//     const fetchContacts = async () => {
//         try {
//             setLoading(true);
//             if (user?.role === Role.Student){
//             const response = await CLIENT_API.get(`/student/enrolled/${user?._id}`);
//             const enrolledCourses = response.data.data;
            
//             const uniqueInstructors = Array.from(
//                 new Set(
//                     enrolledCourses
//                         .filter((course: IEnrollment) => course.courseDetails?.instructor?._id !== undefined)
//                         .map((course: IEnrollment) => course.courseDetails?.instructor?._id)
//                 )
//             )
//                 .map((id) => {
//                     const course = enrolledCourses.find(
//                         (course: IEnrollment) => course.courseDetails?.instructor?._id === id
//                     );
//                     return course?.courseDetails?.instructor;
//                 })
//                 .filter((instructor): instructor is NonNullable<typeof instructor> => instructor !== undefined);
            
//             console.log('unique instructors', uniqueInstructors);
//             setInstructors(uniqueInstructors);
//             }else if(user?.role === Role.Instructor){
//                 const response = await CLIENT_API.get(`/chats/instructor/meesagedStudent/${user?._id}`)
//                 console.log('response of instructor messages',response.data.data)
//                 setInstructors(response.data.data)
//             }
//         } catch (error) {
//             console.error("Error fetching instructors", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMessages = async (contactId: string) => {
//         try {
//             setLoading(true);
//             setSelectedInstructor(contactId);
            
//             if(socket){
//                 socket.emit('join_room',contactId)
//             }else{
//                 console.log('socket connection not available')
//             }
            
//             const senderId = user?._id;
//             const receiverId = contactId

//             // First, access or create the chat
//             await CLIENT_API.post('/chats/access', {
//                 userId: senderId,
//                 receiverId
//             });
            
//             // Then fetch messages
//             const response = await CLIENT_API.get(`/chats/${senderId}/${receiverId}`);
//             console.log('get all messages',response.data.data)
//             setMessages(response.data.data || []);
            
//             // Mark messages as seen
//             const chat = await getChatId(senderId|| '', receiverId);
//             if (chat) {
//                 await CLIENT_API.put('/chats/seen', {
//                     chatId: chat,
//                     userId: senderId
//                 });
//             }
//         } catch (error) {
//             console.error("Error fetching messages", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getChatId = async (userId: string, receiverId: string) => {
//         try {
//             const response = await CLIENT_API.post('/chats/access', {
//                 userId,
//                 receiverId
//             });
//             return response.data.data._id;
//         } catch (error) {
//             console.error("Error getting chat ID", error);
//             return null;
//         }
//     };

//     const sendMessage = async () => {
//         if (!newMessage.trim() || !selectedInstructor || !user?._id) return;

//         try {
//             const messageData = {
//                 sender: user._id,
//                 reciever: selectedInstructor,
//                 content: newMessage,
//                 contentType: "text"
//             };
//             if(socket){
//                 socket.emit('sendMessage',messageData)
//             }

//             const response = await CLIENT_API.post("/chats", messageData);
            
//             if (response.data.success) {
//                 setMessages([...messages, response.data.data]);
//                 setNewMessage("");
//             }
//         } catch (error) {
//             console.error("Error sending message", error);
//         }
//     };

//     // Handle Enter key press for sending messages
//     const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter') {
//             sendMessage();
//         }
//     };

//     // Jitsi Video Call Setup
//     const startVideoCall = () => {
//         if (!selectedInstructor || !user?._id) return;

//         setIsVideoCallActive(true);
//         const domain = "meet.jit.si";
//         const roomName = `Chat_${user._id}_${selectedInstructor}`; // Unique room name based on user IDs

//         const options = {
//             roomName: roomName,
//             width: "100%",
//             height: "400px", // Adjust height as needed
//             parentNode: document.querySelector("#jitsi-container"),
//             userInfo: {
//                 displayName: user.userName,
//             },
//             configOverwrite: {
//                 startWithAudioMuted: false,
//                 startWithVideoMuted: false,
//             },
//             interfaceConfigOverwrite: {
//                 TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"], // Customize toolbar
//             },
//         };

       
//         const api = new JitsiMeetExternalAPI(domain, options);

//         // Cleanup when the call ends
//         api.addEventListener("videoConferenceLeft", () => {
//             setIsVideoCallActive(false);
//             api.dispose();
//         });
//     };
//     return (
//         <div className="flex h-screen">
//             <div className="w-1/4 bg-gray-100 p-4">
//                 <h2 className="text-lg font-semibold mb-4">
//                     {user?.role ===Role.Student? 'Instructors':'Students'}
//                 </h2>
//                 {loading && !selectedInstructor ? (
//                     <p className="text-gray-500">Loading Contacts...</p>
//                 ) : (
//                     <ul className="space-y-2">
//                         {instructors.map((contact) => (
//                             <li 
//                                 key={contact._id} 
//                                 className={`p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${
//                                     selectedInstructor === contact._id ? "bg-blue-200" : "bg-white"
//                                 }`}
//                                 onClick={() => fetchMessages(contact?._id || '')}
//                             >
//                                 {contact.userName}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//                 {instructors.length === 0 && !loading && (
//                     <p className="text-gray-500">No contacts found</p>
//                 )}
//             </div>
            
//             <div className="w-3/4 p-4 flex flex-col">
//                 {selectedInstructor ? (
//                     <>
//                         <div className="bg-white rounded-lg shadow p-2 mb-4">
//                             <h3 className="font-medium">
//                                 {instructors.find(i => i._id === selectedInstructor)?.userName || 'Chat'}
//                             </h3>
//                             <button
//                                 onClick={startVideoCall}
//                                 className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
//                                 disabled={isVideoCallActive}
//                             >
//                                 {isVideoCallActive ? "Call Active" : "Start Video Call"}
//                             </button>
//                         </div>
//                         {/* Jitsi Video Call Container */}
//                         {isVideoCallActive && (
//                             <div id="jitsi-container" className="mb-4 border rounded-lg overflow-hidden"></div>
//                         )}
                        
//                         <div className="flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
//                             {loading ? (
//                                 <div className="flex justify-center items-center h-full">
//                                     <p className="text-gray-500">Loading messages...</p>
//                                 </div>
//                             ) : messages.length > 0 ? (
//                                 messages.map((msg, index) => (
//                                     // <div 
//                                     //     // key={msg._id || index} 
//                                     //     key={ index} 
//                                     //     // className={`p-2 my-2 ${msg.sender === user?._id ? "text-right" : "text-left"}`}
//                                     //     className={`flex ${msg.sender === user?._id ? "justify-end" : "justify-start"} my-2`}
//                                     // >
//                                     //     <span 
//                                     //         className={`inline-block px-4 py-2 rounded-lg ${
//                                     //             msg.sender === user?._id 
//                                     //                 ? "bg-blue-500 text-white rounded-br-none" 
//                                     //                 : "bg-gray-200 text-gray-800 rounded-bl-none"
//                                     //         }`}
//                                     //     >
//                                     //         {msg.content}
//                                     //     </span>
//                                     // </div>
//                                     // When rendering messages
// <div 
//     key={index} 
//     className={`flex ${
//         // Check if msg.sender is an object or string and compare correctly
//         (typeof msg.sender === 'object' && msg.sender?._id === user?._id) || 
//         (typeof msg.sender === 'string' && msg.sender === user?._id) 
//             ? "justify-end" : "justify-start"
//     } my-2`}
// >
//     <span 
//         className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words ${
//             (typeof msg.sender === 'object' && msg.sender?._id === user?._id) || 
//             (typeof msg.sender === 'string' && msg.sender === user?._id)
//                 ? "bg-blue-500 text-white rounded-br-none" 
//                 : "bg-gray-200 text-gray-800 rounded-bl-none"
//         }`}
//     >
//         {msg.content}
//     </span>
// </div>
//                                 ))
//                             ) : (
//                                 <p className="text-center text-gray-500 my-8">
//                                     No messages yet. Start the conversation!
//                                 </p>
//                             )}
//                         </div>
                        
//                         <div className="flex">
//                             <input
//                                 type="text"
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//                                 placeholder="Type a message..."
//                             />
//                             <button 
//                                 onClick={sendMessage} 
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg transition-colors"
//                             >
//                                 Send
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="flex items-center justify-center h-full">
//                         <p className="text-gray-500 text-lg">Select an instructor to start chatting</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ChatPage;

// import { useEffect, useState, useRef } from "react";
// import { IMessage } from "../../types/chat";
// import { Role, SignupFormData } from "../../types/IForm";
// import { IEnrollment } from "../../types/IEnrollment";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { CLIENT_API } from "../../utilities/axios/Axios";
// import { useSocket } from "../../context/Sockets";

// interface JitsiMeetExternalAPI {
//     addEventListener(event: string, listener: () => void): void;
//     dispose(): void;
// }

// interface JitsiOptions {
//     roomName: string;
//     width: string;
//     height: string;
//     parentNode: HTMLElement;
//     userInfo: {
//         displayName: string;
//     };
//     configOverwrite: {
//         startWithAudioMuted: boolean;
//         startWithVideoMuted: boolean;
//     };
//     interfaceConfigOverwrite: {
//         TOOLBAR_BUTTONS: string[];
//     };
// }

// declare global {
//     interface Window {
//         JitsiMeetExternalAPI: new (domain: string, options: JitsiOptions) => JitsiMeetExternalAPI;
//     }
// }

// const ChatPage = () => {
//     const [instructors, setInstructors] = useState<SignupFormData[]>([]);
//     const [messages, setMessages] = useState<IMessage[]>([]);
//     const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
//     const [newMessage, setNewMessage] = useState("");
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isVideoCallActive, setIsVideoCallActive] = useState(false);
//     const [jitsiLoaded, setJitsiLoaded] = useState(false);
//     const [roomName, setRoomName] = useState('')
//     const user = useSelector((state: RootState) => state.auth.data);
//     const socket = useSocket();
//     const jitsiContainerRef = useRef<HTMLDivElement>(null);
//     const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);


//     // Load Jitsi script
//     useEffect(() => {
//         if (!document.querySelector('script[src="https://meet.jit.si/external_api.js"]')) {
//             const script = document.createElement('script');
//             script.src = 'https://meet.jit.si/external_api.js';
//             script.async = true;
//             script.onload = () => {
//                 console.log("Jitsi script loaded successfully");
//                 setJitsiLoaded(true);
//             };
//             script.onerror = () => {
//                 console.error('Failed to load Jitsi script');
//             };
//             document.body.appendChild(script);
//         } else {
//             console.log("Jitsi script already loaded");
//             setJitsiLoaded(true);
//         }
//     }, []);

//     useEffect(() => {
//         if (socket) {
//             socket.on("receiveMessage", (newMessage) => {
//                 console.log("New message received:", newMessage);
//                 setMessages((prevMessages) => [...prevMessages, newMessage]);
//             });
//             return () => {
//                 console.log("socket disconnected");
//                 socket.off("receiveMessage");
//             };
//         }
//     }, [socket]);

//     useEffect(() => {
//         if (user) {
//             fetchContacts();
//         }
//     }, [user]);
//     useEffect(() => {
//     if (socket && user?._id) {
//         socket.emit("join_room", user._id);
//     }
// }, [socket, user]);


//     const fetchContacts = async () => {
//         try {
//             setLoading(true);
//             if (user?.role === Role.Student) {
//                 const response = await CLIENT_API.get(`/student/enrolled/${user?._id}`);
//                 const enrolledCourses = response.data.data;
//                 const uniqueInstructors = Array.from(
//                     new Set(
//                         enrolledCourses
//                             .filter((course: IEnrollment) => course.courseDetails?.instructor?._id !== undefined)
//                             .map((course: IEnrollment) => course.courseDetails?.instructor?._id)
//                     )
//                 )
//                     .map((id) => {
//                         const course = enrolledCourses.find(
//                             (course: IEnrollment) => course.courseDetails?.instructor?._id === id
//                         );
//                         return course?.courseDetails?.instructor;
//                     })
//                     .filter((instructor): instructor is NonNullable<typeof instructor> => instructor !== undefined);
//                 setInstructors(uniqueInstructors);
//             } else if (user?.role === Role.Instructor) {
//                 const response = await CLIENT_API.get(`/chats/instructor/meesagedStudent/${user?._id}`);
//                 setInstructors(response.data.data);
//             }
//         } catch (error) {
//             console.error("Error fetching instructors", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchMessages = async (contactId: string) => {
//         try {
//             setLoading(true);
//             setSelectedInstructor(contactId);
//             if (socket) {
//                 socket.emit("join_room", contactId);
//             }
//             const senderId = user?._id;
//             const receiverId = contactId;
//             await CLIENT_API.post("/chats/access", { userId: senderId, receiverId });
//             const response = await CLIENT_API.get(`/chats/${senderId}/${receiverId}`);
//             setMessages(response.data.data || []);
//             const chat = await getChatId(senderId || "", receiverId);
//             if (chat) {
//                 await CLIENT_API.put("/chats/seen", { chatId: chat, userId: senderId });
//             }
//         } catch (error) {
//             console.error("Error fetching messages", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getChatId = async (userId: string, receiverId: string) => {
//         try {
//             const response = await CLIENT_API.post("/chats/access", { userId, receiverId });
//             return response.data.data._id;
//         } catch (error) {
//             console.error("Error getting chat ID", error);
//             return null;
//         }
//     };

//     const sendMessage = async () => {
//         if (!newMessage.trim() || !selectedInstructor || !user?._id) return;
//         try {
//             const messageData = {
//                 sender: user._id,
//                 reciever: selectedInstructor,
//                 content: newMessage,
//                 contentType: "text",
//             };
//             if (socket) {
//                 socket.emit("sendMessage", messageData);
//             }
//             const response = await CLIENT_API.post("/chats", messageData);
//             if (response.data.success) {
//                 setMessages([...messages, response.data.data]);
//                 setNewMessage("");
//             }
//         } catch (error) {
//             console.error("Error sending message", error);
//         }
//     };

//     const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter") {
//             sendMessage();
//         }
//     };

//     // const startVideoCall = () => {
//     //     if (isVideoCallActive) {
//     //         if (jitsiApiRef.current) {
//     //             jitsiApiRef.current.dispose();
//     //             jitsiApiRef.current = null;
//     //         }
//     //         setIsVideoCallActive(false);
//     //         return;
//     //     }
//     //     console.log('Starting video call');
//     //     if (!selectedInstructor || !user || !user._id) {
//     //         console.log('Cannot start call - missing user or instructor data');
//     //         return;
//     //     }
        
//     //     // Make sure Jitsi is loaded before allowing call
//     //     if (!jitsiLoaded) {
//     //         console.log('Jitsi not loaded yet, please try again in a moment');
//     //         return;
//     //     }
        
//     //     setIsVideoCallActive(true);
//     // };

//     // // Initialize Jitsi when call becomes active
//     // useEffect(() => {
//     //     if (!isVideoCallActive || !jitsiContainerRef.current || !selectedInstructor || !user || !jitsiLoaded) {
//     //         return;
//     //     }

//     //     try {
//     //         console.log('Initializing Jitsi call');
//     //         const domain = "meet.jit.si";
//     //         // Sanitize room name to avoid invalid characters
//     //         const roomName = `Chat_${user._id}_${selectedInstructor}`.replace(/[^a-zA-Z0-9]/g, '_');
            
//     //         console.log('Room name:', roomName);

//     //         const options: JitsiOptions = {
//     //             roomName: roomName,
//     //             width: "100%",
//     //             height: "400px",
//     //             parentNode: jitsiContainerRef.current,
//     //             userInfo: {
//     //                 displayName: user.userName || "",
//     //             },
//     //             configOverwrite: {
//     //                 startWithAudioMuted: false,
//     //                 startWithVideoMuted: false,
//     //             },
//     //             interfaceConfigOverwrite: {
//     //                 TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
//     //             },
//     //         };

//     //         // Use window.JitsiMeetExternalAPI since it's loaded as a global
//     //         const api = new window.JitsiMeetExternalAPI(domain, options);
//     //         jitsiApiRef.current = api;
//     //         console.log('Jitsi API initialized');

//     //         api.addEventListener("videoConferenceLeft", () => {
//     //             console.log('Video conference left');
//     //             setIsVideoCallActive(false);
//     //             if (jitsiApiRef.current) {
//     //                 jitsiApiRef.current.dispose();
//     //                 jitsiApiRef.current = null;
//     //             }
//     //         });
            
//     //         // Add this to handle page navigation/closing
//     //         window.addEventListener('beforeunload', () => {
//     //             if (jitsiApiRef.current) {
//     //                 jitsiApiRef.current.dispose();
//     //             }
//     //         });
//     //     } catch (error) {
//     //         console.error("Error initializing Jitsi:", error);
//     //         setIsVideoCallActive(false);
//     //     }

//     //     return () => {
//     //         if (jitsiApiRef.current) {
//     //             console.log('Cleaning up Jitsi');
//     //             jitsiApiRef.current.dispose();
//     //             jitsiApiRef.current = null;
//     //         }
//     //     };
//     // }, [isVideoCallActive, selectedInstructor, user, jitsiLoaded]);
    
    
//     const startVideoCall = () => {
//         if (isVideoCallActive) {
//             if (jitsiApiRef.current) {
//                 jitsiApiRef.current.dispose();
//                 jitsiApiRef.current = null;
//             }
//             setIsVideoCallActive(false);
//             return;
//         }
//         console.log('Starting video call');
//         if (!selectedInstructor || !user || !user._id) {
//             console.log('Cannot start call - missing user or instructor data');
//             return;
//         }
        
//         // Make sure Jitsi is loaded before allowing call
//         if (!jitsiLoaded) {
//             console.log('Jitsi not loaded yet, please try again in a moment');
//             return;
//         }

//         const roomName = `Chat_${user._id}_${selectedInstructor}`.replace(/[^a-zA-Z0-9]/g, '_');

//         socket?.emit('callUser',{
//             callerId: user._id,
//             receiverId: selectedInstructor,
//             roomName: roomName,
//             callerName: user.userName
//         })

//         setIsVideoCallActive(true);
//     };

//     useEffect(() => {
//         if(socket){
//             socket.on("callUser", (data) => {
//                 console.log("Incoming call from:", data.callerName);
//                 const acceptCall = window.confirm(`${data.callerName} is calling. Do you want to join?`);
        
//                 if (acceptCall) {
//                     setIsVideoCallActive(true);
//                     setRoomName(data.roomName);
//                 } else {
//                     // Notify the caller that the call was declined
//                     socket.emit("callRejected", { callerId: data.callerId });
//                 }
//             });
//         }
    
//         return () => {
//             if(socket){
//                 socket.off("callUser");
//             }
//         };
//     }, [socket]);
    
//     // Initialize Jitsi when call becomes active
//     useEffect(() => {
//         if (!isVideoCallActive || !jitsiContainerRef.current || !roomName || !jitsiLoaded) {
//             return;
//         }

//         try {
//             console.log('Initializing Jitsi call');
//             const domain = "meet.jit.si";
      
//             console.log('Room name:', roomName);

//             const options: JitsiOptions = {
//                 roomName: roomName,
//                 width: "100%",
//                 height: "400px",
//                 parentNode: jitsiContainerRef.current,
//                 userInfo: {
//                     displayName: user?.userName || "",
//                 },
//                 configOverwrite: {
//                     startWithAudioMuted: false,
//                     startWithVideoMuted: false,
//                 },
//                 interfaceConfigOverwrite: {
//                     TOOLBAR_BUTTONS: ["microphone", "camera", "hangup", "chat"],
//                 },
//             };

//             // Use window.JitsiMeetExternalAPI since it's loaded as a global
//             const api = new window.JitsiMeetExternalAPI(domain, options);
//             jitsiApiRef.current = api;
//             console.log('Jitsi API initialized');

//             api.addEventListener("videoConferenceLeft", () => {
//                 console.log('Video conference left');
//                 setIsVideoCallActive(false);
//                 if (jitsiApiRef.current) {
//                     jitsiApiRef.current.dispose();
//                     jitsiApiRef.current = null;
//                 }

//                 socket?.emit("callEnded", { roomName });
//             });
            
//             // Add this to handle page navigation/closing
//             window.addEventListener('beforeunload', () => {
//                 if (jitsiApiRef.current) {
//                     jitsiApiRef.current.dispose();
//                 }
//             });
//         } catch (error) {
//             console.error("Error initializing Jitsi:", error);
//             setIsVideoCallActive(false);
//         }

//         return () => {
//             if (jitsiApiRef.current) {
//                 console.log('Cleaning up Jitsi');
//                 jitsiApiRef.current.dispose();
//                 jitsiApiRef.current = null;
//             }
//         };
//     }, [isVideoCallActive, roomName, jitsiLoaded]);

//     useEffect(() => {
//         if(socket){
//             socket.on("callEnded", (data) => {
//                 console.log("Call ended for room:", data.roomName);
//                 setIsVideoCallActive(false);
//                 if (jitsiApiRef.current) {
//                     jitsiApiRef.current.dispose();
//                     jitsiApiRef.current = null;
//                 }
//             });
        
//         }
//         return () => {
//             socket?.off("callEnded");
//         };
//     }, [socket]);
//     return (
//         <div className="flex h-screen">
//             <div className="w-1/4 bg-gray-100 p-4">
//                 <h2 className="text-lg font-semibold mb-4">
//                     {user?.role === Role.Student ? "Instructors" : "Students"}
//                 </h2>
//                 {loading && !selectedInstructor ? (
//                     <p className="text-gray-500">Loading Contacts...</p>
//                 ) : (
//                     <ul className="space-y-2">
//                         {instructors.map((contact) => (
//                             <li
//                                 key={contact._id}
//                                 className={`p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${
//                                     selectedInstructor === contact._id ? "bg-blue-200" : "bg-white"
//                                 }`}
//                                 onClick={() => fetchMessages(contact?._id || "")}
//                             >
//                                 {contact.userName}
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//                 {instructors.length === 0 && !loading && (
//                     <p className="text-gray-500">No contacts found</p>
//                 )}
//             </div>

//             <div className="w-3/4 p-4 flex flex-col">
//                 {selectedInstructor ? (
//                     <>
//                         <div className="bg-white rounded-lg shadow p-2 mb-4 flex justify-between items-center">
//                             <h3 className="font-medium">
//                                 {instructors.find((i) => i._id === selectedInstructor)?.userName || "Chat"}
//                             </h3>
//                             <button
//                                 onClick={startVideoCall}
//                                 className={`${isVideoCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-lg transition-colors`}
//                                 disabled={!jitsiLoaded}
//                             >
//                                 {!jitsiLoaded ? "Loading Jitsi..." : isVideoCallActive ? "End Call" : "Start Video Call"}
//                             </button>
//                         </div>

//                         {isVideoCallActive && (
//                             <div
//                                 ref={jitsiContainerRef}
//                                 className="mb-4 border rounded-lg overflow-hidden h-96"
//                             />
//                         )}

//                         <div className={`flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 ${isVideoCallActive ? 'max-h-40' : 'h-auto'}`}>
//                             {loading ? (
//                                 <div className="flex justify-center items-center h-full">
//                                     <p className="text-gray-500">Loading messages...</p>
//                                 </div>
//                             ) : messages.length > 0 ? (
//                                 messages.map((msg, index) => (
//                                     <div
//                                         key={index}
//                                         className={`flex ${
//                                             (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
//                                             (typeof msg.sender === "string" && msg.sender === user?._id)
//                                                 ? "justify-end"
//                                                 : "justify-start"
//                                         } my-2`}
//                                     >
//                                         <span
//                                             className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words ${
//                                                 (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
//                                                 (typeof msg.sender === "string" && msg.sender === user?._id)
//                                                     ? "bg-blue-500 text-white rounded-br-none"
//                                                     : "bg-gray-200 text-gray-800 rounded-bl-none"
//                                             }`}
//                                         >
//                                             {msg.content}
//                                         </span>
//                                     </div>
//                                 ))
//                             ) : (
//                                 <p className="text-center text-gray-500 my-8">
//                                     No messages yet. Start the conversation!
//                                 </p>
//                             )}
//                         </div>

//                         <div className="flex">
//                             <input
//                                 type="text"
//                                 value={newMessage}
//                                 onChange={(e) => setNewMessage(e.target.value)}
//                                 onKeyPress={handleKeyPress}
//                                 className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
//                                 placeholder="Type a message..."
//                             />
//                             <button
//                                 onClick={sendMessage}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-r-lg transition-colors"
//                             >
//                                 Send
//                             </button>
//                         </div>
//                     </>
//                 ) : (
//                     <div className="flex items-center justify-center h-full">
//                         <p className="text-gray-500 text-lg">Select a contact to start chatting</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ChatPage;


import { useEffect, useState, useRef } from "react";
import { IMessage } from "../../types/chat";
import { Role, SignupFormData } from "../../types/IForm";
import { IEnrollment } from "../../types/IEnrollment";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CLIENT_API } from "../../utilities/axios/Axios";
import { useSocket } from "../../context/Sockets";

interface JitsiMeetExternalAPI {
    addEventListener(event: string, listener: () => void): void;
    dispose(): void;
}

interface JitsiOptions {
    roomName: string;
    width: string;
    height: string;
    parentNode: HTMLElement;
    userInfo: {
        displayName: string;
    };
    configOverwrite: {
        startWithAudioMuted: boolean;
        startWithVideoMuted: boolean;
    };
    interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: string[];
    };
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: new (domain: string, options: JitsiOptions) => JitsiMeetExternalAPI;
    }
}

type IncomingCall = {
    roomName: string;
    callerName: string;
    callerId: string;
} | null;

interface Notification {
    sender?: string,
    message?: string;
    type?: string;
}
const ChatPage = () => {
    const [instructors, setInstructors] = useState<SignupFormData[]>([]);
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedInstructor, setSelectedInstructor] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false);
    const [jitsiLoaded, setJitsiLoaded] = useState(false);
    const [roomName, setRoomName] = useState('');
    const user = useSelector((state: RootState) => state.auth.data);
    const socket = useSocket();
    const jitsiContainerRef = useRef<HTMLDivElement>(null);
    const jitsiApiRef = useRef<JitsiMeetExternalAPI | null>(null);
    const [incomingCall, setIncomingCall] = useState<IncomingCall>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Load Jitsi script
    useEffect(() => {
        if (!document.querySelector('script[src="https://meet.jit.si/external_api.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://meet.jit.si/external_api.js';
            script.async = true;
            script.onload = () => {
                console.log("Jitsi script loaded successfully");
                setJitsiLoaded(true);
            };
            script.onerror = () => {
                console.error('Failed to load Jitsi script');
            };
            document.body.appendChild(script);
        } else {
            console.log("Jitsi script already loaded");
            setJitsiLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (socket) {
             // Listen for incoming messages
            socket.on("receiveMessage", (newMessage) => {
                console.log("New message received:", newMessage);
                setMessages((prevMessages) => [...prevMessages, newMessage]);
            });

             // Listen for notifications
             socket.on("receiveNotification", (notification: Notification) => {
                console.log("New notification received:", notification);
                // setNotifications((prev) => [...prev, notification]); // ✅ Now correctly typed

                setNotifications((prev) => {
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
    }, [socket]);

    useEffect(() => {
        if (user) {
            fetchContacts();
        }
    }, [user]);

    useEffect(() => {
        if (socket && user?._id) {
            socket.emit("join_room", user._id);
        }
    }, [socket, user]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            if (user?.role === Role.Student) {
                const response = await CLIENT_API.get(`/student/enrolled/${user?._id}`);
                const enrolledCourses = response.data.data;
                const uniqueInstructors = Array.from(
                    new Set(
                        enrolledCourses
                            .filter((course: IEnrollment) => course.courseDetails?.instructor?._id !== undefined)
                            .map((course: IEnrollment) => course.courseDetails?.instructor?._id)
                    )
                )
                    .map((id) => {
                        const course = enrolledCourses.find(
                            (course: IEnrollment) => course.courseDetails?.instructor?._id === id
                        );
                        return course?.courseDetails?.instructor;
                    })
                    .filter((instructor): instructor is NonNullable<typeof instructor> => instructor !== undefined);
                setInstructors(uniqueInstructors);
            } else if (user?.role === Role.Instructor) {
                const response = await CLIENT_API.get(`/chats/instructor/meesagedStudent/${user?._id}`);
                setInstructors(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching instructors", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (contactId: string) => {
        try {
            setLoading(true);
            setSelectedInstructor(contactId);
            if (socket) {
                socket.emit("join_room", contactId);
            }
            const senderId = user?._id;
            const receiverId = contactId;
            await CLIENT_API.post("/chats/access", { userId: senderId, receiverId });
            const response = await CLIENT_API.get(`/chats/${senderId}/${receiverId}`);
            setMessages(response.data.data || []);
            setNotifications((prev) => prev.filter((notif) => notif.sender !== contactId));
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
            const response = await CLIENT_API.post("/chats/access", { userId, receiverId });
            return response.data.data._id;
        } catch (error) {
            console.error("Error getting chat ID", error);
            return null;
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedInstructor || !user?._id) return;
        try {
            const messageData = {
                sender: user._id,
                reciever: selectedInstructor,
                content: newMessage,
                contentType: "text",
            };
            if (socket) {
                socket.emit("sendMessage", messageData);
            }
            const response = await CLIENT_API.post("/chats", messageData);
            if (response.data.success) {
                setMessages([...messages, response.data.data]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

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

        console.log('Starting video call');
        if (!selectedInstructor || !user || !user._id) {
            console.log('Cannot start call - missing user or instructor data');
            return;
        }
        
        // Make sure Jitsi is loaded before allowing call
        if (!jitsiLoaded) {
            console.log('Jitsi not loaded yet, please try again in a moment');
            return;
        }

        // Create a unique room name
        const newRoomName = `Chat_${user._id}_${selectedInstructor}`.replace(/[^a-zA-Z0-9]/g, '_');
        setRoomName(newRoomName);

        // Notify the other user about the call
        socket?.emit('callUser', {
            callerId: user._id,
            receiverId: selectedInstructor,
            roomName: newRoomName,
            callerName: user.userName
        });

        setIsVideoCallActive(true);
    };

    // Handle incoming calls
    // useEffect(() => {
    //     if (socket) {
    //         socket.on("incomingCall", (data) => {
    //             console.log(`https://meet.jit.si/${data.roomName}`)
    //             console.log("Incoming call from:", data.callerName);
    //             const acceptCall = window.confirm(`${data.callerName} is calling. Do you want to join?`);
        
    //             if (acceptCall) {
    //                 setRoomName(data.roomName);
    //                 setIsVideoCallActive(true);
    //                 console.log('dataroomname',data.roomName)
    //                 window.location.href = `https://meet.jit.si/${data.roomName}`;
    //             } else {
    //                 // Notify the caller that the call was declined
    //                 socket.emit("callRejected", { callerId: data.callerId });
    //             }
    //         });

    //         socket.on("callRejected", () => {
    //             alert("Call was rejected");
    //             setIsVideoCallActive(false);
    //         });
    //     }
    
    //     return () => {
    //         if (socket) {
    //             socket.off("incomingCall");
    //             socket.off("callRejected");
    //         }
    //     };
    // }, [socket]);

    
    useEffect(() => {
        if (socket) {
            socket.on("incomingCall", (data) => {
                console.log(`Incoming call from: ${data.callerName}`);
                
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
        // Only initialize if all required conditions are met
        if (!isVideoCallActive || !jitsiContainerRef.current || !roomName || !jitsiLoaded || !user) {
            return;
        }

        try {
            console.log('Initializing Jitsi call for room:', roomName);
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
            console.log('Jitsi API initialized');

            api.addEventListener("videoConferenceLeft", () => {
                console.log('Video conference left');
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
            
            window.addEventListener('beforeunload', handleBeforeUnload);
            
            return () => {
                window.removeEventListener('beforeunload', handleBeforeUnload);
                if (jitsiApiRef.current) {
                    console.log('Cleaning up Jitsi');
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

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-100 p-4">
                <h2 className="text-lg font-semibold mb-4">
                    {user?.role === Role.Student ? "Instructors" : "Students"}
                </h2>
                {loading && !selectedInstructor ? (
                    <p className="text-gray-500">Loading Contacts...</p>
                ) : (
                    <ul className="space-y-2">
                        {/* {instructors.map((contact) => (
                            
                            <li
                                key={contact._id}
                                className={`p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors ${
                                    selectedInstructor === contact._id ? "bg-blue-200" : "bg-white"
                                }`}
                                onClick={() => fetchMessages(contact?._id || "")}
                            >
                                {contact.userName}
                            </li>
                        ))} */}
                        {instructors.map((contact) => {
        const hasNotification = notifications.some((notif) => notif.sender === contact._id);
        
        return (
            <li
                key={contact._id}
                className={`p-3 rounded-lg cursor-pointer flex justify-between items-center hover:bg-blue-100 transition-colors ${
                    selectedInstructor === contact._id ? "bg-blue-200" : "bg-white"
                }`}
                onClick={() => fetchMessages(contact?._id || "")}
            >
                <span>{contact.userName}</span>
                {hasNotification && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">New</span>}
            </li>
        );
    })}
                    </ul>
                )}
                {instructors.length === 0 && !loading && (
                    <p className="text-gray-500">No contacts found</p>
                )}
            </div>

            <div className="w-3/4 p-4 flex flex-col">
                {selectedInstructor ? (
                    <>
                        <div className="bg-white rounded-lg shadow p-2 mb-4 flex justify-between items-center">
                            <h3 className="font-medium">
                                {instructors.find((i) => i._id === selectedInstructor)?.userName || "Chat"}
                            </h3>
                            <button
                                onClick={startVideoCall}
                                className={`${isVideoCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white px-4 py-2 rounded-lg transition-colors`}
                                disabled={!jitsiLoaded}
                            >
                                {!jitsiLoaded ? "Loading Jitsi..." : isVideoCallActive ? "End Call" : "Start Video Call"}
                            </button>
    {incomingCall && (
    // <div className="call-notification">
    //     <p>{incomingCall.callerName} is calling...</p>
    //     <button 
    //         onClick={() => {
    //             setIsVideoCallActive(true);
    //             setRoomName(incomingCall.roomName);
    //             window.location.href = `https://meet.jit.si/${incomingCall.roomName}`;
    //             setIncomingCall(null); // Clear the notification after joining
    //         }}
    //     >
    //         Join Call
    //     </button>
    //     <button 
    //         onClick={() => {
    //             socket?.emit("callRejected", { callerId: incomingCall.callerId });
    //             setIncomingCall(null); // Clear the notification
    //         }}
    //     >
    //         Reject Call
    //     </button>
    // </div>
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
                socket?.emit("callRejected", { callerId: incomingCall.callerId });
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

                        <div className={`flex-1 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 ${isVideoCallActive ? 'max-h-40' : 'h-auto'}`}>
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-gray-500">Loading messages...</p>
                                </div>
                            ) : messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                                            (typeof msg.sender === "string" && msg.sender === user?._id)
                                                ? "justify-end"
                                                : "justify-start"
                                        } my-2`}
                                    >
                                        <span
                                            className={`inline-block px-4 py-2 rounded-lg max-w-xs break-words ${
                                                (typeof msg.sender === "object" && msg.sender?._id === user?._id) ||
                                                (typeof msg.sender === "string" && msg.sender === user?._id)
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                                            }`}
                                        >
                                            {msg.content}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 my-8">
                                    No messages yet. Start the conversation!
                                </p>
                            )}
                        </div>

                        <div className="flex">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
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
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;