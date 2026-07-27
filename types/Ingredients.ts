type units = 'kg' | "l" | 'pcs'

export type Ingredient = {
    id : string;
    name : string;
    unit : units,
    created_at : string,
    updated_at : string;
}