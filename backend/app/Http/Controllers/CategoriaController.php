<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    private Categoria $categoria;

    public function __construct(Categoria $categoria){
        $this->categoria = $categoria;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $categoria = $this->categoria->with('produtos')->when($request->search, function ($query) use ($request){
            $query->where('nome', 'like', '%'.$request->search.'%');
        })
        ->paginate(10);
        return response()->json($categoria);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoriaRequest $request)
    {
        $data = $request->validated();
        $categoria = $this->categoria->create($data);
        return response()->json($categoria);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $categoria = $this->categoria->with('produtos')->findorFail($id);
        return response()->json($categoria);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoriaRequest $request, int $id)
    {
        $categoria = $this->categoria->findOrFail($id);
        $data = $request->validated();
        $categoria->update($data);
        return response()->json($categoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $categoria = $this->categoria->newQuery()->findOrFail($id);
        $categoria->delete();
        return 'Categoria apagada!';
    }
}
