export class MainPage {
    constructor() {
        this.mainPage = document.createElement("div");
        this.mainPage.className = "main-page";
        this.mainPage.id = "main-page";
        document.body.appendChild(this.mainPage);

        this.queryData = document.createElement("div");
        this.queryData.className = "query-data";
        this.queryData.id = "query-data";
        this.mainPage.append(this.queryData);

        this.headingQuery = document.createElement("h1");
        this.headingQuery.innerHTML = "Enter your query:";
        this.queryData.appendChild(this.headingQuery);

        this.queryInfo = document.createElement("div");
        this.queryInfo.className = "query-info";
        this.queryInfo.id = "query-info";
        this.queryData.appendChild(this.queryInfo);

        this.usernameQuery = document.createElement("input");
        this.usernameQuery.className = "username-query";
        this.usernameQuery.id = "username-query";
        this.usernameQuery.placeholder = "Enter username";
        this.usernameQuery.defaultValue = "mihkeln";
        this.submitButton = document.createElement("button");
        this.submitButton.className = "submit-button";
        this.submitButton.id = "submit-button";
        this.submitButton.innerHTML = "Submit";
        this.queryInfo.append(this.usernameQuery, this.submitButton);

        this.resultData = document.createElement("div");
        this.resultData.className = "result-data";
        this.resultData.id = "result-data";
        this.mainPage.appendChild(this.resultData);

        this.headingResult = document.createElement("h1");
        this.headingResult.innerHTML = "Your query results:";
        this.errorMsg = document.createElement("h1");
        this.errorMsg.id = "error-msg";
        this.errorMsg.className = "error-msg";
        this.profile = document.createElement("div");
        this.profile.id = "user-profile";
        this.profile.className = "user-profile";
        this.username = document.createElement("p");
        this.username.id = "username-result";
        this.userId = document.createElement("p");
        this.userId.id = "userId-result";
        this.userXp = document.createElement("p");
        this.userXp.id = "userXp-result";
        this.userLevel = document.createElement("p");
        this.userLevel.id = "userLevel-result";
        this.userNextLevel = document.createElement("p");
        this.userNextLevel.id = "userNextLevel-result";
        this.profile.append(this.errorMsg, this.username, this.userId, this.userXp, this.userLevel, this.userNextLevel);

        this.allGraphs = document.createElement("div");
        this.allGraphs.id = "all-graphs";
        this.allGraphs.className = "all-graphs";

        this.resultData.append(this.headingResult, this.profile, this.allGraphs);
    }
}