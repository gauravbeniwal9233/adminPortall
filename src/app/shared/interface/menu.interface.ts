export interface Menu {
    title: string;
    path?: string;
    icon?: string;
    type: string;
    active?: boolean;
    children?: Menu[]
}