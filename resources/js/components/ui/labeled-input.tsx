import { Input } from "./input";
import { Label } from "./label";
import { ComponentProps } from "react";

type LabeledInputProps = {
    label: string;
    name: string;
    error?: string;
    onChange: (value: string) => void;
} & Omit<ComponentProps<typeof Input>, 'onChange'>;

export default function LabeledInput({
    label,
    name,
    error,
    onChange,
    ...props
}: LabeledInputProps) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>

            <Input
                id={name}
                {...props}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}