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