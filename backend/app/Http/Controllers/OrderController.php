<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with('items')->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = Order::with('items')->find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $calculatedTotal = 0;
        $orderItemsData = [];

        foreach ($validated['items'] as $itemData) {
            $product = Product::find($itemData['product_id']);
            if (!$product) {
                return response()->json(['message' => "Product ID {$itemData['product_id']} not found"], 400);
            }

            $itemPrice = $product->price;
            $subtotal = $itemPrice * $itemData['quantity'];
            $calculatedTotal += $subtotal;

            $orderItemsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'price' => $itemPrice,
                'quantity' => $itemData['quantity'],
                'image_url' => $product->image_url,
            ];

            // Decrement product stock
            if ($product->stock >= $itemData['quantity']) {
                $product->decrement('stock', $itemData['quantity']);
            }
        }

        $orderNumber = 'AUR-' . strtoupper(Str::random(4)) . '-' . rand(1000, 9999);

        $order = Order::create([
            'order_number' => $orderNumber,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'total_amount' => $calculatedTotal,
            'status' => 'Pending',
        ]);

        foreach ($orderItemsData as $item) {
            $order->items()->create($item);
        }

        return response()->json($order->load('items'), 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Processing,Shipped,Delivered,Cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json($order->load('items'));
    }
}
