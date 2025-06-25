¿Qué hace esta prueba?
    Simula una base de datos con 2 links pendientes.

    Simula la llamada a scrape_link.delay.

    Envía una petición POST al endpoint /process con file_id=123.

Verifica:

    Que la respuesta sea 200.

    Que el mensaje indique la cantidad de links procesados.

    Que se hayan invocado scrape_link.delay y la actualización de estado correctamente.