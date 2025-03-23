export const getReplicateResult = async (stream: ReadableStream) => {
  const chunks = [];

  // 读取流数据
  for await (const chunk of stream) {
    // 确保 chunk 是 Buffer 或 Uint8Array 类型
    if (chunk instanceof Buffer || chunk instanceof Uint8Array) {
      chunks.push(chunk);
    } else {
      // 如果是其他类型（比如 FileOutput），尝试转换为 Buffer
      chunks.push(Buffer.from(chunk));
    }
  }

  // 合并所有 chunks 并转换为字符串
  const result = Buffer.concat(chunks).toString('utf8');
  console.log('原始结果:', result);

  // 尝试解析为 JSON
  const jsonResult = JSON.parse(result);
  console.log('解析后的结果:', jsonResult);

  // 返回生成的内容（根据 API 返回结构调整）
  return jsonResult.output || jsonResult;
}
