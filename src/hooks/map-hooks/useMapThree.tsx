import {
  CustomLayerInterface,
  LngLatLike,
  Map,
  MercatorCoordinate,
} from "mapbox-gl";
import { useEffect } from "react";
import {
  AmbientLight,
  BoxGeometry,
  DirectionalLight,
  Group,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";

interface Props {
  map: Map | undefined;
}

const useMapThree = ({ map }: Props) => {
  // parameters to ensure the model is georeferenced correctly on the map
  const modelOrigin: LngLatLike = [24.721569835728133, 48.91009985882852];
  const modelAltitude = 0;
  const modelRotate = [0, 0, 0];

  const modelAsMercatorCoordinate = MercatorCoordinate.fromLngLat(
    modelOrigin,
    modelAltitude
  );
  //   const camera = useMemo(() => new Camera(), []);
  //   const scene = useMemo(() => new Scene(), []);
  //   let renderer: WebGLRenderer;
  // transformation parameters to position, rotate and scale the 3D model onto the map
  let modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    /* Since the 3D model is in real world meters, a scale transform needs to be
     * applied since the CustomLayerInterface expects units in MercatorCoordinates.
     */
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
  };

  const customLayer: CustomLayerInterface = {
    id: "3d-model",
    type: "custom",
    renderingMode: "3d",
    minzoom: 0,
    onAdd: function (_, gl: WebGLRenderingContext) {
      this.camera = new PerspectiveCamera(
        28,
        window.innerWidth / window.innerHeight,
        0.000000000001,
        Infinity
      );
      this.scene = new Scene();
      this.camera.matrixAutoUpdate = false;
      this.map = map;
      // use the Mapbox GL JS map canvas for three.js
      this.renderer = new WebGLRenderer({
        canvas: map?.getCanvas(),
        context: gl,
        antialias: true,
        alpha: true,
      });
      this.renderer.shadowMap.enabled = true;
      this.renderer.autoClear = false;

      const group = new Group();
      this.scene.add(group);

      // create two three.js lights to illuminate the model
      const directionalLight = new DirectionalLight(0xffffff);
      directionalLight.position.set(0, -70, 100).normalize();
      directionalLight.matrixWorldNeedsUpdate = true;
      this.scene.add(directionalLight);
      const ambientLight = new AmbientLight(0xffffff, 1); // Ambient light to brighten the scene
      this.scene.add(ambientLight);
      const directionalLight2 = new DirectionalLight(0xffffff);
      directionalLight2.position.set(0, 70, 100).normalize();
      directionalLight2.matrixWorldNeedsUpdate = true;
      this.scene.add(directionalLight2);

      const boxSize = 5;
      const geometry = new BoxGeometry(boxSize, boxSize, boxSize);
      const material = new MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new Mesh(geometry, material);
      cube.position.set(0, 0, 0); // Встановлюємо позицію першого куба
      this.scene.add(cube);

      const boxSizeT = 5;
      const geometryT = new BoxGeometry(boxSizeT, boxSizeT, boxSizeT);
      const materialT = new MeshBasicMaterial({ color: 0x0f00f0 });
      const cubeT = new Mesh(geometryT, materialT);
      cubeT.position.set(10, 0, 0); // Встановлюємо позицію другого куба
      group.add(cubeT);
    },
    render: function (gl, matrix) {
      const rotationX = new Matrix4().makeRotationAxis(
        new Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new Matrix4().makeRotationAxis(
        new Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new Matrix4().makeRotationAxis(
        new Vector3(0, 0, 1),
        modelTransform.rotateZ
      );
      const m = new Matrix4().fromArray(matrix);

      const l = new Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);
      this.camera.projectionMatrix = m.multiply(l);
      // Очищаємо тільки глибину
      this.renderer.clearDepth();
      // Очищаємо буфер перед рендерингом
      this.renderer.state.reset();
      this.renderer.render(this.scene, this.camera);
      this.map.triggerRepaint();
    },
  };
  useEffect(() => {
    if (map) {
      if (map.getLayer("3d-model")) {
        map.removeLayer("3d-model");
      }
      // Обробник кліку на мапі
      map.on("click", (e) => {
        const { lng, lat } = e.lngLat;
        console.log("Координати кліку:", lng, lat);

        // Оновлюємо модельні координати при кліку
        const newMercatorCoordinate = MercatorCoordinate.fromLngLat(
          [lng, lat],
          modelAltitude
        );

        modelTransform = {
          ...modelTransform,
          translateX: newMercatorCoordinate.x,
          translateY: newMercatorCoordinate.y,
          translateZ: newMercatorCoordinate.z,
        };

        // Викликаємо перерисовку сцени
        map.triggerRepaint();
      });
      map.addLayer(customLayer, "waterway-label");
    }
  }, [map]);
  return;
};

export default useMapThree;
