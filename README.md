# agx

**_agx_** is a desktop application that lets you explore and query data through a modern interface. It's built with [Tauri](https://tauri.app/), [SvelteKit](https://kit.svelte.dev/) and [Plot](https://observablehq.com/@observablehq/plot), and can work in two ways: as a native desktop app using ([Clickhouse](https://github.com/clickhouse/clickhouse)), or as a web interface connected to a [Clickhouse](https://clickhouse.com/) server instance.

## Preview

![Preview](.github/img/screenshot.png)

## Features

- Native desktop application performance with web technologies
- Interactive SQL query editor with syntax highlighting
- Schema browser for exploring data structure
- Results displayed in a tabular format
- Support for drag & drop file operations
- Cross-platform compatibility (macOS, Linux, Windows)

## Prerequisites

- Node.js (v16 or later)
- Rust toolchain
- System dependencies for Tauri

## Getting Started

### → Native ([clickhouse](https://github.com/clickhouse/clickhouse))

Get the latest release from [GitHub](https://github.com/agnosticeng/agx/releases).

### → Live ([clickhouse](https://github.com/ClickHouse/ClickHouse))

https://agx.app

#### Ollama Integration

To use your local Ollama models with the live version (https://agx.app), run:

```bash
OLLAMA_ORIGINS="https://app.agx" ollama serve
```

### → Local ([clickhouse](https://github.com/ClickHouse/ClickHouse))

1. Clone the repository:

```bash
git clone https://github.com/agnosticeng/agx && cd agx
```

2. Run with docker compose:

```bash
docker compose up
```

3. Access the application via http://localhost:8080

## Project Structure

```
agx/
├── src/                 # Frontend source code (SvelteKit)
│   ├── lib/             # Shared components
│   └── routes/          # Application routes
├── src-tauri/           # Backend source code (Rust)
│   ├── src/             # Rust source files
│   └── Cargo.toml       # Rust dependencies
├── package.json         # Node.js dependencies
└── README.md
```

## Installing Agnostic UDF

Install Agnostic ClickHouse UDFs with a single command:

```bash
curl -fsSL https://raw.githubusercontent.com/agnosticeng/agx/main/scripts/install_agnostic_udfs.sh | sh
```

## Development

- The frontend is built with SvelteKit, offering a reactive and efficient UI
- The backend uses Tauri with Rust, providing native performance and security
- Communication between frontend and backend happens through Tauri's IPC bridge
- Data querying is handled by clickhouse, locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

The MIT License is one of the most popular open-source licenses because it:

- Is simple and permissive
- Allows commercial use
- Allows modification and distribution
- Allows private use
- Has minimal restrictions
- Is compatible with many other licenses
