async function test() {
  const res = await fetch("http://localhost:3001/work/rebrand-dwi-muria");
  const text = await res.text();

  console.log("--- WORK PAGE SEO ---");
  console.log("Title:", text.match(/<title(?: [^>]+)?>(.*?)<\/title>/i)?.[1]);
  console.log(
    "OG Title:",
    text.match(/<meta property="og:title" content="([^"]+)"/i)?.[1],
  );
  console.log(
    "OG Image:",
    text.match(/<meta property="og:image" content="([^"]+)"/i)?.[1],
  );
  console.log(
    "Twitter Card:",
    text.match(/<meta name="twitter:card" content="([^"]+)"/i)?.[1],
  );

  const ldJsonMatch = text.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  if (ldJsonMatch) {
    try {
      const parsed = JSON.parse(ldJsonMatch[1].replace(/&quot;/g, '"'));
      console.log("JSON-LD parsed successfully:", parsed["@type"], parsed.name);
    } catch (e) {
      console.log("JSON-LD string:", ldJsonMatch[1]);
    }
  } else {
    console.log("JSON-LD not found");
  }

  const res2 = await fetch("http://localhost:3001/journal/hello-world");
  const text2 = await res2.text();

  console.log("\n--- JOURNAL PAGE SEO ---");
  console.log("Title:", text2.match(/<title(?: [^>]+)?>(.*?)<\/title>/i)?.[1]);
  console.log(
    "OG Title:",
    text2.match(/<meta property="og:title" content="([^"]+)"/i)?.[1],
  );
  console.log(
    "OG Type:",
    text2.match(/<meta property="og:type" content="([^"]+)"/i)?.[1],
  );

  const ldJsonMatch2 = text2.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  if (ldJsonMatch2) {
    try {
      const parsed2 = JSON.parse(ldJsonMatch2[1].replace(/&quot;/g, '"'));
      console.log(
        "JSON-LD parsed successfully:",
        parsed2["@type"],
        parsed2.headline,
      );
    } catch (e) {
      console.log("JSON-LD string:", ldJsonMatch2[1]);
    }
  } else {
    console.log("JSON-LD not found");
  }
}
test();
