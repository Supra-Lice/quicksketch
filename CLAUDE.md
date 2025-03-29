# QuickSketch - Agent Guidelines

## Commands
- Run app: `pdm run quicksketch`
- Install: `pdm install`
- Dev dependencies: `pdm install -G dev`
- Format Python: `pdm run black .`
- Python linting: `pdm run flake8`
- Test: `pdm run pytest`
- Single test: `pdm run pytest tests/path_to_test.py::test_function`
- JS linting: `npx eslint src/quicksketch/static/script.js`

## Style Guidelines
- Python: Black formatted with 120 char line length
- Type hints required for function parameters and returns
- Snake_case for Python functions/variables, PascalCase for classes
- Docstrings for all functions using """triple quotes"""
- Use dataclasses for structured data
- Error handling: abort() for HTTP errors, raise FileNotFoundError with messages
- JS: Modern ES syntax, camelCase for variables/functions
- Organize related functionality into cohesive functions
- Handle errors with try/catch blocks and provide user-friendly messages