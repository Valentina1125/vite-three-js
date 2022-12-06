# vite-three-js

https://638e79130bb609247f32cd73--loquacious-axolotl-441ac4.netlify.app/

Para mi proyecto quise desarrollar un visualizador de objetos 3D que se pueda utilizar como herramienta de aprendizaje de anatomía. En esta se pueden observar modelos 3D con cubos señalizando las partes más relevantes de la anatomía. Para esto se cargó el modelo con su respectiva textura, y se crearon cubos en las partes relevantes. Para poder identificar el nombre de la parte se utilizó raycasting, evaluando la intersección con los cubos. En un cuadro de texto se mostró el nombre de la parte anatómica según el cubo seleccionado. 

Para poder visualizar el objeto se utiliza OBJLoader y MTLLoader de Threejs.
Posteriormente se genera una caja en donde van a estar los objetos a visualizar y se establece como espacio de pantalla este espacio. 
Los cubos que indican las partes anatómicas fueron creados uno a uno y posicionados manualmente en las zonas correspondientes. 
Para luego evaluar si existe intersección por raycasting y cambiar el texto según el objeto que se esté intersecad.

Para ejecutar clone el respositorio y en la terminal ponga: npm run dev
