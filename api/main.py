from opensimplex import OpenSimplex
from flask import Flask, jsonify

app = Flask(__name__)

map_width = 128
map_height = 128
ascii_map_text = ["~","^","*","∆"]
tmp = OpenSimplex(seed=1234)
noise_grid = [[0 for _ in range(map_width)] for _ in range(map_height)]
# print(f"2D noise: {noise}")

def noise_value_generator(noiseTMP):
	for x in range(map_width):
		for y in range(map_height):
			nx = x/map_width - 0.5
			ny = y/map_height - 0.5
			noise_value = noiseTMP.noise2(x=nx,y=ny)
			noise_grid[y][x] = noise_value
	return noise_grid

def noise_map(n_coo):
	if n_coo < -0.3:
		return ascii_map_text[0]
	if n_coo < 0:
		return ascii_map_text[2]
	if n_coo < 0.3:
		return ascii_map_text[1]
	else:
		return ascii_map_text[3]

def noise_map_generator():
	for y in range(map_height):
    		row = ""
    		for x in range(map_width):
        		row += noise_map(noise_grid[y][x])
    		print(row)


# print("Procedural Generation")
@app.route('/noise_map', methods=["GET","OPTIONS"])
def noise_map():
	noise_grid = noise_value_generator(tmp)
	return jsonify(noise_grid)

if __name__ == "__main__":
	app.run(debug=True)
