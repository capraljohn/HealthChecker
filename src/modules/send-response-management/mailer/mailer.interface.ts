export interface MailerInterface {
	sendToEmail: (consumer: string, type: string, body: string) => void;
}
