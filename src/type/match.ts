export enum MatchMode {
    BronzeToufuu4P = 2,
    BronzeHanchan4P = 3,
    Bronze3ToufuuP = 17,
    BronzeHanchan3P = 18,
    KouryuToufuu4P = 29,
    KouryuHanchan4P = 30,
    KouryuToufuu3P = 31,
    KouryuHanchan3P = 32,
    TaikaiRyuNoWarime = 35,
    TaikaiSekketsu = 41,
    TaikaiShura = 40
}

export enum GamePlayerType {
    Toufuu4P = 1,
    Hanchan4P = 2,
    AI4P = 3,
    Ikkoku4P = 4,
    Toufuu3P = 11,
    Hanchan3P = 12,
    AI3P = 13,
    Ikkoku3P = 14
}

export const playerTypeMap: Record<number, string> = {
    1: "4人東風禅",
    2: "4人半荘禅",
    3: "4人CPU禅",
    4: "4人一局禅",
    11: "3人東風禅",
    12: "3人半荘禅",
    13: "3人CPU禅",
    14: "3人一局禅"
};

export enum RoomType {
    CUSTOM,
    CONTEST,
    MATCH,
    OTHERS
}

export const roomTypeMap: Record<number, string> = {
    0: "友人禅",
    1: "大会禅",
    2: "単位禅"
};
