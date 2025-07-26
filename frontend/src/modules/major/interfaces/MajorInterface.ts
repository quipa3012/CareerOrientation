export interface Block {
    id: number;
    code: string;
    name: string;
    modelLabel: number;
}

export interface Major {
    id: number;
    code: string;
    name: string;
    description: string;
    block: Block;
}
