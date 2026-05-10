<?php

namespace App\Http\Controllers;

use App\Actions\StockMovement\GetPaginatedStockMovements;
use App\Http\Requests\StockMovement\IndexStockMovementRequest;
use Inertia\Inertia;
use Inertia\Response;

class StockMovementController extends Controller
{

    public function __construct(
        private readonly GetPaginatedStockMovements $getPaginatedStockMovements
    ) {
    }
    /**
     * Returns paginated list of stock movements
     */
    public function __invoke(IndexStockMovementRequest $request): Response
    {
        $result = $this->getPaginatedStockMovements->execute($request->filters());

        return Inertia::render('stock-movement/index', [
            'stockMovements' => $result['stockMovements'],
            'products' => $result['products'],
            'totals' => $result['totals'],
            'filters' => $result['filters'],
        ]);
    }
}
