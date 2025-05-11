'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';

interface DbStatus {
  connected: boolean;
  message: string;
  items: Array<{ id: number; text: string }>;
  timestamp: string;
}

export function DbStatus() {
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [addingItem, setAddingItem] = useState(false);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/db-status');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError((err as Error).message || 'Failed to check database status');
      console.error('Error fetching database status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAddItem = async (e: FormEvent) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    
    try {
      setAddingItem(true);
      const response = await fetch('/api/items/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newItem.trim() })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      setNewItem('');
      fetchStatus(); // Refresh the list
    } catch (err) {
      console.error('Error adding item:', err);
      setError((err as Error).message || 'Failed to add item');
    } finally {
      setAddingItem(false);
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      const response = await fetch(`/api/items/remove?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      fetchStatus(); // Refresh the list
    } catch (err) {
      console.error('Error removing item:', err);
      setError((err as Error).message || 'Failed to remove item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Checking database connection...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-1">
        <Badge variant="destructive" className="w-fit">Database Error</Badge>
        <span className="text-xs text-muted-foreground">{error}</span>
        <Button variant="outline" size="sm" className="mt-2 w-fit" onClick={fetchStatus}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {status?.connected ? (
        <>
          <Badge variant="success" className="w-fit">SQLite Connected</Badge>
          
          <form onSubmit={handleAddItem} className="flex gap-2">
            <Input 
              value={newItem} 
              onChange={(e) => setNewItem(e.target.value)} 
              placeholder="Add new item" 
              disabled={addingItem}
            />
            <Button type="submit" disabled={addingItem || !newItem.trim()}>
              {addingItem ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add'}
            </Button>
          </form>
          
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted p-2 font-medium text-sm">Items in SQLite Database</div>
            <div className="divide-y">
              {status.items.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">No items found. Add one above.</div>
              ) : (
                status.items.map(item => (
                  <div key={item.id} className="p-2 flex justify-between items-center">
                    <span>{item.text}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      ) : (
        <Badge variant="destructive" className="w-fit">SQLite Disconnected</Badge>
      )}
      <span className="text-xs text-muted-foreground">Last checked: {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : 'N/A'}</span>
    </div>
  );
}
