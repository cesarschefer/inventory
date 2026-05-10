import { Textarea } from "./textarea";
import { Label } from "./label";

type LabeledTextareaProps = {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    className?: string;
    rows?: number;
};

export default function LabeledTextarea({
    label,
    name,
    value,
    onChange,
    error,
    className,
    rows = 3,
}: LabeledTextareaProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <Label htmlFor={name}>{label}</Label>

            <Textarea
                id={name}
                value={value}
                rows={rows}
                onChange={(e) => onChange(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
}
