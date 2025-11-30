'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema, type Login } from '@homeo/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Container } from '@homeo/ui';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: Login) => {
    try {
      setServerError(null);
      login(data, {
        onSuccess: () => {
          router.push('/dashboard');
        },
      } as any);
    } catch (err) {
      setServerError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <Container>
        <div className="max-w-md w-full">
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-bold">Homeo</CardTitle>
              <CardDescription>
                Sign in to your patient management account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {(serverError || error) && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {serverError || error?.message}
                  </div>
                )}

                <Input
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  {...form.register('email')}
                  error={form.formState.errors.email?.message}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  {...form.register('password')}
                  error={form.formState.errors.password?.message}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:underline">
                    Create one
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
