# GraphApp

This is a sample application built with React and Express.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/albertceballos0/myapp.git
    ```
2. Navigate to the project directory:
    ```bash
    cd GraphApp
    ```
3. Install dependencies for both backend and frontend:
    ```bash
    cd backend && pnpm install
    cd ../frontend && pnpm install
    ```
4. Create database for the project
    ```bash
    cd backend && ./backup.sh


## Usage

1. Configurate the .env files with all the information about your db and backend.

2. Run the backend and frontend:
    ```bash
    pnpm run dev
    ```
3. Open your browser and visit: `http://localhost:5173`

## C++ TSP Algorithm

The repository also includes a C++ program that solves the Traveling Salesman Problem (TSP). The TSP is a classic optimization problem in computer science, where the goal is to find the shortest possible route that visits a given set of cities and returns to the starting city.

To run the TSP program:

1. Navigate to the `GraphApplication` directory:
    ```bash
    cd GraphApplication/GraphApplication
    ```
2. Compile the main program:
    ```bash
    g++ -o GraphApplication main.cpp
    ```
3. Move the compiled executable to the backend directory:
    ```bash
    mv GraphApplication ../../backend/
    ```

## Project Structure

Here's a visual representation of the project's structure:

```plaintext
├───GraphApplication/
│   ├───Backtracking.cpp
│   ├───BranchAndBound.cpp
│   ├───BranchAndBound2.cpp
│   ├───Dijkstra.cpp
│   ├───Graph.cpp
│   ├───Graph.h
│   ├───Greedy.cpp
│   ├───MAtrix.h
│   └───main.cpp
├───TestSalesMan/
│   ├───Graf100_200.GR
│   ├───Graf10_20.GR
│   ├───Graf10_40.GR
│   ├───Graf11.GR
│   ├───Graf12.GR
│   ├───Graf13.GR
│   ├───Graf14.GR
│   ├───Graf15.GR
│   ├───Graf16.GR
│   ├───Graf17.GR
│   ├───Graf18.GR
│   ├───Graf19.GR
│   ├───Graf20.GR
│   ├───Graf20_100.GR
│   ├───Graf21.GR
│   ├───Graf22.GR
│   ├───Graf23.GR
│   ├───Graf50_200.GR
│   ├───Graf50_300.GR
│   ├───Graf50_400.GR
│   ├───Graf80_500.GR
│   ├───graf30_300.GR
├───backend/
│   ├───controllers/
│   │   ├───graphController.js
│   │   └───userController.js
│   ├───models/
│   │   ├───graphModel.js
│   │   └───userModel.js
│   ├───routes/
│   │   ├───graphRoutes.js
│   │   └───userRoutes.js
│   ├───uploads/
│   ├───.env
│   ├───.gitignore
│   ├───GraphApplication
│   ├───index.js
│   ├───package.json
│   ├───pnpm-lock.yaml
│   └───utils.js
├───frontend/
│   ├───public/
│   │   └───innovacion.png
│   ├───src/
│   │   ├───assets/
│   │   ├───components/
│   │   ├───forms/
│   │   ├───hooks/
│   │   ├───App.tsx
│   │   ├───index.css
│   │   ├───main.tsx
│   │   ├───store.ts
│   │   └───vite-env.d.ts
│   ├───.env
│   ├───.eslintrc.cjs
│   ├───.gitignore
│   ├───index.html
│   ├───package.json
│   ├───pnpm-lock.yaml
│   ├───postcss.config.js
│   ├───tailwind.config.js
│   ├───tsconfig.json
│   ├───tsconfig.node.json
│   └───vite.config.ts
├───.gitignore
└───README.md
```
## Packages Used

### Frontend

- **react**: Library for building user interfaces.
- **typescript**: Superset of JavaScript that adds static types.
- **vite**: Next-generation frontend tooling for faster builds.
- **tailwindcss**: Utility-first CSS framework for rapid UI development.

### Backend

- **express**: Web framework for Node.js.
- **mongoose**: MongoDB object modeling tool (if using MongoDB).
- **multer**: Middleware for handling `multipart/form-data` for file uploads.
- **dotenv**: Module to load environment variables from a `.env` file.

## Algoritmo Branch and Bound para el Problema del Vendedor Viajero (TSP)

### Introducción

El algoritmo Branch and Bound es una técnica de ramificación y poda utilizada para resolver el Problema del Vendedor Viajero (TSP), un problema combinatorio fundamental en la optimización. El objetivo es encontrar el recorrido más corto que visita cada ciudad exactamente una vez y regresa al punto de partida.

### Funcionamiento del Algoritmo

El algoritmo Branch and Bound para TSP funciona de la siguiente manera:

1. **Inicialización**:
   - Comienza con un recorrido parcial vacío y un valor de mejor solución inicialmente infinito.

2. **Exploración**:
   - Utiliza una cola de prioridad (min-heap) para almacenar y expandir los nodos del árbol de búsqueda.
   - Cada nodo representa una ciudad parcialmente visitada con una cierta longitud acumulada.

3. **Ramificación**:
   - Se expande el nodo actual ramificándolo en todos los nodos hijos posibles que aún no han sido visitados.
   - Calcula la longitud de cada posible extensión del recorrido y estima su costo final agregando una cota inferior (lower bound).

4. **Poda**:
   - Podar las ramas del árbol que ya superan la mejor solución conocida (upper bound).
   - Continúa expandiendo los nodos más prometedores (menor longitud total) hasta que todas las ramas posibles se hayan explorado.

5. **Actualización de la Mejor Solución**:
   - Actualiza el mejor recorrido encontrado cada vez que se encuentra una solución completa y mejor que la actualmente conocida.

6. **Terminación**:
   - El algoritmo termina cuando todos los nodos han sido explorados y no hay más extensiones prometedoras disponibles.

### Implementación en `GraphApplication`

En el proyecto `GraphApplication`, el algoritmo Branch and Bound para TSP está implementado en la función:

```cpp
CTrack SalesmanTrackBranchAndBound(CGraph& g, CVisits& visits);
```

### Consideraciones

- **Eficiencia**: El algoritmo Branch and Bound reduce la cantidad de exploración mediante la poda de soluciones no prometedoras, pero puede ser computacionalmente costoso para instancias grandes del problema TSP.

- **Optimalidad**: Garantiza encontrar la solución óptima para el TSP, siempre que se calcule correctamente la cota inferior y superior.


## Contributing

Contributions are welcome!

1. - Clone the repository. `git clone https://github.com/albertceballos0/GraphApp.git`
2. - Create a new branch `git checkout -b feature/new-feature`
3. - Make your changes.
4. - Commit your changes `git commit -am 'Add new feature'`
5. - Push your changes `git push origin feature/new-feature`
6. - Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
