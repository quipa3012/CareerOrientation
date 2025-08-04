export interface Block {
    id: number;
    code: string;
    name: string;
    modelLabel: number;
}

export interface MajorManager {
    id: number;
    code: string;
    name: string;
    description: string;
    block: Block;
}

export interface MajorManagerRequest {
    code: string;
    name: string;
    description: string;
    blockId: number;
}

export interface MajorManagerFlat {
    id: number;
    code: string;
    name: string;
    description: string;
    blockId: number;
    blockName: string;
}
