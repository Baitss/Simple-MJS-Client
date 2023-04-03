interface LoginRequestData {
    deviceId: string,
    token: string,
    uid: string
}

interface LoginResponseData {
    accessToken: string,
    channelId: string,
    current_timestamp_ms: number,
    result: number,
    token: string,
    twitter_id?: string,
    twitter_username?: string,
    google_id?: string,
    google_username?: string,
    facebook_id?: string,
    facebook_username?: string,
    uid: string,
    yostar_uid?: string,
    yostar_username?: string
}

export {
    LoginRequestData,
    LoginResponseData
};
