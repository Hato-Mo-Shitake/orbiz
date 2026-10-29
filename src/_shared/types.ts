
export type Listener = () => void;
export type Unsubscribe = () => void;

export type Commit = () => void;
export type AsyncCommit = () => Promise<void>;

export type ReadonlyTreeNode<T> = Readonly<{
    node: T
    neighbors?: TreeNode<T>[]
}>
export type TreeNode<T> = {
    node: T
    neighbors?: TreeNode<T>[]
}

export type PlainYMD = {
    y: number,
    m: number,
    d: number
}

export type DateFormat = "yyyy-MM-dd" | "yyyyMMdd" | "yyyy/MM/dd" | "yyyy-MM-dd_EEE" | "yyyy-MM" | "yyyy" | "MM";
export type DateTimeFormat = "yyyy-MM-dd'T'HH:mm:ss";

export type TimeZone = "UTC" | "LOCAL";

export type WeekDay = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
