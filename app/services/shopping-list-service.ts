import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export interface ShoppingListItem {
  id: string;
  text: string;
  createdAt: string;
}

export const DATA_FILE = join(process.cwd(), 'data', 'shopping-list.json');

export async function readShoppingList(): Promise<ShoppingListItem[]> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading shopping list:', error);
    return [];
  }
}

export async function writeShoppingList(items: ShoppingListItem[]): Promise<void> {
  try {
    await writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing shopping list:', error);
    throw error;
  }
}