export interface ProjectDisplayerInterface {
    displayProject(): void;
    updateFrameDisplayer(): void;
    onProjectHideDisplay(): void;
}

export interface ProjectDisplayer {
    displayer: ProjectDisplayerInterface | null;
    displayed: HTMLElement;
    startTime: number;
}
