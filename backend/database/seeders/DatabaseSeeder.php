<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CategoriaSeeder::class,
            ProdutoSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Ricardo Modenese',
            'email' => 'ricardomodenese@example.com',
            'password' => Hash::make('password')
        ]);

        User::factory(15)->create();
    }
}
