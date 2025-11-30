'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Container, Card, CardContent, CardHeader, CardTitle } from '@homeo/ui';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600">{user.role}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{user.email}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-green-600">Active</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a
                href="/patients"
                className="p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="font-semibold">Patients</div>
                <div className="text-sm text-gray-600">Manage patients</div>
              </a>
              <a
                href="/appointments"
                className="p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="font-semibold">Appointments</div>
                <div className="text-sm text-gray-600">Schedule & view</div>
              </a>
              <a
                href="/consultations"
                className="p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="font-semibold">Consultations</div>
                <div className="text-sm text-gray-600">Medical records</div>
              </a>
              <a
                href="/profile"
                className="p-4 border rounded-lg hover:bg-gray-100 transition"
              >
                <div className="font-semibold">Profile</div>
                <div className="text-sm text-gray-600">Account settings</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
