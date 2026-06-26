"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      router.push('/');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black p-4">
      {/* <h1 className="mb-6 text-3xl font-bold">Drink Order Tracker</h1>
      <p className="mb-4 text-lg text-center">Record shop drink orders quickly.</p> */}

      <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Order Management Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 text-base"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="min-h-14 w-full text-base font-bold">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
