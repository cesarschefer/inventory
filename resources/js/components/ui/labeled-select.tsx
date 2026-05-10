import { Label } from "./label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./select";

type Option = {
    value: string;
    label: string;
};

type LabeledSelectProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    placeholder?: string;
    error?: string;
    disabled?: boolean;
};

export default function LabeledSelect({
    label,
    name,
    value,
    onChange,
    options,
    placeholder = "Select an option",
    error,
    disabled = false,
}: LabeledSelectProps) {
    return (
        <div className="space-y-1">
            <Label htmlFor={name}>{label}</Label>
            <Select value={value} onValueChange={onChange} disabled={disabled}>
                <SelectTrigger id={name} className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
