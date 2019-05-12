<?php
require_once 'vendor/autoload.php';

use GeoIp2\Database\Reader;

$json = file_get_contents('php://input');

if(empty($json)){ die('empty'); }

class Pusher{
  private $sql;
  private $data;
  private $geo;

  function __construct($json, $db, $login, $pass) {
    $this->geo = (new Reader('geoip.mmdb'))->city((new GetClientIp)->getClientIp());
    $this->sql = $mysql = new PDO("mysql:host=localhost;dbname={$db}", $login, $pass, [ PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION ]);
    $this->data = json_decode($json, true);
    $this->store();
  }

  private function store() {
    $insertData = [
      'sourceId' => $this->getSourceIdByKey($this->data['sourceKey']),
      'endpoint' => $this->data['subscription']['endpoint'],
      'p256dh' => $this->data['subscription']['keys']['p256dh'],
      'auth' => $this->data['subscription']['keys']['auth'],
      'country' => $this->geo->country->isoCode,
      'city' => $this->geo->city->name,
      'os' => $this->data['device']['os'],
      'browser' => $this->data['device']['browser'],
      'device' => $this->data['device']['platform'],
      'fingerprint' => $this->data['fingerprint']
    ];

    $query = "INSERT INTO subscribers (source_id, endpoint, p256dh, auth, country, city, os, browser, device, fingerprint) VALUES (:sourceId, :endpoint, :p256dh, :auth, :country, :city, :os, :browser, :device, :fingerprint) ON DUPLICATE KEY UPDATE endpoint = :endpoint , p256dh = :p256dh , auth = :auth";

    try{
      $this->sql->prepare($query)->execute($insertData);
    } catch(Exception $e){
      var_dump($e);
    }
  }

  private function getSourceIdByKey($key){
    $query = $this->sql->prepare("SELECT id FROM sources WHERE `key`=?");
    $query->execute([$key]);
    $id = intval($query->fetchColumn());
    if(!is_int($id) || $id < 1){
      throw new Exception("Wrong source key {$key} | Id = {$id}");
    }
    
    return $id;
  }
}

$Pusher = new Pusher($json, 'pusher', 'push', '02xdaiis');