# Quicksketch

A simple tool for timed drawing practice that allows you to practice on your own custom image-sets locally without an internet connection.

## Installation

```bash
# Install with pip
pip install https://github.com/Supra-Lice/quicksketch

# Or better, install with pipx (recommended)
pipx install https://github.com/Supra-Lice/quicksketch
```

## Usage

After installation, simply run:

```bash
quicksketch
```

Then open your browser to http://127.0.0.1:5032

### Command Line Options

```
usage: quicksketch [-h] [-p PORT] [-a ADDRESS] [-f FOLDER] [-d]

Run a timer-based drawing practice tool.

options:
  -h, --help            show this help message and exit
  -p PORT, --port PORT  Port to listen on (default: 5032)
  -a ADDRESS, --address ADDRESS
                        Address to listen on (default: 127.0.0.1)
  -f FOLDER, --folder FOLDER
                        Folder to serve images from (default: data)
  -d, --debug           Enable debug mode (default: False)
```

## Setting Up Your Image Collection

The app expects a directory structure like this:

```
- data/
    - animals/
        - cat1.jpg
        - cat2.jpg
        - dog1.png
    - landscapes/
        - mountain1.jpg
        - beach1.jpg
    - portraits/
        - person1.jpg
        - person2.png
```

Each subfolder becomes a selectable category in the app.

## Inspiration

This project was inspired by [Line of Action](https://line-of-action.com/), which offers excellent timed practice with their curated image sets. Quicksketch was created to allow practice with personal image collections.

## Attribution

This project uses the pencil icon from Font Awesome Free, licensed under CC BY 4.0.
- Font Awesome: [https://fontawesome.com/](https://fontawesome.com/)
- CC BY 4.0 License: [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)