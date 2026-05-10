<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class GenerateReportRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'format' => 'nullable|in:excel,pdf',
            'report_type' => 'required|in:purchases,sales,profit',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after_or_equal:date_from',
        ];
    }

    public function messages(): array
    {
        return [
            'report_type.required' => 'You must select a report type.',
            'report_type.in' => 'Invalid report type selected.',
            'date_from.date' => 'The "from" date must be a valid date.',
            'date_to.date' => 'The "to" date must be a valid date.',
            'date_to.after_or_equal' => 'The "to" date must be the same or after the "from" date.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json(['message' => $validator->errors()->first()], 422)
        );
    }
}
