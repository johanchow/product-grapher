import { NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
export const textToImage = async (prompt: string, size: {width: number; height: number}): Promise<string> => {
  // width、height muse larger than 256
  let width, height;
  const aspectRatio = size.width / size.height;
  if (size.width < 256 || size.height < 256) {
    if (size.width < size.height) {
      width = 256;
      height = Math.round(256 / aspectRatio);
    } else {
      height = 256;
      width = Math.round(256 * aspectRatio);
    }
  } else {
    width = size.width;
    height = size.height;
  }
  // width、height must be 8 times
  width = Math.ceil(width / 8) * 8;
  height = Math.ceil(height / 8) * 8;
  const output: string[] = await replicate.run(
    "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
    {
      input: {
        width,
        height,
        prompt,
        scheduler: "K_EULER",
        num_outputs: 1,
        guidance_scale: 0,
        negative_prompt: "worst quality, low quality",
        num_inference_steps: 4
      }
    }
  );

  // 获取 Replicate 生成的图片 URL（假设是数组）
  const imageUrl = output[0];

  // 下载图片数据
  const response = await fetch(imageUrl);
  const imageBuffer = await response.buffer();

  return imageBuffer;

  // // 将图片数据转换为 Base64 编码
  // const images = output.map((item) => {
  //   // 假设 item 是 Buffer 或 Uint8Array
  //   const base64Data = Buffer.from(item).toString('base64');
  //   return `data:image/png;base64,${base64Data}`;
  //   // return {
  //   //   index,
  //   //   data: `data:image/png;base64,${base64Data}`, // 前端可直接使用的 Base64 URL
  //   // };
  // });

  // console.log('images: ', images);

  // return images[0];
};

export async function POST(request: NextRequest) {
  const { prompt, width, height } = await request.json();
  if (!prompt || !width || !height) {
    return Response.json({
      code: 400,
      message: 'miss param',
    });
  }
  const imageUrl = await textToImage(prompt, {
    width,
    height,
  });
  return Response.json({
    code: 0,
    message: 'success',
    data: {
      imageUrl,
    },
  });
};
