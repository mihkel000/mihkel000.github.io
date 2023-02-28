import { MainPage } from "./mainpage.js";
import { getTotalUserProgress, getTotalUserTransactions, GetUserId } from "./queries.js";
import { ProjectXpChart } from "./projectXp.js";
import { TotalXpChart } from "./totalXp.js";

// make the page
new MainPage();

// focus on username field so you can press enter right away
let usernameQuery;
let username = document.getElementById("username-query");
username.focus();
var val = username.value;
username.value = "";
username.value = val;

// all magic happens in the click
let submitButton = document.getElementById("submit-button");
submitButton.addEventListener("click", async() => {
    // get username and make query
    usernameQuery = document.getElementById("username-query").value;
    document.getElementById("result-data").style.display = "block";
    let result = await GetUserId(usernameQuery);
    let errorMsg = document.getElementById("error-msg");
    let userId;
    let userLogin;
    // if successful
    if (result.data.user[0] !== undefined) {
        errorMsg.innerHTML = "";
        userId = result.data.user[0].id;
        userLogin = result.data.user[0].login;
        console.log("Get profile data for:", userLogin);
        document.getElementById("all-graphs").style.display = "block";
    } else {
        // if not successful
        errorMsg.innerHTML = "Username is not valid, please try again";
        document.getElementById("all-graphs").style.display = "none";
        document.getElementById("username-result").innerHTML = "";
        document.getElementById("userId-result").innerHTML = "";
        document.getElementById("userXp-result").innerHTML = "";
        document.getElementById("userLevel-result").innerHTML = "";
        document.getElementById("userNextLevel-result").innerHTML = "";
        return;
    }

    // set up query limit and offset
    let limit = 50;
    let offset = 0;

    // // get total user transactions
    let totalUserTransactions = await getTotalUserTransactions(userId, limit, offset);
    // delete all audits XP from transaction, keeping the largest XP which is the project
    const reducedUserTransactions = totalUserTransactions.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item.path === current.path && item.amount >= current.amount)) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);
    // sort the projects by time
    reducedUserTransactions.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
    // console.log("reducedUserTransactions:", reducedUserTransactions);

    // // get total user progress
    let totalUserProgress = await getTotalUserProgress(userId, limit, offset);
    // delete all duplicates
    const reducedUserProgress = totalUserProgress.reduce((accumulator, current) => {
        if (!accumulator.find((item) => item.path === current.path && item.createdAt <= current.createdAt)) {
            accumulator.push(current);
        }
        return accumulator;
    }, []);
    // console.log("reducedUserProgress:", reducedUserProgress);

    // // get all projects that are actually finished and find total user Xp. Also fix some french bugs in the data
    let userXp = 0;
    let finishedProjects = [];
    reducedUserTransactions.forEach((transaction) => {
        reducedUserProgress.forEach((progress) => {
            if (progress.isDone === true && transaction.object.name === progress.object.name) {
                userXp += transaction.amount;
                finishedProjects.push(transaction);
            }
            if (transaction.isBonus === true && transaction.object.name === progress.object.name) {
                userXp += transaction.amount;
                finishedProjects.push(transaction);
            }
        });
        if (transaction.object.name === "Div 01") {
            userXp += transaction.amount;
            transaction.object.name = "Piscine Rust 2022";
            transaction.object.type = "piscine";
            finishedProjects.push(transaction);
        }
    });
    // console.log("finishedProjects:", finishedProjects);

    // // make a user profile box
    let user = document.getElementById("user-id" + userId);
    if (user === null) {
        let userLevel = calculateLevel(userXp);
        let userNextLevel = levelNeededXP(userLevel + 1);
        makeUserProfile(userId, userLogin, userXp, userLevel, userNextLevel);
    }

    // // make svg graphs
    await ProjectXpChart(finishedProjects, 30, 4);
    await TotalXpChart(finishedProjects, 30, 4, userXp);

    // // empty arrays to let a new query be done
    submitButton.addEventListener("click", () => {
        totalUserTransactions.length = 0;
        totalUserProgress.length = 0;
        let graphs = document.querySelectorAll(".project-xp-chart");
        graphs.forEach((graph) => {
            graph.remove();
        });
        let graphs2 = document.querySelectorAll(".total-xp-chart");
        graphs2.forEach((graph) => {
            graph.remove();
        });
    });
});

function makeUserProfile(userId, userLogin, userXp, userLevel, userNextLevel) {
    document.getElementById("username-result").innerHTML = "Username: " + userLogin;
    document.getElementById("userId-result").innerHTML = "UserId: " + userId;
    document.getElementById("userXp-result").innerHTML = "Total XP: " + userXp;
    document.getElementById("userLevel-result").innerHTML = "Level: " + userLevel;
    document.getElementById("userNextLevel-result").innerHTML = "Next level in: " + (userNextLevel - userXp) + " xp";
}

// from Olari and < Robert Reimann (Kanguste) >
// Calculates what level this amount of XP would be at
function calculateLevel(userXp) {
    let userLevel = 0;

    while (levelNeededXP(++userLevel) < userXp) {}

    return userLevel - 1;
}

// from Olari and < Robert Reimann (Kanguste) >
// Returns the amount of XP needed for any given level
function levelNeededXP(userLevel) {
    return Math.round(userLevel * (176 + 3 * userLevel * (47 + 11 * userLevel)));
}

// make Enter button send query
let queryInput = document.getElementById("username-query");
queryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        submitButton.click();
    }
});