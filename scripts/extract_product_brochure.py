#!/usr/bin/env python3
"""Extract selectable page text, vector rules, and original image assets from a brochure PDF."""

from __future__ import annotations

import argparse
import hashlib
import json
import unicodedata
from collections import Counter
from pathlib import Path
from typing import Any

import pdfplumber
from PIL import Image, ImageDraw, ImageFilter
from pypdf import PdfReader

PAGE_WIDTH = 612.283
PAGE_HEIGHT = 858.898
CJK_RADICAL_REPLACEMENTS = str.maketrans(
    {
        "⽚": "片",
        "⼒": "力",
        "⽐": "比",
        "⽅": "方",
        "⼨": "寸",
        "⾸": "首",
        "⽛": "牙",
        "⾃": "自",
        "⼯": "工",
        "⼝": "口",
    }
)

ASSET_NAMES: dict[tuple[int, int], tuple[str, str, bool]] = {
    (2, 0): ("logos/brand-symbol.png", "ZeroLab symbol", False),
    (2, 1): ("logos/brand-wordmark.png", "ZeroLab wordmark", False),
    (2, 2): ("products/zl9nsq-size-comparison.webp", "ZL9NSQ size comparison", True),
    (2, 3): ("products/zl9nsq-chip-on-fingertip.webp", "ZL9NSQ chip on fingertip", False),
    (3, 0): ("scenarios/motion-capture.webp", "Motion data collection", False),
    (3, 1): ("scenarios/virtual-reality.webp", "Virtual reality interaction", False),
    (3, 2): ("scenarios/machine-perception.webp", "Machine perception", False),
    (3, 3): ("scenarios/remote-tracking.webp", "Remote tracking", False),
    (6, 2): ("products/f1-full-body-suit.webp", "F1 full-body suit", True),
    (6, 3): ("products/f1-strap-sensor.webp", "F1 strap sensor", True),
    (6, 4): ("products/f1-tracker-unit.webp", "F1 tracker unit", True),
    (8, 2): ("products/h1-data-gloves.webp", "H1 data gloves", True),
    (10, 2): ("products/f2-tracker-case.webp", "F2 tracker case", True),
    (10, 3): ("products/f2-data-gloves.webp", "F2 data gloves", True),
    (10, 4): ("products/f2-tracker-unit.webp", "F2 tracker unit", True),
    (11, 0): ("logos/ros.png", "ROS logo", False),
    (11, 1): ("logos/windows.png", "Windows 11 logo", False),
    (11, 2): ("logos/ubuntu.png", "Ubuntu logo", False),
    (11, 3): ("logos/unreal-engine.png", "Unreal Engine logo", False),
    (11, 4): ("logos/unity.png", "Unity logo", False),
    (12, 2): ("products/f2-pro-plus-gloves.webp", "F2 Pro+ data gloves", True),
    (12, 3): ("products/f2-pro-plus-tracker-case.webp", "F2 Pro+ tracker case", True),
    (12, 4): ("products/f2-pro-plus-tracker.webp", "F2 Pro+ tracker", True),
    (14, 2): ("products/h2-dexterous-data-gloves.webp", "H2 dexterous hand data gloves", True),
    (15, 0): ("logos/ros.png", "ROS logo", False),
    (15, 1): ("logos/unity.png", "Unity logo", False),
    (15, 2): ("logos/engineai.png", "EngineAI logo", False),
    (15, 3): ("logos/oymotion.png", "OYMotion logo", False),
    (16, 2): ("products/h2-pro-data-gloves.webp", "H2 Pro data gloves", True),
    (18, 2): ("products/h2-pro-plus-data-gloves.webp", "H2 Pro+ data gloves", True),
    (21, 0): ("products/openarm-hands.webp", "OpenArm hands", True),
    (21, 1): ("products/openarm-z-robot.webp", "OpenArm-Z robot", True),
    (21, 2): ("scenarios/robot-operation.webp", "Robot operation", False),
    (21, 3): ("scenarios/robot-data-collection.webp", "Robot data collection", False),
    (21, 4): ("scenarios/physical-ai-training.webp", "Physical AI training", False),
    (21, 5): ("scenarios/contact-task-validation.webp", "Complex contact task validation", False),
    (22, 2): ("scenarios/openarm-zm-page-edge.webp", "OpenArm-Zm scenario image edge", False),
    (23, 0): ("products/openarm-zm-scenario.webp", "OpenArm-Zm scenario", False),
    (23, 1): ("scenarios/industrial-maintenance.webp", "Industrial equipment maintenance", False),
    (23, 2): ("scenarios/research-data-collection.webp", "Research data collection", False),
    (25, 0): ("scenarios/smart-retail.webp", "Smart retail", False),
    (25, 1): ("scenarios/intelligent-warehousing.webp", "Intelligent warehousing", False),
    (26, 2): ("scenarios/humanoid-data-platform.webp", "Humanoid robot data platform", False),
    (27, 1): ("logos/partner-engineai.png", "EngineAI logo", False),
    (27, 2): ("logos/partner-asd.png", "ASD logo", False),
    (27, 3): ("logos/partner-fourier.png", "Fourier Intelligence logo", False),
    (27, 4): ("logos/partner-matrix.png", "Matrix logo", False),
    (27, 5): ("logos/partner-unitree.png", "Unitree logo", False),
    (27, 6): ("logos/partner-pndbotics.png", "PNDbotics logo", False),
    (27, 7): ("logos/partner-zhejiang-humanoid-center.png", "Zhejiang Humanoid Robot Innovation Center logo", False),
}

