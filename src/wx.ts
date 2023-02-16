import http from "http";
import crypto from "crypto";
import { ChatMessage } from "chatgpt";
import parser from "xml2json";

const TOKEN = "jealh";

function verifyIsFromWx(timestamp: string, nonce: string, signature: string) {
  const hash = crypto.createHash("sha1");
  const _signature = new Array(TOKEN, timestamp, nonce)
    .sort((a, b) => {
      if (String(a) < String(b)) {
        return -1;
      } else {
        return 1;
      }
    })
    .join("");
  hash.update(_signature);
  const result = hash.digest("hex").toString();
  return result === signature;
}

const server = http.createServer((request, response) => {
  const url = new URL(`http://${request.headers.host}${request.url}`);
  const params = url.searchParams;
  const p: Record<string, string> = {};
  params.forEach((v, k) => {
    p[k] = v;
  });
  response.setHeader("content-type", "text/plain;charset=utf8");
  // 消息来源于微信的验证接口
  if (request?.method?.toLowerCase() === "get") {
    const valid = verifyIsFromWx(p?.timestamp, p?.nonce, p?.signature);
    if (valid) {
      response.end(p?.echostr);
    } else {
      const answer = askForAnswer("随机说一首古诗！");
      answer.then((gptResult) => {
        response.end(gptResult);
      });
    }
  } else {
    let data = "";
    request
      .on("data", (thunk) => {
        data += thunk.toString();
      })
      .on("end", async () => {
        const userMessage = JSON.parse(parser.toJson(data));
        const answer = await askForAnswer(userMessage.xml.Content);
        const serverMessage = `
      <xml>
        <ToUserName><![CDATA[${userMessage.xml.FromUserName}]]></ToUserName>
        <FromUserName><![CDATA[${userMessage.xml.ToUserName}]]></FromUserName>
        <CreateTime>${+new Date()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${String(answer)}]]></Content>
      </xml>
      `;
        response.end(serverMessage);
      });
  }
});

server.listen(4090, () => {
  console.log("server listen on port: 4090");
});

async function askForAnswer(question: string): Promise<string> {
  const { ChatGPTAPI } = await import("chatgpt");

  process.env[
    "OPENAI_API_KEY"
  ] = `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`;
  const api = new ChatGPTAPI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const res = await retry(() => api.sendMessage(`${question}`), 3);
    return res.text;
  } catch (error) {
    console.log(error);
    return String(error);
  }
}

async function retry(
  fn: () => Promise<ChatMessage>,
  limit: number
): Promise<ChatMessage> {
  try {
    return await fn();
  } catch (error) {
    if (limit > 0) {
      console.log(`Failed retry!! less retry times ${limit}`);
      return retry(fn, limit - 1);
    }
    throw error;
  }
}
