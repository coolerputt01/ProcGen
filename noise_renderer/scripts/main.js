const NOISE_MAP_API_URL = "https://procgen-nu.vercel.app/noise_map";
const canvas = document.querySelector("#map_renderer");
const context = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

var noise_maps;

const Biomes = {
  LAND: 0,
  WATER: 1
};
const textureFilePath = "textures/Textures-16.png";
const tileset = new Image();
tileset.src = textureFilePath;

function getTileIndex(noise_value){
  if(noise_value < -0.3) return 135; // water
  else if(noise_value < 0) return 156; // sand
  else if(noise_value < 0.3) return 255; // grass 
  else return 255; // mountain
}

class GridMap {
  constructor(noise_map){
    this.noise_map = noise_map;
  }
  generate_map(){
    for(var y = 0; y < this.noise_map.length;y++){
      for(var x = 0; x < this.noise_map[0].length;x++){
        var noise_value = this.noise_map[y][x];
        var tileIndex = getTileIndex(noise_value);
        var tx = (tileIndex % 16) * 16;
        var ty = Math.floor(tileIndex / 16) * 16;
        const tileSize = canvas.width / this.noise_map[0].length;
        context.drawImage(tileset, tx, ty, 16, 16, x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }
}

async function getNoiseMap() {
  try{
    const response = await fetch(NOISE_MAP_API_URL);
    const data = await response.json();
    console.log(data);
    noise_maps = data;
  }catch(error){
    console.error("An error occurred while fetching from the API: ", error);
  }
}

tileset.onload = async () => {
    console.log("hey");
    await getNoiseMap();
    const grid = new GridMap(noise_maps);
    grid.generate_map();
};