import {Column} from "typeorm";

export class OrderDto {

    id?: string;

    order_id?: string;

    product_name?: string;

    order_quantity?: string;

    order_sumbitted_at?: string;

    final_amount?: string;

    status?: number;

    is_active?: boolean;
}