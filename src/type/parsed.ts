export interface ResError {
    code: number;
    u32Params: number[];
    strParams: string[];
    jsonParam: string;
}

export interface AccountLevel {
    id: number;
    score: number;
}

export interface PlatformSkinTicket {
    id: number;
    count: number;
}

export interface PlatformDiamond {
    id: number;
    count: number;
}

export interface AchievementCount {
    rare: number;
    count: number;
}

export interface Account {
    accountId: number;
    nickname: string;
    loginTime: number;
    logoutTime: number;
    roomId: number;
    title: number;
    signature: string;
    email: string;
    emailVerify: number;
    gold: number;
    diamond: number;
    avatarId: number;
    vip: number;
    birthday: number;
    phone: string;
    phoneVerify: number;
    platformDiamond: PlatformDiamond[];
    level: AccountLevel;
    level3: AccountLevel;
    avatarFrame: number;
    skinTicket: number;
    platformSkinTicket: PlatformSkinTicket[];
    verified: number;
    achievementCount: AchievementCount[],
    frozenState: number;
}

export interface ResLogin {
    accountId: number;
    account: Account;
    accessToken: string;
    signupTime: number;
    isIdCardAuthed: boolean;
    country: string;
}

export interface FriendBaseView {
    accountId: number;
    avatarId: number;
    title: number;
    nickname: string;
    level: AccountLevel;
    level3: AccountLevel;
    avatarFrame: number;
    verified: number;
    isBanned: number;
}

export interface GameMetaData {
    roomId: number;
    modeId: number;
    contestUid: number;
}
export interface AccountPlayingGame {
    gameUuid: string;
    category: number;
    meta: GameMetaData;
}

export interface AccountActiveState {
    accountId: number;
    loginTime: number;
    logoutTime: number;
    isOnline: boolean;
    playing: AccountPlayingGame;
}

export interface Friend {
    base: FriendBaseView;
    state: AccountActiveState;
}
export interface ResFriendList {
    friends: Friend[];
    friendMaxCount: number;
    friendCount: number;
}

export interface ViewSlot {
    slot: number;
    itemId: number;
}

export interface Character {
    charid: number;
    level: number;
    exp: number;
    views: ViewSlot[];
    skin: number;
    isUpgraded: boolean;
    extraEmoji: number[];
    rewardedLevel: number[];
}
export interface ResCharacterInfo {
    characters: Character[];
    skins: number[];
    mainCharacterId: number;
    sendGiftCount: number;
    sendGiftLimit: number;
    finishedEndings: number[];
    rewardedEndings: number[];
    characterSort: number[];
    hiddenCharacters: number[]
}

export interface CurrentMatchInfo {
    modeId: number;
    playingCount: number;
}
export interface ResCurrentMatchInfo {
    matches: CurrentMatchInfo[];
}

export interface PlayerGameView {
    accountId: number;
    avatarId: number;
    title: number;
    nickname: string;
    level: AccountLevel;
    level3: AccountLevel;
    character: Character;
    avatarFrame: number;
    verified: number;
    views: ViewSlot[];
}

export interface GameDetailRule {
    timeFixed: number;
    timeAdd :number;
    doraCount: number;
    shiduan: number;
    initPoint: number;
    fandian: number;
    canJifei: boolean;
    tianbianValue: number;
    liqibangValue: number;
    changbangValue: number;
    notingFafu1: number;
    notingFafu2: number;
    notingFafu3: number;
    haveLiujumanguan: boolean;
    haveQieshangmanguan: boolean;
    haveBiaoDora: boolean;
    haveGangBiaoDora: boolean;
    mingDoraImmediatelyOpen: boolean;
    haveLiDora: boolean;
    haveGangLiDora: boolean;
    haveSifenglinda: boolean;
    haveSigangsanle: boolean;
    haveSijializhi: boolean;
    haveJiuzhongjiupai: boolean;
    haveSanjiahele: boolean;
    haveToutiao: boolean;
    haveHeleianzhuang: boolean;
    haveHelezhongju: boolean;
    haveTingpailianzhuang: boolean;
    haveTingpaizhongju: boolean;
    haveYifa: boolean;
    haveNanruxiru: boolean;
    jingsuanyuandian: number;
    shunweima2: number;
    shunweima3: number;
    shunweima4: number;
    bianjietishi: boolean;
    aiLevel: number;
    haveZimosun: boolean;
    disableMultiYukaman: boolean;
    fanfu: number;
    guyiMode: number;
    dora3Mode: number;
    beginOpenMode: number;
    jiuchaoMode: number;
    muyuMode: number;
    openHand: number;
    xuezhandaodi: number;
    huansanzhang: number;
    chuanma: number;
    revealDiscard: number;
    fieldSpellMode: number;
    disableLeijiyiman: boolean;
}

export interface GameTestingEnvironmentSet {
    paixing: number;
    leftCount: number;
    fieldSpellVar: number;
}

export interface GameSetting {
    emojiSwitch: number;
}
export interface GameMode {
    mode: number;
    ai: boolean;
    extendinfo: string;
    detailRule: GameDetailRule;
    testingEnvironment: GameTestingEnvironmentSet;
    gameSetting: GameSetting;
}

