import { IMessage, Notification } from "../../types/Ichat";
import { Role, SignupFormData } from "../../types/IForm";
import pic from '../../assets/commonPages/logo.png'

interface ContactListProps {
    instructors: SignupFormData[];
    loading: boolean;
    selectedInstructor: string | null;
    fetchMessages: (contactId: string) => void;
    notifications: Notification[];
    userRole?: Role;
    latestMessages?: { [key: string]: IMessage };
  }

const ContactList = ({
    instructors,
    loading,
    selectedInstructor,
    fetchMessages,
    notifications,
    userRole,
    latestMessages = {}
}:ContactListProps) => {
  return (
     <div className="w-1/4 bg-gray-100 p-4 h-[75vh]">
            <h2 className="text-lg font-semibold mb-4">
              {userRole === Role.Student ? "Instructors" : "Students"}
            </h2>
            {loading && !selectedInstructor ? (
              <p className="text-gray-500">Loading Contacts...</p>
            ) : (
              <ul className="space-y-2">
                {instructors.map((contact) => {
                  console.log('contacts',contact)
                  const hasNotification = notifications.some(
                    (notif) => notif.sender === contact._id && !notif.isSeen
                  );
                  const latestMessage = latestMessages? latestMessages[contact?._id || ""] || null :null;
                  return (
                    <li
                      key={contact._id}
                      className={`p-3 rounded-lg cursor-pointer flex justify-between items-center hover:bg-blue-100 transition-colors ${
                        selectedInstructor === contact._id
                          ? "bg-blue-200"
                          : "bg-white"
                      }`}
                      onClick={() => fetchMessages(contact?._id || "")}
                    >
                      {/* <div className="flex justify-between items-center"> */}
                      <div className="flex items-center space-x-3">
                      {/* Profile Picture */}
                      <img
                        src={contact.profile?.avatar || pic} // Fallback image
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
                    {latestMessage.content?.substring(0, 30) || "No message content"}
                    {latestMessage.content && latestMessage.content.length > 30 ? "..." : ""}
                  </span>
                ) : (
                  ''
                  // <span className="text-sm text-gray-400">No messages yet</span>
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
  )
}

export default ContactList