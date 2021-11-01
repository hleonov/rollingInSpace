export interface ChatLogMessageDto {
    message : string
    source : MessageSource
    color? : string
}

export enum MessageSource {
    USER = "USER",
    SYSTEM = "SYSTEM"
}