'use client'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react';
import Image from 'next/image';
import styles from './layout.module.scss';

const Header = () => {
  const { data: session } = useSession(); // 获取用户会话信息

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Image src="/logo.svg" alt="Logo" width={40} height={40} />
      </div>
      <div className={styles.auth}>
        {session ? (
          <>
            <span>{session?.user?.name}</span>
            <button onClick={() => signOut()}>登出</button>
          </>
        ) : (
          <button onClick={() => signIn('google')}>登录</button>
        )}
      </div>
    </header>
  );
};

const HeaderWrapper = () => {
  return <SessionProvider><Header /></SessionProvider>
}

export default HeaderWrapper
