from transformers import AutoTokenizer


_tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")


def chunk_text(text: str, max_tokens: int = 500):
    
    tokens = _tokenizer.encode(text, add_special_tokens=False)
    chunks = []

    for i in range(0, len(tokens), max_tokens):
        sub_tokens = tokens[i:i + max_tokens]
        chunk_str = _tokenizer.decode(sub_tokens, skip_special_tokens=True)
        chunks.append({
            "text": chunk_str,
            "start_token": i,
            "end_token": i + len(sub_tokens),
            "chunk_index": len(chunks),
        })

    return chunks