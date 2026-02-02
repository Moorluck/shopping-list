import { readShoppingList, ShoppingListItem, writeShoppingList } from "@/app/services/shopping-list-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const items = await readShoppingList();
    return NextResponse.json(items);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shopping list' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string' || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const items = await readShoppingList();
    const newItem: ShoppingListItem = {
      id: Date.now().toString(),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    items.push(newItem);
    await writeShoppingList(items);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Failed to add item to shopping list' },
      { status: 500 }
    );
  }
}