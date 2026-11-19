from pathlib import Path

from pypdf import PdfReader
from docx import Document


def extract_text(file_path):
    path = Path(file_path)

    if not path.is_file():
        raise FileNotFoundError(path)

    extension = path.suffix.lower()

    if extension == ".txt":
        text = path.read_text(encoding="utf-8-sig")

    elif extension == ".pdf":
        reader = PdfReader(str(path))

        text = "\n\n".join(
            page.extract_text() or ""
            for page in reader.pages
        )

    elif extension == ".docx":
        document = Document(str(path))

        parts = [
            paragraph.text
            for paragraph in document.paragraphs
        ]

        # Extract table content too
        for table in document.tables:
            for row in table.rows:
                parts.append(
                    " | ".join(cell.text for cell in row.cells)
                )

        text = "\n".join(parts)

    else:
        raise ValueError("Unsupported document format")

    text = "\n".join(
        line.strip()
        for line in text.splitlines()
        if line.strip()
    )

    if not text:
        raise ValueError(
            "No extractable text found. Scanned PDFs require OCR."
        )

    return text