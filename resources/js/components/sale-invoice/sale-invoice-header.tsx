import type { Customer } from "@/types/customer";
import { Card, CardContent } from "../ui/card";
import LabeledInput from "../ui/labeled-input";
import LabeledSelect from "../ui/labeled-select";

type CustomerSelect = Pick<Customer, 'id' | 'name'>

interface SaleInvoiceHeaderProps {
    data: {
        customer_id: string;
        invoice_number: string;
        invoice_date: string;
    };
    setData: (key: string, value: string) => void;
    errors: Partial<Record<string, string>>;
    customers: CustomerSelect[];
    disabled?: boolean;
}

export function SaleInvoiceHeader({
    data,
    setData,
    errors,
    customers,
    disabled = false
}: SaleInvoiceHeaderProps) {
    const customerOptions = customers.map(c => ({
        value: c.id.toString(),
        label: c.name
    }));

    return (
        <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LabeledSelect
                        label="Customer"
                        name="customer_id"
                        value={data.customer_id}
                        onChange={(value) => setData('customer_id', value)}
                        options={customerOptions}
                        placeholder="Select Customer"
                        error={errors.customer_id}
                        disabled={disabled}
                    />

                    <LabeledInput
                        label="Invoice Number"
                        name="invoice_number"
                        value={data.invoice_number}
                        onChange={(value) => setData('invoice_number', value)}
                        error={errors.invoice_number}
                        disabled={disabled}
                        placeholder="e.g. INV-001"
                    />

                    <LabeledInput
                        label="Invoice Date"
                        name="invoice_date"
                        type="date"
                        value={data.invoice_date}
                        onChange={(value) => setData('invoice_date', value)}
                        error={errors.invoice_date}
                        disabled={disabled}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
