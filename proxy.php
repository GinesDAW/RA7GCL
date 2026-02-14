<?php

//Configuración del proxy
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

//Como tenemos que tener en cuenta CORS, tenemos que manejar las peticiones
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

//Como necesitamos la categoría, si existe, la tenemos que coger
$categoria = isset($_GET['cat']) ? $_GET['cat'] : '';

//URL de la API externa
$url = "http://api.raulserranoweb.es/rest.php";
if ($categoria && $categoria !== 'todas') {
    $url .= "?cat=" . urlencode($categoria);
}

//Inicializar cURL para hacer la petición desde el servidor
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

//Devolvemos la respuesta de la api
if ($response !== false && $httpCode == 200) {
    echo $response;
} else {
    //Si, devolvemos un error
    http_response_code(503);
    echo json_encode([
        "error" => "La API externa no está disponible",
        "codigo_http" => $httpCode,
        "mensaje" => "No se pudieron obtener datos de http://api.raulserranoweb.es/rest.php"
    ]);
}
?>