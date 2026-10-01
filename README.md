# RAG chatbot

A small, friendly chatbot built with plain HTML, CSS, and JavaScript. It runs entirely in the browser and has no dependencies or setup step.

## Run it

Open `index.html` in a browser, or serve the folder locally:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

The chatbot uses a lightweight local response engine in `script.js`. Update the `replies` list to add new topics or connect `sendMessage()` to an API for AI-generated responses.
