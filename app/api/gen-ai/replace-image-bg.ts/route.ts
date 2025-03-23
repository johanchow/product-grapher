import { NextRequest } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: NextRequest) {
  const {} = request;
  const output = await replicate.run(
    "wolverinn/realistic-background:1fbd2b79f5cc40346dece1f1bba461c4239e012497b479ade7a493979b493ca4",
    {
      input: {
        seed: -1,
        image,
        steps: 25,
        prompt,
        cfg_scale: 7,
        max_width: size.width,
        scheduler: "Karras",
        max_height: size.height,
        batch_count: 1,
        sampler_name: "DPM++ 2M SDE",
        negative_prompt: "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime, mutated hands and fingers:1.4), (deformed, distorted, disfigured:1.3), poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, amputation",
        denoising_strength: 0.75,
        only_masked_padding_pixels: 4
      }
    }
  );

  return Response.json({
    code: 0,
    message: 'success',
    data: {
      imageUrl,
    },
  });
};