HIGH_RES_MATCHES = {
    (14, 2): {
        "source_file": "exec-72001abc-f75a-41d3-acc3-e91b83012702.png",
        "source_name": "source-h2-dexterous-data-gloves.png",
        "sha256": "13679985ffb52ac09dd3f91d620eb79dbf62cee51f2caae345681f3276ac47f1",
        "destination": "products/h2-dexterous-data-gloves.png",
    },
    (18, 2): {
        "source_file": "exec-470e82eb-63a2-4565-9e03-2d913c4583b7.png",
        "source_name": "source-h2-pro-plus-data-gloves.png",
        "sha256": "a92eae78a8cc5a58dfb336d8f42e29b8d707602c980732496e38e085f0af2c01",
        "destination": "products/h2-pro-plus-data-gloves.png",
    },
}

THEME_TOKENS = {
    "page": "#07090c",
    "text": "#F2F2F2",
    "muted": "#B3B3B3",
    "rule": "#747474",
    "table": "#242424",
}


def color_channels(value: Any) -> tuple[float, ...] | None:
    if not isinstance(value, (tuple, list)) or not value:
        return None
    try:
        return tuple(float(channel) for channel in value)
    except (TypeError, ValueError):
        return None


def rgb_color(value: Any) -> str | None:
    channels = color_channels(value)
    if channels is None or len(channels) < 3:
        return None
    red, green, blue = channels[:3]
    if max(red, green, blue) <= 1:
        red, green, blue = red * 255, green * 255, blue * 255
    return f"#{round(red):02x}{round(green):02x}{round(blue):02x}"


def is_brand_accent(value: Any) -> bool:
    channels = color_channels(value)
    if channels is None or len(channels) < 3:
        return False
    red, green, blue = channels[:3]
    return green > red * 1.12 and green > blue * 0.92


