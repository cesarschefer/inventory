import LabeledInput from '@/components/ui/labeled-input';
import LabeledSelect from '@/components/ui/labeled-select';

interface State {
    code: string;
    name: string;
}

interface City {
    name: string;
}

interface CustomerData {
    customer_type: string;
    tax_id: string | null;
    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    address: string;
    floor: string;
    apartment: string;
}

interface CustomerInputsProps {
    data: CustomerData;
    setData: {
        (key: keyof CustomerData, value: string): void;
        (updater: (prev: CustomerData) => CustomerData): void;
    };
    errors: Partial<Record<keyof CustomerData, string>>;
    states: State[];
    filteredCities: City[];
    editingCustomer?: boolean;
}

export default function CustomerInputs({
    data,
    setData,
    errors,
    states,
    filteredCities,
    editingCustomer = false,
}: CustomerInputsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-4">
            <div className="space-y-4">
                <LabeledSelect
                    label="Customer Type"
                    name="customer_type"
                    value={data.customer_type}
                    disabled={editingCustomer}
                    onChange={(value) =>
                        setData((prev) => ({
                            ...prev,
                            customer_type: value,
                            tax_id: value === '2' ? prev.tax_id : '',
                        }))
                    }
                    options={[
                        { value: '1', label: 'Customer' },
                        { value: '2', label: 'Company' },
                    ]}
                    error={errors.customer_type}
                />
                {data.customer_type === '2' && (
                    <LabeledInput
                        label="Tax ID"
                        name="tax_id"
                        value={data.tax_id}
                        onChange={(value) => setData('tax_id', value)}
                        error={errors.tax_id}
                    />
                )}
                <LabeledInput
                    label="Name"
                    name="name"
                    value={data.name}
                    onChange={(value) => setData('name', value)}
                    error={errors.name}
                />
                <LabeledInput
                    label="Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                />
                <LabeledInput
                    label="Phone"
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={(value) => setData('phone', value)}
                    error={errors.phone}
                />
            </div>

            <div className="space-y-4">
                <LabeledSelect
                    label="State"
                    name="state"
                    value={data.state}
                    onChange={(value) =>
                        setData((prev) => ({
                            ...prev,
                            state: value,
                            city: '',
                        }))
                    }
                    options={states.map((s) => ({
                        value: s.code,
                        label: s.name,
                    }))}
                    error={errors.state}
                />
                <LabeledSelect
                    label="City"
                    name="city"
                    value={data.city}
                    onChange={(value) => setData('city', value)}
                    options={filteredCities.map((c) => ({
                        value: c.name,
                        label: c.name,
                    }))}
                    error={errors.city}
                    disabled={!data.state}
                    placeholder={!data.state ? 'Select state' : 'Select city'}
                />
                <LabeledInput
                    label="Address"
                    name="address"
                    value={data.address}
                    onChange={(value) => setData('address', value)}
                    error={errors.address}
                />
                <div className="grid grid-cols-2 gap-4">
                    <LabeledInput
                        label="Floor"
                        name="floor"
                        value={data.floor}
                        onChange={(value) => setData('floor', value)}
                        error={errors.floor}
                    />
                    <LabeledInput
                        label="Apartment"
                        name="apartment"
                        value={data.apartment}
                        onChange={(value) => setData('apartment', value)}
                        error={errors.apartment}
                    />
                </div>
            </div>
        </div>
    );
}