import { PrismaClient } from '@prisma/client'; // 导入 Prisma Client

const prisma = new PrismaClient(); // 创建 Prisma Client 实例

// 根据用户的 OAuth ID 获取作品
async function fetchArtworks(userId: string): Promise<any[]> {
  const artworks = await prisma.artifact.findMany({
    where: {
      userId: userId, // 根据用户的 OAuth ID 查询作品
    },
  });
  return artworks;
}

export {
  fetchArtworks,
};