def compact_color(value: Any, *, fill: bool = False) -> str:
    channels = color_channels(value)
    if channels is None:
        return "#242424" if fill else "#747474"
    if len(channels) >= 3:
        if is_brand_accent(channels):
            return "#242424" if fill else "#747474"
        red, green, blue = channels[:3]
        if max(red, green, blue) <= 1:
            red, green, blue = red * 255, green * 255, blue * 255
        luminance = (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
    else:
        luminance = channels[0] * 255 if channels[0] <= 1 else channels[0]
    if fill:
        return "#080808" if luminance > 245 else "#242424"
    return "#747474"


def group_character_lines(
    chars: list[dict[str, Any]], page_height: float = PAGE_HEIGHT
) -> list[dict[str, Any]]:
    rows: dict[float, list[dict[str, Any]]] = {}
    for char in chars:
        top = round(float(char["top"]) * 2) / 2
        rows.setdefault(top, []).append(char)

    lines: list[dict[str, Any]] = []
    for top, row_chars in sorted(rows.items()):
        row_chars.sort(key=lambda char: (char["x0"], char["x1"]))
        chunks: list[list[dict[str, Any]]] = []
        current: list[dict[str, Any]] = []
        last_right: float | None = None
        for char in row_chars:
            text = str(char.get("text") or "")
            if not text:
                continue
            if last_right is not None and char["x0"] - last_right > 20:
                if current:
                    chunks.append(current)
                current = []
            current.append(char)
            last_right = max(float(char["x1"]), last_right or 0)
        if current:
            chunks.append(current)

        for chunk in chunks:
            text = "".join(char["text"] for char in chunk).strip()
            if not text:
                continue
            fonts = Counter(str(char.get("fontname", "")) for char in chunk)
            colors = Counter(
                str(char.get("non_stroking_color")) for char in chunk
            )
            font = fonts.most_common(1)[0][0]
            color_value = chunk[0].get("non_stroking_color")
            for char in chunk:
                if str(char.get("non_stroking_color")) == colors.most_common(1)[0][0]:
                    color_value = char.get("non_stroking_color")
                    break
            size = sum(float(char.get("size", 0)) for char in chunk) / len(chunk)
            run_chunks: list[list[dict[str, Any]]] = []
            for char in chunk:
                key = (char["fontname"], round(float(char["size"]), 2), round(float(char["matrix"][5]), 3))
                previous = run_chunks[-1][-1] if run_chunks else None
                previous_key = (
                    previous["fontname"], round(float(previous["size"]), 2), round(float(previous["matrix"][5]), 3)
                ) if previous else None
                if key != previous_key:
                    run_chunks.append([])
                run_chunks[-1].append(char)
            runs = []
            if len(run_chunks) > 1:
                for index, run in enumerate(run_chunks):
                    run_text = "".join(char["text"] for char in run)
                    if index == 0:
                        run_text = run_text.lstrip()
                    if index == len(run_chunks) - 1:
                        run_text = run_text.rstrip()
                    run_font = str(run[0]["fontname"])
                    runs.append({
                        "text": unicodedata.normalize("NFKC", run_text).translate(CJK_RADICAL_REPLACEMENTS),
                        "x": round(min(float(char["x0"]) for char in run), 3),
                        "w": round(max(float(char["x1"]) for char in run) - min(float(char["x0"]) for char in run), 3),
                        "baseline": round(page_height - float(run[0]["matrix"][5]), 3),
                        "size": round(float(run[0]["size"]), 2),
                        "font": run_font,
                        "bold": "bold" in run_font.casefold() or "medium" in run_font.casefold(),
                    })
            lines.append(
                {
                    "x": round(min(float(char["x0"]) for char in chunk), 3),
                    "y": round(top, 3),
                    "baseline": round(
                        page_height - sum(float(char["matrix"][5]) for char in chunk) / len(chunk),
                        3,
                    ),
                    "w": round(max(float(char["x1"]) for char in chunk) - min(float(char["x0"]) for char in chunk), 3),
                    "h": round(max(float(char["bottom"]) for char in chunk) - min(float(char["top"]) for char in chunk), 3),
                    "size": round(size, 2),
                    "font": font,
                    "bold": "bold" in font.casefold() or "medium" in font.casefold(),
                    "accent": is_brand_accent(color_value),
                    "text": unicodedata.normalize("NFKC", text).translate(
                        CJK_RADICAL_REPLACEMENTS
                    ),
                    "runs": runs,
                }
            )
    return sorted(lines, key=lambda line: (line["y"], line["x"]))


def refresh_layout(source: Path, data_path: Path) -> None:
    """Refresh geometry without rewriting approved copy or image assets."""
    payload = json.loads(data_path.read_text())
    fingerprint = hashlib.sha256(source.read_bytes()).hexdigest()
    if fingerprint != payload["source"]["sha256"]:
        raise ValueError("The reference PDF fingerprint has changed")
    with pdfplumber.open(source) as document:
        for page in payload["pages"]:
            reference = document.pages[page["sourcePage"] - 1]
            extracted = group_character_lines(reference.chars, float(reference.height))
            if [line["text"] for line in extracted] != [line["text"] for line in page["lines"]]:
                raise ValueError(f"Copy mismatch on source page {page['sourcePage']}")
            for line, updated in zip(page["lines"], extracted, strict=True):
                line["baseline"] = updated["baseline"]
                line["runs"] = updated["runs"]
            rules = [item for item in page["decorations"] if item["type"] == "line"]
            for rule, reference_rule in zip(rules, reference.lines, strict=True):
                rule["dash"] = (reference_rule.get("dash") or ([], 0))[0]
    data_path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n")


def image_bytes(image: Any) -> bytes:
    data = image.data
    if image.name.casefold().endswith(".png") and not data.startswith(b"\x89PNG"):
        import io

        stream = io.BytesIO()
        image.image.save(stream, format="PNG", optimize=True)
        return stream.getvalue()
    return data


def image_extension(image: Any, data: bytes) -> str:
    if data.startswith(b"\xff\xd8\xff"):
        return ".jpg"
    if data.startswith(b"\x89PNG"):
        return ".png"
    if data.startswith(b"\x00\x00\x00\x0cjP  \r\n\x87\n"):
        return ".jp2"
    ext = Path(image.name).suffix.casefold()
    return ext if ext in {".jpg", ".jpeg", ".jp2", ".png", ".tif"} else ".png"


def build_asset(
    image: Any,
    output: Path,
    *,
    preserve_alpha: bool,
    filename: str,
    source_image: Image.Image | None = None,
) -> None:
    pixels = (source_image or image.image).convert("RGBA")
    has_alpha = pixels.getchannel("A").getextrema()[0] < 255
    if preserve_alpha and not has_alpha:
        floodfill_pixels = pixels.copy()
        for point in ((0, 0), (pixels.width - 1, 0), (0, pixels.height - 1), (pixels.width - 1, pixels.height - 1)):
            try:
                ImageDraw.floodfill(floodfill_pixels, point, (255, 255, 255, 0), thresh=36)
            except ValueError:
                continue
        alpha = floodfill_pixels.getchannel("A")
        alpha = alpha.filter(ImageFilter.GaussianBlur(radius=0.7))
        pixels.putalpha(alpha)

    destination = output / filename
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.suffix == ".png":
        pixels.save(destination, format="PNG", optimize=True)
    else:
        pixels.save(destination, format="WEBP", quality=91, method=6, lossless=False)


def extract_font_subsets(reader: PdfReader, output: Path) -> list[dict[str, Any]]:
    font_dir = output / "fonts"
    font_dir.mkdir(parents=True, exist_ok=True)
    seen: set[int] = set()
    manifest: list[dict[str, Any]] = []
    names = {"ArialMT": "arial-regular", "ArialNarrow-Bold": "arial-narrow-bold"}
    for page in reader.pages[1:27]:
        fonts = page["/Resources"].get("/Font", {})
        for reference in fonts.values():
            font = reference.get_object()
            font_name = str(font.get("/BaseFont", "")).split("+")[-1].lstrip("/")
            label = names.get(font_name)
            if not label:
                continue
            descendants = font.get("/DescendantFonts")
            descriptor_owner = descendants[0].get_object() if descendants else font
            descriptor_ref = descriptor_owner.get("/FontDescriptor")
            if not descriptor_ref:
                continue
            descriptor = descriptor_ref.get_object()
            subset_ref = descriptor.get("/FontFile2")
            if not subset_ref:
                continue
            stream = subset_ref.get_object()
            object_id = int(subset_ref.idnum)
            if object_id in seen:
                continue
            seen.add(object_id)
            file = f"{label}.ttf"
            target = font_dir / file
            target.write_bytes(stream.get_data())
            manifest.append({"font": label, "file": f"/product-brochure/fonts/{file}", "bytes": target.stat().st_size})
    return manifest


def extract_brochure(
    source: Path,
    output: Path,
    data_path: Path,
    source_assets: Path | None = None,
) -> None:
    source_pdf_bytes = source.read_bytes()
    reader = PdfReader(source)
    if len(reader.pages) != 31:
        raise ValueError(f"Expected a 31-page source brochure, found {len(reader.pages)} pages")

    output.mkdir(parents=True, exist_ok=True)
    originals_dir = output / "originals"
    originals_dir.mkdir(parents=True, exist_ok=True)
    content_pages = []
    emitted: dict[str, str] = {}
    asset_hashes: dict[str, dict[str, str]] = {}

    with pdfplumber.open(source) as document:
        for source_page_number in range(2, 28):
            pdf_page = reader.pages[source_page_number - 1]
            layout_page = document.pages[source_page_number - 1]
            pdf_images = {image.indirect_reference.idnum: image for image in pdf_page.images}
            images = []

            for image_index, image_layout in enumerate(layout_page.images):
                image_width = float(image_layout["x1"]) - float(image_layout["x0"])
                if (
                    source_page_number == 27
                    and float(image_layout["x0"]) < 0
                    and image_width < 15
                ):
                    continue
                object_id = image_layout["stream"].objid
                image = pdf_images.get(object_id)
                if image is None:
                    continue
                image_hash = hashlib.sha256(image_bytes(image)).hexdigest()
                raw_ext = image_extension(image, image_bytes(image))
                original_filename = f"source-{image_hash[:16]}{raw_ext}"
                original_path = originals_dir / original_filename
                if original_filename not in emitted:
                    original_path.write_bytes(image_bytes(image))
                    emitted[original_filename] = image_hash

                asset = asset_hashes.get(image_hash)
                if asset is None:
                    mapping = ASSET_NAMES.get((source_page_number, image_index))
                    if mapping is None:
                        raise ValueError(
                            f"Missing asset name for PDF page {source_page_number}, image {len(images)}"
                        )
                    relative_path, description, remove_background = mapping
                    destination_relative = relative_path
                    asset_source = None
                    asset_fingerprint = None
                    high_res_match = HIGH_RES_MATCHES.get(
                        (source_page_number, image_index)
                    )
                    source_image = None
                    if high_res_match and source_assets:
                        source_file = source_assets / high_res_match["source_file"]
                        source_asset_bytes = source_file.read_bytes()
                        asset_fingerprint = hashlib.sha256(source_asset_bytes).hexdigest()
                        if asset_fingerprint != high_res_match["sha256"]:
                            raise ValueError(
                                f"Source asset fingerprint mismatch for {source_file.name}"
                            )
                        asset_source = (
                            f"/product-brochure/originals/{high_res_match['source_name']}"
                        )
                        (originals_dir / high_res_match["source_name"]).write_bytes(
                            source_asset_bytes
                        )
                        source_image = Image.open(source_file)
                        destination_relative = high_res_match["destination"]
                    # Keep product cutouts separate from the immutable PDF extracts.
                    if (
                        source_image is None
                        and remove_background
                        and relative_path.endswith(".webp")
                    ):
                        destination_relative = relative_path.removesuffix(".webp") + ".png"
                    destination = output / destination_relative
                    build_asset(
                        image,
                        output,
                        preserve_alpha=remove_background,
                        filename=destination_relative,
                        source_image=source_image,
                    )
                    asset = {
                        "src": f"/product-brochure/{destination_relative}",
                        "alt": description,
                    }
                    if asset_source and asset_fingerprint:
                        asset["assetSource"] = asset_source
                        asset["assetSha256"] = asset_fingerprint
                    asset_hashes[image_hash] = asset
                else:
                    mapping = ASSET_NAMES.get((source_page_number, image_index))
                    if mapping:
                        asset = {**asset, "alt": mapping[1]}
                images.append(
                    {
                        **asset,
                        "x": round(float(image_layout["x0"]), 3),
                        "y": round(float(image_layout["top"]), 3),
                        "w": round(float(image_layout["x1"]) - float(image_layout["x0"]), 3),
                        "h": round(float(image_layout["bottom"]) - float(image_layout["top"]), 3),
                        "source": f"/product-brochure/originals/{original_filename}",
                    }
                )

            lines = group_character_lines(layout_page.chars, float(layout_page.height))
            decorations = []
            for rule in layout_page.lines:
                color = rule.get("stroking_color")
                decorations.append({
                    "type": "line",
                    "x1": round(float(rule["x0"]), 3),
                    "y1": round(float(rule["top"]), 3),
                    "x2": round(float(rule["x1"]), 3),
                    "y2": round(float(rule["bottom"]), 3),
                    "color": "#777777" if is_brand_accent(color) else compact_color(color),
                    "width": round(float(rule.get("linewidth") or 0.45), 3),
                    "dash": (rule.get("dash") or ([], 0))[0],
                })
            for rect in layout_page.rects:
                stroke = rect.get("stroking_color")
                fill = rect.get("non_stroking_color")
                decorations.append({
                    "type": "rect",
                    "x": round(float(rect["x0"]), 3),
                    "y": round(float(rect["top"]), 3),
                    "w": round(float(rect["x1"]) - float(rect["x0"]), 3),
                    "h": round(float(rect["bottom"]) - float(rect["top"]), 3),
                    "stroke": compact_color(stroke),
                    "fill": compact_color(fill, fill=True),
                    "strokeWidth": round(float(rect.get("linewidth") or 0.45), 3),
                })

            content_pages.append({
                "sourcePage": source_page_number,
                "id": {
                    2: "zl9nsq-chip",
                    6: "f1-full-body-suit",
                    8: "h1-data-gloves",
                    10: "f2-full-body-suit",
                    12: "f2-pro-plus-full-body-suit",
                    14: "h2-dexterous-data-gloves",
                    16: "h2-pro-data-gloves",
                    18: "h2-pro-plus-data-gloves",
                    20: "openarm-z",
                    22: "openarm-zm",
                    24: "openarm-z-plus",
                    26: "custom-motion-data-platform",
                    27: "partners",
                }.get(source_page_number, f"brochure-page-{source_page_number:02d}"),
                "width": round(float(layout_page.width), 3),
                "height": round(float(layout_page.height), 3),
                "lines": lines,
                "images": images,
                "decorations": decorations,
            })

    font_manifest = extract_font_subsets(reader, output)
    data_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": {
            "sha256": hashlib.sha256(source_pdf_bytes).hexdigest(),
            "pageCount": len(reader.pages),
            "pageWidth": PAGE_WIDTH,
            "pageHeight": PAGE_HEIGHT,
        },
        "theme": THEME_TOKENS,
        "fonts": font_manifest,
        "pages": content_pages,
    }
    data_path.write_text(json.dumps(payload, ensure_ascii=True, indent=2) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_pdf", type=Path)
    parser.add_argument("assets_dir", type=Path)
    parser.add_argument("data_file", type=Path)
    parser.add_argument("--source-assets-dir", type=Path)
    parser.add_argument("--refresh-layout", action="store_true")
    args = parser.parse_args()
    if args.refresh_layout:
        refresh_layout(args.source_pdf, args.data_file)
        return
    extract_brochure(
        args.source_pdf, args.assets_dir, args.data_file, args.source_assets_dir
    )


if __name__ == "__main__":
    main()
