import {queryFauna} from 'quotes.ts';

async function handleRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith("/html")) {
    const html = `<html>
      <p><b>Message:</b> Hello from Deno Deploy. - Mindon</p>
      </html>`;

    return new Response(html, {
      headers: {
        // The interpretation of the body of the response by the client depends
        // on the 'content-type' header.
        // The "text/html" part implies to the client that the content is HTML
        // and the "charset=UTF-8" part implies to the client that the content
        // is encoded using UTF-8.
        "content-type": "text/html; charset=UTF-8",
      },
    });
  }

  if (pathname.startsWith("/json")) {
    // Use stringify function to convert javascript object to JSON string.
    const json = JSON.stringify({
      message: "Hello from Deno Deploy - Mindon",
    });

    return new Response(json, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });
  }
  
  if (pathname.startsWith('/quotes')) {
    const result = await getAllQuotes();
    const resp = JSON.stringify({
      quotes: result.quotes,
      error: result.error,
    });

    return new Response(resp, {
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    });    
  }

  return new Response(
    ` <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Hello Deno!</title>
  </head>
    <body
      align="center"
      style="font-family: Avenir, Helvetica, Arial, sans-serif; font-size: 1.5rem;"
    >
      <h1>Hello Deno! - Mindon</h1>
      <p>
        <a href="/html">/html</a> - responds with HTML to the request.
      </p>
      <p>
        <a href="/json">/json</a> - responds with JSON to the request.
      </p>
    </body>
</html>`,
    {
      headers: {
        "content-type": "text/html; charset=UTF-8",
      },
    },
  );
}

async function getAllQuotes() {
  const query = `
    query {
      allQuotes {
        data {
          quote
          author
        }
      }
    }
  `;

  const {
    data: {
      allQuotes: { data: quotes },
    },
    error,
  } = await queryFauna(query, {});
  if (error) {
    return { error };
  }

  return { quotes };
}


addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
