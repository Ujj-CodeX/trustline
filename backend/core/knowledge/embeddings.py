from core.intent_classifier import get_model
def embed_chunks(chunks):
    if not chunks:
        return []
    if not all(isinstance(chunk,str)and chunk.strip() for chunk in chunks):
        raise ValueError("Every chunk must be a non-empty string")
    model = get_model()
    max_tokens = model.max_seq_length

    for index, chunk in enumerate(chunks):
        tokens = model.tokenizer(
            chunk,
            add_special_tokens=True,
            truncation=False,

        )["input_ids"]

        if len(tokens) > max_tokens:
            raise ValueError(
                f"Chunk {index} has {len(tokens)} tokens; maximum is {max_tokens}"
            )

    embeddings = model.encode(chunks, 
        convert_to_numpy=True,
        show_progress_bar=False,

        )

    return embeddings.tolist()
