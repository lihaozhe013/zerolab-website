import json
from pathlib import Path
from typing import Any

import click

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent.parent
LOCALES_DIR = PROJECT_ROOT / "src" / "locales"


def load_json(path: Path) -> dict[str, Any]:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path: Path, data: dict[str, Any]) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")


def flatten_keys(data: dict[str, Any], prefix: str = "") -> list[str]:
    keys: list[str] = []
    for k, v in data.items():
        full_key = f"{prefix}.{k}" if prefix else k
        if isinstance(v, dict):
            keys.extend(flatten_keys(v, full_key))
        else:
            keys.append(full_key)
    return sorted(keys)


def count_leaves(data: dict[str, Any]) -> int:
    count = 0
    for v in data.values():
        if isinstance(v, dict):
            count += count_leaves(v)
        else:
            count += 1
    return count


def sort_dict(data: dict[str, Any]) -> dict[str, Any]:
    result: dict[str, Any] = {}
    for k in sorted(data.keys()):
        v = data[k]
        if isinstance(v, dict):
            result[k] = sort_dict(v)
        elif isinstance(v, list):
            result[k] = [sort_dict(item) if isinstance(item, dict) else item for item in v]
        else:
            result[k] = v
    return result


@click.group()
def main() -> None:
    """i18n translation management tools."""


@main.command()
def check() -> None:
    """Check for missing translation keys between zh.json and en.json."""
    zh_path = LOCALES_DIR / "zh.json"
    en_path = LOCALES_DIR / "en.json"

    if not zh_path.exists():
        click.echo("✗ zh.json not found")
        return
    if not en_path.exists():
        click.echo("✗ en.json not found")
        return

    zh_data = load_json(zh_path)
    en_data = load_json(en_path)

    zh_keys = set(flatten_keys(zh_data))
    en_keys = set(flatten_keys(en_data))

    missing_in_en = sorted(zh_keys - en_keys)
    missing_in_zh = sorted(en_keys - zh_keys)

    if missing_in_en:
        click.echo(f"\n❌ Missing in en.json ({len(missing_in_en)}):")
        for key in missing_in_en:
            click.echo(f"  - {key}")

    if missing_in_zh:
        click.echo(f"\n❌ Missing in zh.json ({len(missing_in_zh)}):")
        for key in missing_in_zh:
            click.echo(f"  - {key}")

    if not missing_in_en and not missing_in_zh:
        click.echo("✅ All keys are aligned between zh.json and en.json")


@main.command()
def sort() -> None:
    """Sort all keys alphabetically in zh.json and en.json."""
    for fname in ["zh.json", "en.json"]:
        path = LOCALES_DIR / fname
        if not path.exists():
            click.echo(f"✗ {fname} not found, skipping")
            continue
        data = load_json(path)
        sorted_data = sort_dict(data)
        save_json(path, sorted_data)
        click.echo(f"✓ Sorted {fname}")


@main.command()
def stats() -> None:
    """Show translation statistics."""
    for fname in ["zh.json", "en.json"]:
        path = LOCALES_DIR / fname
        if not path.exists():
            click.echo(f"✗ {fname} not found")
            continue
        data = load_json(path)
        n = count_leaves(data)
        lang = "中文" if fname == "zh.json" else "English"
        click.echo(f"  {lang} ({fname}): {n} keys")

    zh_data = load_json(LOCALES_DIR / "zh.json")
    en_data = load_json(LOCALES_DIR / "en.json")
    zh_keys = set(flatten_keys(zh_data))
    en_keys = set(flatten_keys(en_data))

    missing = zh_keys - en_keys
    total = len(zh_keys)
    pct = ((total - len(missing)) / total * 100) if total else 0
    click.echo(f"\n  Translation progress: {pct:.1f}% ({total - len(missing)}/{total})")


@main.command()
def diff() -> None:
    """Show structural differences between zh.json and en.json."""
    zh_data = load_json(LOCALES_DIR / "zh.json")
    en_data = load_json(LOCALES_DIR / "en.json")

    zh_keys = set(flatten_keys(zh_data))
    en_keys = set(flatten_keys(en_data))

    only_zh = sorted(zh_keys - en_keys)
    only_en = sorted(en_keys - zh_keys)

    if only_zh:
        click.echo(f"\nOnly in zh.json ({len(only_zh)}):")
        for key in only_zh:
            click.echo(f"  + {key}")

    if only_en:
        click.echo(f"\nOnly in en.json ({len(only_en)}):")
        for key in only_en:
            click.echo(f"  + {key}")

    if not only_zh and not only_en:
        click.echo("✅ zh.json and en.json have identical key structures")


if __name__ == "__main__":
    main()
