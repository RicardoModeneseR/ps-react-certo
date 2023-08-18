<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Produto>
 */
class ProdutoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nome'=>$this->faker->name,
            'imagem'=>$this->faker->imageUrl(640, 480),
            'descricao'=>$this->faker->name,
            'quantidade'=>$this->faker->numberBetween(1, 50),
            'categoria_id'=>$this->faker->numberBetween(1, 10),
        ];
    }
}
