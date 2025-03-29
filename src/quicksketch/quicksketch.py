from operator import attrgetter
import random
import argparse
from pathlib import Path
from dataclasses import dataclass
from flask import Flask, Response, render_template, send_from_directory, jsonify, abort
from urllib.parse import quote, unquote

app = Flask(__name__, template_folder="templates", static_folder="static")

# Configuration
DATA_FOLDER = "data"

# Timer options in seconds
TIMER_OPTIONS = {
    "30 seconds": 30,
    "60 seconds": 60,
    "2 minutes": 120,
    "5 minutes": 300,
    "15 minutes": 900,
    "30 minutes": 1800,
    "unlimited": -1,
}


@dataclass
class Subfolder:
    name: str
    key: str
    count: int


@app.route("/")
def index() -> str:
    """Get the index page."""
    path = Path(DATA_FOLDER)
    if not path.is_dir():
        abort(404)

    subfolders = []
    for item in path.iterdir():
        if item.is_dir():
            count = len([f for f in item.iterdir() if f.is_file()])
            subfolders.append(Subfolder(item.name, quote(item.name), count))
    subfolders.sort(key=attrgetter("count"), reverse=True)

    return render_template("index.html", subfolders=subfolders, timer_options=TIMER_OPTIONS, default_timer="2 minutes")


@app.route("/random/<subfolder>")
def random_image(subfolder: str) -> Response:
    """Sample a random image."""
    path = Path(DATA_FOLDER) / unquote(subfolder)
    if not path.is_dir():
        abort(404)

    files = [f for f in path.iterdir() if f.is_file()]
    if not files:
        abort(404)

    random_file = random.choice(files)

    return jsonify({"image_url": f"/images/{subfolder}/{quote(random_file.name)}"})


@app.route("/images/<subfolder>/<filename>")
def serve_image(subfolder: str, filename: str) -> Response:
    """Get a single image content."""
    return send_from_directory(Path(DATA_FOLDER) / unquote(subfolder), unquote(filename))


def get_args() -> argparse.Namespace:
    """Creates an argparse parser for Flask server options."""
    parser = argparse.ArgumentParser(description="Run a Flask server.")
    parser.add_argument(
        "-p",
        "--port",
        type=int,
        default=5032,
        help="Port to listen on (default: 5032)",
    )
    parser.add_argument(
        "-a",
        "--address",
        type=str,
        default="127.0.0.1",
        help="Address to listen on (default: 127.0.0.1)",
    )
    parser.add_argument(
        "-f",
        "--folder",
        type=str,
        default="data",
        help="Folder to serve images from (default: data)",
    )
    parser.add_argument(
        "-d",
        "--debug",
        action="store_true",
        default=False,
        help="Enable debug mode (default: False)",
    )
    return parser.parse_args()


def main():
    args = get_args()
    global DATA_FOLDER
    DATA_FOLDER = str(Path(args.folder).absolute())
    if not Path(args.folder).is_dir():
        raise FileNotFoundError(f"Data folder does not exist: {args.folder}.")

    app.run(host=args.address, debug=args.debug, port=args.port)


if __name__ == "__main__":
    main()
