import { Upload, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LabeledInput from '@/components/ui/labeled-input';
import LabeledSelect from '@/components/ui/labeled-select';
import LabeledTextarea from '@/components/ui/labeled-textarea';
import type { Category } from '@/types/category';

interface ProductData {
    category_id: string;
    sku: string;
    name: string;
    detail: string;
    image: string | File | null;
}

interface ProductInputsProps {
    data: ProductData;
    setData: {
        (key: keyof ProductData, value: string | File | null): void;
        (updater: (prev: ProductData) => ProductData): void;
    };
    errors: Partial<Record<keyof ProductData, string>>;
    categories: Category[];
}

export default function ProductInputs({
    data,
    setData,
    errors,
    categories,
}: ProductInputsProps) {
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!(data.image instanceof File)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFilePreview(null);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setFilePreview(reader.result as string);
        reader.readAsDataURL(data.image);
    }, [data.image]);

    const preview = data.image instanceof File
        ? filePreview
        : typeof data.image === 'string' && data.image !== ''
            ? `/storage/${data.image}`
            : null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('image', file);
        }
    };

    const removeImage = () => {
        setData('image', null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 py-4">
            <div className="space-y-5">
                <LabeledInput
                    label="Name"
                    name="name"
                    value={data.name}
                    onChange={(value) => setData('name', value)}
                    error={errors.name}
                />

                <div className="grid grid-cols-2 gap-4">
                    <LabeledSelect
                        label="Category"
                        name="category_id"
                        value={data.category_id}
                        onChange={(value) =>
                            setData((prev) => ({
                                ...prev,
                                category_id: value,
                            }))
                        }
                        options={categories.map((category) => ({
                            value: category.id.toString(),
                            label: category.name,
                        }))}
                        error={errors.category_id}
                    />

                    <LabeledInput
                        label="SKU"
                        name="sku"
                        value={data.sku}
                        onChange={(value) => setData('sku', value)}
                        error={errors.sku}
                    />
                </div>

                <LabeledTextarea
                    label="Detail"
                    name="detail"
                    value={data.detail}
                    onChange={(value) => setData('detail', value)}
                    error={errors.detail}
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label>Product Image</Label>
                <div
                    className="relative aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/50 flex flex-col items-center justify-center overflow-hidden transition-colors hover:bg-muted/80 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {preview ? (
                        <>
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-lg"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="p-4 rounded-full bg-background shadow-sm">
                                <Upload className="h-8 w-8" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium">Click to upload</p>
                                <p className="text-xs">PNG, JPG or WEBP</p>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                {errors.image && (
                    <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
            </div>
        </div>
    );
}