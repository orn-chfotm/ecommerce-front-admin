// PreToolUse guard: .ai-prompts 는 .claude 문서를 만들 때 참고하는 starter submodule 이다.
// 프로젝트 산출물을 그 안에 쓰지 않도록 차단한다.
import { relative, resolve, sep } from "node:path";

const chunks = [];
for await (const c of process.stdin) chunks.push(c);

let input;
try {
  input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
} catch {
  process.exit(0);
}

const target = input?.tool_input?.file_path ?? input?.tool_input?.notebook_path;
if (!target) process.exit(0);

const root = input?.cwd ?? process.cwd();
const rel = relative(resolve(root, ".ai-prompts"), resolve(root, target));

if (rel && !rel.startsWith("..") && !rel.startsWith(sep) && rel !== "") {
  process.stderr.write(
    ".ai-prompts/ 는 읽기 전용 starter submodule 입니다. " +
      "프로젝트 규칙은 .claude/ 아래에, 리뷰 로그는 .ai/reviews/ 아래에 작성하세요.\n"
  );
  process.exit(2);
}

process.exit(0);
