export interface UnHandledAction {
    type: "UNHANDLED";
}
export type CombinedActions<T> = T | UnHandledAction;
