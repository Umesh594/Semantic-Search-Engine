import requests
from bs4 import BeautifulSoup
import re

def format_sentences(text: str) -> str:
    
    text = re.sub(r"\s+", " ", text).strip()
   
    text = re.sub(r"([.!?])\s+", r"\1\n", text)
    return text

def fetch_and_clean_html(url: str) -> str:
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers, timeout=15)
    response.raise_for_status()

    if len(response.content) > 5_000_000:
        raise ValueError("Fetched content is too large to process (over 5MB).")

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "noscript", "iframe"]):
        tag.decompose()

    raw_text = soup.get_text(separator=" ")

   
    cleaned_text = format_sentences(raw_text)
    print(cleaned_text[:500])
    return cleaned_text