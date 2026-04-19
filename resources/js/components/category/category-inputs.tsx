import LabeledInput from '@/components/ui/labeled-input';

interface CategoryInputsProps {
    data: { name: string };
    setData: (key: 'name', value: string) => void;
    errors: Partial<Record<'name', string>>;
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
