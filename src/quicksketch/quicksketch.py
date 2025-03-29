from operator import itemgetter
import os
import random
import argparse
from flask import Flask, render_template, send_from_directory, jsonify
from pathlib import Path

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


@app.route("/")
def index():
    subfolders = []
    for item in Path(DATA_FOLDER).iterdir():
        if item.is_dir():
            count = len([f for f in item.iterdir() if f.is_file()])
            subfolders.append({"name": item.name, "count": count})
    subfolders.sort(key=itemgetter("count"), reverse=True)
    return render_template("index.html", subfolders=subfolders, timer_options=TIMER_OPTIONS, default_timer="2 minutes")


@app.route("/random/<subfolder>")
def random_image(subfolder):
    path = Path(DATA_FOLDER) / subfolder
    if not path.isdir():
        return "Subfolder not found", 404

    files = [f for f in path.iterdir() if f.isfile()]

    if not files:
        return "No files in subfolder", 404

    random_file = random.choice(files)

    return jsonify({"image_url": f"/images/{subfolder}/{random_file.name}"})


@app.route("/images/<subfolder>/<filename>")
def serve_image(subfolder, filename):
    return send_from_directory(os.path.join(DATA_FOLDER, subfolder), filename)


def get_args():
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
    DATA_FOLDER = os.path.abspath(args.folder)
    app.run(host=args.address, debug=args.debug, port=args.port)


if __name__ == "__main__":
    main()
