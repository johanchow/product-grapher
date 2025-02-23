import { getSession } from 'next-auth/react'; // 假设您使用 next-auth 进行身份验证
import { PrismaClient } from '@prisma/client'; // 导入 Prisma Client
import styles from './workbench.module.scss';

const prisma = new PrismaClient(); // 创建 Prisma Client 实例

export default async function Workbench({ searchParams }: {
  searchParams: {
    artifactId: string;
  }
}) {
  const { artifactId } = await searchParams;
  // const session = await getSession(); // 获取用户的会话信息
  const session = {
    user: {
      id: '12345@abc.com'
    }
  };

  // 根据用户的 OAuth ID 获取作品列表
  const artworks = await fetchArtworks(session?.user?.id as string); // 假设用户的 ID 存储在 session.user.id 中

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>作品列表</h2>
        <ul>
          {artworks.map((artwork) => (
            <li key={artwork.id}>
              <img src={artwork.imageUrl} alt={artwork.title} />
              <span>{artwork.title}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        {artifactId ? (
          <div>
            <h1>作品内容</h1>
            <p>这里是作品 ID 为 {artifactId} 的详细内容。</p>
            {/* 在这里展示作品的详细信息 */}
          </div>
        ) : (
          <button className={styles.uploadButton}>上传图片</button>
        )}
      </main>
    </div>
  );
}

// 根据用户的 OAuth ID 获取作品
async function fetchArtworks(userId: string): Promise<any[]> {
  const artworks = await prisma.artifact.findMany({
    where: {
      userId: userId, // 根据用户的 OAuth ID 查询作品
    },
  });
  return artworks;
}
