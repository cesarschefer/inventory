import { Input } from "./input";
import { Label } from "./label";

type LabeledInputProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
};

export default function LabeledInput({
    label,
    name,
    value,
    onChange,
    error,
}: LabeledInputProps) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>

            <Input
                id={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}