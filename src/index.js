// src/index.js — /submit だけを処理し、それ以外は静的アセット（public/）に任せる
function html(body, status = 200) {
  return new Response(
    `<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>お問い合わせ</title></head>
<body style="font-family:sans-serif;max-width:480px;margin:2rem auto;padding:0 1rem">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/submit" && request.method === "POST") {
      const data = await request.formData();
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message || name.length > 100 || message.length > 2000) {
        return html('<p>入力内容に不備があります。</p><a href="/">戻る</a>', 400);
      }

      // 最小構成：ログ出力のみ（ダッシュボードの Logs で確認）
      console.log("新しいお問い合わせ", { name, email, message });

      return html(`<p>${escapeHtml(name)} 様、お問い合わせありがとうございました。</p><a href="/">戻る</a>`);
    }

    // それ以外は静的ファイルへ
    return env.ASSETS.fetch(request);
  },
};