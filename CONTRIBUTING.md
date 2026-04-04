# Contributing to fg-tool-access-control

Thank you for your interest in improving the project! We welcome all contributions, including bug reports, feature requests, and code improvements.

## 🛠️ Getting Started

To set up the project locally for development:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/yang-chen8810/openclaw-tool-access-control.git
    cd openclaw-tool-access-control
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Tests**:
    Always ensure tests pass before submitting a pull request:
    ```bash
    npm test
    ```

4.  **Build the Project**:
    ```bash
    npm run build
    ```

## 📜 Rebuilding the Rule Grammar

The project uses **ANTLR 4** for rule evaluation. If you modify `src/antlr4/RuleExpr.g4`, you will need to rebuild the TypeScript source files:

1.  Download the [ANTLR 4 complete JAR](https://www.antlr.org/download.html).
2.  Place it in the root folder as `antlr-complete.jar`.
3.  Run the generation script:
    ```bash
    npm run antlr4
    ```

## 🤝 How to Contribute

### Reporting Bugs
-   Check if the bug has already been reported in the [Issues](https://github.com/yang-chen8810/openclaw-tool-access-control/issues) section.
-   If not, open a new issue. Include details like your OpenClaw version, node version, and steps to reproduce the problem.

### Suggesting Enhancements
-   Open an issue to discuss your idea before implementing it. This helps ensure the feature fits the project's goals.

### Submitting Pull Requests
1.  Fork the repository and create your feature branch from `main`.
2.  Follow the existing code style (TypeScript).
3.  Verify that `npm test` passes.
4.  Write clear, concise commit messages.
5.  Open a Pull Request with a description of your changes.

## ⚖️ License
By contributing, you agree that your contributions will be licensed under the project's **Apache 2.0 License**.
