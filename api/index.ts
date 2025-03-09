export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {


      // await env.KV.put("KEY2", "VALUE2");
      // const value = await env.KV.get("KEY2");
      // console.log(value);


      // return Response.json({
      //   name: "Cloudflare",
      //   v: value
      // });



      // Example: Query all companies
      // const { results } = await env.DB.prepare(
      //   "SELECT * FROM companies ORDER BY company_name"
      // ).all();

      const results = await searchByCompany(env.DB, 'Dr. Reddy\'s');


      return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
      });
    }



    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;


async function searchByCompany(db: D1Database, companyName: string) {
  // Update search count for the company
  await db.prepare(
    "UPDATE companies SET search_count = search_count + 1 WHERE company_name LIKE ?"
  ).bind(`%${companyName}%`).run();
  
  // Find suppliers for the company
  const { results } = await db.prepare(`
    SELECT s.* 
    FROM suppliers s
    JOIN supplier_companies sc ON s.supplier_id = sc.supplier_id
    JOIN companies c ON sc.company_id = c.company_id
    WHERE c.company_name LIKE ?
  `).bind(`%${companyName}%`).all();
  
  return results;
}