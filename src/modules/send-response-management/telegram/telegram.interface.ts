export interface TelegramInterface {
	sendToChat: (message: string, chatId: string) => void;
}
