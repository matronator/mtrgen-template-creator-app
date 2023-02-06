import { v1 } from 'uuid';

export function generateUUID(): string {
    return v1({
        clockseq: 0x1ad2,
    });
}

export const compareArrays = (array1: unknown[], array2: unknown[]): boolean => {
    return array1.length == array2.length && array1.every(function(element, index) {
        return element === array2[index]; 
    });
}