export interface GameConfig {
    category: number;
    mode: GameMode;
    meta: GameMetaData;
}

export interface ResAuthGame {
    players: PlayerGameView[];
    seatList: number[];
    isGameStart: boolean;
    gameConfig: GameConfig;
    readyIdList: number[];
}

export enum GamePlayerState {
    NULL = "NULL",
    AUTH = "AUTH",
    SYNCING = "SYNCING",
    READY = "READY"
}
export interface ResGamePlayerState {
    stateList: GamePlayerState[];
}

export interface ReqSelfOperation {
    type: number;
    index: number;
    tile: string;
    cancelOperation: boolean;
    moqie: boolean;
    timeuse: number;
    tileState: number;
    changeTiles: string[];
    tileStates: number[];
    gapType: number;
}

export interface ReqChiPengGang {
    type: number;
    index: number;
    cancelOperation: boolean;
    timeuse: number;
}

export interface ReqBroadcastInGame {
    content: string;
    exceptSelf: boolean;
}

export interface ReqStartUnifiedMatch {
    matchSid: string;
    clientVersionString: string;
}

export interface NotifyMatchGameStart {
    gameUrl: string;
    connectToken: string;
    gameUuid: string;
    matchModeId: number;
    location: string;
}

export interface Fulu {
    type: number;
    tile: string[];
    from: number[];
}

export interface PlayerSnapshot {
    score: number;
    liqiposition: number;
    tilenum: number;
    qipais: string[];
    mings: Fulu[];
}

export interface GameSnapshot {
    chang: number;
    ju: number;
    den: number;
    indexPlayer: number;
    leftTileCount: number;
    hands: string[];
    doras: string[];
    liqibang: number;
    players: PlayerSnapshot[];
    zhenting: boolean;
}

export interface GameRestore {
    snapshot: GameSnapshot;
    actions: ActionPrototype;
    passedWaitingTime: number;
    gameState: number;
    startTime: number;
    lastPauseTimeMsg: number;
}
export interface ResEnterGame {
    error?: ResError;
    step: number;
    isEnd: boolean;
    gameRestore: GameRestore;
}

export interface ActionPrototype {
    step: number;
    name: string;
    data: string;
}

export interface OptionalOperation {
    type: number;
    combination: string[];
    changeTiles: string[];
    changeTileStates: number[];
    gapType: number;
}
export interface OptionalOperationList {
    seat: number;
    operationList: OptionalOperation[];
    timeAdd: number;
    timeFixed: number;
}

export interface TingPaiInfo {
    tile: string;
    haveyi: boolean;
    yiman: boolean;
    count: number;
    fu: number;
    biaoDoraCount: number;
    yimanZimo: boolean;
    coundZimo: number;
    fuZimo: number;
}

export interface MuyuInfo {
    seat: number;
    count: number;
    countMax: number;
    id: number;
}

export interface ActionDiscardTile {
    seat: number;
    tile: string;
    isLiqi: boolean;
    operation: OptionalOperationList;
    moqie: boolean;
    zhenting: boolean;
    tingpais: TingPaiInfo[];
    doras: string[];
    isWliqi: boolean;
    tileState: number;
    muyu: MuyuInfo;
    revealed: boolean;
    scores: number[];
    liqibang: number;
}

export interface LiQiSuccess {
    seat: number;
    score: number;
    liqibang: number;
    failed: boolean;
}

export interface TingPaiDiscardInfo {
    tile: string;
    zhenting: boolean;
    infos: TingPaiInfo[];
}

export interface ActionDealTile {
    seat: number;
    tile: string;
    leftTileCount: number;
    operation: OptionalOperationList;
    liqi: LiQiSuccess;
    doras: string[];
    zhenting: boolean;
    tingpais: TingPaiDiscardInfo;
    tileState: number;
    muyu: MuyuInfo;
}

export interface ActionChiPengGang {
    seat: number;
    type: number;
    tiles: string[];
    froms: undefined[];
    liqi: LiQiSuccess;
    operation: OptionalOperationList;
    zhenting: boolean;
    tingpais: TingPaiDiscardInfo[];
    tileStates: number[];
    muyu: MuyuInfo;
    scores: number[];
    liqibang: number;
}

export interface FanInfo {
    name: string;
    val: number;
    id: number;
}
export interface HuleInfo {
    hand: string[];
    ming: string[];
    huTile: string;
    seat: number;
    zimo: boolean;
    qinjia: boolean;
    liqi: boolean;
    doras: string[];
    liDoras: string[];
    yiman: boolean;
    count: number;
    fans: FanInfo[];
    fu: number;
    title: string;
    pointRong: number;
    pointZimoQin: number;
    pointZimoXian: number;
    titleId: number;
    pointSum: number;
    dadian: number;
    baopai: number;
}

export interface GameEnd {
    scores: number[];
}
export interface ActionHule {
    hules: HuleInfo[];
    oldScores: number[];
    deltaScores: number[];
    waitTimeout: number;
    scores: number[];
    gameend: GameEnd;
    doras: string[];
    muyu: MuyuInfo;
    baopai: number;
}

