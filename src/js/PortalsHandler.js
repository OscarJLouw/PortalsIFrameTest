export class PortalsHandler {
    TaskStates = {
        AnyToNotActive: "ToNotActive",
        AnyToActive: "SetAnyToActive",
        AnyToComplete: "SetAnyToCompleted",

        NotActiveToActive: "SetNotActiveToActive",
        NotActiveToComplete: "SetNotActiveToCompleted",

        ActiveToNotActive: "SetActiveToNotActive",
        ActiveToComplete: "SetActiveToCompleted",

        CompleteToNotActive: "SetCompletedToNotActive",
        CompleteToActive: "SetCompletedToActive",
    }

    Setup(portalsSDKActive) {
        this.portalsSDKActive = portalsSDKActive;

        if (!portalsSDKActive)
            return;

        // Attach this function to the window to make it globally accessible,
        // even in the onclick callback on the close button in index.html
        window.CloseIFrame = () => this.CloseIFrame();
    }

    SetTaskState(taskName, targetState) {
        if (!this.portalsSDKActive)
            return;

        const message = {
            TaskName: taskName,
            TaskTargetState: targetState
        };

        PortalsSdk.sendMessageToUnity(JSON.stringify(message));

        console.log("Set task: " + taskName + " to " + targetState);
    }

    CloseIFrame() {
        PortalsSdk.closeIframe();
    }
}
