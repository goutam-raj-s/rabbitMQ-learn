export interface OrderRequest {
    item: string;
    quantity: number;
    price: number;
}

export interface Order extends OrderRequest {
    id: number;
}
