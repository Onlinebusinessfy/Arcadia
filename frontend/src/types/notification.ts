export default interface NotificationType {
    id: number,
    type: string,
    text: string,
    time: string,
    read: boolean,
    target_game?: string,
}
