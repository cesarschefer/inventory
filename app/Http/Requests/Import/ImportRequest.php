<?php

namespace App\Http\Requests\Import;

use Illuminate\Foundation\Http\FormRequest;

class ImportRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'import_type' => 'required|in:products,categories,suppliers,customers',
            'file' => 'required|file|mimes:csv|max:10240',
        ];
    }
}