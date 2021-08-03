export interface Message {
    id: number;
    senderId: number;
    senderUserName: string;
    senderPhotoUrl: string;
    reciptientId: number;
    reciptientUserName: string;
    reciptientPhotoUrl: string;
    content: string;
    dateRead: Date;
    messageSent: Date;
}