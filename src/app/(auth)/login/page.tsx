'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginRequestSchema, type LoginRequestInput } from '@/lib/validators/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from '@/components/forms/form';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

const LoginPage = () => {
  const form = useForm<LoginRequestInput>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: { login: '', password: '' },
  });
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginRequestInput) => {
    try {
      setError(null);
      await signIn(values);
    } catch (err) {
      setError('Não foi possível realizar o login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-100 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-3">
          <Image src="/logo.svg" alt="App Assistência" width={96} height={96} />
          <h1 className="text-2xl font-semibold text-neutral-800">Acesse sua conta</h1>
          <p className="text-sm text-neutral-500 text-center">
            Gerencie clientes, equipamentos e ordens de serviço mesmo quando estiver offline.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Login</FormLabel>
              <FormControl>
                <Input placeholder="E-mail ou usuário" {...form.register('login')} />
              </FormControl>
              <FormMessage name="login" />
            </FormItem>
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Senha" {...form.register('password')} />
              </FormControl>
              <FormMessage name="password" />
            </FormItem>
            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Entrando...' : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
