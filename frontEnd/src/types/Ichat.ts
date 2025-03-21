export interface IChat {
    _id?: string;
    isGroupChat?: boolean;
    users?: string[];
    latestMessage?: string;
    groupName?: string;
    groupAdmin?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IMessage {
    _id?: string;
    sender?: string| { _id: string; userName?: string};
    reciever?: string | { _id: string; userName?: string };
    content?: string;
    chatId?: string;
    contentType?: 'text' | 'image' | 'audio' | 'video' | 'file';
    recieverSeen?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

}

export interface Notification {
    _id: string;
    sender?: string;
    message?: string;
    type?: string;
    recipient?: string;
    chat?: string;
    isSeen?: boolean;
    createdAt?: string;
  }


 export type IncomingCall = {
    roomName: string;
    callerName: string;
    callerId: string;
  } | null;
  

 export interface JitsiOptions {
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

  
export interface JitsiMeetExternalAPI {
    addEventListener(event: string, listener: () => void): void;
    dispose(): void;
  }
  