# Quicksketch

Quicksketch is a simple tool for doing timed drawing practice. It was inspired by [Line of Action](https://line-of-action.com/),
which I recommend if you're looking for timed practice on the good set of images. I made this so I could practice on my own image-sets locally.

## Installation

To install, run:
```bash
pip install https://github.com/Supra-Lice/quicksketch # or
pipx install https://github.com/Supra-Lice/quicksketch # recommended
```

## CLI

To run, call `quicksketch`.
```
usage: quicksketch.py [-h] [-p PORT] [-a ADDRESS] [-f FOLDER] [-d]

Run a Flask server.

options:
  -h, --help            show this help message and exit
  -p PORT, --port PORT  Port to listen on (default: 5032)
  -a ADDRESS, --address ADDRESS
                        Address to listen on (default: 127.0.0.1)
  -f FOLDER, --folder FOLDER
                        Folder to serve images from (default: data)
  -d, --debug           Enable debug mode (default: False)

```

## Data
The data folder should look something like:
```
- data/
    - imageset1/
        - image1.png
        - image2.png
        - etc
    - imageset2/
        - image1.png
        - image2.png
        - etc
    - etc
```

## Attribution
This project use the pencil icon from Font Awesome Free, licensed under CC BY 4.0.
Font Awesome: [https://fontawesome.com/](https://fontawesome.com/)
CC BY 4.0 License: [https://creativecommons.org/licenses/by/4.0/](https://creativecommons.org/licenses/by/4.0/)
