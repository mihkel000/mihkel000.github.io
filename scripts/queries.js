import { queryData } from "./fetch.js";

export const GetUserId = async(username) => {
    let userId = await queryData(
        `
        query GetUserId ($username: String){
            user(where: { login: {_eq: $username}}) {
                id,
                login
                }
        }
        `, { username: username }
    );
    return userId;
};

export const GetUserTransactions = async(userId, limit = 50, offset = 0) => {
    let pathReg = "((/johvi/div-01/rust)(?!/)|(/johvi/div-01)(?!/rust)[A-Za-z0-9/-//]*)";
    let type = "xp";
    let amount = 4999;

    let userTransactions = await queryData(
        `
            query GetUserTransactions($userId: Int, $type: String, $amount: numeric, $pathReg: String, $limit: Int, $offset: Int) {
                transaction(
                  where: {userId: {_eq: $userId}, type: {_eq: $type}, amount: {_gt: $amount}, path: {_iregex: $pathReg}}
                  limit: $limit
                  offset: $offset
                  order_by: {path: asc, amount: desc}
                ) {
                  type
                  amount
                  path
                  object {
                    name
                    type
                  }
                  objectId
                  isBonus
                  createdAt
                }
              }
        `, {
            userId: userId,
            type: type,
            amount: amount,
            pathReg: pathReg,
            limit: limit,
            offset: offset,
        }
    );
    return userTransactions.data.transaction;
};

let totalUserTransactions = [];
export const getTotalUserTransactions = async(userId, transactionLimit, transactionOffset) => {
    let userTransactions = await GetUserTransactions(userId, transactionLimit, transactionOffset);
    totalUserTransactions = totalUserTransactions.concat(userTransactions);
    if (totalUserTransactions.length === transactionLimit) {
        transactionLimit += 50;
        transactionOffset += 50;
        return getTotalUserTransactions(userId, transactionLimit, transactionOffset);
    }
    return totalUserTransactions;
};

export const GetUserProgress = async(userId, limit = 50, offset = 0) => {
    let pathReg = "((/johvi/div-01/rust)(?!/)|(/johvi/div-01)(?!/rust)[A-Za-z0-9/-//]*)";

    // get these types
    let objectTypeReg = "(project|piscine|module)";

    let userprogress = await queryData(
        `
            query GetUserProgress($userId: Int, $pathReg: String, $objectTypeReg: String, $limit: Int, $offset: Int) {
                progress(
                    where: {userId: {_eq: $userId}, path: {_iregex: $pathReg}, object: {type: {_iregex: $objectTypeReg}}, isDone: {_eq: true}}
                    limit: $limit
                    offset: $offset
                    order_by: {createdAt: asc}
                ) {
                    id
                    path
                    objectId
                    isDone
                    object {
                        name
                        type
                    }
                    createdAt
                }
            }
        `, {
            userId: userId,
            pathReg: pathReg,
            objectTypeReg: objectTypeReg,
            limit: limit,
            offset: offset,
        }
    );
    return userprogress.data.progress;
};

let totalUserProgress = [];
export const getTotalUserProgress = async(userId, progressLimit, progressOffset) => {
    let userProgress = await GetUserProgress(userId, progressLimit, progressOffset);
    totalUserProgress = totalUserProgress.concat(userProgress);
    if (totalUserProgress.length === progressLimit) {
        progressLimit += 50;
        progressOffset += 50;
        return getTotalUserProgress(userId, progressLimit, progressOffset);
    }
    return totalUserProgress;
};