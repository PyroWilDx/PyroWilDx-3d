export class LoadingScreen {
    public static loadPercentage: number = 48;
    public static preLoadPercentage: number = 48;

    public static readonly maxCount: number = 13;
    public static readonly preLoadMaxCount: number = 60;
    public static currCount: number = 0;
    public static preLoadCount: number = 0;

    private static loadingBar = document.getElementById("loadingBar");
    private static loadingText = document.getElementById("loadingText");

    static updateCount() {
        LoadingScreen.currCount++;

        LoadingScreen.updateLoadingScreen();
    }

    static updateLoadingScreen() {
        if (LoadingScreen.loadingBar != null && LoadingScreen.loadingText != null) {
            let progressBarValue = 4 + ((LoadingScreen.currCount + 1) / LoadingScreen.maxCount) * LoadingScreen.loadPercentage
                + (LoadingScreen.preLoadCount / LoadingScreen.preLoadMaxCount) * LoadingScreen.preLoadPercentage;
            progressBarValue = Math.round(progressBarValue);
            let progressTextValue = 4 + (LoadingScreen.currCount / LoadingScreen.maxCount) * LoadingScreen.loadPercentage
                + (LoadingScreen.preLoadCount / LoadingScreen.preLoadMaxCount) * LoadingScreen.preLoadPercentage;
            progressTextValue = Math.round(progressTextValue);
            let progressBarStr = progressBarValue.toString() + "%";
            let progressTextStr = progressTextValue.toString() + "%";
            LoadingScreen.loadingBar.style.width = progressBarStr;
            LoadingScreen.loadingText.textContent = "Loading... " + progressTextStr;
        }
    }
}
