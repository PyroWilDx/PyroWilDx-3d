export class LoadingScreen {
    public static readonly maxCount: number = 8;
    public static currCount: number = 0;

    private static loadingBar = document.getElementById("loadingBar");
    private static loadingText = document.getElementById("loadingText");

    static updateCount() {
        LoadingScreen.currCount++;

        LoadingScreen.updateLoadingScreen();
    }

    static updateLoadingScreen() {
        if (LoadingScreen.loadingBar != null && LoadingScreen.loadingText != null) {
            let progress = Math.floor((LoadingScreen.currCount / LoadingScreen.maxCount) * 100);
            let progressStr = progress.toString() + "%";
            LoadingScreen.loadingBar.style.width = progressStr;
            LoadingScreen.loadingText.textContent = "Loading... " + progressStr;
        }
    }
}