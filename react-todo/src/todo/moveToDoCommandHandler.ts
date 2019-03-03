export enum MoveCommands {
    MOVE = "MOVE"
};

export interface MoveIndexes {
    current: number;
    target: number;
};

export interface MoveCommand {
    type: MoveCommands.MOVE;
    indexes: MoveIndexes;
}

const moveCommand = (indexes: MoveIndexes): MoveCommand => ({
    type: MoveCommands.MOVE,
    indexes
});

const handleMoveCommand = () => { };


export { moveCommand, handleMoveCommand };
