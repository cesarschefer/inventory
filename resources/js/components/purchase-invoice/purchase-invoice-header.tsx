import type { Supplier } from "@/types/supplier";
import { Card, CardContent } from "../ui/card";
import LabeledInput from "../ui/labeled-input";
import LabeledSelect from "../ui/labeled-select";

type SupplierSelect = Pick<Supplier, 'id' | 'name'>

interface PurchaseInvoiceHeaderProps {
    data: {
        supplier_id: string;
        invoice_number: string;
        invoice_date: string;
    };
    setData: (key: string, value: string) => void;
    errors: Partial<Record<string, string>>;
    suppliers: SupplierSelect[];
    disabled?: boolean;
}

export function PurchaseInvoiceHeader({
    data,
    setData,
    errors,
    suppliers,
    disabled = false
}: PurchaseInvoiceHeaderProps) {
    const supplierOptions = suppliers.map(s => ({
        value: s.id.toString(),
        label: s.name
    }));

    return (
        <Card className="rounded-xl border border-border bg-card shadow-sm">
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LabeledSelect
                        label="Supplier"
                        name="supplier_id"
                        value={data.supplier_id}
                        onChange={(value) => setData('supplier_id', value)}
                        options={supplierOptions}
                        placeholder="Select Supplier"
                        error={errors.supplier_id}
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
