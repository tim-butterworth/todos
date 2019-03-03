export enum NewToDoCommands {
    NEW_TODO = "NEW_TODO"
}

export interface NewToDoCommand {
    type: NewToDoCommands.NEW_TODO
};

const newToDoCommand = () => ({
    type: NewToDoCommands.NEW_TODO
});

export { newToDoCommand };
