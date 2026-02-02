import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export interface ShoppingListItem {
  id: string;
  text: string;
  createdAt: string;
}

const DATA_FILE = join(process.cwd(), 'data', 'shopping-list.json');

async function readShoppingList(): Promise<ShoppingListItem[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading shopping list:', error);
    return [];
  }
}

async function writeShoppingList(items: ShoppingListItem[]): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing shopping list:', error);
    throw error;
  }
}

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