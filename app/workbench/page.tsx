import Image from 'next/image';
// import { getServerSession } from 'next-auth/next'; // 假设您使用 next-auth 进行身份验证
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { fetchArtworks } from './rpc';
import ArtworkDisplay from './ArtworkDisplay'; // 导入新组件
import styles from './workbench.module.scss';


export default async function Workbench({ searchParams }: {
  searchParams: {
    artifactId: string;
  }
}) {
  const { artifactId } = await searchParams;
  // const session = await getServerSession(authOptions); // 获取用户的会话信息
  const session = {
    user: {email: 'abcde@123.com'}
  };
  console.log('session: ', session);

  let artworks = [];
  let userMessage = '';

  if (session?.user?.email) {
    // 根据用户的 OAuth ID 获取作品列表
    artworks = await fetchArtworks(session.user.email);
  } else {
    userMessage = "登录后，可查看历史作品"; // 提示信息
  }

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>作品列表</h2>
        {session?.user?.email ? (
          <ul>
            {artworks.map((artwork) => (
              <li key={artwork.id}>
                <Image src={artwork.imageUrl} alt={artwork.name} />
                <span>{artwork.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>{userMessage}</p> // 显示提示信息
        )}
      </aside>

      <main className={styles.main}>
        <ArtworkDisplay artifactId={artifactId} />
      </main>
    </div>
  );
}
