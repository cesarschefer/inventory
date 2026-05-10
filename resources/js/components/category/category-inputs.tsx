import LabeledInput from '@/components/ui/labeled-input';

interface CategoryData {
    name: string;
}

interface CategoryInputsProps {
    data: CategoryData;
    setData: {
        (key: keyof CategoryData, value: string): void;
        (updater: (prev: CategoryData) => CategoryData): void;
    };
    errors: Partial<Record<keyof CategoryData, string>>;
}

export function CategoryInputs({ data, setData, errors }: CategoryInputsProps) {
    return (
        <LabeledInput
            label="Name"
            name="name"
            value={data.name}
            onChange={(value) => setData('name', value)}
            error={errors.name}
        />
    );
}
