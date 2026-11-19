from core.intent_classifier import get_model


def chunk_text(text, chunk_size=100, overlap=20):
    if not text or not text.strip():
        return []

    if chunk_size <= 0 or overlap < 0 or overlap >= chunk_size:
        raise ValueError("Invalid chunk size or overlap")

    model = get_model()
    tokenizer = model.tokenizer

    special_tokens = tokenizer.num_special_tokens_to_add(pair=False)
    max_content_tokens = model.max_seq_length - special_tokens
    token_budget = min(chunk_size, max_content_tokens)

    if token_budget <= 0:
        raise ValueError("Invalid model token limit")

    words = text.split()
    chunks = []
    current = []

    def count_tokens(value):
        return len(
            tokenizer(
                value,
                add_special_tokens=False,
                truncation=False
            )["input_ids"]
        )

    index = 0

    while index < len(words):
        candidate = " ".join(current + [words[index]])

        if count_tokens(candidate) <= token_budget:
            current.append(words[index])
            index += 1
            continue

        if current:
            chunks.append(" ".join(current))

            # Preserve a token-based overlap from the previous chunk.
            suffix = []
            for word in reversed(current):
                proposed = [word] + suffix
                if count_tokens(" ".join(proposed)) > overlap:
                    break
                suffix = proposed

            current = list(reversed(suffix))
            continue

        # Handle an unusually long individual word safely.
        token_ids = tokenizer(
            words[index],
            add_special_tokens=False,
            truncation=False
        )["input_ids"]

        for start in range(0, len(token_ids), token_budget):
            piece = tokenizer.decode(
                token_ids[start:start + token_budget],
                skip_special_tokens=True
            ).strip()

            if piece:
                chunks.append(piece)

        index += 1

    if current:
        chunks.append(" ".join(current))

    return chunks