export interface PlayerItem {
    seat: number;
    totalPoint: number;
    partPoint1: number;
    partPoint2: number;
    gradingScore: number;
    gold: number;
}
export interface GameEndResult {
    players: PlayerItem[];
}
export interface NotifyGameEndResult {
    result: GameEndResult;
}

export interface NumericalUpdate {
    id: number;
    final: number;
}

export interface CharacterUpdate {
    characters: Character[];
    skins: number[];
    finishedEndings: number[];
    rewardedEndings: number[];
}

export interface AchievementUpdate {
    progresses: AchievementProgress[];
    rewardedGroup: number[];
}

export interface AchievementProgress {
    id: number;
    counter: number;
    achieved: boolean;
    rewarded: boolean;
    achievedTime: number;
}

export interface DailyTaskUpdate {
    progresses: TaskProgress[];
    taskList: number[];
}

export interface TaskProgress {
    id: number;
    counter: number;
    achieved: boolean;
    rewarded: boolean;
    failed: boolean;
}

export interface TitleUpdate {
    newTitles: number[];
    removeTitles: number[];
}

export interface TaskUpdate {
    progresses: TaskProgress[];
    taskList: number[];
}

export interface AccountChallengeUpdate {
    progresses: TaskProgress[];
    level: number;
    refreshCount: number;
    matchCount: number;
    ticketId: number;
    taskList: number[];
    rewardedSeason: number[];
}

export interface AccountABMatchUpdate {
    matchId: number;
    matchCount: number;
    buyInCount: number;
    point: number;
    rewarded: boolean;
    matchMaxPoint: MatchPoint[];
    quit: boolean;
}

export interface SegmentTaskUpdate {
    progresses: SegmentTaskProgress[];
    taskList: number[];
}

export interface SegmentTaskProgress {
    id: number;
    counter: number;
    achieved: boolean;
    rewarded: boolean;
    failed: boolean;
    rewardCount: number;
    achievedCount: number;
}

export interface MatchPoint {
    matchId: number;
    point: number;
}

export interface Item {
    itemId: number;
    stack: number;
}

export interface ItemGainRecord {
    itemId: number;
    count: number;
}
export interface ItemGainRecords {
    recordTime: number;
    limitSourceId: number;
    records: ItemGainRecord[];
}
export interface BagUpdate {
    updateItems: Item;
    updateDailyGainRecord: ItemGainRecords;
}

export interface AccountShiLian {
    step: number;
    state: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface MineReward {
    point: Point;
    rewardId: number;
    received: boolean;
}

export interface MineActivityData {
    digPoint: Point[];
    map: MineReward[];
    id: number;
}

export interface RPGState {
    playerDamaged: number;
    monsterDamaged: number;
    monsterSeq: number;
}

export interface RPGActivity {
    activityId: number;
    lastShowUuid: string;
    lastPlayerUuid: number;
    currentState: RPGState;
    lastShowState: RPGState;
    receivedRewards: number[];
}

export interface CountWithTimeData {
    count: number;
    lastUpdateTime: number;
}

export interface GiftBoxData {
    id: number;
    itemId: number;
    count: number;
    fromAccountId: number;
    time: number;
    received: number;
}

export interface ActivityFeedData {
    activityId: number;
    feedCount: number;
    friendReceiveData: CountWithTimeData;
    friendSendData: CountWithTimeData;
    giftInbox: GiftBoxData[];
    maxInboxId: number;
}

export interface AccountActivityUpdate {
    mineData: MineActivityData;
    rpgData: RPGActivity;
    feedData: ActivityFeedData;
}

export interface AccountUpdate {
    numerical: NumericalUpdate[];
    character: CharacterUpdate;
    bag: BagUpdate;
    achievement: AchievementUpdate;
    shilian: AccountShiLian;
    dailyTask: DailyTaskUpdate;
    title: TitleUpdate;
    newRechargedList: number[];
    activityTask: TaskUpdate;
    activityFlipTask: TaskUpdate;
    activityPeriodTask: TaskUpdate;
    activityRandomTask: TaskUpdate;
    challenge: AccountChallengeUpdate;
    abMatch: AccountABMatchUpdate;
    activity: AccountActivityUpdate;
    activitySegmentTask: SegmentTaskUpdate;
}

export interface NotifyAccountUpdate {
    update: AccountUpdate;
}

export interface LevelChange {
    origin: AccountLevel;
    final: AccountLevel;
    type: number;
}

export interface RewardSlot {
    id: number;
    count: number;
}

export interface MatchChest {
    chestId: number;
    origin: number;
    final: number;
    isGraded: boolean;
    rewards: RewardSlot[];
}

export interface MainCharacter {
    level: number;
    exp: number;
    add: number;
}

export interface CharacterGift {
    origin: number;
    final: number;
    add: number;
    isGraded: boolean;
}

export interface NotifyGameFinishRewardV2 {
    modeId: number;
    levelChange: LevelChange;
    matchChest: MatchChest;
    mainCharacter: MainCharacter;
    characterGift: CharacterGift;
}
