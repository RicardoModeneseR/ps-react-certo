<?php

namespace App\Http\Controllers;

use App\Models\Produto;
use App\Http\Requests\StoreProdutoRequest;
use App\Http\Requests\UpdateProdutoRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProdutoController extends Controller
{
    private Produto $produto;

    public function __construct(Produto $produto){
        $this->produto = $produto;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $produtos = $this->produto->with('categorias')->when($request->search, function ($query) use ($request){
            $query->where('nome', 'like', '%'.$request->search.'%')->orWhere('categoria_id', $request->search);
        })
        ->paginate(10);
        return response()->json($produtos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProdutoRequest $request)
    {
        $data = $request->validated();
        if($request->hasFile('imagem')){
            $path = $request->file('imagem')->store('imagem', 'public');
            $data['imagem'] = url('storage/' . $path);
        }
        $produto = $this->produto->create($data);
        return response()->json($produto);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $produto = $this->produto->with('categorias')->findorFail($id);
        return response()->json($produto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProdutoRequest $request, int $id)
    {
        $data = $request->validated();
        $produto = $this->produto->findOrFail($id);
        if($request->hasFile('imagem')){
            Storage::disk('public')->delete($produto->imagem);
            $data['imagem'] = $request->file('imagem')->store('imagem', 'public');
        }
        $produto->update($data);
        return response()->json($produto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $produto = $this->produto->newQuery()->findOrFail($id);
        Storage::disk('public')->delete($produto->imagem);
        $produto->delete();
        return response()->json([], 204);
    }
}
