export interface ChatLogMessageDto {
    message : string
    source : MessageSource
}

export enum MessageSource {
    USER = "USER",
    SYSTEM = "SYSTEM"
}