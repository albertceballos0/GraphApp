# GraphApp

This is a sample application built with React and Express.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Backend Routes](#backend-routes)
- [Branch and Bound algorithm resolving TSP](#branch-and-bound-algorithm-resolving-tsp)
- [Contributing](#contributing)
- [License](#license)

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
    cd database && ./backup.sh

5. Navigate to the `GraphApplication` directory:
    ```bash
    cd GraphApplication/GraphApplication
    ```
6. Compile the main program:
    ```bash
    g++ -o GraphApplication main.cpp
    ```
7. Move the compiled executable to the backend directory:
    ```bash
    mv GraphApplication ../../backend/
    ```
## Usage

1. Configurate the `.env` files with all the information about your db and backend.
2. Run the backend and frontend:
    ```bash
    pnpm run dev
    ```
3. Open your browser and visit: `http://localhost:5173`


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

## Frontend
Frontend app in home page

![frontend GraphApp](/assets/frontend.png)

## Backend Routes
### User Backend Routes (/users)
```plaintext
GET /users/
POST /users/register
POST /users/login
GET /users/userId/:username
```

### Graph Backend Routes (/graph)
```plaintext
GET /graph/files
GET /graph/files/:username
GET /graph/:id
GET /graph/comprove/:checksum
POST /graph/generate
POST /graph/visits
POST /graph/track
POST /graph/initialize/:id
GET /graph/borrar/:archivo
```

Each route corresponds to CRUD operations related to users and graphs.

## Branch and Bound algorithm resolving TSP
### Introduction
The Branch and Bound algorithm is a branching and pruning technique used to solve the Traveling Salesman Problem (TSP), a fundamental combinatorial problem in optimization. The goal is to find the shortest route that visits each city exactly once and returns to the starting point.

### Algorithm operation
The Branch and Bound algorithm for TSP works as follows:
1. **Initialization**:
   - Starts with an empty partial path and an initially infinite best solution value.
2. **Exploration**:
   - Uses a priority queue (min-heap) to store and expand search tree nodes.
   - Each node represents a partially visited city with a certain cumulative length.
3. **Branching**:
   - The current node is expanded by branching into all possible child nodes that have not yet been visited.
   - Calculate the length of each possible extension of the route and estimate its final cost by adding a lower bound.
4. **Pruning**:
   - Prune the tree branches that already exceed the best known solution (upper limit).
   - Continue expanding the most promising nodes (smallest total length) until all possible branches have been explored.
5. **Best Solution Update**:
   - Updates the best route found every time a complete and better solution than the one currently known is found.
6. **Termination**:
   - The algorithm terminates when all nodes have been explored and there are no more promising extensions available.

### Images

Resume branch and bound.

![Branch & bound](/assets/bab.png)

![visits](/assets/visites.png)



### Implementation in `GraphApplication`
In the `GraphApplication` project, the Branch and Bound algorithm for TSP is implemented in the function:
```cpp
CTrack SalesmanTrackBranchAndBound(CGraph& g, CVisits& visits);
```

### Considerations
- **Efficiency**: The Branch and Bound algorithm reduces the amount of exploration by pruning unpromising solutions, but can be computationally expensive for large instances of the TSP problem.
- **Optimality**: Guarantees finding the optimal solution for the TSP, as long as the lower and upper bound are correctly calculated.

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

