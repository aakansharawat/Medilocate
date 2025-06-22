from app.utils.graph_interface import find_shortest_path

# Sample input (corrected format: list of (to, distance) tuples)
sample_graph = {
    "A": [("B", 2.0), ("C", 5.0)],
    "B": [("C", 1.0), ("D", 3.0)],
    "C": [("D", 2.0)],
    "D": []
}

path = find_shortest_path(sample_graph, "A", "D")
print("Shortest path from A to D:", path)
