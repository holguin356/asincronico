const fs = require("fs");
const http = require("http");
const https = require("https");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "content-type": "text/plain" });

    fs.writeFile("data/archivo.txt", "contenido de prueba", "utf8", (err) => {
      if (err) {
        res.write("Error al escribir el archivo: " + err + "\n");
        res.end(); // Falta llamar a res.end() como función
        return;
      }

      res.write("Archivo escrito correctamente.\n"); // Mensaje de confirmación de escritura

      // Leer el archivo después de escribirlo
      fs.readFile("data/archivo.txt", "utf8", (err, data) => {
        if (err) {
          res.write("Error al leer el archivo: " + err + "\n");
          res.end(); // Llama a res.end() en caso de error para terminar la respuesta
          return;
        } else {
          res.write("Archivo leído correctamente: " + data + "\n");
        }

        // Realizar solicitud HTTPS
        https
          .get("https://jsonplaceholder.typicode.com/todos/1", (resp) => {
            let jsonData = "";
            resp.on("data", (chunk) => {
              jsonData += chunk;
            });

            resp.on("end", () => {
              res.write(
                "Datos de la solicitud HTTP: \n" +
                  JSON.stringify(JSON.parse(jsonData), null, 2) +
                  "\n\n"
              );
              setTimeout(() => {
                res.write("Temporizador completado despues de dos segundos\n");
                res.end(); // Termina la respuesta después de enviar todos los datos
              }, 2000);
            });
          })
          .on("error", (e) => {
            // Manejo de errores en la solicitud HTTPS
            res.write("Error al hacer la solicitud HTTPS: " + e.message + "\n");
            res.end();
          });
      });
    });
  }
});

// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
