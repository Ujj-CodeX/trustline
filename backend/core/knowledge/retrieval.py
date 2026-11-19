from .embeddings import embed_chunks
from .storage import search_knowledge

def retrieve_knowledge(query_text, top_k=3):
    if not isinstance(query_text, str) or not query_text.strip():
        return[]
    query_embedding = embed_chunks([query_text])[0]
    return search_knowledge(query_embedding, top_k=top_k)

def build_knowledge_context(results,max_chars=5000):
    if not results:
        return ""

    context_blocks = []
    total_chars = 0

    for index, result in enumerate(results, start=1):
        block = (
            f"Source {index}: {result['title']}\n"
            f"Reference: {result.get('source_url') or 'Not provided'}\n"
            f"Content: {result['content']}"
        )

        remaining = max_chars - total_chars

        if remaining <= 0:
            break

        block = block[:remaining]
        context_blocks.append(block)
        total_chars += len(block)

    return "\n\n".join(context_blocks)