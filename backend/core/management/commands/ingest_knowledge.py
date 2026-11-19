import hashlib
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from core.models import KnowledgeDocument
from core.knowledge.extractors import extract_text
from core.knowledge.chunking import chunk_text
from core.knowledge.embeddings import embed_chunks
from core.knowledge.storage import store_document_chunks


class Command(BaseCommand):
    help = "Ingest an official knowledge document into TrustLine"

    def add_arguments(self, parser):
        parser.add_argument("file_path")
        parser.add_argument("--title", default=None)
        parser.add_argument("--source-url", default=None)

    def handle(self, *args, **options):
        path = Path(options["file_path"])

        if not path.is_file():
            raise CommandError("Document file not found")

        extension = path.suffix.lower()

        if extension not in {".pdf", ".docx", ".txt"}:
            raise CommandError("Unsupported document format")

        checksum = hashlib.sha256(path.read_bytes()).hexdigest()

        if KnowledgeDocument.objects.filter(checksum=checksum).exists():
            self.stdout.write("Document already ingested.")
            return

        self.stdout.write("Extracting text...")
        text = extract_text(path)

        self.stdout.write("Generating chunks...")
        chunks = chunk_text(text)

        self.stdout.write("Generating embeddings...")
        embeddings = embed_chunks(chunks)

        self.stdout.write("Storing document...")
        document = store_document_chunks(
            title=options["title"] or path.stem,
            source_type=extension.lstrip("."),
            checksum=checksum,
            chunks=chunks,
            embeddings=embeddings,
            source_url=options["source_url"],
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully ingested: {document.title} "
                f"({len(chunks)} chunks)"
            )
        )