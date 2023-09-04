<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProdutoRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'nome'=>['required', 'min:2', 'max:100'],
            'descricao'=>['required', 'min:2', 'max:220'],
            'quantidade'=>['required', 'integer'],
            'preco' => ['required', 'numeric'],
            'imagem'=>['required', 'mimes:jpg,png,jpeg'],
            'categoria_id'=>['required', 'integer'],
        ];
    }
}
