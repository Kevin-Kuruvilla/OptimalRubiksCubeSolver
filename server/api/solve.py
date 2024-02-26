from http.server import BaseHTTPRequestHandler
import json
from rubiks_cube import RubiksCube
import numpy as np

def json_object_to_cube_state(json_object):
    top = [
        json_object["top"]["top_sticker_1"],
        json_object["top"]["top_sticker_2"],
        json_object["top"]["top_sticker_3"],
        json_object["top"]["top_sticker_0"]
    ]
    front = [
        json_object["front"]["front_sticker_0"],
        json_object["front"]["front_sticker_1"],
        json_object["front"]["front_sticker_2"],
        json_object["front"]["front_sticker_3"]
    ]
    right = [
        json_object["right"]["right_sticker_0"],
        json_object["right"]["right_sticker_1"],
        json_object["right"]["right_sticker_2"],
        json_object["right"]["right_sticker_3"]
    ]
    back = [
        json_object["back"]["back_sticker_0"],
        json_object["back"]["back_sticker_1"],
        json_object["back"]["back_sticker_2"],
        json_object["back"]["back_sticker_3"]
    ]
    left = [
        json_object["left"]["left_sticker_0"],
        json_object["left"]["left_sticker_1"],
        json_object["left"]["left_sticker_2"],
        json_object["left"]["left_sticker_3"]
    ]
    bottom = [
        json_object["bottom"]["bottom_sticker_3"],
        json_object["bottom"]["bottom_sticker_0"],
        json_object["bottom"]["bottom_sticker_1"],
        json_object["bottom"]["bottom_sticker_2"]
    ]
    return np.array(top + left + front + right + back + bottom)

def cube_state_to_json_object(cube_state):
    color_mapping = {
        "W": "#ffffff",  # White
        "G": "#009b48",  # Green
        "B": "#0046ad",  # Blue
        "R": "#b71234",  # Red
        "O": "#ff5800",  # Orange
        "Y": "#ffd500"   # Yellow
    }

    json_object = {
        "top": {
            "top_sticker_1": color_mapping[cube_state[0]],
            "top_sticker_2": color_mapping[cube_state[1]],
            "top_sticker_3": color_mapping[cube_state[2]],
            "top_sticker_0": color_mapping[cube_state[3]]
        },
        "front": {
            "front_sticker_0": color_mapping[cube_state[8]],
            "front_sticker_1": color_mapping[cube_state[9]],
            "front_sticker_2": color_mapping[cube_state[10]],
            "front_sticker_3": color_mapping[cube_state[11]]
        },
        "right": {
            "right_sticker_0": color_mapping[cube_state[12]],
            "right_sticker_1": color_mapping[cube_state[13]],
            "right_sticker_2": color_mapping[cube_state[14]],
            "right_sticker_3": color_mapping[cube_state[15]]
        },
        "back": {
            "back_sticker_0": color_mapping[cube_state[16]],
            "back_sticker_1": color_mapping[cube_state[17]],
            "back_sticker_2": color_mapping[cube_state[18]],
            "back_sticker_3": color_mapping[cube_state[19]]
        },
        "left": {
            "left_sticker_0": color_mapping[cube_state[4]],
            "left_sticker_1": color_mapping[cube_state[5]],
            "left_sticker_2": color_mapping[cube_state[6]],
            "left_sticker_3": color_mapping[cube_state[7]]
        },
        "bottom": {
            "bottom_sticker_3": color_mapping[cube_state[20]],
            "bottom_sticker_0": color_mapping[cube_state[21]],
            "bottom_sticker_1": color_mapping[cube_state[22]],
            "bottom_sticker_2": color_mapping[cube_state[23]]
        }
    }
    return json_object


def list_of_states_to_json_object(list_of_cube_states, moves):
    grouped_json_object = {}
    
    moves = ["start"] + moves.split(" ")

    for index, cube_state in enumerate(list_of_cube_states):
        json_object = cube_state_to_json_object(cube_state)
        json_object["move"] = moves[index]
        grouped_json_object[str(index)] = json_object
    
    return grouped_json_object

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        json_object = json.loads(post_data.decode('utf-8'))
        
        scramble = json_object_to_cube_state(json_object)
        scramble = np.array(scramble)
        cube = RubiksCube(scramble)
        path, moves = cube.solve_cube()
        output = list_of_states_to_json_object(path, moves)
        json_output = json.dumps(output, ensure_ascii=False)

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json_output.encode('utf-8'))

if __name__ == '__main__':
    from http.server import HTTPServer
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, handler)
    httpd.serve_forever()