from flask import Flask, render_template, send_from_directory, jsonify
import os
import random
import argparse

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
    subfolders = [f for f in os.listdir(DATA_FOLDER) if os.path.isdir(os.path.join(DATA_FOLDER, f))]

    return render_template("index.html", subfolders=subfolders, timer_options=TIMER_OPTIONS, default_timer="2 minutes")


@app.route("/random/<subfolder>")
def random_image(subfolder):
    subfolder_path = os.path.join(DATA_FOLDER, subfolder)

    if not os.path.exists(subfolder_path):
        return "Subfolder not found", 404

    files = [f for f in os.listdir(subfolder_path) if os.path.isfile(os.path.join(subfolder_path, f))]

    if not files:
        return "No files in subfolder", 404

    random_file = random.choice(files)

    return jsonify({"image_url": f"/images/{subfolder}/{random_file}"})


@app.route("/images/<subfolder>/<filename>")
def serve_image(subfolder, filename):
    print(os.path.isfile(os.path.join(DATA_FOLDER, subfolder, filename)))
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
