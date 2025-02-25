import { getServerSession } from 'next-auth/next'; // 假设您使用 next-auth 进行身份验证
import Image from 'next/image';
import { authOptions } from "@/app/api/auth/[...nextauth]";
import { PrismaClient } from '@prisma/client'; // 导入 Prisma Client
import styles from './workbench.module.scss';

const prisma = new PrismaClient(); // 创建 Prisma Client 实例

export default async function Workbench({ searchParams }: {
  searchParams: {
    artifactId: string;
  }
}) {
  const { artifactId } = await searchParams;
  const session = await getServerSession(authOptions); // 获取用户的会话信息

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
