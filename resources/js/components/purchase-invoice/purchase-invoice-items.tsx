import { Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types/product";
import type { PurchaseInvoiceItem } from "@/types/purchase-invoice-item";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";


type ProductSelect = Pick<Product, 'id' | 'name'>

interface PurchaseInvoiceItemsProps {
    items: PurchaseInvoiceItem[];
    products: ProductSelect[];
    updateItem: (index: number, field: keyof PurchaseInvoiceItem, value: any) => void;
    addItem: () => void;
    removeItem: (index: number) => void;
    errors: any;
    disabled?: boolean;
}

export function PurchaseInvoiceItems({
    items,
    products,
    updateItem,
    addItem,
    removeItem,
    errors,
    disabled = false
}: PurchaseInvoiceItemsProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Invoice Items</h3>
                {!disabled && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addItem}
                        className="cursor-pointer gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Add Item
                    </Button>
                )}
            </div>

            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b border-border text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-4 py-3 min-w-[250px]">Product</th>
                                <th className="px-4 py-3 w-32 text-center">Quantity</th>
                                <th className="px-4 py-3 w-40 text-right">Unit Price</th>
                                <th className="px-4 py-3 w-40 text-right">Subtotal</th>
                                {!disabled && <th className="px-4 py-3 w-16"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((item, index) => (
                                <tr key={index} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 align-top">
                                        <Select
                                            value={item.product_id.toString()}
                                            onValueChange={(value) => updateItem(index, 'product_id', value)}
                                            disabled={disabled}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Product" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {products.map((product) => (
                                                    <SelectItem key={product.id} value={product.id.toString()}>
                                                        {product.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors[`invoiceItems.${index}.product_id`] && (
                                            <p className="text-destructive text-xs mt-1">{errors[`invoiceItems.${index}.product_id`]}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                            className="text-center"
                                            disabled={disabled}
                                        />
                                        {errors[`invoiceItems.${index}.quantity`] && (
                                            <p className="text-destructive text-xs mt-1">{errors[`invoiceItems.${index}.quantity`]}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.unit_price}
                                            onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                            className="text-right"
                                            disabled={disabled}
                                        />
                                        {errors[`invoiceItems.${index}.unit_price`] && (
                                            <p className="text-destructive text-xs mt-1">{errors[`invoiceItems.${index}.unit_price`]}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 align-top text-right font-medium">
                                        <div className="h-9 flex items-center justify-end">
                                            ${Number(item.subtotal).toFixed(2)}
                                        </div>
                                    </td>
                                    {!disabled && (
                                        <td className="px-4 py-3 align-top">
                                            {items.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/10"
                                                    onClick={() => removeItem(index)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-muted/20 border-t border-border font-bold">
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-right text-muted-foreground uppercase text-xs tracking-wider">
                                    Total Amount
                                </td>
                                <td className="px-4 py-3 text-right text-lg">
                                    ${items.reduce((sum, item) => sum + Number(item.subtotal), 0).toFixed(2)}
                                </td>
                                <td className="px-4 py-3"></td>
                                {!disabled && <td className="px-4 py-3"></td>}
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
