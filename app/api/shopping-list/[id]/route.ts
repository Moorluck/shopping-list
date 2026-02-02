import { readShoppingList, writeShoppingList } from "@/app/services/shopping-list-service";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const items = await readShoppingList();
    const initialLength = items.length;
    const filteredItems = items.filter(item => item.id !== id);

    if (filteredItems.length === initialLength) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    await writeShoppingList(filteredItems);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item from shopping list' },
      { status: 500 }
    );
  }
}