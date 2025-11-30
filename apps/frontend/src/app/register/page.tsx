'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema, type Register } from '@homeo/shared';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Container } from '@homeo/ui';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<Register>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      role: 'PATIENT',
    },
  });

  const onSubmit = async (data: Register) => {
    try {
      setServerError(null);
      registerUser(data, {
        onSuccess: () => {
          router.push('/dashboard');
        },
      } as any);
    } catch (err) {
      setServerError('An error occurred during registration');
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
                Create your patient management account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {(serverError || error) && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {serverError || error?.message}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    placeholder="John"
                    {...form.register('firstName')}
                    error={form.formState.errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    {...form.register('lastName')}
                    error={form.formState.errors.lastName?.message}
                  />
                </div>

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

                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  {...form.register('confirmPassword')}
                  error={form.formState.errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:underline">
                    Sign in
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
