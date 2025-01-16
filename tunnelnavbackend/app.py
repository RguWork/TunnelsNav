from flask import Flask, request, jsonify
from flask_cors import CORS
from collections import deque
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from model import load_model, predict

app = Flask(__name__)
CORS(app)

class NodeNotFoundError(Exception):
    def __init__(self, node):
        self.node = node
        super().__init__(f"Node {node} not found in the tunnels graph.")

graph = {
    "B1": ["B5", "B3"],
    "B5": ["B1", "B3", "B7"],
    "B7": ["B5"],
    "B3": ["B1", "B5", "B11"],
    "B11": ["B3", "B10", "B13"],
    "B13": ["B9", "B11"],
    "B10": ["B11", "B4"],
    "B4": ["B10", "B2", "B8"],
    "B2": ["B4", "B6", "B14"],
    "B6": ["B2", "B8"],
    "B14": ["B2", "B18"],
    "B18": ["B14", "B54", "B56"],
    "B8": ["B4", "B6", "B16"],
    "B16": ["B8", "B56", "B26"],
    "B26": ["B16", "B32", "B36"],
    "B56": ["B18", "B16", "B66"],
    "B54": ["B18"],
    "B32": ["B26"],
    "B36": ["B26"],
    "B66": ["B56", "B68"],
    "B68": ["B66", "E17"],
    "E17": ["B68", "E18"],
    "E18": ["E17", "E19"],
    "E19": ["E18"],
    "B9": ["B13"]
}

def bfs(start, end):
    # print("inputted start and end nodes", start, end)
    if end not in graph:
        raise NodeNotFoundError(end)

    queue = deque([(start, [start])])
    visited = set()

    while queue:
        cur, path = queue.popleft()
        if cur not in visited:
            visited.add(cur)
            if cur == end:
                return path
            
            if cur not in graph:
                raise NodeNotFoundError(cur)

            for neighbor in graph[cur]:
                if neighbor not in visited:
                    queue.append((neighbor, path+[neighbor]))
    
    return []
    


@app.route('/api/pathfinding', methods = ["POST"])
def find_path():
    start_text = request.form.get("startText")
    start_image = request.files.get("startImage")
    destination_text = request.form.get("destinationText")
    print("for testing", start_text, start_image, destination_text)


    if (not start_text and not start_image) or not destination_text:
        return jsonify({"error":"Both start and end locations must be filled out"}), 400

    if start_image:
        #meaning image input
        print(f"Image received: {start_image.filename}, Type: {type(start_image)}")
        model = load_model()
        predicted_output, confidence  = predict(model, start_image)
        print("Final hallway prediction", predicted_output, "Confidence:", confidence)
        if confidence <= 0.5:
            return jsonify({'error': "The model was not confident its location prediction given the picture. Please try again with a new image. Ensure that it is within the MIT tunnel system!"})
        else:
            start_text = predicted_output
    
    try:
        startNode, endNode = start_text.capitalize() , destination_text.capitalize()
        path = bfs(startNode, endNode)
        return jsonify({"path": path})
    except NodeNotFoundError as e:
        return jsonify({'error': f"The following locations do not exist: {e.node}. The input is case sensitive! Make sure b1 is written as B1, and so on."})

if __name__ == "__main__":
    app.run(debug=True)