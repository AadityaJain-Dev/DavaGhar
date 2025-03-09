export default {
  async fetch(request, env) {
    const url = new URL(request.url);    

    if (url.pathname.startsWith("/api/")) {
      await env.KV.put("KEY2", "VALUE2");
      const value = await env.KV.get("KEY2");
      console.log(value);
      return Response.json({
        name: "Cloudflare",
        v: value
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
