from django.db import transaction
from pgvector.django import CosineDistance

from core.models import KnowledgeChunk, KnowledgeDocument

@transaction.atomic
def store_document_chunks(title,source_type,checksum,chunks,embeddings,source_url=None,):
    if not chunks or len(chunks) != len(embeddings):
        raise ValueError("Chunks and embeddings must be non-empty and of the same length")

    document, created = KnowledgeDocument.objects.get_or_create(
        checksum=checksum,
        defaults={
            "title": title,
            "source_type": source_type,
            "source_url": source_url,
        },
    )
    if not created:
        return document
    KnowledgeChunk.objects.bulk_create([
        KnowledgeChunk(
            document=document,
            chunk_index=index,
            content=chunk,
            embedding=embedding
        )
        for index, (chunk, embedding) in enumerate(zip(chunks, embeddings))
    ])
    return document


def search_knowledge(query_embedding, top_k=5):
    if len(query_embedding) != 384:
        raise ValueError("Expected 384-dimensional embedding")

    if top_k < 1:
        raise ValueError("top_k must be positive")

    results = (
        KnowledgeChunk.objects
        .filter(document__is_active=True)
        .annotate(
            distance=CosineDistance("embedding", query_embedding)
        )
        .select_related("document")
        .order_by("distance")[:top_k]
    )

    return [
        {
            "content": item.content,
            "title": item.document.title,
            "source_url": item.document.source_url,
            "similarity": round(1 - float(item.distance), 4),
        }
        for item in results
    ]



