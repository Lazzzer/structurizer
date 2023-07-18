'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Icons } from './icons';

export function Redirect() {
  const router = useRouter();
  
  async function asyncSignOut() {
    await signOut();
  }

  useEffect(() => {
    asyncSignOut();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  return <div className='w-screen h-screen flex justify-center items-center'>
    <div className='text-2xl font-bold flex items-center gap-2 text-slate-900'>
      <h1>Redirecting </h1>
      <Icons.spinner width={24} height={24} strokeWidth={3} className='animate-spin' />
      </div>
  </div>;
}