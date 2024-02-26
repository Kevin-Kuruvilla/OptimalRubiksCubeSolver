# rubiks_cube.py
import numpy as np
import networkx as nx

class RubiksCube:
    TURN_KEYS = {
        'U': np.array([3, 0, 1, 2, 8, 9, 6, 7, 12, 13, 10, 11, 16, 17, 14, 15, 4, 5, 18, 19, 20, 21, 22, 23]),
        'F': np.array([0, 1, 17, 18, 7, 4, 5, 6, 3, 9, 10, 2, 12, 13, 14, 15, 16, 20, 21, 19, 11, 8, 22, 23]),
        'R': np.array([0, 5, 6, 3, 4, 21, 22, 7, 11, 8, 9, 10, 2, 13, 14, 1, 16, 17, 18, 19, 20, 15, 12, 23]),
        'B': np.array([9, 10, 2, 3, 4, 5, 6, 7, 8, 22, 23, 11, 15, 12, 13, 14, 1, 17, 18, 0, 20, 21, 19, 16]),
        'L': np.array([14, 1, 2, 13, 0, 5, 6, 3, 8, 9, 10, 11, 12, 23, 20, 15, 19, 16, 17, 18, 4, 21, 22, 7]),
        'D': np.array([0, 1, 2, 3, 4, 5, 18, 19, 8, 9, 6, 7, 12, 13, 10, 11, 16, 17, 14, 15, 23, 20, 21, 22]),
        'x': np.array([4, 5, 6, 7, 20, 21, 22, 23, 11, 8, 9, 10, 2, 3, 0, 1, 17, 18, 19, 16, 14, 15, 12, 13]),
        'y': np.array([3, 0, 1, 2, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 4, 5, 6, 7, 21, 22, 23, 20]),
        'z': np.array([19, 16, 17, 18, 7, 4, 5, 6, 3, 0, 1, 2, 13, 14, 15, 12, 23, 20, 21, 22, 11, 8, 9, 10]),
        'U\'': np.array([1, 2, 3, 0, 16, 17, 6, 7, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13, 18, 19, 20, 21, 22, 23]),
        'F\'': np.array([0, 1, 11, 8, 5, 6, 7, 4, 21, 9, 10, 20, 12, 13, 14, 15, 16, 2, 3, 19, 17, 18, 22, 23]),
        'R\'': np.array([0, 15, 12, 3, 4, 1, 2, 7, 9, 10, 11, 8, 22, 13, 14, 21, 16, 17, 18, 19, 20, 5, 6, 23]),
        'B\'': np.array([19, 16, 2, 3, 4, 5, 6, 7, 8, 0, 1, 11, 13, 14, 15, 12, 23, 17, 18, 22, 20, 21, 9, 10]),
        'L\'': np.array([4, 1, 2, 7, 20, 5, 6, 23, 8, 9, 10, 11, 12, 3, 0, 15, 17, 18, 19, 16, 14, 21, 22, 13]),
        'D\'': np.array([0, 1, 2, 3, 4, 5, 10, 11, 8, 9, 14, 15, 12, 13, 18, 19, 16, 17, 6, 7, 21, 22, 23, 20]),
        'x\'': np.array([14, 15, 12, 13, 0, 1, 2, 3, 9, 10, 11, 8, 22, 23, 20, 21, 19, 16, 17, 18, 4, 5, 6, 7]),
        'y\'': np.array([1, 2, 3, 0, 16, 17, 18, 19, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 23, 20, 21, 22]),
        'z\'': np.array([9, 10, 11, 8, 5, 6, 7, 4, 21, 22, 23, 20, 15, 12, 13, 14, 1, 2, 3, 0, 17, 18, 19, 16]),
        'U2': np.array([2, 3, 0, 1, 12, 13, 6, 7, 16, 17, 10, 11, 4, 5, 14, 15, 8, 9, 18, 19, 20, 21, 22, 23]),
        'F2': np.array([0, 1, 20, 21, 6, 7, 4, 5, 18, 9, 10, 17, 12, 13, 14, 15, 16, 11, 8, 19, 2, 3, 22, 23]),
        'R2': np.array([0, 21, 22, 3, 4, 15, 12, 7, 10, 11, 8, 9, 6, 13, 14, 5, 16, 17, 18, 19, 20, 1, 2, 23]),
        'B2': np.array([22, 23, 2, 3, 4, 5, 6, 7, 8, 19, 16, 11, 14, 15, 12, 13, 10, 17, 18, 9, 20, 21, 0, 1]),
        'L2': np.array([20, 1, 2, 23, 14, 5, 6, 13, 8, 9, 10, 11, 12, 7, 4, 15, 18, 19, 16, 17, 0, 21, 22, 3]),
        'D2': np.array([0, 1, 2, 3, 4, 5, 14, 15, 8, 9, 18, 19, 12, 13, 6, 7, 16, 17, 10, 11, 22, 23, 20, 21]),
        'x2': np.array([20, 21, 22, 23, 14, 15, 12, 13, 10, 11, 8, 9, 6, 7, 4, 5, 18, 19, 16, 17, 0, 1, 2, 3]),
        'y2': np.array([2, 3, 0, 1, 12, 13, 14, 15, 16, 17, 18, 19, 4, 5, 6, 7, 8, 9, 10, 11, 22, 23, 20, 21]),
        'z2': np.array([22, 23, 20, 21, 6, 7, 4, 5, 18, 19, 16, 17, 14, 15, 12, 13, 10, 11, 8, 9, 2, 3, 0, 1])
    }

    SOLVED_STATE = np.array(['W', 'W', 'W', 'W', 'G', 'G', 'G', 'G', 'R', 'R', 'R', 'R', 'B', 'B', 'B', 'B', 'O', 'O', 'O', 'O', 'Y', 'Y', 'Y', 'Y'])

    def __init__(self, scramble=None):
        self.current_state = scramble if scramble is not None else self.SOLVED_STATE.copy()
        self.current_state = self._find_correct_orientation(self.current_state)

    def perform_algorithm(self, algorithm: str) -> None:
        moves = algorithm.split()

        for move in moves:
            self._perform_turn(self.current_state, move)

    def solve_cube(self) -> tuple:
        scrambled_graph = nx.Graph()
        solved_graph = nx.Graph()

        scrambled_queue = [self.current_state]
        scrambled_graph.add_node(tuple(self.current_state))

        solved_queue = [self.SOLVED_STATE]
        solved_graph.add_node(tuple(self.SOLVED_STATE))

        while scrambled_queue and solved_queue:
            shortest_path = self._analyze_neighbors(scrambled_graph, solved_graph, scrambled_queue)

            if shortest_path is not None:
                moves = self._path_to_algorithm(shortest_path)
                return shortest_path, moves

            shortest_path = self._analyze_neighbors(solved_graph, scrambled_graph, solved_queue)

            if shortest_path is not None:
                moves = self._path_to_algorithm(shortest_path)
                return shortest_path, moves

        return None, None

    def __str__(self) -> str:
        return ' '.join(self.current_state)

    def _perform_turn(self, state: np.ndarray, turn: str) -> None:
        state[:] = state[self.TURN_KEYS[turn]]

    def _generate_neighbors(self, state: np.ndarray) -> list:
        neighbors = []
        turns = ['U', 'R', 'U\'', 'R\'', 'U2', 'R2', 'F2', 'F', 'F\'']

        for turn in turns:
            neighbor = state.copy()
            self._perform_turn(neighbor, turn)
            neighbors.append(neighbor)

        return neighbors

    def _get_orientations(self, state: np.ndarray) -> list:
        orientations = []

        for _ in range(2):
            for _ in range(3):
                for i in range(4):
                    orientations.append(state.copy())
                    if i != 3:
                        self._perform_turn(state, 'y')
                self._perform_turn(state, 'x')
            self._perform_turn(state, 'y2')
            self._perform_turn(state, 'x\'')

        return orientations

    def _check_correct_orientation(self, orientation: np.ndarray) -> bool:
        return orientation[14] == 'B' and orientation[19] == 'O' and orientation[23] == 'Y'

    def _find_correct_orientation(self, state: np.ndarray) -> np.ndarray:
        orientations = self._get_orientations(state)

        for orientation in orientations:
            if self._check_correct_orientation(orientation):
                return orientation

        return None

    def _path_to_algorithm(self, states: list) -> str:
        moves = []

        for i in range(len(states) - 1):
            before_state = np.array(states[i])
            after_state = np.array(states[i + 1])

            for turn in self.TURN_KEYS:
                temp_state = before_state.copy()

                self._perform_turn(temp_state, turn)

                if np.array_equal(temp_state, after_state):
                    moves.append(turn)
                    break

        return " ".join(moves)

    def _find_shortest_path(self, scrambled_graph: nx.Graph, solved_graph: nx.Graph, midpoint: tuple) -> list:
        if tuple(self.SOLVED_STATE) not in solved_graph:
            temp = scrambled_graph
            scrambled_graph = solved_graph
            solved_graph = temp

        first_half = nx.shortest_path(scrambled_graph, tuple(self.current_state), midpoint)
        second_half = nx.shortest_path(solved_graph, midpoint, tuple(self.SOLVED_STATE))
        shortest_path = first_half + second_half[1:]

        return shortest_path

    def _analyze_neighbors(self, graph: nx.Graph, other_graph: nx.Graph, queue: list) -> tuple:
        current_state = queue.pop(0)
        neighbors = self._generate_neighbors(current_state)

        for neighbor in neighbors:
            neighbor_tuple = tuple(neighbor)

            if neighbor_tuple not in graph:
                graph.add_node(neighbor_tuple)
                graph.add_edge(tuple(current_state), neighbor_tuple)
                queue.append(neighbor)
                
            if neighbor_tuple in other_graph:
                shortest_path = self._find_shortest_path(graph, other_graph, neighbor_tuple)
                return shortest_path

        return None