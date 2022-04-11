export interface EmailerInterface {
	sendToEmail: (consumer: string, type: string, body: string) => void;
}
